import numpy as np

from d3rlpy.datasets import get_atari
from d3rlpy.dataset import MDPDataset
from minerva.dataset import export_mdp_dataset_as_csv

# prepare MDPDataset
dataset, _ = get_atari('breakout-mixed-v0')

# take 100 episodes due to dataset size
episodes = dataset.episodes[:30]

observations = []
actions = []
rewards = []
terminals = []

for episode in episodes:
    observations.append(episode.observations)
    actions.append(episode.actions.reshape(-1))
    rewards.append(episode.rewards.reshape(-1))
    flag = np.zeros(episode.observations.shape[0])
    flag[-1] = 1.0
    terminals.append(flag)

observations = np.vstack(observations)
actions = np.hstack(actions)
rewards = np.hstack(rewards)
terminals = np.hstack(terminals)

dataset = MDPDataset(observations=observations,
                     actions=actions,
                     rewards=rewards,
                     terminals=terminals,
                     discrete_action=True)

# save as CSV and images
export_mdp_dataset_as_csv(dataset, 'breakout.csv')
