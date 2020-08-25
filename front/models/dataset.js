/* global FormData */

import { Record } from 'immutable'
import axios from 'axios'

const DatasetRecord = Record({
  id: 0,
  name: '',
  episodeSize: 0,
  stepSize: 0,
  dataSize: 0,
  isImage: false,
  isDiscrete: false,
  statistics: {},
  createdAt: '',
  updatedAt: ''
})

export class Dataset extends DatasetRecord {
  static get (id) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/datasets/${id}`)
        .then((res) => {
          const dataset = Dataset.fromResponse(res.data)
          resolve(dataset)
          return dataset
        })
        .catch((err) => reject(err))
    })
  }

  static getAll () {
    return new Promise((resolve, reject) => {
      axios.get('/api/datasets')
        .then((res) => {
          const datasets = res.data.datasets.map(Dataset.fromResponse)
          resolve(datasets)
          return datasets
        })
        .catch((err) => reject(err))
    })
  }

  static upload (file, isImage, isDiscrete, progressCallback = () => {}) {
    const params = new FormData()
    params.append('dataset', file)
    params.append('is_image', isImage)
    params.append('is_discrete', isDiscrete)
    const config = {
      headers: { 'Content-type': 'multipart/form-data' },
      onUploadProgress: progressCallback
    }
    return new Promise((resolve, reject) => {
      axios.post('/api/datasets/upload', params, config)
        .then((res) => {
          const dataset = Dataset.fromResponse(res.data)
          resolve(dataset)
          return dataset
        })
        .catch((err) => reject(err))
    })
  }

  delete () {
    return axios.delete(`/api/datasets/${this.id}`)
  }

  update () {
    return axios.put(`/api/datasets/${this.id}`, this.toRequest())
  }

  static fromResponse (data) {
    const dataset = new Dataset({
      id: data.id,
      name: data.name,
      episodeSize: data.episode_size,
      stepSize: data.step_size,
      dataSize: data.data_size,
      isImage: data.is_image,
      isDiscrete: data.is_discrete,
      statistics: JSON.parse(data.statistics),
      createdAt: data.created_at,
      updatedAt: data.updated_at
    })
    return dataset
  }

  toRequest () {
    return {
      id: this.id,
      name: this.name
    }
  }
}
