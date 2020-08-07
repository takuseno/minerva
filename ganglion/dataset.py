import numpy as np
import csv

from d3rlpy.dataset import MDPDataset


def export_mdp_dataset_as_csv(dataset, fname):
    # image observation
    if len(dataset.get_observation_shape()) > 1:
        export_image_observation_dataset_as_csv(dataset, fname)
    # vector observation
    export_vector_observation_dataset_as_csv(dataset, fname)


def export_image_observation_dataset_as_csv(dataset, fname):
    raise NotImplementedError('image observation is not ready.')


def export_vector_observation_dataset_as_csv(dataset, fname):
    observation_size = dataset.get_observation_shape()[0]
    action_size = dataset.get_action_size()

    with open(fname, 'w') as f:
        writer = csv.writer(f)

        # write header
        header = ['episode']
        header += ['observation:%d' % i for i in range(observation_size)]
        if dataset.is_action_discrete():
            header += ['action:0']
        else:
            header += ['action:%d' % i for i in range(action_size)]
        header += ['reward']
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


def import_csv_as_mdp_dataset(fname, image=False, discrete_action=False):
    if image:
        return import_csv_as_image_observation_dataset(fname, discrete_action)
    return import_csv_as_vector_observation_dataset(fname, discrete_action)


def import_csv_as_image_observation_dataset(fname, discrete_action):
    raise NotImplementedError('image observation is not ready')


def import_csv_as_vector_observation_dataset(fname, discrete_action):
    with open(fname, 'r') as f:
        reader = csv.reader(f)
        rows = [row for row in reader]

        # get observation shape
        header = rows[0]
        _validate_csv_header(header)

        # retrieve data section
        csv_data = np.array(rows[1:], dtype=np.float32)

        # get episode ids
        episode_ids = csv_data[:, 0]

        # get observation columns
        observation_size = _get_observation_size_from_header(header)
        observation_last_index = observation_size + 1
        observations = csv_data[:, 1:observation_last_index]

        # get action columns
        action_size = _get_action_size_from_header(header)
        action_last_index = observation_last_index + action_size
        actions = csv_data[:, observation_last_index:action_last_index]
        if discrete_action:
            actions = np.array(actions.reshape(-1), dtype=np.int32)

        # get reward column
        rewards = csv_data[:, -1]

        # make terminal flags
        terminals = np.zeros_like(episode_ids)
        for i, episode_id in enumerate(episode_ids):
            if i + 1 == len(episode_ids) or episode_id != episode_ids[i + 1]:
                terminals[i] = 1.0

        dataset = MDPDataset(observations,
                             actions,
                             rewards,
                             terminals,
                             discrete_action=discrete_action)

    return dataset


def _validate_csv_header(header):
    assert header[0] == 'episode', "column=0 must be 'episode'"

    # check observation section
    index = 1
    observation_index = 0
    while True:
        if header[index].find('action') > -1:
            break
        ref_name = 'observation:%d' % observation_index
        message = "column=%d must be '%s'" % (index, ref_name)
        assert header[index] == ref_name, message
        index += 1
        observation_index += 1

    # check action section
    action_index = 0
    while True:
        if header[index] == 'reward':
            break
        ref_name = 'action:%d' % action_index
        message = "column=%d must be '%s'" % (index, ref_name)
        assert header[index] == ref_name, message
        index += 1
        action_index += 1


def _get_observation_size_from_header(header):
    size = 0
    for column in header:
        if column.find('observation') > -1:
            size += 1
    return size


def _get_action_size_from_header(header):
    size = 0
    for column in header:
        if column.find('action') > -1:
            size += 1
    return size
