import '../styles/dialog.scss'
import { Button, Checkbox, FileInput, FormGroup, FormRow } from './forms.js'
import React, { useContext, useState } from 'react'
import { GlobalContext } from '../context'
import { Line } from 'rc-progress'
import Modal from 'react-modal'

const modalStyles = {
  content: {
    width: '500px',
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    padding: '32px',
    'box-shadow': '10px 10px 20px 20px rgba(0, 0, 0, 0.1)'
  }
}

Modal.setAppElement('#root')

export const DatasetUploadDialog = (props) => {
  const [isUploading, setIsUploading] = useState(false)
  const [isImage, setIsImage] = useState(false)
  const [isDiscrete, setIsDiscrete] = useState(false)
  const [file, setFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { uploadDataset, showErrorToast } = useContext(GlobalContext)

  const handleClose = () => {
    setIsImage(false)
    setIsDiscrete(false)
    setFile(null)
    setUploadProgress(0)
    props.onClose()
  }

  const handleSubmit = () => {
    // Quick validation
    if (file === null) {
      return
    }

    setIsUploading(true)
    const progressCallback = (e) => {
      const progress = Math.round(e.loaded * 100 / e.total)
      setUploadProgress(progress)
    }
    uploadDataset(file, isImage, isDiscrete, progressCallback)
      .then((dataset) => {
        setIsUploading(false)
        handleClose()
        return dataset
      })
      .catch(() => showErrorToast('Failed to upload dataset'))
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
            onChange={(newFile) => setFile(newFile)}
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
