import 'react-sweet-progress/lib/style.css'
import '../styles/project-dashboard.scss'
import { List, Map } from 'immutable'
import React, { useContext, useEffect, useState } from 'react'
import { ExperimentDetail } from './project/ExperimentDetail'
import { FETCH_EXPERIMENTS_INTERVAL } from '../constants'
import { GlobalContext } from '../context'
import { MetricsGraph } from './project/MetricsGraph'
import { ParamsList } from './project/ParamsList'
import { ProjectDetail } from './project/ProjectDetail'
import { ProjectHeader } from './project/ProjectHeader'
import { useParams } from 'react-router-dom'

const ExperimentList = (props) => (
  <div className='experiment-list'>
    <ProjectDetail project={props.project} dataset={props.dataset} />
    {props.experiments.size === 0 &&
      <div className='empty'>
        <span>NO EXPERIMENTS</span>
      </div>}
    {props.experiments.size > 0 &&
      <ul className='experiments'>
        {props.experiments.map((experiment) => (
          <li key={experiment.id}>
            <ExperimentDetail experiment={experiment} />
          </li>
        ))}
      </ul>}
  </div>
)

const ProjectMetrics = (props) => {
  const { experiments, project } = props

  const metrics = {}
  const labels = {}
  experiments.forEach((experiment) => {
    Object.entries(experiment.metrics).forEach(([key, values]) => {
      if (!(key in metrics)) {
        metrics[key] = []
        labels[key] = []
      }
      metrics[key].push(values)
      labels[key].push(experiment.name)
    })
  })

  return (
    <div className='project-metrics'>
      {Object.keys(metrics).length === 0 &&
        <div className='empty'>
          <span>NO METRICS</span>
        </div>}
      {Object.keys(metrics).length > 0 &&
        <MetricsGraph metrics={metrics} labels={labels} project={project} />}
      <ParamsList experiments={experiments} />
    </div>
  )
}

export const ProjectDashboard = (props) => {
  const { id } = useParams()
  const { fetchExperiments } = useContext(GlobalContext)
  const [time, setTime] = useState(Date.now())

  const { datasets, projects } = props
  const experiments = props.experiments.get(Number(id)) ?? List([])
  const project = projects.find((p) => p.id === Number(id)) ?? Map({})
  const { datasetId } = project
  const dataset = datasets.find((d) => d.id === Number(datasetId)) ?? Map({})

  // Fetch experiments
  useEffect(() => {
    fetchExperiments(Number(id))
  }, [id])

  // Fetch experiments periodically
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTime(Date.now())
      fetchExperiments(Number(id))
    }, FETCH_EXPERIMENTS_INTERVAL)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [time])

  return (
    <div className='dashboard'>
      <ProjectHeader project={project} dataset={dataset} />
      <div className='dashboard-body-wrapper'>
        <div className='dashboard-body'>
          <ExperimentList
            project={project}
            dataset={dataset}
            experiments={experiments}
          />
          <ProjectMetrics experiments={experiments} project={project} />
        </div>
      </div>
    </div>
  )
}
