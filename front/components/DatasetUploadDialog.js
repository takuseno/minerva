import '../styles/dataset-upload-dialog.scss'
import '../styles/dialog.scss'
import { Checkbox, FileInput, FormRow } from './forms.js'
import React, { useContext, useState } from 'react'
import { Dialog } from './dialog'
import { GlobalContext } from '../context'

export const DatasetUploadDialog = (props) => {
  const [isUploading, setIsUploading] = useState(false)
  const [isImage, setIsImage] = useState(false)
  const [file, setFile] = useState(null)
  const [zipFile, setZipFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { uploadDataset, showErrorToast } = useContext(GlobalContext)

  const handleClose = () => {
    setIsImage(false)
    setFile(null)
    setZipFile(null)
    setUploadProgress(0)
    props.onClose()
  }

  const handleSubmit = () => {
    // Quick validation
    if (file === null || (isImage && zipFile === null)) {
      return
    }

    setIsUploading(true)
    const progressCallback = (e) => {
      const progress = Math.round(e.loaded * 100 / e.total)
      setUploadProgress(progress)
    }
    uploadDataset(file, isImage, zipFile, progressCallback)
      .then((dataset) => {
        setIsUploading(false)
        handleClose()
        return dataset
      })
      .catch(() => showErrorToast('Failed to upload dataset'))
  }

  return (
    <Dialog
      isOpen={props.isOpen}
      title='Upload dataset'
      onConfirm={handleSubmit}
      onClose={handleClose}
      isUploading={isUploading}
      uploadProgress={uploadProgress}
    >
      <div>
        <FormRow>
          <FileInput
            name='dataset'
            text='UPLOAD'
            onChange={(newFile) => setFile(newFile)}
            accept='.csv'
          />
        </FormRow>
        <FormRow>
          <Checkbox
            name='is_image'
            text='image observation'
            onChange={(checked) => setIsImage(checked)}
          />
        </FormRow>
        {isImage &&
          <FormRow>
            <FileInput
              name='image_zip'
              text='UPLOAD ZIPPED IMAGE FILES'
              onChange={(newFile) => setZipFile(newFile)}
              accept='.zip'
            />
          </FormRow>}
      </div>
    </Dialog>
  )
}
