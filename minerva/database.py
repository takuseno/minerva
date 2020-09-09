# pylint: disable=unused-argument

import flask_migrate

from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate


# protect sqlite internal tables from migrations
def skip_internal_tables(obj, name, type_, reflexted, compare_to):
    if type_ == 'table' and name == 'sqlite_sequence':
        return False
    return True


db = SQLAlchemy()
ma = Marshmallow()
migrate = Migrate(include_object=skip_internal_tables)


def init_db(app):
    db.init_app(app)
    ma.init_app(app)
    migrate.init_app(app, db)


def init_migration(directory):
    flask_migrate.init(directory)


def create_migration(directory):
    flask_migrate.migrate(directory)


def upgrade_db(directory):
    flask_migrate.upgrade(directory)


def downgrade_db(directory):
    flask_migrate.downgrade(directory)
