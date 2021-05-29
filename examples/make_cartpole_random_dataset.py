from d3rlpy.datasets import get_cartpole
from minerva.dataset import export_mdp_dataset_as_csv

# prepare MDPDataset
dataset, _ = get_cartpole(dataset_type='random')

# save as CSV
export_mdp_dataset_as_csv(dataset, 'cartpole_random.csv')
