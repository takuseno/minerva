/* global FormData */

import { BaseModel } from './base'
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

const urlBase = '/api/datasets'

export class Dataset extends BaseModel(DatasetRecord, urlBase, 'dataset') {
  static upload (file, isImage, zipFile, progressCallback) {
    const params = new FormData()
    params.append('dataset', file)
    params.append('is_image', isImage)
    if (isImage) {
      params.append('zip_file', zipFile)
    }
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

  getExampleObservations () {
    return new Promise((resolve, reject) => {
      axios.get(`/api/datasets/${this.id}/example`)
        .then((res) => {
          const { observations } = res.data
          resolve(observations)
          return observations
        })
        .catch((err) => reject(err))
    })
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
