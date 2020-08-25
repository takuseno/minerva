import '../styles/create-experiment-dialog.scss'
import '../styles/dialog.scss'
import {
  Button,
  Checkbox,
  FormGroup,
  FormRow,
  MultiSelectForm,
  SelectForm,
  TextFormUnderline
} from './forms.js'
import {
  CONTINUOUS_CONFIGS,
  DISCRETE_CONFIGS,
  IMAGE_AUGMENTATION_OPTIONS,
  Q_FUNC_TYPE_OPTIONS,
  SCALER_OPTIONS,
  VECTOR_AUGMENTATION_OPTIONS
} from '../constants'
import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../context'
import { Line } from 'rc-progress'
import Modal from 'react-modal'
import { Record } from 'immutable'

const modalStyles = {
  content: {
    width: '600px',
    height: '420px',
    top: '18%',
    left: '30%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: '32px',
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

const ConfigForm = (props) => {
  const { dataset } = props

  if (props.label === 'q_func_type') {
    const options = Object.entries(Q_FUNC_TYPE_OPTIONS)
      .map(([key, value]) => ({ text: value, value: key }))
    return (
      <SelectForm
        options={options}
        value={props.value}
        onChange={(newValue) => props.onChange(props.label, newValue)}
      />
    )
  } else if (props.label === 'scaler') {
    const options = Object.entries(SCALER_OPTIONS)
      .map(([key, value]) => ({ text: value, value: key }))
    return (
      <SelectForm
        options={options}
        value={props.value}
        onChange={(newValue) => {
          props.onChange(props.label, newValue === 'null' ? null : newValue)
        }}
      />
    )
  } else if (props.label === 'augmentation') {
    const augmentations = dataset.isImage ? IMAGE_AUGMENTATION_OPTIONS
      : VECTOR_AUGMENTATION_OPTIONS
    const options = Object.entries(augmentations)
      .map(([key, value]) => ({ text: value, value: key }))
    return (
      <FormRow>
        <MultiSelectForm
          options={options}
          onChange={(newValue) => props.onChange(props.label, newValue)}
          value={props.value}
        />
      </FormRow>
    )
  } else if (props.label === 'use_gpu') {
    const options = [{ text: 'CPU', value: null }]
    if (props.status.gpu !== undefined) {
      for (let i = 0; i < props.status.gpu.total; ++i) {
        options.push({ text: `GPU:${i}`, value: i })
      }
    }
    return (
      <SelectForm
        options={options}
        value={props.value}
        onChange={(newValue) => {
          const value = newValue === 'null' ? null : Number(newValue)
          props.onChange(props.label, value)
        }}
      />
    )
  } else if ((typeof props.value) === 'boolean') {
    return (
      <FormRow>
        <Checkbox
          text=''
          value={props.value}
          onChange={(check) => props.onChange(props.label, check)}
        />
      </FormRow>
    )
  }
  return (
    <TextFormUnderline
      value={props.value}
      onChange={(newValue) => props.onChange(props.label, Number(newValue))}
    />
  )
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
  const [basicConfig, setBasicConfig] = useState(Record({})())
  const [advancedConfig, setAdvancedConfig] = useState(Record({})())
  const [isShowingAdvancedConfig, setIsShowingAdvancedConfig] = useState(false)
  const {
    status,
    createExperiment,
    showErrorToast
  } = useContext(GlobalContext)

  const { dataset, project } = props
  const { algorithm } = project
  const configs = dataset.isDiscrete ? DISCRETE_CONFIGS : CONTINUOUS_CONFIGS

  useEffect(() => {
    setExperimentName(`${algorithm.toUpperCase()}_${getTimestamp()}`)

    // Default scaling option based on observation type
    const scaler = dataset.isImage ? 'pixel' : null
    setBasicConfig(Record(configs[algorithm].basic_config)({ scaler: scaler }))

    setAdvancedConfig(Record(configs[algorithm].advanced_config)())
  }, [props.isOpen])

  const handleClose = () => {
    setUploadProgress(0)
    setBasicConfig(Record({})())
    setAdvancedConfig(Record({})())
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
