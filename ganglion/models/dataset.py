from werkzeug.exceptions import HTTPException
from datetime import datetime
from ..database import db, ma
from .project import Project


class Dataset(db.Model):
    __tablename__ = 'datasets'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    file_name = db.Column(db.String(100))
    is_image = db.Column(db.Boolean)
    is_discrete = db.Column(db.Boolean)
    created_at = db.Column(db.DateTime, nullable=True, default=datetime.now)
    updated_at = db.Column(db.DateTime,
                           nullable=True,
                           default=datetime.now,
                           onupdate=datetime.now)

    projects = db.relationship(Project, backref='projects')

    def __init__(self, name, file_name, is_image, is_discrete):
        self.name = name
        self.file_name = file_name
        self.is_image = is_image
        self.is_discrete = is_discrete

    def __repr__(self):
        return '<Dataset {}:{}>'.format(self.id, self.name)

    @classmethod
    def create(cls, name, file_name, is_image, is_discrete):
        dataset = Dataset(name, file_name, is_image, is_discrete)
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
            raise HTTPException(code=404)
        return dataset


class DatasetSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Dataset
        fields = ('id', 'name', 'is_image', 'is_discrete', 'created_at',
                  'updated_at')

    created_at = ma.DateTime('%Y-%m-%dT%H:%M:%S+09:00')
    updated_at = ma.DateTime('%Y-%m-%dT%H:%M:%S+09:00')
