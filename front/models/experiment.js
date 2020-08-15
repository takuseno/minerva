import axios from 'axios'
import { Record } from 'immutable'

const ExperimentRecord = Record({
  id: 0,
  projectId: 0,
  name: '',
  config: {},
  isActive: false,
  createdAt: '',
  updatedAt: '',
  metrics: {}
})

export class Experiment extends ExperimentRecord {
  static get (projectId, id) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/projects/${projectId}/experiments/${id}`)
        .then((res) => {
          const experiment = Experiment.fromResponse(res.data)
          resolve(experiment)
        })
        .catch((err) => reject(err))
    })
  }

  static getAll (projectId) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/projects/${projectId}/experiments`)
        .then((res) => {
          const experiments = res.data.experiments.map(Experiment.fromResponse)
          resolve(experiments)
        })
        .catch((err) => reject(err))
    })
  }

  static create (projectId, name, experimentConfig, progressCallback = () => {}) {
    const config = { onUploadProgress: progressCallback }
    const data = {
      project_id: projectId,
      name: name,
      config: experimentConfig
    }
    return new Promise((resolve, reject) => {
      axios.post(`/api/projects/${projectId}/experiments`, data, config)
        .then((res) => {
          const experiment = Experiment.fromResponse(res.data)
          resolve(experiment)
        })
        .catch((err) => reject(err))
    })
  }

  delete () {
    const url = `/api/projects/${this.projectId}/experiments/${this.id}`
    return axios.delete(url)
  }

  update () {
    const url = `/api/projects/${this.projectId}/experiments/${this.id}`
    return axios.put(url, this.toResponse())
  }

  static fromResponse (data) {
    const experiment = new Experiment({
      id: data.id,
      projectId: data.project_id,
      name: data.name,
      config: JSON.parse(data.config),
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      metrics: data.metrics
    })
    return experiment
  }

  toRequest () {
    return {
      id: this.id,
      project_id: this.projectId,
      name: this.name
    }
  }
}
