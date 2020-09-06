import '../styles/forms.scss'
import React, { useEffect, useRef, useState } from 'react'

export const FormGroup = ({ children }) => (
  <div className='minerva-form-group'>
    {children}
  </div>
)

export const FormRow = ({ children }) => (
  <div className='minerva-form-row'>
    {children}
  </div>
)

export const TextForm = (props) => {
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

export const TextFormUnderline = (props) => (
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

export const SelectForm = (props) => (
  <select
    className='minerva-form-select'
    onChange={(e) => props.onChange(e.target.value)}
  >
    {props.placeholder &&
      <option value={-1} hidden>{props.placeholder}</option>}
    {props.options.map((option) => (
      <option
        key={option.value}
        value={option.value}
        selected={option.value === props.value}
      >
        {option.text}
      </option>
    ))}
  </select>
)

export const MultiSelectForm = (props) => {
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
        const checked = props.value.includes(option.value)
        return (
          <div key={option.value} className='option'>
            <Checkbox
              text={option.text}
              value={checked}
              onChange={(check) => handleChange(check, option.value)}
            />
          </div>
        )
      })}
    </div>
  )
}

export const Button = (props) => (
  <button className='minerva-form-button' onClick={props.onClick}>
    <span>{props.text}</span>
  </button>
)

Button.defaultProps = {
  onClick: () => {},
  text: 'BUTTON'
}

const wrapText = (text, limit) => {
  if (text.length > limit) {
    return `${text.substr(0, limit)}...`
  }
  return text
}

export const FileInput = (props) => {
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

export const DirectoryInput = (props) => {
  const [directoryName, setDirectoryName] = useState('')
  const handleChange = (e) => {
    if (e.target.files.length > 0) {
      // Convert FileList to Array
      const fileList = []
      for (let i = 0; i < e.target.files.length; ++i) {
        fileList.push(e.target.files[i])
      }
      props.onChange(fileList)

      // Update directory name
      const samplePath = e.target.files[0].webkitRelativePath
      const [name] = samplePath.split('/')
      const fileCount = e.target.files.length
      setDirectoryName(`${wrapText(name, 15)} (${fileCount} files)`)
    }
  }
  return (
    <label className='minerva-form-file minerva-form-directory'>
      <input
        type='file'
        name={props.name}
        onChange={handleChange}
        webkitdirectory=''
        mozdirectory=''
        msdirectory=''
        odirectory=''
        directory=''
      />
      <span className='minerva-form-file-button'>{props.text}</span>
      <span className='minerva-form-file-name'>{directoryName}</span>
    </label>
  )
}

DirectoryInput.defaultProps = {
  text: 'UPLOAD',
  onChange: () => {}
}

export const Checkbox = (props) => {
  const handleChange = (e) => {
    props.onChange(e.target.checked)
  }
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
