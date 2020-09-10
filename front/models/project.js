import { BaseModel } from './base'
import { Dataset } from './dataset'
import { Record } from 'immutable'
import axios from 'axios'

const ProjectRecord = Record({
  id: 0,
  datasetId: 0,
  name: '',
  algorithm: '',
  dataset: null,
  createdAt: '',
  updatedAt: ''
})

const urlBase = '/api/projects'

export class Project extends BaseModel(ProjectRecord, urlBase, 'project') {
  static create (datasetId, name, progressCallback = () => {}) {
    const config = { onUploadProgress: progressCallback }
    const data = { dataset_id: datasetId, name: name }
    return new Promise((resolve, reject) => {
      axios.post('/api/projects', data, config)
        .then((res) => {
          const project = Project.fromResponse(res.data)
          resolve(project)
          return project
        })
        .catch((err) => reject(err))
    })
  }

  static fromResponse (data) {
    let dataset = null
    if (data.dataset !== undefined && data.dataset !== null) {
      dataset = Dataset.fromResponse(data.dataset)
    }
    const project = new Project({
      id: data.id,
      datasetId: data.dataset_id,
      name: data.name,
      algorithm: data.algorithm,
      dataset: dataset,
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
