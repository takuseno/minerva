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
        device_id = experiment.statistics['use_gpu']
        if device_id == False:
            cpu_jobs.append(ExperimentSchema.dump(experiment))
        else:
            if device_id not in used_gpus:
                used_gpus[device_id] = []
            used_gpus[device_id].append(ExperimentSchema.dump(experiment))

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
