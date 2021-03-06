import base64
import json
import os
import tempfile
import uuid
import zipfile
from io import BytesIO

import werkzeug
from flask import Blueprint, jsonify, request

from ..config import get_config
from ..dataset import convert_ndarray_to_image, import_csv_as_mdp_dataset
from ..models.dataset import Dataset, DatasetSchema
from .generator import generate_for_model

dataset_route = Blueprint("dataset", __name__)

generate_for_model(dataset_route, Dataset, DatasetSchema)


@dataset_route.route("/upload", methods=["POST"])
def upload_dataset():
    # validation
    if "dataset" not in request.files:
        return jsonify({"status": "dataset is empty"}), 400

    # save uploaded files and create MDPDataset
    with tempfile.TemporaryDirectory() as dname:
        # save file
        file = request.files["dataset"]
        file_name = werkzeug.utils.secure_filename(file.filename)
        file_path = os.path.join(dname, file_name)
        file.save(file_path)

        # save image files
        is_image = request.form.get("is_image") == "true"
        if is_image:
            # save zip file
            zip_file = request.files["zip_file"]
            zip_file_name = werkzeug.utils.secure_filename(zip_file.filename)
            zip_file_path = os.path.join(dname, zip_file_name)
            zip_file.save(zip_file_path)
            # decompress zip file
            with zipfile.ZipFile(zip_file_path) as zip_fd:
                zip_fd.extractall(dname)

        # convert uploaded data to MDPDataset
        try:
            mdp_dataset = import_csv_as_mdp_dataset(file_path, image=is_image)
        except ValueError:
            return jsonify({"status": "dataset conversion failed."}), 400

        # save MDPDataset object.
        dataset_name = str(uuid.uuid1()) + ".h5"
        dataset_path = os.path.join(get_config("DATASET_DIR"), dataset_name)
        mdp_dataset.dump(dataset_path)

    # get dataset size
    data_size = os.path.getsize(dataset_path)
    episode_size = len(mdp_dataset)
    step_size = sum(map(len, mdp_dataset))

    # compute statistics
    stats = mdp_dataset.compute_stats()
    stats["observation_shape"] = mdp_dataset.get_observation_shape()
    stats["action_size"] = mdp_dataset.get_action_size()
    # handle ndarray serialization
    stats_json = json.dumps(jsonify(stats).json)

    # insert record
    dataset = Dataset.create(
        file_name,
        dataset_name,
        episode_size,
        step_size,
        data_size,
        is_image,
        mdp_dataset.is_action_discrete(),
        stats_json,
    )

    # return json
    return jsonify(DatasetSchema().dump(dataset))


@dataset_route.route("/<dataset_id>/example", methods=["GET"])
def get_example_vector_observation(dataset_id):
    dataset = Dataset.get(dataset_id, raise_404=True)

    # take care of computational cost
    mdp_dataset = dataset.load_mdp_dataset()

    if dataset.is_image:
        # take first 3 samples
        ndarrays = mdp_dataset.observations[:3]

        observations = []
        for ndarray in ndarrays:
            image = convert_ndarray_to_image(ndarray)

            # encode image to base64
            buffer = BytesIO()
            image.save(buffer, format="PNG")
            encoded_image = base64.b64encode(buffer.getvalue())

            # return in string
            observations.append(encoded_image.decode().replace("'", ""))
    else:
        # take first 100 samples
        n_steps = min(100, mdp_dataset.observations.shape[0])
        observations = mdp_dataset.observations[:n_steps]

    return jsonify({"observations": observations})
