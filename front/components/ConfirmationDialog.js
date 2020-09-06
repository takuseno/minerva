import '../styles/dialog.scss'
import { Button, FormGroup } from './forms.js'
import Modal from 'react-modal'
import React from 'react'

const modalStyles = {
  content: {
    width: '500px',
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    padding: '32px',
    'box-shadow': '10px 10px 20px 20px rgba(0, 0, 0, 0.1)'
  }
}

export const ConfirmationDialog = (props) => (
  <Modal
    isOpen={props.isOpen}
    contentLabel={props.title}
    style={modalStyles}
    onRequestClose={props.onClose}
  >
    <div>
      <p className='dialog-title'>{props.title}</p>
      <p className='dialog-message'>{props.message}</p>
      <FormGroup>
        <Button text={props.confirmText} onClick={props.onConfirm} />
        <Button text={props.cancelText} onClick={props.onClose} />
      </FormGroup>
    </div>
  </Modal>
)
