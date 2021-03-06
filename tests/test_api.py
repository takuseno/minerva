import pytest
import os
import json
import base64
import time
import zipfile
import numpy as np
import minerva.config as config

from io import BytesIO
from d3rlpy.datasets import get_cartpole
from d3rlpy.dataset import MDPDataset
from werkzeug.datastructures import FileStorage
from PIL import Image
from minerva.dataset import export_mdp_dataset_as_csv
from minerva.dataset import export_image_observation_dataset_as_csv
from minerva.dataset import convert_image_to_ndarray
from minerva.index import app, db
from minerva.models.dataset import Dataset
from minerva.models.project import Project
from minerva.models.experiment import Experiment


@pytest.fixture(scope='session')
def client():
    config.ROOT_DIR = os.path.abspath('test_data')
    config.DATASET_DIR = os.path.join(config.ROOT_DIR, 'dataset')
    config.DATABASE_PATH = os.path.join(config.ROOT_DIR, 'database.db')
    config.LOG_DIR = os.path.join(config.ROOT_DIR, 'train_logs')
    database_path = config.DATABASE_PATH
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///%s' % database_path
    config.prepare_directory()
    with app.app_context():
        db.drop_all()
        db.create_all()
    return app.test_client()


def _upload_dataset(client):
    # prepare dataset
    mdp_dataset, _ = get_cartpole()
    csv_path = os.path.join('test_data', 'dataset.csv')
    export_mdp_dataset_as_csv(mdp_dataset, csv_path)

    # prepare upload request
    with open(csv_path, 'rb') as f:
        data = {'is_image': 'false'}
        file = FileStorage(stream=f,
                           filename='dataset.csv',
                           content_type='text/csv')
        data['dataset'] = file

        # upload
        res = client.post('/api/datasets/upload',
                          data=data,
                          content_type='multipart/form-data')

    return res, mdp_dataset


def _upload_image_dataset(client):
    # prepare dummy data
    shape = (100, 3, 84, 84)
    observations = np.random.randint(255, size=shape, dtype=np.uint8)
    actions = np.random.random((100, 2)).astype('f4')
    rewards = np.random.random((100, 1)).astype('f4')
    terminals = (np.arange(100) % 9) == 0

    # prepare dataset
    mdp_dataset = MDPDataset(observations, actions, rewards, terminals)
    csv_path = os.path.join('test_data', 'dataset.csv')
    zip_path = os.path.join('test_data', 'dataset.zip')
    export_image_observation_dataset_as_csv(mdp_dataset, csv_path)

    # prepare upload request
    with open(csv_path, 'rb') as csv_fd, open(zip_path, 'rb') as zip_fd:
        data = {'is_image': 'true'}

        file = FileStorage(stream=csv_fd,
                           filename='dataset.csv',
                           content_type='text/csv')
        data['dataset'] = file

        zip_file = FileStorage(stream=zip_fd,
                               filename='dataset.zip',
                               content_type='.zip')
        data['zip_file'] = zip_file

        # upload
        res = client.post('/api/datasets/upload',
                          data=data,
                          content_type='multipart/form-data')

    return res, mdp_dataset


@pytest.mark.parametrize('is_image', [False, True])
def test_dataset_api(client, is_image):
    # check upload dataset
    if is_image:
        res, mdp_dataset = _upload_image_dataset(client)
    else:
        res, mdp_dataset = _upload_dataset(client)
    assert res.status_code == 200
    assert res.json['name'] == 'dataset.csv'
    assert res.json['episode_size'] == len(mdp_dataset)
    step_size = 0
    for episode in mdp_dataset:
        step_size += len(episode)
    assert res.json['step_size'] == step_size

    dataset_id = res.json['id']
    dataset_name = res.json['name']
    dataset_file_name = res.json['file_name']

    dataset_path = os.path.join(config.DATASET_DIR, dataset_file_name)
    assert os.path.exists(dataset_path)

    # check get
    res = client.get('/api/datasets/%d' % dataset_id, follow_redirects=True)
    assert res.status_code == 200
    assert res.json['id'] == dataset_id
    assert res.json['name'] == dataset_name
    assert res.json['file_name'] == dataset_file_name
    assert res.json['is_discrete'] != is_image

    # check get_all
    res = client.get('/api/datasets', follow_redirects=True)
    assert res.status_code == 200
    assert len(res.json['datasets']) == 1
    assert res.json['datasets'][0]['id'] == dataset_id

    # check update
    res = client.put('/api/datasets/%d' % dataset_id,
                     data=json.dumps({'name': 'updated'}),
                     content_type='application/json',
                     follow_redirects=True)
    assert res.status_code == 200
    assert res.json['name'] == 'updated'
    with app.app_context():
        assert Dataset.get(dataset_id).name == 'updated'

    # check get example observations
    res = client.get('/api/datasets/%d/example' % dataset_id)
    assert res.status_code == 200
    examples = res.json['observations']
    if is_image:
        for i, base64_image in enumerate(examples):
            image = Image.open(BytesIO(base64.b64decode(base64_image)))
            ndarray = convert_image_to_ndarray(image)
            assert np.all(ndarray == mdp_dataset.observations[i])
    else:
        assert np.allclose(np.array(examples), mdp_dataset.observations[:100])

    # check delete
    res = client.delete('/api/datasets/%d' % dataset_id, follow_redirects=True)
    assert res.status_code == 200
    with app.app_context():
        assert Dataset.get(dataset_id) is None
    assert not os.path.exists(dataset_path)


