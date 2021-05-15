# pylint: disable=no-name-in-module

import csv
import os
import tempfile
import zipfile

import numpy as np
from d3rlpy.dataset import MDPDataset
from PIL import Image
from tqdm import trange


def convert_ndarray_to_image(ndarray):
    # convert channel-fist to channel-last
    if ndarray.shape[0] == 1:
        array = ndarray[0]
    else:
        array = np.transpose(ndarray, [1, 2, 0])
    return Image.fromarray(array)


def convert_image_to_ndarray(image):
    array = np.asarray(image)
    # fix channel-first shape
    if image.mode == "L":
        array = array.reshape((1, *array.shape))
    else:
        array = array.transpose([2, 0, 1])
    return array


def export_mdp_dataset_as_csv(dataset, fname):
    if len(dataset.get_observation_shape()) > 1:
        # image observation
        export_image_observation_dataset_as_csv(dataset, fname)
    else:
        # vector observation
        export_vector_observation_dataset_as_csv(dataset, fname)


def _save_image_files(dataset, zip_path):
    with tempfile.TemporaryDirectory() as dname:
        with zipfile.ZipFile(zip_path, "w") as zip_fd:
            data_size = dataset.observations.shape[0]
            for i in trange(data_size, desc="saving images"):
                image = convert_ndarray_to_image(dataset.observations[i])
                image_path = os.path.join(dname, "observation_%d.png" % i)
                image.save(image_path, quality=100)
                zip_fd.write(image_path, arcname="observation_%d.png" % i)


def export_image_observation_dataset_as_csv(dataset, fname):
    action_size = dataset.get_action_size()

    # prepare image directory
    csv_file_name = os.path.basename(fname)

    # save image files as zip file
    zip_name = csv_file_name.split(".")[0] + ".zip"
    zip_path = os.path.join(os.path.dirname(fname), zip_name)
    _save_image_files(dataset, zip_path)

    with open(fname, "w") as file:
        writer = csv.writer(file)

        # write header
        header = ["episode", "observation:0"]
        if dataset.is_action_discrete():
            header += ["action:0"]
        else:
            header += ["action:%d" % i for i in range(action_size)]
        header += ["reward"]
        writer.writerow(header)

        count = 0
        for i, episode in enumerate(dataset.episodes):
            # prepare data to write
            for j in range(episode.observations.shape[0]):
                row = []
                row.append(i)

                # add image path
                row.append("observation_%d.png" % count)
                count += 1

                row += episode.actions[j].reshape(-1).tolist()
                row.append(episode.rewards[j])
                writer.writerow(row)


def export_vector_observation_dataset_as_csv(dataset, fname):
    observation_size = dataset.get_observation_shape()[0]
    action_size = dataset.get_action_size()

    with open(fname, "w") as file:
        writer = csv.writer(file)

        # write header
        header = ["episode"]
        header += ["observation:%d" % i for i in range(observation_size)]
        if dataset.is_action_discrete():
            header += ["action:0"]
        else:
            header += ["action:%d" % i for i in range(action_size)]
        header += ["reward"]
        writer.writerow(header)

        for i, episode in enumerate(dataset.episodes):
            # prepare data to write
            observations = np.asarray(episode.observations)
            episode_length = observations.shape[0]
            actions = np.asarray(episode.actions).reshape(episode_length, -1)
            rewards = episode.rewards.reshape(episode_length, 1)
            episode_ids = np.full([episode_length, 1], i)

            # write episode
            rows = np.hstack([episode_ids, observations, actions, rewards])
            writer.writerows(rows)


def import_csv_as_mdp_dataset(fname, image=False):
    if image:
        return import_csv_as_image_observation_dataset(fname)
    return import_csv_as_vector_observation_dataset(fname)


def _load_image(path):
    image = Image.open(path)

    # resize image to (84, 84)
    if image.size != (84, 84):
        image = image.resize((84, 84), Image.BICUBIC)

    return image


def import_csv_as_image_observation_dataset(fname):
    with open(fname, "r") as file:
        reader = csv.reader(file)
        rows = [row for row in reader]

        # check header
        header = rows[0]
        _validate_csv_header(header)

        # get action size
        action_size = _get_action_size_from_header(header)

        data_size = len(rows) - 1

        observations = []
        actions = []
        rewards = []
        terminals = []
        for i, row in enumerate(rows[1:]):
            episode_id = row[0]

            # load image
            image_path = os.path.join(os.path.dirname(fname), row[1])
            if not os.path.exists(image_path):
                raise ValueError(f"{image_path} does not exist.")
            image = _load_image(os.path.join(os.path.dirname(fname), row[1]))

            # convert PIL.Image to ndarray
            array = convert_image_to_ndarray(image)

            observations.append(array)

            # get action columns
            actions.append(list(map(float, row[2 : 2 + action_size])))

            # get reward column
            rewards.append(float(row[-1]))

            if i == data_size - 1 or episode_id != rows[i + 2][0]:
                terminals.append(1)
            else:
                terminals.append(0)

        # convert list to ndarray
        observations = np.array(observations, dtype=np.uint8)
        actions = np.array(actions)
        rewards = np.array(rewards, dtype=np.float32)
        terminals = np.array(terminals, dtype=np.float32)

        dataset = MDPDataset(
            observations=observations,
            actions=actions,
            rewards=rewards,
            terminals=terminals,
        )

    return dataset


def import_csv_as_vector_observation_dataset(fname):
    with open(fname, "r") as file:
        reader = csv.reader(file)
        rows = [row for row in reader]

        # get observation shape
        header = rows[0]
        _validate_csv_header(header)

        # retrieve data section
        csv_data = np.array(rows[1:], dtype=np.float32)

        # get observation columns
        observation_size = _get_observation_size_from_header(header)
        observation_last_index = observation_size + 1
        observations = csv_data[:, 1:observation_last_index]

        # get action columns
        action_size = _get_action_size_from_header(header)
        action_last_index = observation_last_index + action_size
        actions = csv_data[:, observation_last_index:action_last_index]

        # get reward column
        rewards = csv_data[:, -1]

        # make terminal flags
        episode_ids = csv_data[:, 0]
        terminals = np.zeros_like(episode_ids)
        for i, episode_id in enumerate(episode_ids):
            if i + 1 == len(episode_ids) or episode_id != episode_ids[i + 1]:
                terminals[i] = 1.0

        dataset = MDPDataset(
            observations=observations,
            actions=actions,
            rewards=rewards,
            terminals=terminals,
        )

    return dataset


def _validate_csv_header(header):
    assert header[0] == "episode", "column=0 must be 'episode'"

    # check observation section
    index = 1
    observation_index = 0
    while header[index].find("action") == -1:
        ref_name = "observation:%d" % observation_index
        message = "column=%d must be '%s'" % (index, ref_name)
        assert header[index] == ref_name, message
        index += 1
        observation_index += 1

    # check action section
    action_index = 0
    while header[index] != "reward":
        ref_name = "action:%d" % action_index
        message = "column=%d must be '%s'" % (index, ref_name)
        assert header[index] == ref_name, message
        index += 1
        action_index += 1


def _get_observation_size_from_header(header):
    size = 0
    for column in header:
        if column.find("observation") > -1:
            size += 1
    return size


def _get_action_size_from_header(header):
    size = 0
    for column in header:
        if column.find("action") > -1:
            size += 1
    return size
