import numpy as np

from d3rlpy.datasets import get_cartpole, get_pendulum
from ganglion.dataset import export_mdp_dataset_as_csv
from ganglion.dataset import import_csv_as_mdp_dataset


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
