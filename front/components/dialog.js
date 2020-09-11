import '../styles/dialog.scss'
import { Button, FormGroup } from './forms.js'
import { Line } from 'rc-progress'
import Modal from 'react-modal'
import React from 'react'

export const modalStyles = {
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

Modal.setAppElement('#root')

export const Dialog = ({ children, ...props }) => (
  <Modal
    isOpen={props.isOpen}
    contentLabel={props.title}
    style={modalStyles}
    onRequestClose={props.onClose}
  >
    <div>
      <p className='dialog-title'>{props.title}</p>
      <p className='dialog-message'>{props.message}</p>
      <div className='dialog-content'>
        {children}
      </div>
      <FormGroup>
        <Button text={props.confirmText} onClick={props.onConfirm} />
        <Button text={props.cancelText} onClick={props.onClose} />
      </FormGroup>
      {props.isUploading &&
        <Line
          percent={props.uploadProgress}
          strokeWidth='1'
          strokeColor='#2980b9'
        />}
    </div>
  </Modal>
)
