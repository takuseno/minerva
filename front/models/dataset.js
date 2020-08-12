/* global FormData */

import axios from 'axios'
import { Record } from 'immutable'

const DatasetRecord = Record({
  id: 0,
  name: '',
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
      axios.get(`/api/dataset/${id}`)
        .then((res) => {
          const dataset = Dataset.fromResponse(res.data)
          resolve(dataset)
        })
        .catch((err) => reject(err))
    })
  }

  static getAll () {
    return new Promise((resolve, reject) => {
      axios.get('/api/dataset')
        .then((res) => {
          const datasets = res.data.datasets.map(Dataset.fromResponse)
          resolve(datasets)
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
      axios.post('/api/dataset/upload', params, config)
        .then((res) => {
          const dataset = Dataset.fromResponse(res.data)
          resolve(dataset)
        })
        .catch((err) => reject(err))
    })
  }

  delete () {
    return axios.delete(`/api/dataset/${this.id}`)
  }

  update () {
    return axios.put(`/api/dataset/${this.id}`, this.toRequest())
  }

  static fromResponse (data) {
    const dataset = new Dataset({
      id: data.id,
      name: data.name,
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
