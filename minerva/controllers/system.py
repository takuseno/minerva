# pylint: disable=unidiomatic-typecheck

import json

from d3rlpy.gpu import get_gpu_count
from flask import Blueprint, jsonify
from ..models.experiment import Experiment, ExperimentSchema
from .project import _process_metrics

system_route = Blueprint('system', __name__)


@system_route.route('/status', methods=['GET'])
def get_system_status():
    n_gpus = get_gpu_count()

    # get all active experiments
    experiments = Experiment.create_query().filter(Experiment.is_active).all()

    gpu_jobs = {}
    cpu_jobs = []
    for experiment in experiments:
        # identify device
        config = json.loads(experiment.config)
        device_id = config['use_gpu'] if 'use_gpu' in config else None

        # make response data
        data = ExperimentSchema().dump(experiment)
        # update status
        _process_metrics(experiment, data)

        if type(device_id) == int:
            if device_id not in gpu_jobs:
                gpu_jobs[device_id] = []
            gpu_jobs[device_id].append(data)
        else:
            cpu_jobs.append(data)

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
