# pylint: disable=no-name-in-module

from d3rlpy.dataset import MDPDataset
from d3rlpy.algos import create_algo
from d3rlpy.augmentation import DrQPipeline, create_augmentation
from d3rlpy.metrics.scorer import td_error_scorer
from d3rlpy.metrics.scorer import discounted_sum_of_advantage_scorer
from d3rlpy.metrics.scorer import average_value_estimation_scorer
from d3rlpy.metrics.scorer import value_estimation_std_scorer
from d3rlpy.metrics.scorer import continuous_action_diff_scorer
from d3rlpy.metrics.scorer import discrete_action_match_scorer
from d3rlpy.metrics.scorer import initial_state_value_estimation_scorer
from d3rlpy.metrics.scorer import soft_opc_scorer
from sklearn.model_selection import train_test_split


def _get_scorers(discrete_action, dataset_stats):
    scorers = {}
    scorers['td_error'] = td_error_scorer
    scorers['discounted_sum_of_advantage'] = discounted_sum_of_advantage_scorer
    scorers['value_scale'] = average_value_estimation_scorer
    scorers['value_standard_deviation'] = value_estimation_std_scorer
    scorers['initial_state_value'] = initial_state_value_estimation_scorer
    scorers['soft_opc'] = soft_opc_scorer(0.8 * dataset_stats['return']['max'])
    if discrete_action:
        scorers['action_match'] = discrete_action_match_scorer
    else:
        scorers['action_difference'] = continuous_action_diff_scorer
    return scorers


def train(algo_name,
          params,
          dataset_path,
          experiment_name=None,
          logdir='d3rlpy_logs'):
    # prepare dataset
    dataset = MDPDataset.load(dataset_path)
    train_data, test_data = train_test_split(dataset, test_size=0.2)

    # get dataset statistics
    stats = dataset.compute_stats()

    # evaluate
    scorers = _get_scorers(dataset.is_action_discrete(), stats)

    # data augmentation setting
    if 'augmentation' in params:
        aug_names = params['augmentation']
        n_mean = params['n_augmentations']
        augmentations = [create_augmentation(name) for name in aug_names]
        augmentation = DrQPipeline(augmentations, n_mean=n_mean)
        params['augmentation'] = augmentation

    # add action scaler if continuous action-space
    if not dataset.is_action_discrete():
        params['action_scaler'] = 'min_max'

    # train
    algo = create_algo(algo_name, dataset.is_action_discrete(), **params)
    algo.fit(train_data,
             n_epochs=params['n_epochs'],
             eval_episodes=test_data,
             scorers=scorers,
             experiment_name=experiment_name,
             with_timestamp=False,
             logdir=logdir,
             save_interval=1,
             show_progress=False,
             tensorboard=False)

    return True
