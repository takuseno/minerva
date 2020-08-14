import React, { useState, useContext } from 'react'
import Modal from 'react-modal'
import { GlobalContext } from '../context'
import { Line } from 'rc-progress'
import {
  FormGroup,
  FormRow,
  Button,
  TextFormUnderline,
  SelectForm
} from './forms.js'
import '../styles/dialog.scss'

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

export function ProjectCreateDialog (props) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [projectName, setProjectName] = useState('')
  const [datasetId, setDatasetId] = useState(-1)
  const { createProject } = useContext(GlobalContext)

  const handleClose = () => {
    setUploadProgress(0)
    setProjectName('')
    setDatasetId(-1)
    props.onClose()
  }

  const handleSubmit = () => {
    // quick validation
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
      })
  }

  const datasetOptions = props.datasets.map((dataset) => {
    return { value: dataset.id, text: dataset.name }
  })

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
            onChange={(datasetId) => setDatasetId(datasetId)}
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
