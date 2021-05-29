from d3rlpy.datasets import get_pendulum
from minerva.dataset import export_mdp_dataset_as_csv

# prepare MDPDataset
dataset, _ = get_pendulum()

# save as CSV
export_mdp_dataset_as_csv(dataset, 'pendulum.csv')
