import '../../styles/dialog.scss'
import '../../styles/project/download-policy-dialog.scss'
import React, { useState } from 'react'
import { Dialog } from '../dialog'
import { Range } from 'immutable'
import { SelectForm } from '../forms.js'

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
    <Dialog
      isOpen={props.isOpen}
      title='Download policy'
      message={experiment.name}
      confirmText='SUBMIT'
      cancelText='CANCEL'
      onConfirm={handleSubmit}
      onClose={handleClose}
    >
      <div>
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
      </div>
    </Dialog>
  )
}
