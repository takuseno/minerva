import axios from 'axios'
import { Record } from 'immutable'

const DatasetRecord = Record({
  id: 0,
  name: '',
  statistics: {},
  createdAt: '',
  updatedAt: ''
})

export class Dataset extends DatasetRecord {
  static get (id) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/dataset/${id}`)
        .then((res) => {
          const dataset = Dataset.fromResponse(res)
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

  static upload (file, isImage, isDiscrete) {
    const params = new FormData()
    params.append('dataset', file)
    params.append('is_image', isImage)
    params.append('is_discrete', isDiscrete)
    return new Promise((resolve, reject) => {
      axios.post('/api/dataset/upload', params, {
          headers: { 'Content-type': 'multipart/form-data' }
        })
        .then((res) => {
          const dataset = Dataset.fromResponse(res)
          resolve(dataset)
        })
        .catch((err) => reject(err))
    })
  }

  delete () {
    axios.delete(`/api/dataset/${this.id}`)
  }

  update () {
    axios.put(`/api/dataset/${this.id}`, this.toRequest())
  }

  static fromResponse (res) {
    const dataset = new Dataset({
      id: res.data.id,
      name: res.data.name,
      statistics: JSON.parse(res.data.statistics),
      createdAt: res.data.created_at,
      updatedAt: res.data.updated_at
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
