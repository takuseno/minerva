import React, { useState } from 'react'
import '../styles/forms.scss'

export function FormGroup ({ children }) {
  return (
    <div className='ganglion-form-group'>
      {children}
    </div>
  )
}

export function FormRow ({ children }) {
  return (
    <div className='ganglion-form-row'>
      {children}
    </div>
  )
}

export function Button (props) {
  return (
    <button
      className='ganglion-form-button'
      onClick={props.onClick}
    >
      <span>{props.text}</span>
    </button>
  )
}

Button.defaultProps = {
  onClick: () => {},
  text: 'BUTTON'
}

export function FileInput (props) {
  const [fileName, setFileName] = useState('')
  const handleChange = (e) => {
    props.onChange(e.target.files[0])
    setFileName(e.target.files[0].name)
  }
  return (
    <label className='ganglion-form-file'>
      <input type='file' name={props.name} onChange={handleChange} />
      <span className='ganglion-form-file-button'>{props.text}</span>
      <span className='ganglion-form-file-name'>{fileName}</span>
    </label>
  )
}

FileInput.defaultProps = {
  text: 'UPLOAD',
  onChange: () => {}
}

export function Checkbox (props) {
  return (
    <label className='ganglion-form-checkbox'>
      <input type='checkbox' name={props.name} onChange={props.onChange} />
      <span>{props.text}</span>
    </label>
  )
}

Checkbox.defaultProps = {
  text: 'CHECKBOX',
  onChange: () => {}
}
