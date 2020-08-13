import os
import ganglion.config as config

from d3rlpy.dataset import MDPDataset
from werkzeug.exceptions import NotFound
from datetime import datetime
from ..database import db, ma
from .base import BaseModel
from .project import Project


class Dataset(db.Model, BaseModel):
    __tablename__ = 'datasets'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    file_name = db.Column(db.String(100))
    episode_size = db.Column(db.Integer)
    step_size = db.Column(db.Integer)
    data_size = db.Column(db.Integer)
    is_image = db.Column(db.Boolean)
    is_discrete = db.Column(db.Boolean)
    statistics = db.Column(db.Text)
    created_at = db.Column(db.DateTime, nullable=True, default=datetime.now)
    updated_at = db.Column(db.DateTime,
                           nullable=True,
                           default=datetime.now,
                           onupdate=datetime.now)

    projects = db.relationship(Project, backref='dataset')

    def __init__(self, name, file_name, episode_size, step_size, data_size,
                 is_image, is_discrete, statistics):
        self.name = name
        self.file_name = file_name
        self.episode_size = episode_size
        self.step_size = step_size
        self.data_size = data_size
        self.is_image = is_image
        self.is_discrete = is_discrete
        self.statistics = statistics

    def __repr__(self):
        return '<Dataset {}:{}>'.format(self.id, self.name)

    @classmethod
    def create(cls, name, file_name, episode_size, step_size, data_size,
               is_image, is_discrete, statistics):
        dataset = Dataset(name, file_name, episode_size, step_size, data_size,
                          is_image, is_discrete, statistics)
        db.session.add(dataset)
        db.session.commit()
        return dataset

    def delete(self):
        # remove dataset file
        path = os.path.join(config.DATASET_DIR, self.file_name)
        if os.path.exists(path):
            os.remove(path)
        super().delete()

    def load_mdp_dataset(self):
        path = self.get_dataset_path()
        mdp_dataset = MDPDataset.load(path)
        return mdp_dataset

    def get_dataset_path(self):
        return os.path.join(config.DATASET_DIR, self.file_name)


class DatasetSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Dataset
        fields = ('id', 'name', 'file_name', 'episode_size', 'step_size',
                  'data_size', 'is_image', 'is_discrete', 'statistics',
                  'created_at', 'updated_at')

    created_at = ma.DateTime('%Y-%m-%dT%H:%M:%S+09:00')
    updated_at = ma.DateTime('%Y-%m-%dT%H:%M:%S+09:00')
