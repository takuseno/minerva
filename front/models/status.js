import axios from 'axios'
import { Record } from 'immutable'
import { Experiment } from './experiment'

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
    const gpuJobs = {}
    Object.entries(data.gpu.jobs).forEach((deviceId, jobs) => {
      gpuJobs[deviceId] = jobs.map(Experiment.fromResponse)
    })
    const status = new Status({
      gpu: {
        total: data.gpu.total,
        jobs: gpuJobs
      },
      cpu: {
        jobs: data.cpu.jobs.map(Experiment.fromResponse)
      }
    })
    return status
  }
}
