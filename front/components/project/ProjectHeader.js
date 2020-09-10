import '../../styles/project/project-header.scss'
import { Button, TextForm } from '../forms'
import React, { useContext, useState } from 'react'
import { ConfirmationDialog } from '../ConfirmationDialog'
import { ExperimentCreateDialog } from './ExperimentCreateDialog'
import { GlobalContext } from '../../context'
import { useHistory } from 'react-router-dom'

const EditingProjectHeader = (props) => {
  const { projectName, onChange, onSubmit, onCancel } = props
  return (
    <div className='project-header'>
      <TextForm value={projectName} onChange={onChange} focus />
      <div className='edit-buttons'>
        <Button text='UPDATE' onClick={onSubmit} />
        <Button text='CANCEL' onClick={onCancel} />
      </div>
    </div>
  )
}

const NormalProjectHeader = (props) => {
  const {
    project,
    dataset,
    onCreate,
    onDelete,
    onEdit,
    onSubmitDelete,
    onCancelDelete,
    onCancelCreate,
    isCreating,
    isDeleting
  } = props
  return (
    <div className='project-header'>
      <span className='project-name'>{project.name}</span>
      <div className='edit-buttons'>
        <Button text='RUN' onClick={onCreate} />
        <Button text='EDIT' onClick={onEdit} />
        <Button text='DELETE' onClick={onDelete} />
        <ConfirmationDialog
          title={`Deleting ${project.name}.`}
          message='Are you sure to delete this project?'
          isOpen={isDeleting}
          onClose={onCancelDelete}
          onConfirm={onSubmitDelete}
          confirmText='DELETE'
          cancelText='CANCEL'
        />
        {project &&
          <ExperimentCreateDialog
            isOpen={isCreating}
            onClose={onCancelCreate}
            project={project}
            dataset={dataset}
          />}
      </div>
    </div>
  )
}

export const ProjectHeader = (props) => {
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
      <EditingProjectHeader
        projectName={projectName}
        onChange={setProjectName}
        onSubmit={handleUpdate}
        onCancel={() => setIsEditing(false)}
      />
    )
  }
  return (
    <NormalProjectHeader
      project={project}
      dataset={dataset}
      onCreate={() => setIsCreating(true)}
      onEdit={handleEdit}
      onDelete={() => setIsDeleting(true)}
      onSubmit={handleDelete}
      onCancelDelete={() => setIsDeleting(false)}
      onCancelCreate={() => setIsCreating(false)}
      isCreating={isCreating}
      isDeleting={isDeleting}
    />
  )
}
