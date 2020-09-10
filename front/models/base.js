import axios from 'axios'

export const BaseModel = (record, urlBase, name) => class extends record {
  static get (id) {
    return new Promise((resolve, reject) => {
      axios.get(`${urlBase}/${id}`)
        .then((res) => {
          const model = this.fromResponse(res.data)
          resolve(model)
          return model
        })
        .catch((err) => reject(err))
    })
  }

  static getAll () {
    return new Promise((resolve, reject) => {
      axios.get(urlBase)
        .then((res) => {
          const models = res.data[`${name}s`].map(this.fromResponse)
          resolve(models)
          return models
        })
        .catch((err) => reject(err))
    })
  }

  delete () {
    return axios.delete(`${urlBase}/${this.id}`)
  }

  update () {
    return axios.put(`${urlBase}/${this.id}`, this.toRequest())
  }

  toRequest () {
    return this
  }

  static fromResponse (data) {
    throw Error('override fromResponse.')
  }
}
