import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import { Progress } from 'react-sweet-progress'
import { GlobalContext } from '../context'
import { Button, TextForm } from './forms'
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
  const { cancelExperiment } = useContext(GlobalContext)
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false)

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
      </div>
      <DownloadPolicyDialog
        isOpen={isDownloadDialogOpen}
        totalEpoch={currentEpoch}
        experiment={experiment}
        onClose={() => setIsDownloadDialogOpen(false)}
      />
    </div>
  )
}

function ExperimentList (props) {
  return (
    <div className='experiment-list'>
      <ProjectDetail project={props.project} dataset={props.dataset} />
      <ul className='experiments'>
        {props.experiments.map((experiment) => {
          return (
            <li key={experiment.id}>
              <ExperimentDetail experiment={experiment} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function ProjectMetrics (props) {
  const experiments = props.experiments
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
      <ul className='metrics-list'>
        {Object.entries(metrics).map(([title, values]) => {
          const graphTitle = title.toUpperCase().replace(/_/g, ' ')
          return (
            <li key={title}>
              <div className='graph-item'>
                <p className='graph-title'>{graphTitle}</p>
                <Line
                  values={values}
                  titles={labels[title]}
                  xLabel='epoch'
                  yLabel='value'
                  refresh={props.isLoadingNewData}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function ProjectDashboard (props) {
  const { id } = useParams()
  const { fetchExperiments } = useContext(GlobalContext)
  const [time, setTime] = useState(Date.now())
  const [isLoadingNewData, setIsLoadingNewData] = useState(false)

  const projects = props.projects
  const datasets = props.datasets
  const experiments = props.experiments.get(Number(id)) ?? []
  const project = projects.find((p) => p.id === Number(id)) ?? {}
  const datasetId = project.datasetId
  const dataset = datasets.find((d) => d.id === Number(datasetId)) ?? {}

  // fetch experiments
  useEffect(() => {
    fetchExperiments(Number(id))
    setIsLoadingNewData(true)
  }, [id])

  // fetch experiments periodically
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTime(Date.now())
      fetchExperiments(Number(id))
      setIsLoadingNewData(false)
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
          <ProjectMetrics
            experiments={experiments}
            isLoadingNewData={isLoadingNewData}
          />
        </div>
      </div>
    </div>
  )
}
