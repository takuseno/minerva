from werkzeug.exceptions import NotFound
from ..database import db


class BaseModel:
    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def get(cls, model_id, raise_404=False):
        data = db.session.query(cls).get(model_id)
        if not data and raise_404:
            raise NotFound()
        return data

    def update(self):
        db.session.commit()
