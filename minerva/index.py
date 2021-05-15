# pylint: disable=unused-import

import os
import shutil

import click
import numpy as np
from flask import Flask, redirect
from flask.json import JSONEncoder

from . import database, models
from ._version import __version__
from .config import (
    DATABASE_PATH,
    MIGRATION_DIR,
    ROOT_DIR,
    config,
    prepare_directory,
)
from .controllers import dataset_route, project_route, system_route
from .database import db, init_db

static_path = os.path.join(os.path.dirname(__file__), "dist")
app = Flask(__name__, static_folder=static_path)
for name, val in config.items():
    app.config[name] = val
app.url_map.strict_slashes = False


# enable to return ndarray in json
class CustomJSONEncoder(JSONEncoder):
    def default(self, o):
        if isinstance(o, np.integer):
            return int(o)
        if isinstance(o, np.floating):
            return float(o)
        if isinstance(o, np.ndarray):
            return o.tolist()
        return JSONEncoder.default(self, o)


app.json_encoder = CustomJSONEncoder

# initialize database
init_db(app)

# create minerva directory
prepare_directory()

# API endpoints
app.register_blueprint(dataset_route, url_prefix="/api/datasets")
app.register_blueprint(project_route, url_prefix="/api/projects")
app.register_blueprint(system_route, url_prefix="/api/system")


# proxy
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def send_file(path):
    if path in ["", "/"]:
        return redirect("/projects")
    if path.find("favicon.ico") > -1:
        path = "favicon.ico"
    elif path.find(".js") == -1:
        path = "index.html"
    return app.send_static_file(path)


@click.group()
def cli():
    print("MINERVA command line interface (Version %s)" % __version__)


@cli.command(short_help="Start MINERVA server.")
@click.option("--host", "-h", default="0.0.0.0", help="Host IP address.")
@click.option("--port", "-p", default=9000, help="Port number.")
@click.option("--debug", is_flag=True, help="Start as debug mode.")
def run(host, port, debug):
    # create databse if not exists
    if not os.path.exists(DATABASE_PATH):
        with app.app_context():
            db.create_all()
            database.init_migration(MIGRATION_DIR)
            database.create_migration(MIGRATION_DIR)
        print("Database initialization has been completed.")

    # start server
    app.run(debug=debug, host=host, port=int(port))


@cli.command(short_help="Initialize database.")
def create_db():
    with app.app_context():
        db.create_all()
        database.init_migration(MIGRATION_DIR)
        database.create_migration(MIGRATION_DIR)
    print("Database initialization has been completed.")


@cli.command(short_help="Upgrade database schema.")
def upgrade_db():
    with app.app_context():
        database.create_migration(MIGRATION_DIR)
        database.upgrade_db(MIGRATION_DIR)
    print("Database migration has been completed.")


@cli.command(short_help="Rollback database schema.")
def downgrade_db():
    with app.app_context():
        database.downgrade_db(MIGRATION_DIR)
    print("Database rollback has been completed.")


@cli.command(short_help="Delete all data from the disk.")
def clean():
    print(f"{ROOT_DIR} is being deleted...")
    shutil.rmtree(ROOT_DIR)
    print(f"{ROOT_DIR} has been deleted.")


if __name__ == "__main__":
    cli()
