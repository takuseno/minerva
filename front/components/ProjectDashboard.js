import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import { Progress } from 'react-sweet-progress'
import { List, Map } from 'immutable'
import { GlobalContext } from '../context'
import { Button, TextForm, SelectForm } from './forms'
import { Line } from './graphs'
import { ConfirmationDialog } from './ConfirmationDialog'
import { ExperimentCreateDialog } from './ExperimentCreateDialog'
import { DownloadPolicyDialog } from './DownloadPolicyDialog'
import { Q_FUNC_TYPE_OPTIONS, SCALER_OPTIONS } from '../constants'
import 'react-sweet-progress/lib/style.css'
import '../styles/project-dashboard.scss'

function ProjectHeader (props) {
  const dataset = props.dataset
  const project = props.project
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
  } else {
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
}

function ProjectDetail (props) {
  const project = props.project
  const dataset = props.dataset
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

function ExperimentDetail (props) {
  const { cancelExperiment, deleteExperiment } = useContext(GlobalContext)
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const experiment = props.experiment
  const isActive = experiment.isActive
  const totalEpoch = experiment.config.n_epochs
  const metrics = experiment.metrics
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
              symbol: Math.round(100.0 * progress).toString() + '%',
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

function ExperimentList (props) {
  return (
    <div className='experiment-list'>
      <ProjectDetail project={props.project} dataset={props.dataset} />
      {props.experiments.size === 0 &&
        <div className='empty'>
          <span>NO EXPERIMENTS</span>
        </div>}
      {props.experiments.size > 0 &&
        <ul className='experiments'>
          {props.experiments.map((experiment) => {
            return (
              <li key={experiment.id}>
                <ExperimentDetail experiment={experiment} />
              </li>
            )
          })}
        </ul>}
    </div>
  )
}

function ParamsList (props) {
  const experiments = props.experiments
  const paramKeys = []

  experiments.forEach((experiment) => {
    Object.keys(experiment.config).forEach((key) => {
      if (!paramKeys.includes(key)) {
        paramKeys.push(key)
      }
    })
  })

  // sort parameters in alphabetical order
  paramKeys.sort()

  return (
    <div className='params-list'>
      <table className='parameter-table'>
        <tr className='table-header'>
          <th className='name'>NAME</th>
          {paramKeys.map((key) => {
            return (
              <th key={key}>{key.toUpperCase().replace(/_/g, ' ')}</th>
            )
          })}
        </tr>
        {experiments.map((experiment) => {
          return (
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
          )
        })}
      </table>
    </div>
  )
}

function MetricsGraph (props) {
  const [activeGraphIndex, setActiveGraphIndex] = useState(0)
  const project = props.project
  const metrics = props.metrics
  const labels = props.labels
  const graphOptions = []

  useEffect(() => {
    setActiveGraphIndex(0)
  }, [project])

  Object.keys(metrics).forEach((key) => {
    graphOptions.push({
      key: key,
      text: key.toUpperCase().replace(/_/g, ' '),
      value: graphOptions.length
    })
  })

  const graphKey = graphOptions[activeGraphIndex].key

  return (
    <div className='graph'>
      <SelectForm
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

function ProjectMetrics (props) {
  const experiments = props.experiments
  const project = props.project

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

export function ProjectDashboard (props) {
  const { id } = useParams()
  const { fetchExperiments } = useContext(GlobalContext)
  const [time, setTime] = useState(Date.now())

  const projects = props.projects
  const datasets = props.datasets
  const experiments = props.experiments.get(Number(id)) ?? List([])
  const project = projects.find((p) => p.id === Number(id)) ?? Map({})
  const datasetId = project.datasetId
  const dataset = datasets.find((d) => d.id === Number(datasetId)) ?? Map({})

  // fetch experiments
  useEffect(() => {
    fetchExperiments(Number(id))
  }, [id])

  // fetch experiments periodically
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTime(Date.now())
      fetchExperiments(Number(id))
    }, 5000) // 5 seconds
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
