# pylint: disable=no-member, no-self-use

from datetime import datetime
from werkzeug.exceptions import NotFound
from ..database import db


class BaseModel:
    created_at = db.Column(db.DateTime, nullable=True, default=datetime.now)
    updated_at = db.Column(db.DateTime,
                           nullable=True,
                           default=datetime.now,
                           onupdate=datetime.now)

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def get(cls, model_id, raise_404=False):
        data = db.session.query(cls).get(model_id)
        if not data and raise_404:
            raise NotFound()
        return data

    @classmethod
    def create_query(cls):
        return db.session.query(cls)

    def update(self):
        db.session.commit()
