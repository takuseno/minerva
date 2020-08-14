import React from 'react'
import Modal from 'react-modal'
import { FormGroup, Button } from './forms.js'
import '../styles/dialog.scss'

const modalStyles = {
  content: {
    width: '500px',
    height: '170px',
    top: '32%',
    left: '30%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: '32px',
    'box-shadow': '10px 10px 20px 20px rgba(0, 0, 0, 0.1)'
  }
}

export function ConfirmationDialog (props) {
  return (
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
}
