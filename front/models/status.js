import axios from 'axios'
import { Record } from 'immutable'

const StatusRecord = Record({
  gpu: {},
  cpu: []
})

export class Status extends StatusRecord {
  static get () {
    return new Promise((resolve, reject) => {
      axios.get('/api/system/status')
        .then((res) => {
          const status = Status.fromResponse(res.data)
          resolve(status)
        })
        .catch((err) => reject(err))
    })
  }

  static fromResponse (data) {
    const status = new Status({
      gpu: data.gpu,
      cpu: data.cpu
    })
    return status
  }
}
