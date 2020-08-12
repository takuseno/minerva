import React, { useState, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { GlobalContext } from '../context'
import { Button, TextForm } from './forms'
import { ConfirmationDialog } from './ConfirmationDialog.js'
import '../styles/project-dashboard.scss'

function ProjectHeader (props) {
  const project = props.project
  const [isEditing, setIsEditing] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
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
        </div>
      </div>
    )
  }
}

export function ProjectDashboard (props) {
  const { id } = useParams()
  const projects = props.projects
  const project = projects.find((p) => p.id === Number(id))
  return (
    <div className='dashboard'>
      <ProjectHeader project={project} />
    </div>
  )
}
