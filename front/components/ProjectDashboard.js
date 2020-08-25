import 'react-sweet-progress/lib/style.css'
import '../styles/project-dashboard.scss'
import { Button, SelectForm, TextForm } from './forms'
import {
  FETCH_EXPERIMENTS_INTERVAL,
  Q_FUNC_TYPE_OPTIONS,
  SCALER_OPTIONS
} from '../constants'
import { Link, useHistory, useParams } from 'react-router-dom'
import { List, Map } from 'immutable'
import React, { useContext, useEffect, useState } from 'react'
import { ConfirmationDialog } from './ConfirmationDialog'
import { DownloadPolicyDialog } from './DownloadPolicyDialog'
import { ExperimentCreateDialog } from './ExperimentCreateDialog'
import { GlobalContext } from '../context'
import { Line } from './graphs'
import { Progress } from 'react-sweet-progress'

const ProjectHeader = (props) => {
  const { dataset, project } = props
  const [isEditing, setIsEditing] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const { updateProject, deleteProject } = useContext(GlobalContext)
  const history = useHistory()

  const handleEdit = () => {
    setProjectName(project.name)
    setIsEditing(true)
  }
  const handleUpdate = () => {
    setIsEditing(false)
    updateProject(project.set('name', projectName))
  }
  const handleDelete = () => {
    setIsDeleting(false)
    deleteProject(project)
    history.push('/projects')
  }

  if (isEditing) {
    return (
      <div className='project-header'>
        <TextForm value={projectName} onChange={setProjectName} focus />
        <div className='edit-buttons'>
          <Button text='UPDATE' onClick={handleUpdate} />
          <Button text='CANCEL' onClick={() => setIsEditing(false)} />
        </div>
      </div>
    )
  }
  return (
    <div className='project-header'>
      <span className='project-name'>{project.name}</span>
      <div className='edit-buttons'>
        <Button text='RUN' onClick={() => setIsCreating(true)} />
        <Button text='EDIT' onClick={handleEdit} />
        <Button text='DELETE' onClick={() => setIsDeleting(true)} />
        <ConfirmationDialog
          title={`Deleting ${project.name}.`}
          message='Are you sure to delete this project?'
          isOpen={isDeleting}
          onClose={() => setIsDeleting(false)}
          onConfirm={handleDelete}
          confirmText='DELETE'
          cancelText='CANCEL'
        />
        {project &&
          <ExperimentCreateDialog
            isOpen={isCreating}
            onClose={() => setIsCreating(false)}
            project={project}
            dataset={dataset}
          />}
      </div>
    </div>
  )
}

const ProjectDetail = (props) => {
  const { dataset, project } = props
  const algorithm = project.algorithm.toUpperCase().replace('_', ' ')
  return (
    <div className='project-detail'>
      <table>
        <tr>
          <th>DATASET</th>
          <td>
            <Link to={`/datasets/${dataset.id}`}>
              {dataset.name}
            </Link>
          </td>
        </tr>
        <tr>
          <th>ALGORITHM</th>
          <td>{algorithm}</td>
        </tr>
      </table>
    </div>
  )
}

