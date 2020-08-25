import { Experiment } from './experiment'
import { Record } from 'immutable'
import axios from 'axios'

const StatusRecord = Record({
  cpu: [],
  gpu: {}
})

export class Status extends StatusRecord {
  static get () {
    return new Promise((resolve, reject) => {
      axios.get('/api/system/status')
        .then((res) => {
          const status = Status.fromResponse(res.data)
          resolve(status)
          return status
        })
        .catch((err) => reject(err))
    })
  }

  static fromResponse (data) {
    const gpuJobs = {}
    Object.entries(data.gpu.jobs).forEach(([deviceId, jobs]) => {
      gpuJobs[deviceId] = jobs.map(Experiment.fromResponse)
    })
    const status = new Status({
      cpu: {
        jobs: data.cpu.jobs.map(Experiment.fromResponse)
      },
      gpu: {
        jobs: gpuJobs,
        total: data.gpu.total
      }
    })
    return status
  }
}
