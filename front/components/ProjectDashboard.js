import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import { GlobalContext } from '../context'
import { Button, TextForm } from './forms'
import { ConfirmationDialog } from './ConfirmationDialog'
import { ExperimentCreateDialog } from './ExperimentCreateDialog'
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
  const experiment = props.experiment
  return (
    <div className='experiment-detail'>
      {experiment.name}
    </div>
  )
}

function ExperimentList (props) {
  return (
    <div className='experiment-list'>
      <ProjectDetail project={props.project} dataset={props.dataset} />
      {props.experiments.map((experiment) => {
        return (
          <ExperimentDetail key={experiment.id} experiment={experiment} />
        )
      })}
    </div>
  )
}

function ProjectMetrics (props) {
  return (
    <div className='project-metrics' />
  )
}

export function ProjectDashboard (props) {
  const { id } = useParams()
  const { fetchExperiments } = useContext(GlobalContext)

  const projects = props.projects
  const datasets = props.datasets
  const experiments = props.experiments
  const project = projects.find((p) => p.id === Number(id)) ?? {}
  const datasetId = project.datasetId
  const dataset = datasets.find((d) => d.id === Number(datasetId)) ?? {}

  // fetch experiments
  useEffect(() => {
    fetchExperiments(id)
  }, [id])

  return (
    <div className='dashboard'>
      <ProjectHeader project={project} dataset={dataset} />
      <div className='dashboard-body'>
        <ExperimentList
          project={project}
          dataset={dataset}
          experiments={experiments}
        />
        <ProjectMetrics />
      </div>
    </div>
  )
}
