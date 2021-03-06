import {
  Checkbox,
  FormRow,
  SelectForm,
  TextFormUnderline
} from '../forms.js'
import { Q_FUNC_TYPE_OPTIONS, SCALER_OPTIONS } from '../../constants'
import React from 'react'

export const ConfigForm = (props) => {
  let form = null
  switch (props.label) {
    case 'q_func_factory': {
      const options = Object.entries(Q_FUNC_TYPE_OPTIONS)
        .map(([key, value]) => ({ text: value, value: key }))
      form = (
        <SelectForm
          options={options}
          value={props.value}
          onChange={(newValue) => props.onChange(props.label, newValue)}
        />
      )
      break
    }
    case 'scaler': {
      const options = Object.entries(SCALER_OPTIONS)
        .map(([key, value]) => ({ text: value, value: key }))
      form = (
        <SelectForm
          options={options}
          value={props.value}
          onChange={(newValue) => {
            props.onChange(props.label, newValue === 'null' ? null : newValue)
          }}
        />
      )
      break
    }
    case 'use_gpu': {
      const options = [{ text: 'CPU', value: null }]
      if (props.status.gpu !== undefined) {
        for (let i = 0; i < props.status.gpu.total; ++i) {
          options.push({ text: `GPU:${i}`, value: i })
        }
      }
      form = (
        <SelectForm
          options={options}
          value={props.value}
          onChange={(newValue) => {
            const value = newValue === 'null' ? null : Number(newValue)
            props.onChange(props.label, value)
          }}
        />
      )
      break
    }
    default:
      form = (
        <TextFormUnderline
          value={props.value}
          onChange={(newValue) => props.onChange(props.label, Number(newValue))}
        />
      )
  }

  if ((typeof props.value) === 'boolean') {
    form = (
      <FormRow>
        <Checkbox
          text=''
          value={props.value}
          onChange={(check) => props.onChange(props.label, check)}
        />
      </FormRow>
    )
  }

  return form
}
