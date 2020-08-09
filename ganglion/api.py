import werkzeug
import os
import uuid

from flask import Blueprint, request, jsonify
from sqlalchemy import desc
from d3rlpy.dataset import MDPDataset
from .database import db
from .dataset import import_csv_as_mdp_dataset
from .config import UPLOAD_DIR, DATASET_DIR
from .models.dataset import Dataset, DatasetSchema

api_app = Blueprint('api', __name__)


@api_app.route('/dataset/upload', methods=['POST'])
def upload_dataset():
    # validation
    if 'dataset' not in request.files:
        return jsonify({'status': 'dataset is empty'}), 400

    # save file
    file = request.files['dataset']
    file_name = werkzeug.utils.secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_DIR, file_name)
    file.save(file_path)

    # save as MDPDataset
    is_image = bool(int(request.form.get('is_image')))
    is_discrete = bool(int(request.form.get('is_discrete')))
    mdp_dataset = import_csv_as_mdp_dataset(file_path,
                                            image=is_image,
                                            discrete_action=is_discrete)
    dataset_name = str(uuid.uuid1()) + '.h5'
    dataset_path = os.path.join(DATASET_DIR, dataset_name)
    mdp_dataset.dump(dataset_path)
    stats = mdp_dataset.compute_stats()

    # insert record
    dataset = Dataset.create(file_name, dataset_name, is_image, is_discrete)

    # return json
    data = DatasetSchema().dump(dataset)
    data['statistics'] = stats
    return jsonify(data)


@api_app.route('/dataset', methods=['GET'])
def get_all_dataset():
    datasets = db.session.query(Dataset)\
        .order_by(desc(Dataset.id))\
        .all()

    dataset_schema = DatasetSchema(many=True)
    return jsonify({
        'datasets': dataset_schema.dump(datasets),
        'total': len(datasets)
    })


@api_app.route('/dataset/<dataset_id>', methods=['GET'])
def get_dataset(dataset_id):
    dataset = Dataset.get(dataset_id, raise_404=True)

    # compute stats
    dataset_path = os.path.join(DATASET_DIR, dataset.file_name)
    mdp_dataset = MDPDataset.load(dataset_path)
    stats = mdp_dataset.compute_stats()

    # return json
    data = DatasetSchema().dump(dataset)
    data['statistics'] = stats
    return jsonify(data)


@api_app.route('/dataset/<dataset_id>', methods=['PUT'])
def update_dataset(dataset_id):
    pass


@api_app.route('/dataset/<dataset_id>', methods=['DELETE'])
def delete_dataset(dataset_id):
    dataset = Dataset.get(dataset_id, raise_404=True)
    dataset.delete()
    return jsonify({})
