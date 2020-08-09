from datetime import datetime
from ..database import db, ma


class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    dataset_id = db.Column(db.Integer, db.ForeignKey('datasets.id'))
    created_at = db.Column(db.DateTime, nullable=True, default=datetime.now)
    updated_at = db.Column(db.DateTime,
                           nullable=True,
                           default=datetime.now,
                           onupdate=datetime.now)

    def __init__(self, name, dataset_id):
        self.name = name
        self.dataset_id = dataset_id

    def __repr__(self):
        return '<Project {}:{}>'.format(self.id, self.name)

    @classmethod
    def create(cls, name, dataset_id):
        project = Project(name, dataset_id)
        db.session.add(project)
        db.session.commit()
        return project

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def get(cls, dataset_id, raise_404=False):
        dataset = db.session.query(Dataset).get(dataset_id)
        if not dataset and raise_404:
            raise HTTPException(code=404)
        return dataset


class ProjectSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Project
        fields = ('id', 'name', 'dataset_id', 'dataset', 'updated_at')

    dataset = ma.Nested('ganglion.models.dataset.DatasetSchema')
    created_at = ma.DateTime('%Y-%m-%dT%H:%M:%S+09:00')
    updated_at = ma.DateTime('%Y-%m-%dT%H:%M:%S+09:00')
