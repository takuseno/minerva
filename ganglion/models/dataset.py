import os

from d3rlpy.dataset import MDPDataset
from werkzeug.exceptions import NotFound
from datetime import datetime
from ..database import db, ma
from ..config import DATASET_DIR
from .project import Project


class Dataset(db.Model):
    __tablename__ = 'datasets'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    file_name = db.Column(db.String(100))
    is_image = db.Column(db.Boolean)
    is_discrete = db.Column(db.Boolean)
    statistics = db.Column(db.Text)
    created_at = db.Column(db.DateTime, nullable=True, default=datetime.now)
    updated_at = db.Column(db.DateTime,
                           nullable=True,
                           default=datetime.now,
                           onupdate=datetime.now)

    projects = db.relationship(Project, backref='projects')

    def __init__(self, name, file_name, is_image, is_discrete, statistics):
        self.name = name
        self.file_name = file_name
        self.is_image = is_image
        self.is_discrete = is_discrete
        self.statistics = statistics

    def __repr__(self):
        return '<Dataset {}:{}>'.format(self.id, self.name)

    @classmethod
    def create(cls, name, file_name, is_image, is_discrete, statistics):
        dataset = Dataset(name, file_name, is_image, is_discrete, statistics)
        db.session.add(dataset)
        db.session.commit()
        return dataset

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def get(cls, dataset_id, raise_404=False):
        dataset = db.session.query(Dataset).get(dataset_id)
        if not dataset and raise_404:
            raise NotFound()
        return dataset

    def load_mdp_dataset(self):
        path = os.path.join(DATASET_DIR, self.file_name)
        mdp_dataset = MDPDataset.load(path)
        return mdp_dataset


class DatasetSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Dataset
        fields = ('id', 'name', 'is_image', 'is_discrete', 'statistics',
                  'created_at', 'updated_at')

    created_at = ma.DateTime('%Y-%m-%dT%H:%M:%S+09:00')
    updated_at = ma.DateTime('%Y-%m-%dT%H:%M:%S+09:00')
