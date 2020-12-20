import '../../styles/dialog.scss'
import '../../styles/project/create-experiment-dialog.scss'
import { Button, FormRow, TextFormUnderline } from '../forms.js'
import {
  COMMON_CONFIGS,
  CONTINUOUS_CONFIGS,
  DISCRETE_CONFIGS
} from '../../constants'
import React, { useContext, useEffect, useState } from 'react'
import { ConfigForm } from './ConfigForm'
import { Dialog } from '../dialog'
import { GlobalContext } from '../../context'
import { OrderedMap } from 'immutable'

const convertSnakeToUpper = (text) => text.toUpperCase().replace(/_/gu, ' ')

const getTimestamp = () => {
  const date = new Date()
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  ].join('')
}

const ConfigForms = (props) => {
  const { dataset } = props
  return (
    <table className='form-table'>
      {Object.entries(props.config).map(([key, value]) => {
        // Handle special labels
        let label = convertSnakeToUpper(key)
        if (key === 'use_gpu') {
          label = 'DEVICE'
        }
        return (
          <tr key={key}>
            <th>{label}</th>
            <td>
              <ConfigForm
                label={key}
                value={value}
                onChange={props.onChange}
                status={props.status}
                dataset={dataset}
              />
            </td>
          </tr>
        )
      })}
    </table>
  )
}

export const ExperimentCreateDialog = (props) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [experimentName, setExperimentName] = useState('')
  const [basicConfig, setBasicConfig] = useState(OrderedMap({}))
  const [advancedConfig, setAdvancedConfig] = useState(OrderedMap({}))
  const [isShowingAdvancedConfig, setIsShowingAdvancedConfig] = useState(false)
  const { status, createExperiment, showErrorToast } = useContext(GlobalContext)

  const { dataset, project } = props
  const { algorithm } = project

  useEffect(() => {
    setExperimentName(`${algorithm.toUpperCase()}_${getTimestamp()}`)

    // Algorithm-specific configurations
    const { isDiscrete } = dataset
    const algoConfigs = isDiscrete ? DISCRETE_CONFIGS : CONTINUOUS_CONFIGS
    let algoConfig = OrderedMap(algoConfigs[algorithm])

    // Default option based on observation type
    const scaler = dataset.isImage ? 'pixel' : null
    let config = OrderedMap(COMMON_CONFIGS.basic_config).set('scaler', scaler)
    if (!dataset.isImage) {
      // Remove frame stacking option
      config = config.delete('n_frames')
    }

    // Apply algorithm-specific default parameters
    for (const key of algoConfig.keys()) {
      if (config.has(key)) {
        config = config.set(key, algoConfig.get(key))
        algoConfig = algoConfig.delete(key)
      }
    }

    setBasicConfig(config)

    const commonAdvancedConfig = COMMON_CONFIGS.advanced_config
    setAdvancedConfig(OrderedMap(commonAdvancedConfig).merge(algoConfig))
  }, [props.isOpen])

  const handleClose = () => {
    setUploadProgress(0)
    setBasicConfig(OrderedMap({}))
    setAdvancedConfig(OrderedMap({}))
    setExperimentName('')
    setIsShowingAdvancedConfig(false)
    props.onClose()
  }

  const handleSubmit = () => {
    // Quick validation
    if (experimentName === '') {
      return
    }

    setIsUploading(true)
    const progressCallback = (e) => {
      const progress = Math.round(e.loaded * 100 / e.total)
      setUploadProgress(progress)
    }

    // Concat basic configs and advanced configs
    const config = Object.assign(basicConfig.toJS(), advancedConfig.toJS())

    createExperiment(project.id, experimentName, config, progressCallback)
      .then((experiment) => {
        setIsUploading(false)
        handleClose()
        return experiment
      })
      .catch(() => showErrorToast('Failed to create experiment.'))
  }

  const handleBasicConfigChange = (key, value) => {
    setBasicConfig(basicConfig.set(key, value))
  }
  const handleAdvancedConfigChange = (key, value) => {
    setAdvancedConfig(advancedConfig.set(key, value))
  }

  return (
    <Dialog
      isOpen={props.isOpen}
      title='Run experiment'
      onConfirm={handleSubmit}
      onClose={handleClose}
      isUploading={isUploading}
      uploadProgress={uploadProgress}
    >
      <div>
        <FormRow>
          <TextFormUnderline
            value={experimentName}
            placeholder='EXPERIMENT NAME'
            onChange={(name) => setExperimentName(name)}
          />
        </FormRow>
        <ConfigForms
          config={basicConfig.toJS()}
          status={status}
          onChange={handleBasicConfigChange}
          dataset={dataset}
        />
        {!isShowingAdvancedConfig &&
          <div className='advanced-config-button'>
            <Button
              text='SHOW ADVANCED CONFIGURATIONS'
              onClick={() => setIsShowingAdvancedConfig(true)}
            />
          </div>}
        {isShowingAdvancedConfig &&
          <div className='advanced-config-button'>
            <Button
              text='HIDE ADVANCED CONFIGURATIONS'
              onClick={() => setIsShowingAdvancedConfig(false)}
            />
          </div>}
        {isShowingAdvancedConfig &&
          <ConfigForms
            config={advancedConfig.toJS()}
            status={status}
            onChange={handleAdvancedConfigChange}
            dataset={props.dataset}
          />}
      </div>
    </Dialog>
  )
}
