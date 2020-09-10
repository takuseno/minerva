# pylint: disable=unidiomatic-typecheck

import json

from collections import defaultdict
from d3rlpy.gpu import get_gpu_count
from flask import Blueprint, jsonify
from ..models.experiment import Experiment, ExperimentSchema
from .project import _process_metrics

system_route = Blueprint('system', __name__)


def _get_device_id_and_data(experiment):
    # identify device
    config = json.loads(experiment.config)
    device_id = config['use_gpu'] if 'use_gpu' in config else None

    # make response data
    data = ExperimentSchema().dump(experiment)
    # update status
    _process_metrics(experiment, data)

    return device_id, data


@system_route.route('/status', methods=['GET'])
def get_system_status():
    n_gpus = get_gpu_count()

    # get all active experiments
    experiments = Experiment.create_query().filter(Experiment.is_active).all()

    gpu_jobs = defaultdict(list)
    cpu_jobs = []
    for experiment in experiments:
        device_id, data = _get_device_id_and_data(experiment)
        if type(device_id) == int:
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
