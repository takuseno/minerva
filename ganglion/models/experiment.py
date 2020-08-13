import numpy as np
import ganglion.config as config
import os
import re
import json

from datetime import datetime
from .base import BaseModel
from ..database import db, ma
from ..async import is_running, dispatch, kill
from ..tasks import train


class Experiment(db.Model, BaseModel):
    __tablename__ = 'experiments'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    name = db.Column(db.String(100))
    log_name = db.Column(db.String(100))
    config = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, nullable=True, default=datetime.now)
    updated_at = db.Column(db.DateTime,
                           nullable=True,
                           default=datetime.now,
                           onupdate=datetime.now)

    def __init__(self, project_id, name, log_name, config):
        self.project_id = project_id
        self.name = name
        self.log_name = log_name
        self.config = config

    def __repr__(self):
        return '<Experiment {}:{}>'.format(self.id, self.name)

    @classmethod
    def create(cls, project_id, name, log_name, config):
        experiment = Experiment(project_id, name, log_name, config)
        db.session.add(experiment)
        db.session.commit()
        return experiment

    def get_metrics(self):
        metrics = {}
        csv_pattern = re.compile('^.*.csv$')
        for file_name in os.listdir(self.get_log_path()):
            if re.match(csv_pattern, file_name):
                path = os.path.join(self.get_log_path(), file_name)
                name = file_name[:-4]
                data = np.loadtxt(path, delimiter=',')
                if len(data.shape) == 1:
                    data = data.reshape((1, -1))
                metrics[name] = data[:, 2]
        return metrics

    def get_current_status(self):
        return is_running(self.id)

    def start_training(self):
        dispatch(self.id,
                 train,
                 algo_name=self.project.algorithm,
                 params=json.loads(self.config),
                 dataset_path=self.project.dataset.get_dataset_path(),
                 experiment_name=self.log_name,
                 logdir=config.LOG_DIR)

    def cancel_training(self):
        kill(self.id)
        self.is_active = False
        self.update()

    def get_log_path(self):
        return os.path.join(config.LOG_DIR, self.log_name)


class ExperimentSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Experiment
        fields = ('id', 'project_id', 'name', 'log_name', 'config',
                  'is_active', 'updated_at')

    created_at = ma.DateTime('%Y-%m-%dT%H:%M:%S+09:00')
    updated_at = ma.DateTime('%Y-%m-%dT%H:%M:%S+09:00')