def test_project_api(client):
    # upload dataset
    res, _ = _upload_dataset(client)

    dataset_id = res.json['id']

    # check create project
    data = {'name': 'test', 'dataset_id': dataset_id, 'algorithm': 'cql'}
    res = client.post('/api/projects',
                      data=json.dumps(data),
                      content_type='application/json',
                      follow_redirects=True)
    assert res.status_code == 200
    assert res.json['name'] == 'test'
    assert res.json['dataset_id'] == dataset_id

    project_id = res.json['id']

    # check get
    res = client.get('/api/projects/%d' % project_id, follow_redirects=True)
    assert res.status_code == 200
    assert res.json['id'] == project_id
    assert res.json['name'] == 'test'
    assert res.json['dataset_id'] == dataset_id

    # check get all
    res = client.get('/api/projects', follow_redirects=True)
    assert res.status_code == 200
    assert len(res.json['projects']) == 1
    assert res.json['projects'][0]['id'] == project_id

    # check update
    res = client.put('/api/projects/%d' % project_id,
                     data=json.dumps({'name': 'updated'}),
                     content_type='application/json',
                     follow_redirects=True)
    assert res.status_code == 200
    assert res.json['name'] == 'updated'

    # check delete
    res = client.delete('/api/projects/%d' % project_id, follow_redirects=True)
    assert res.status_code == 200
    with app.app_context():
        assert Project.get(project_id) is None


def test_experiment_api(client):
    # upload dataset
    res, _ = _upload_dataset(client)

    # create project
    data = {
        'name': 'test_project',
        'dataset_id': res.json['id'],
        'algorithm': 'cql'
    }
    res = client.post('/api/projects',
                      data=json.dumps(data),
                      content_type='application/json',
                      follow_redirects=True)
    project_id = res.json['id']

    # check create experiment
    data = {'name': 'test_experiment', 'config': {'n_epochs': 1}}
    res = client.post('/api/projects/%d/experiments' % project_id,
                      data=json.dumps(data),
                      content_type='application/json',
                      follow_redirects=True)
    assert res.status_code == 200
    assert res.json['name'] == 'test_experiment'
    assert res.json['is_active']
    experiment_id = res.json['id']

    time.sleep(20)

    # check get experiment
    url = '/api/projects/%d/experiments/%d' % (project_id, experiment_id)
    while True:
        res = client.get(url, follow_redirects=True)
        assert res.status_code == 200
        if not res.json['is_active']:
            break
        time.sleep(1)

    # check get all experiments
    res = client.get('/api/projects/%d/experiments' % project_id)
    assert res.status_code == 200
    assert len(res.json['experiments']) == 1

    # check update
    url = '/api/projects/%d/experiments/%d' % (project_id, experiment_id)
    res = client.put(url,
                     data=json.dumps({'name': 'updated'}),
                     content_type='application/json',
                     follow_redirects=True)
    assert res.status_code == 200
    assert res.json['name'] == 'updated'

    # check download as TorchScript
    url = '/api/projects/{}/experiments/{}/download?epoch=1&format=torchscript'
    res = client.get(url.format(project_id, experiment_id))
    assert res.status_code == 200

    # check download as ONNX
    url = '/api/projects/{}/experiments/{}/download?epoch=1&format=onnx'
    res = client.get(url.format(project_id, experiment_id))
    assert res.status_code == 200

    # check delete
    url = '/api/projects/%d/experiments/%d' % (project_id, experiment_id)
    res = client.delete(url, follow_redirects=True)
    assert res.status_code == 200
    with app.app_context():
        assert Experiment.get(experiment_id) is None


def test_system_api(client):
    # check status
    res = client.get('/api/system/status')
    assert res.status_code == 200
    assert res.json['gpu']['total'] == 0
    assert res.json['gpu']['jobs'] == {}
    assert res.json['cpu']['jobs'] == []
