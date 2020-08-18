import json

from d3rlpy.gpu import get_gpu_count
from flask import Blueprint, jsonify
from ..database import db
from ..models.experiment import Experiment, ExperimentSchema

system_route = Blueprint('system', __name__)


@system_route.route('/status', methods=['GET'])
def get_system_status():
    n_gpus = get_gpu_count()

    experiments = db.session.query(Experiment)\
        .filter(Experiment.is_active == True)\
        .all()

    gpu_jobs = {}
    cpu_jobs = []
    for experiment in experiments:
        config = json.loads(experiment.config)
        device_id = config['use_gpu'] if 'use_gpu' in config else None
        if device_id:
            if device_id not in gpu_jobs:
                gpu_jobs[device_id] = []
            gpu_jobs[device_id].append(ExperimentSchema().dump(experiment))
        else:
            cpu_jobs.append(ExperimentSchema().dump(experiment))

    res = {
        'gpu': {
            'total': n_gpus,
            'jobs': gpu_jobs
        },
        'cpu': {
            'jobs': cpu_jobs
        }
    }

    return jsonify(res)