const ExperimentDetail = (props) => {
  const { cancelExperiment, deleteExperiment } = useContext(GlobalContext)
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { experiment } = props
  const { metrics, isActive } = experiment
  const totalEpoch = experiment.config.n_epochs
  const currentEpoch = metrics.td_error ? metrics.td_error.length : 0

  let progress = currentEpoch / totalEpoch
  let status = 'success'
  let progressStatus = 'success'
  let progressColor = '#2ecc71'
  if (isActive) {
    status = 'running'
    progressStatus = 'active'
    progressColor = '#3498db'
  } else if (progress !== 1.0) {
    status = 'failed'
    progressStatus = 'error'
    progressColor = '#e74c3c'
    progress = 1.0
  }

  return (
    <div className='experiment-detail'>
      <div className='top-line'>
        <Progress
          type='circle'
          percent={100.0 * progress}
          strokeWidth='10'
          width='35'
          status={progressStatus}
          theme={{
            error: {
              color: progressColor
            },
            success: {
              color: progressColor
            },
            active: {
              symbol: `${Math.round(100.0 * progress).toString()}%`,
              color: progressColor
            }
          }}
        />
        <span className='experiment-name'>
          {experiment.name}
        </span>
        <span className={status}>
          {status}
        </span>
      </div>
      <div className='middle-line'>
        <table>
          <tr>
            <th>EPOCH</th>
            <td>{currentEpoch}/{totalEpoch}</td>
          </tr>
          <tr>
            <th>Q FUNCTION</th>
            <td>{Q_FUNC_TYPE_OPTIONS[experiment.config.q_func_type]}</td>
          </tr>
          <tr>
            <th>SCALER</th>
            <td>{SCALER_OPTIONS[experiment.config.scaler]}</td>
          </tr>
        </table>
      </div>
      <div className='bottom-line'>
        <Button
          text='DOWNLOAD'
          onClick={() => setIsDownloadDialogOpen(true)}
        />
        {isActive &&
          <Button
            text='CANCEL'
            onClick={() => cancelExperiment(experiment)}
          />}
        {!isActive &&
          <Button
            text='DELETE'
            onClick={() => setIsDeleting(true)}
          />}
      </div>
      <DownloadPolicyDialog
        isOpen={isDownloadDialogOpen}
        totalEpoch={currentEpoch}
        experiment={experiment}
        onClose={() => setIsDownloadDialogOpen(false)}
      />
      <ConfirmationDialog
        title={`Deleting ${experiment.name}.`}
        message='Are you sure to delete this experiment?'
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={() => deleteExperiment(experiment)}
        confirmText='DELETE'
        cancelText='CANCEL'
      />
    </div>
  )
}

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

const ParamsList = (props) => {
  const { experiments } = props
  const paramKeys = []

  experiments.forEach((experiment) => {
    Object.keys(experiment.config).forEach((key) => {
      if (!paramKeys.includes(key)) {
        paramKeys.push(key)
      }
    })
  })

  // Sort parameters in alphabetical order
  paramKeys.sort()

  return (
    <div className='params-list'>
      <table className='parameter-table'>
        <tr className='table-header'>
          <th className='name'>NAME</th>
          {paramKeys.map((key) => (
            <th key={key}>{key.toUpperCase().replace(/_/gu, ' ')}</th>
          ))}
        </tr>
        {experiments.map((experiment) => (
          <tr key={experiment.id} className='table-body'>
            <th className='name'>{experiment.name}</th>
            {paramKeys.map((key) => {
              let value = experiment.config[key]
              if ((typeof value) === 'boolean') {
                value = value ? 'true' : 'false'
              } else if ((typeof value) === 'object') {
                if (value === null) {
                  value = 'none'
                } else if (Array.isArray(value)) {
                  if (value.length === 0) {
                    value = 'none'
                  } else {
                    value = value.join(', ')
                  }
                }
              }
              return (
                <td key={key}>{value}</td>
              )
            })}
          </tr>
        ))}
      </table>
    </div>
  )
}

const MetricsGraph = (props) => {
  const [activeGraphIndex, setActiveGraphIndex] = useState(0)
  const { metrics, labels, project } = props
  const graphOptions = []

  useEffect(() => {
    setActiveGraphIndex(0)
  }, [project])

  Object.keys(metrics).forEach((key) => {
    graphOptions.push({
      key: key,
      text: key.toUpperCase().replace(/_/gu, ' '),
      value: graphOptions.length
    })
  })

  const graphKey = graphOptions[activeGraphIndex].key

  return (
    <div className='graph'>
      <SelectForm
        value={activeGraphIndex}
        options={graphOptions}
        onChange={(value) => setActiveGraphIndex(value)}
      />
      <div className='graph-item'>
        <Line
          values={metrics[graphKey]}
          titles={labels[graphKey]}
          xLabel='epoch'
          yLabel='value'
        />
      </div>
    </div>
  )
}

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
