import '../../styles/dialog.scss'
import '../../styles/project/create-experiment-dialog.scss'
import {
  Button,
  FormGroup,
  FormRow,
  TextFormUnderline
} from '../forms.js'
import { CONTINUOUS_CONFIGS, DISCRETE_CONFIGS } from '../../constants'
import React, { useContext, useEffect, useState } from 'react'
import { ConfigForm } from './ConfigForm'
import { GlobalContext } from '../../context'
import { Line } from 'rc-progress'
import { Map } from 'immutable'
import Modal from 'react-modal'

const modalStyles = {
  content: {
    width: '600px',
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    padding: '32px',
    'max-height': '80%',
    'box-shadow': '10px 10px 20px 20px rgba(0, 0, 0, 0.1)'
  }
}

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

Modal.setAppElement('#root')

export const ExperimentCreateDialog = (props) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [experimentName, setExperimentName] = useState('')
  const [basicConfig, setBasicConfig] = useState(Map({}))
  const [advancedConfig, setAdvancedConfig] = useState(Map({}))
  const [isShowingAdvancedConfig, setIsShowingAdvancedConfig] = useState(false)
  const { status, createExperiment, showErrorToast } = useContext(GlobalContext)

  const { dataset, project } = props
  const { algorithm } = project
  const configs = dataset.isDiscrete ? DISCRETE_CONFIGS : CONTINUOUS_CONFIGS

  useEffect(() => {
    setExperimentName(`${algorithm.toUpperCase()}_${getTimestamp()}`)

    // Default option based on observation type
    const scaler = dataset.isImage ? 'pixel' : null
    let config = Map(configs[algorithm].basic_config).set('scaler', scaler)
    if (!dataset.isImage) {
      // Remove frame stacking option
      config = config.delete('n_frames')
    }
    setBasicConfig(config)

    setAdvancedConfig(Map(configs[algorithm].advanced_config))
  }, [props.isOpen])

  const handleClose = () => {
    setUploadProgress(0)
    setBasicConfig(Map({}))
    setAdvancedConfig(Map({}))
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
    <Modal
      isOpen={props.isOpen}
      contentLabel='Run experiment'
      style={modalStyles}
      onRequestClose={handleClose}
    >
      <div>
        <p className='dialog-title'>Run experiment</p>
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