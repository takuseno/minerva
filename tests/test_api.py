import pytest
import os
import ganglion.config as config

from d3rlpy.datasets import get_cartpole
from werkzeug.datastructures import FileStorage
from ganglion.dataset import export_mdp_dataset_as_csv
from ganglion.index import app, db
from ganglion.models.dataset import Dataset


@pytest.fixture(scope='session')
def client():
    config.ROOT_DIR = os.path.abspath('test_data')
    config.DATASET_DIR = os.path.join(config.ROOT_DIR, 'dataset')
    config.DATABASE_PATTH = os.path.join(config.ROOT_DIR, 'database.db')
    database_path = config.DATABASE_PATTH
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///%s' % database_path
    config.prepare_directory()
    with app.app_context():
        db.drop_all()
        db.create_all()
    return app.test_client()


def test_dataset_api(client):
    # prepare dataset
    mdp_dataset, _ = get_cartpole()
    csv_path = os.path.join('test_data', 'dataset.csv')
    export_mdp_dataset_as_csv(mdp_dataset, csv_path)

    # prepare upload request
    with open(csv_path, 'rb') as f:
        data = {'is_image': 0, 'is_discrete': 1}
        file = FileStorage(stream=f,
                           filename='dataset.csv',
                           content_type='text/csv')
        data['dataset'] = file

        # upload
        res = client.post('/api/dataset/upload',
                          data=data,
                          content_type='multipart/form-data')
        assert res.status_code == 200
        assert res.json['name'] == 'dataset.csv'

        dataset_id = res.json['id']
        dataset_name = res.json['name']

    # check get
    res = client.get('/api/dataset/%d' % dataset_id)
    assert res.status_code == 200
    assert res.json['id'] == dataset_id
    assert res.json['name'] == dataset_name

    # check get_all
    res = client.get('/api/dataset')
    assert res.status_code == 200
    assert len(res.json['datasets']) == 1
    assert res.json['datasets'][0]['id'] == dataset_id

    # check delete
    res = client.delete('/api/dataset/%d' % dataset_id)
    assert res.status_code == 200
    with app.app_context():
        assert Dataset.get(dataset_id) is None
