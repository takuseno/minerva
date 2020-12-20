import '../styles/dialog.scss'
import { CONTINUOUS_CONFIGS, DISCRETE_CONFIGS } from '../constants'
import {
  FormRow,
  SelectForm,
  TextFormUnderline
} from './forms.js'
import React, { useContext, useEffect, useState } from 'react'
import { Dialog } from './dialog'
import { GlobalContext } from '../context'

export const ProjectCreateDialog = (props) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [projectName, setProjectName] = useState('')
  const [datasetId, setDatasetId] = useState(-1)
  const [algorithm, setAlgorithm] = useState('cql')
  const { createProject, showErrorToast } = useContext(GlobalContext)

  const handleClose = () => {
    setUploadProgress(0)
    setProjectName('')
    setDatasetId(-1)
    setAlgorithm('cql')
    props.onClose()
  }

  // Reset algorithm option when changing dataset
  useEffect(() => {
    setAlgorithm('cql')
  }, [datasetId])

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

    createProject(datasetId, projectName, algorithm, progressCallback)
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

  let isDiscrete = false
  const dataset = props.datasets.find((d) => d.id === Number(datasetId))
  if (dataset !== undefined) {
    ({ isDiscrete } = dataset)
  }

  const continuousAlgos = Object.keys(CONTINUOUS_CONFIGS)
  const discreteAlgos = Object.keys(DISCRETE_CONFIGS)
  const algos = isDiscrete ? discreteAlgos : continuousAlgos
  const algorithmOptions = algos.map((algo) => (
    { value: algo, text: algo.toUpperCase().replace(/_/gu, ' ') }
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
          <SelectForm
            placeholder='CHOOSE ALGORITHM'
            options={algorithmOptions}
            onChange={(value) => setAlgorithm(value)}
            value={algorithm}
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
