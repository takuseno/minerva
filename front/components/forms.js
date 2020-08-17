import React, { useState, useEffect, useRef } from 'react'
import '../styles/forms.scss'

export function FormGroup ({ children }) {
  return (
    <div className='minerva-form-group'>
      {children}
    </div>
  )
}

export function FormRow ({ children }) {
  return (
    <div className='minerva-form-row'>
      {children}
    </div>
  )
}

export function TextForm (props) {
  const inputEl = useRef(null)
  useEffect(() => {
    if (props.focus) {
      inputEl.current.focus()
    }
  }, [])
  return (
    <input
      className='minerva-form-text'
      type='text'
      value={props.value}
      placeholder={props.placeholder}
      onChange={(e) => props.onChange(e.target.value)}
      ref={inputEl}
    />
  )
}

export function TextFormUnderline (props) {
  return (
    <div className='minerva-form-text-underline'>
      <TextForm
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
        focus={props.focus}
      />
      <div className='minerva-form-underline' />
    </div>
  )
}

export function SelectForm (props) {
  return (
    <select
      className='minerva-form-select'
      onChange={(e) => props.onChange(e.target.value)}
    >
      {props.placeholder &&
        <option value={-1} hidden>{props.placeholder}</option>}
      {props.options.map((option) => {
        return (
          <option
            key={option.value}
            value={option.value}
            selected={option.value === props.value}
          >
            {option.text}
          </option>
        )
      })}
    </select>
  )
}

export function MultiSelectForm (props) {
  const handleChange = (check, value) => {
    if (check) {
      props.onChange(props.value.concat([value]))
    } else {
      props.onChange(props.value.filter((v) => v !== value))
    }
  }
  return (
    <div className='minerva-form-multi-select'>
      {props.options.map((option) => {
        const value = props.value.indexOf(option.value) !== -1
        return (
          <div key={option.value} className='option'>
            <Checkbox
              text={option.text}
              value={value}
              onChange={(check) => handleChange(check, option.value)}
            />
          </div>
        )
      })}
    </div>
  )
}

export function Button (props) {
  return (
    <button
      className='minerva-form-button'
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

function wrapText (text, limit) {
  if (text.length > limit) {
    return (text.substr(0, limit) + '...')
  } else {
    return text
  }
}

export function FileInput (props) {
  const [fileName, setFileName] = useState('')
  const handleChange = (e) => {
    props.onChange(e.target.files[0])
    setFileName(e.target.files[0].name)
  }
  const wrappedName = wrapText(fileName, 20)
  return (
    <label className='minerva-form-file'>
      <input type='file' name={props.name} onChange={handleChange} />
      <span className='minerva-form-file-button'>{props.text}</span>
      <span className='minerva-form-file-name'>{wrappedName}</span>
    </label>
  )
}

FileInput.defaultProps = {
  text: 'UPLOAD',
  onChange: () => {}
}

export function Checkbox (props) {
  const handleChange = (e) => { props.onChange(e.target.checked) }
  return (
    <label className='minerva-form-checkbox'>
      <input type='checkbox' name={props.name} onChange={handleChange} />
      <span>{props.text}</span>
    </label>
  )
}

Checkbox.defaultProps = {
  text: 'CHECKBOX',
  onChange: () => {}
}
