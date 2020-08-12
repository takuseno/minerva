import axios from 'axios'
import { Record } from 'immutable'
import { Dataset } from './dataset'

const ProjectRecord = Record({
  id: 0,
  datasetId: 0,
  name: '',
  algorithm: '',
  dataset: null,
  createdAt: '',
  updatedAt: ''
})

export class Project extends ProjectRecord {
  static get (id) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/projects/${id}`)
        .then((res) => {
          const project = Project.fromResponse(res.data)
          resolve(project)
        })
        .catch((err) => reject(err))
    })
  }

  static getAll () {
    return new Promise((resolve, reject) => {
      axios.get('/api/projects')
        .then((res) => {
          const projects = res.data.projects.map(Project.fromResponse)
          resolve(projects)
        })
        .catch((err) => reject(err))
    })
  }

  static create (datasetId, name, progressCallback = () => {}) {
    const config = { onUploadProgress: progressCallback }
    const data = { dataset_id: datasetId, name: name }
    return new Promise((resolve, reject) => {
      axios.post('/api/projects', data, config)
        .then((res) => {
          const project = Project.fromResponse(res.data)
          resolve(project)
        })
        .catch((err) => reject(err))
    })
  }

  delete () {
    return axios.delete(`/api/projects/${this.id}`)
  }

  update () {
    return axios.put(`/api/projects/${this.id}`, this.toRequest())
  }

  static fromResponse (data) {
    const project = new Project({
      id: data.id,
      datasetId: data.dataset_id,
      name: data.name,
      algorithm: data.algorithm,
      dataset: Dataset.fromResponse(data.dataset),
      createdAt: data.created_at,
      updatedAt: data.updated_at
    })
    return project
  }

  toRequest () {
    return {
      id: this.id,
      dataset_id: this.datasetId,
      name: this.name
    }
  }
}
