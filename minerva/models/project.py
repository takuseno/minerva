# pylint: disable=no-member, too-many-instance-attributes

from .base import BaseModel
from .experiment import Experiment
from ..database import db, ma


class Project(db.Model, BaseModel):
    __tablename__ = 'projects'
    __table_args__ = {'sqlite_autoincrement': True}
    id = db.Column(db.Integer, primary_key=True)
    dataset_id = db.Column(db.Integer, db.ForeignKey('datasets.id'))
    name = db.Column(db.String(100))
    algorithm = db.Column(db.String(100))

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
    dataset = ma.Nested('minerva.models.dataset.DatasetSchema')
    created_at = ma.DateTime('%Y-%m-%dT%H:%M:%S+09:00')
    updated_at = ma.DateTime('%Y-%m-%dT%H:%M:%S+09:00')
