import pytest
import os
import json
import time
import minerva.config as config

from d3rlpy.datasets import get_cartpole
from werkzeug.datastructures import FileStorage
from minerva.dataset import export_mdp_dataset_as_csv
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
        data = {'is_image': 'false', 'is_discrete': 'true'}
        file = FileStorage(stream=f,
                           filename='dataset.csv',
                           content_type='text/csv')
        data['dataset'] = file

        # upload
        res = client.post('/api/datasets/upload',
                          data=data,
                          content_type='multipart/form-data')

    return res, mdp_dataset


def test_dataset_api(client):
    # check upload dataset
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
    data = {'name': 'test', 'dataset_id': dataset_id}
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
    data = {'name': 'test_project', 'dataset_id': res.json['id']}
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

    # check download
    url = '/api/projects/%d/experiments/%d/download?epoch=0' % (project_id,
                                                                experiment_id)
    res = client.get(url)
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
