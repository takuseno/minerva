from d3rlpy.dataset import MDPDataset
from d3rlpy.algos import create_algo
from d3rlpy.metrics.scorer import td_error_scorer
from d3rlpy.metrics.scorer import discounted_sum_of_advantage_scorer
from d3rlpy.metrics.scorer import average_value_estimation_scorer
from d3rlpy.metrics.scorer import value_estimation_std_scorer
from d3rlpy.metrics.scorer import continuous_action_diff_scorer
from d3rlpy.metrics.scorer import discrete_action_match_scorer
from sklearn.model_selection import train_test_split


def _get_scorers(discrete_action):
    scorers = {}
    scorers['td_error'] = td_error_scorer
    scorers['discounted_sum_of_advantage'] = discounted_sum_of_advantage_scorer
    scorers['value_scale'] = average_value_estimation_scorer
    scorers['value_standard_deviation'] = value_estimation_std_scorer
    if discrete_action:
        scorers['action_match'] = discrete_action_match_scorer
    else:
        scorers['action_difference'] = continuous_action_diff_scorer
    return scorers


def train(algo_name,
          params,
          dataset_path,
          experiment_name=None,
          logdir='d3rlpy_logs',
          test_size=0.2):
    # prepare dataset
    dataset = MDPDataset.load(dataset_path)
    train_data, test_data = train_test_split(dataset, test_size=test_size)

    # evaluate
    scorers = _get_scorers(dataset.is_action_discrete())

    # train
    algo = create_algo(algo_name, dataset.is_action_discrete(), **params)
    algo.fit(train_data,
             eval_episodes=test_data,
             scorers=scorers,
             experiment_name=experiment_name,
             with_timestamp=False,
             logdir=logdir,
             save_interval=1,
             show_progress=False,
             tensorboard=False)

    return True
