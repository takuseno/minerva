import 'react-sweet-progress/lib/style.css'
import '../styles/header.scss'
import { Link, useLocation } from 'react-router-dom'
import React, { useContext, useState } from 'react'
import { CpuIcon } from '@primer/octicons-react'
import { GlobalContext } from '../context'
import { Progress } from 'react-sweet-progress'
import { Range } from 'immutable'

const JobItem = (props) => {
  const { experiment, metrics, project } = props

  const totalEpoch = experiment.config.n_epochs
  const currentEpoch = metrics.td_error ? metrics.td_error.length : 0
  const progress = currentEpoch / totalEpoch

  return (
    <div className='job-item'>
      <div className='job-progress'>
        <Progress
          type='circle'
          percent={100.0 * progress}
          strokeWidth='10'
          width='35'
          status='active'
          theme={{
            active: {
              symbol: `${Math.round(100.0 * progress).toString()}%`,
              color: '#3498db'
            }
          }}
        />
      </div>
      <div className='job-description'>
        <p className='project-name'>Project: {project.name}</p>
        <p className='experiment-name'>{experiment.name}</p>
      </div>
    </div>
  )
}

const JobList = (props) => {
  const { projects } = props.projects
  const cpuJobs = props.status.cpu.jobs
  const totalGPU = props.status.gpu.total
  const gpuJobs = props.status.gpu.jobs
  return (
    <div className='job-list'>
      <div className='jobs'>
        <p className='device-name'>CPU</p>
        {cpuJobs.length === 0 &&
          <p className='empty-message'>No Jobs</p>}
        {cpuJobs.length > 0 &&
          <ul>
            {cpuJobs.map((experiment) => {
              const { projectId } = experiment
              const project = projects.find((p) => p.id === projectId)
              return (
                <li key={experiment.id}>
                  <JobItem experiment={experiment} project={project} />
                </li>
              )
            })}
          </ul>}
      </div>
      {Range(0, totalGPU).toJS().map((i) => (
        <div key={i} className='jobs'>
          <p className='device-name'>GPU:{i}</p>
          {(gpuJobs[i] === undefined || gpuJobs[i].length === 0) &&
            <p className='empty-message'>No Jobs</p>}
          {gpuJobs[i] !== undefined && gpuJobs[i].length > 0 &&
            <ul>
              {gpuJobs[i].map((experiment) => {
                const { projectId } = experiment
                const project = projects.find((p) => p.id === projectId)
                return (
                  <li key={experiment.id}>
                    <JobItem experiment={experiment} project={project} />
                  </li>
                )
              })}
            </ul>}
        </div>
      ))}
    </div>
  )
}

export const Header = () => {
  const { status, projects } = useContext(GlobalContext)
  const [isJobListOpen, setIsJobListOpen] = useState(false)
  const location = useLocation()
  return (
    <div className='header'>
      <div className='logo'>
        <span>MINERVA</span>
      </div>
      <div className='links'>
        {['projects', 'datasets'].map((link) => {
          const isActive = location.pathname.split('/')[1] === link
          const className = isActive ? 'link active' : 'link'
          const to = `/${link}`
          return (
            <Link key={link} to={to} className={className}>
              <span>{link.toUpperCase()}</span>
            </Link>
          )
        })}
      </div>
      <div className='popups'>
        <div className='button'>
          <div onClick={() => setIsJobListOpen(!isJobListOpen)}>
            <CpuIcon size='large' />
          </div>
          {isJobListOpen && status.cpu !== undefined &&
            <JobList status={status} projects={projects} />}
        </div>
      </div>
    </div>
  )
}
