import { Dialog } from './dialog'
import React from 'react'

export const ConfirmationDialog = (props) => (
  <Dialog
    isOpen={props.isOpen}
    title={props.title}
    message={props.message}
    confirmText={props.confirmText}
    cancelText={props.cancelText}
    onConfirm={props.onConfirm}
    onClose={props.onClose}
  />
)
