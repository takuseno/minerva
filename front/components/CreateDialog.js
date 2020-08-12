import React, { useState, useContext } from 'react'
import Modal from 'react-modal'
import { GlobalContext } from '../context'
import { Line } from 'rc-progress'
import { FormGroup, FormRow, Button, FileInput, Checkbox } from './forms.js'
import '../styles/dialog.scss'

const modalStyles = {
  content: {
    width: '500px',
    height: '280px',
    top: '32%',
    left: '30%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: '32px'
  }
}

Modal.setAppElement('#root')

export function DatasetUploadDialog (props) {
  const [isUploading, setIsUploading] = useState(false)
  const [isImage, setIsImage] = useState(false)
  const [isDiscrete, setIsDiscrete] = useState(false)
  const [file, setFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { uploadDataset } = useContext(GlobalContext)

  const handleClose = () => {
    setIsImage(false)
    setIsDiscrete(false)
    setFile(null)
    setUploadProgress(0)
    props.onClose()
  }

  const handleSubmit = () => {
    setIsUploading(true)
    const progressCallback = (e) => {
      const progress = Math.round(e.loaded * 100 / e.total)
      setUploadProgress(progress)
    }
    uploadDataset(file, isImage, isDiscrete, progressCallback)
      .then((dataset) => {
        setIsUploading(false)
        handleClose()
      })
  }

  return (
    <Modal
      isOpen={props.isOpen}
      contentLabel='Upload dataset'
      style={modalStyles}
      onRequestClose={handleClose}
    >
      <div>
        <p className='dialog-title'>Upload dataset</p>
        <FormRow>
          <FileInput
            name='dataset'
            text='UPLOAD'
            onChange={(file) => setFile(file)}
          />
        </FormRow>
        <FormRow>
          <Checkbox
            name='is_image'
            text='image observation'
            onChange={(checked) => setIsImage(checked)}
          />
        </FormRow>
        <FormRow>
          <Checkbox
            name='is_discrete'
            text='discrete control'
            onChange={(checked) => setIsDiscrete(checked)}
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
