import numpy as np
import click
import os
import minerva.models

from flask import Flask, Blueprint, redirect, url_for
from flask.json import JSONEncoder
from minerva.config import config, prepare_directory
from minerva.database import init_db, db, ma
from minerva.controllers import dataset_route
from minerva.controllers import project_route

static_path = os.path.join(os.path.dirname(__file__), '..', 'dist')
app = Flask(__name__, static_folder=static_path)
for name, val in config.items():
    app.config[name] = val
app.url_map.strict_slashes = False


# enable to return ndarray in json
class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        return JSONEncoder.default(self, obj)


app.json_encoder = CustomJSONEncoder

# initialize database
init_db(app)

# create minerva directory
prepare_directory()

# API endpoints
app.register_blueprint(dataset_route, url_prefix='/api/datasets')
app.register_blueprint(project_route, url_prefix='/api/projects')


# proxy
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def send_file(path):
    if path == '' or path == '/':
        return redirect('/projects')
    if path.find('.js') == -1:
        path = 'index.html'
    return app.send_static_file(path)


@click.group()
def cli():
    pass


@cli.command()
@click.option('--host', '-h', default='0.0.0.0')
@click.option('--port', '-p', default=9000)
def run(host, port):
    app.run(debug=True, host=host, port=int(port))


@cli.command()
def create_db():
    with app.app_context():
        db.create_all()


if __name__ == '__main__':
    cli()
