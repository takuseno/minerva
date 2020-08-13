from datetime import datetime
from flask_marshmallow.fields import fields
from .base import BaseModel
from .experiment import Experiment
from ..database import db, ma


class Project(db.Model, BaseModel):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    dataset_id = db.Column(db.Integer, db.ForeignKey('datasets.id'))
    name = db.Column(db.String(100))
    algorithm = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, nullable=True, default=datetime.now)
    updated_at = db.Column(db.DateTime,
                           nullable=True,
                           default=datetime.now,
                           onupdate=datetime.now)

    experiments = db.relationship(Experiment, backref='project')

    def __init__(self, dataset_id, name, algorithm):
        self.dataset_id = dataset_id
        self.name = name
        self.algorithm = algorithm

    def __repr__(self):
        return '<Project {}:{}>'.format(self.id, self.name)

    @classmethod
    def create(cls, dataset_id, name, algorithm):
        project = Project(dataset_id, name, algorithm)
        db.session.add(project)
        db.session.commit()
        return project


class ProjectSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Project

    id = ma.Integer(required=True)
    dataset_id = ma.Integer(required=True)
    name = ma.String(required=True)
    algorithm = ma.String(required=True)
    dataset = ma.Nested('ganglion.models.dataset.DatasetSchema')
    created_at = ma.DateTime('%Y-%m-%dT%H:%M:%S+09:00')
    updated_at = ma.DateTime('%Y-%m-%dT%H:%M:%S+09:00')
