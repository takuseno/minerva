import '../styles/dialog.scss'
import {
  Button,
  FormGroup,
  FormRow,
  SelectForm,
  TextFormUnderline
} from './forms.js'
import React, { useContext, useState } from 'react'
import { GlobalContext } from '../context'
import { Line } from 'rc-progress'
import Modal from 'react-modal'

const modalStyles = {
  content: {
    width: '500px',
    height: '240px',
    top: '32%',
    left: '30%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: '32px',
    'box-shadow': '10px 10px 20px 20px rgba(0, 0, 0, 0.1)'
  }
}

Modal.setAppElement('#root')

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
    <Modal
      isOpen={props.isOpen}
      contentLabel='Create project'
      style={modalStyles}
      onRequestClose={handleClose}
    >
      <div>
        <p className='dialog-title'>Create project</p>
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
        <FormGroup>
          <Button text='SUBMIT' onClick={handleSubmit} />
          <Button text='CANCEL' onClick={handleClose} />
        </FormGroup>
        {isUploading &&
          <Line
            percent={uploadProgress}
            strokeWidth='1'
            strokeColor='#2980b9'
          />}
      </div>
    </Modal>
  )
}
