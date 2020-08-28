import '../styles/dialog.scss'
import '../styles/download-policy-dialog.scss'
import {
  Button,
  FormGroup,
  SelectForm
} from './forms.js'
import React, { useState } from 'react'
import Modal from 'react-modal'
import { Range } from 'immutable'

const modalStyles = {
  content: {
    width: '500px',
    height: '260px',
    top: '30%',
    left: '30%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: '32px',
    'box-shadow': '10px 10px 20px 20px rgba(0, 0, 0, 0.1)'
  }
}

Modal.setAppElement('#root')

export const DownloadPolicyDialog = (props) => {
  const [epoch, setEpoch] = useState(-1)
  const [format, setFormat] = useState('torchscript')

  const { experiment } = props

  const handleClose = () => {
    setEpoch(-1)
    props.onClose()
  }

  const handleSubmit = () => {
    // Quick validation
    if (epoch === -1) {
      return
    }
    experiment.downloadPolicy(epoch, format)
    props.onClose()
  }

  const epochOptions = Range(0, props.totalEpoch).map((i) => (
    { value: i, text: i }
  ))

  const formatOptions = [
    { value: 'torchscript', text: 'TorchScript' },
    { value: 'onnx', text: 'ONNX' }
  ]

  return (
    <Modal
      isOpen={props.isOpen}
      contentLabel='Download policy'
      style={modalStyles}
      onRequestClose={handleClose}
    >
      <div>
        <p className='dialog-title'>Download policy function</p>
        <p className='experiment-title'>{experiment.name}</p>
        <div className='select-wrapper'>
          <span className='label'>EPOCH</span>
          <SelectForm
            placeholder='CHOOSE EPOCH TO DOWNLOAD'
            options={epochOptions}
            value={epoch}
            onChange={(v) => setEpoch(v)}
          />
        </div>
        <div className='select-wrapper'>
          <span className='label'>FORMAT</span>
          <SelectForm
            options={formatOptions}
            value={format}
            onChange={(v) => setFormat(v)}
          />
        </div>
        <FormGroup>
          <Button text='DOWNLOAD' onClick={handleSubmit} />
          <Button text='CANCEL' onClick={handleClose} />
        </FormGroup>
      </div>
    </Modal>
  )
}
