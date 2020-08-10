import React from 'react'
import Modal from 'react-modal'
import { FormGroup, FormRow, Button, FileInput, Checkbox } from './forms.js'
import '../styles/dialog.scss'

const modalStyles = {
  content: {
    top: '33%',
    left: '35%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: '32px'
  }
}

Modal.setAppElement('#root')

export function DatasetUploadDialog (props) {
  return (
    <Modal
      isOpen={props.isOpen}
      contentLabel='Upload dataset'
      style={modalStyles}
      onRequestClose={props.onClose}
    >
      <div>
        <p className='dialog-title'>Upload dataset</p>
        <FormRow>
          <FileInput name='dataset' text='UPLOAD' />
        </FormRow>
        <FormRow>
          <Checkbox name='is_image' text='image observation' />
        </FormRow>
        <FormRow>
          <Checkbox name='is_discrete' text='discrete control' />
        </FormRow>
        <FormGroup>
          <Button text='SUBMIT' />
          <Button text='CANCEL' onClick={props.onClose} />
        </FormGroup>
      </div>
    </Modal>
  )
}
