import '../styles/dialog.scss'
import {
  FormRow,
  SelectForm,
  TextFormUnderline
} from './forms.js'
import React, { useContext, useState } from 'react'
import { Dialog } from './dialog'
import { GlobalContext } from '../context'

export const ProjectCreateDialog = (props) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [projectName, setProjectName] = useState('')
  const [datasetId, setDatasetId] = useState(-1)
  const { createProject, showErrorToast } = useContext(GlobalContext)

  const handleClose = () => {
    setUploadProgress(0)
    setProjectName('')
    setDatasetId(-1)
    props.onClose()
  }

  const handleSubmit = () => {
    // Quick validation
    if (projectName === '' || datasetId === -1) {
      return
    }

    setIsUploading(true)
    const progressCallback = (e) => {
      const progress = Math.round(e.loaded * 100 / e.total)
      setUploadProgress(progress)
    }

    createProject(datasetId, projectName, progressCallback)
      .then((project) => {
        setIsUploading(false)
        handleClose()
        return project
      })
      .catch(() => showErrorToast('Failed to create project.'))
  }

  const datasetOptions = props.datasets.map((dataset) => (
    { value: dataset.id, text: dataset.name }
  ))

  return (
    <Dialog
      isOpen={props.isOpen}
      title='Create project'
      onConfirm={handleSubmit}
      onClose={handleClose}
      isUploading={isUploading}
      uploadProgress={uploadProgress}
    >
      <div>
        <FormRow>
          <SelectForm
            placeholder='CHOOSE DATASET'
            options={datasetOptions}
            onChange={(value) => setDatasetId(value)}
          />
        </FormRow>
        <FormRow>
          <TextFormUnderline
            name='projectName'
            value={projectName}
            placeholder='PROJECT NAME'
            onChange={(name) => setProjectName(name)}
          />
        </FormRow>
      </div>
    </Dialog>
  )
}
