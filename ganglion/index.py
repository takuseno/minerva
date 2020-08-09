import numpy as np
import click
import os
import ganglion.models

from flask import Flask, Blueprint, redirect, url_for
from flask.json import JSONEncoder
from ganglion.config import config, prepare_directory
from ganglion.database import init_db, db, ma
from ganglion.controllers import dataset_route

app = Flask(__name__, static_folder='dist')
for name, val in config.items():
    app.config[name] = val


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

# create ganglion directory
prepare_directory()


# proxy
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def send_file(path):
    if path == '' or path == '/':
        return redirect('/projects')
    if path.find('.js') == -1:
        path = 'index.html'
    return app.send_static_file(path)


# API endpoints
app.register_blueprint(dataset_route, url_prefix='/api/dataset')


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
