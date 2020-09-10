import {
  Checkbox,
  FormRow,
  MultiSelectForm,
  SelectForm,
  TextFormUnderline
} from '../forms.js'
import {
  IMAGE_AUGMENTATION_OPTIONS,
  Q_FUNC_TYPE_OPTIONS,
  SCALER_OPTIONS,
  VECTOR_AUGMENTATION_OPTIONS
} from '../../constants'
import React from 'react'

export const ConfigForm = (props) => {
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
