import pytest
import numpy as np

from d3rlpy.dataset import MDPDataset
from d3rlpy.datasets import get_cartpole, get_pendulum
from minerva.dataset import export_mdp_dataset_as_csv
from minerva.dataset import import_csv_as_mdp_dataset


def test_vector_dataset_with_discrete_action():
    ref, _ = get_cartpole()

    # save as csv
    export_mdp_dataset_as_csv(ref, 'test_data/test.csv')

    # load from csv
    dataset = import_csv_as_mdp_dataset('test_data/test.csv',
                                        discrete_action=True)

    assert dataset.get_observation_shape() == ref.get_observation_shape()
    assert dataset.get_action_size() == ref.get_action_size()
    assert np.allclose(dataset.observations, ref.observations)
    assert np.all(dataset.actions == ref.actions)
    assert np.allclose(dataset.rewards, ref.rewards)
    assert np.all(dataset.terminals == ref.terminals)


def test_vector_dataset_with_continuous_action():
    ref, _ = get_pendulum()

    # save as csv
    export_mdp_dataset_as_csv(ref, 'test_data/test.csv')

    # load from csv
    dataset = import_csv_as_mdp_dataset('test_data/test.csv',
                                        discrete_action=False)

    assert dataset.get_observation_shape() == ref.get_observation_shape()
    assert dataset.get_action_size() == ref.get_action_size()
    assert np.allclose(dataset.observations, ref.observations)
    assert np.allclose(dataset.actions, ref.actions)
    assert np.allclose(dataset.rewards, ref.rewards)
    assert np.all(dataset.terminals == ref.terminals)


@pytest.mark.parametrize('discrete_action', [True, False])
@pytest.mark.parametrize('n_channels', [1, 3])
@pytest.mark.parametrize('action_size', [2])
@pytest.mark.parametrize('data_size', [1000])
def test_image_dataset(discrete_action, n_channels, action_size, data_size):
    shape = (data_size, n_channels, 84, 84)
    observations = np.random.randint(256, size=shape, dtype=np.uint8)
    if discrete_action:
        actions = np.random.randint(action_size, size=(data_size, ))
    else:
        actions = np.random.random((data_size, action_size))
    rewards = np.random.random((data_size, 1))
    terminals = (np.arange(data_size) % 9) == 0

    ref = MDPDataset(observations=observations,
                     actions=actions,
                     rewards=rewards,
                     terminals=terminals,
                     discrete_action=discrete_action)

    # save as csv
    export_mdp_dataset_as_csv(ref, 'test_data/test.csv', relative_path=True)

    # load from csv
    dataset = import_csv_as_mdp_dataset('test_data/test.csv',
                                        image=True,
                                        discrete_action=discrete_action)

    assert dataset.get_observation_shape() == ref.get_observation_shape()
    assert dataset.get_action_size() == ref.get_action_size()
    assert np.all(dataset.observations == ref.observations)
    assert np.allclose(dataset.actions, ref.actions)
    assert np.allclose(dataset.rewards, ref.rewards)
    assert np.all(dataset.terminals == ref.terminals)
