from datetime import datetime
from .base import BaseModel
from ..database import db, ma


class Experiment(db.Model, BaseModel):
    __tablename__ = 'experiments'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    name = db.Column(db.String(100))
    config = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, nullable=True, default=datetime.now)
    updated_at = db.Column(db.DateTime,
                           nullable=True,
                           default=datetime.now,
                           onupdate=datetime.now)

    def __init__(self, name, config):
        self.name = name
        self.config = config

    def __repr__(self):
        return '<Experiment {}:{}>'.format(self.id, self.name)

    def create(cls, name, config):
        experiment = Experiment(name, config)
        db.session.add(experiment)
        db.session.commit()
        return experiment


class ExperimentSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Experiment
        fields = ('id', 'project_id', 'name', 'config', 'project',
                  'updated_at')

    project = ma.Nested('ganglion.models.project.ProjectSchema')
    created_at = ma.DateTime('%Y-%m-%dT%H:%M:%S+09:00')
    updated_at = ma.DateTime('%Y-%m-%dT%H:%M:%S+09:00')
