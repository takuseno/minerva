import '../../styles/dataset/dataset-header.scss'
import { Button, TextForm } from '../forms'
import React, { useContext, useState } from 'react'
import { ConfirmationDialog } from '../ConfirmationDialog'
import { GlobalContext } from '../../context'
import { useHistory } from 'react-router-dom'

export const DatasetHeader = (props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [datasetName, setDatasetName] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const { updateDataset, deleteDataset } = useContext(GlobalContext)
  const history = useHistory()

  const { dataset } = props

  const handleEdit = () => {
    setDatasetName(dataset.name)
    setIsEditing(true)
  }
  const handleUpdate = () => {
    setIsEditing(false)
    updateDataset(dataset.set('name', datasetName))
  }
  const handleDelete = () => {
    setIsDeleting(false)
    deleteDataset(dataset)
    history.push('/datasets')
  }

  if (isEditing) {
    return (
      <div className='dataset-header'>
        <TextForm value={datasetName} onChange={setDatasetName} focus />
        <div className='edit-buttons'>
          <Button text='UPDATE' onClick={handleUpdate} />
          <Button text='CANCEL' onClick={() => setIsEditing(false)} />
        </div>
      </div>
    )
  }
  return (
    <div className='dataset-header'>
      <span className='dataset-name'>{dataset.name}</span>
      <div className='edit-buttons'>
        <Button text='EDIT' onClick={handleEdit} />
        <Button text='DELETE' onClick={() => setIsDeleting(true)} />
        <ConfirmationDialog
          title={`Deleting ${dataset.name}.`}
          message='Are you sure to delete this dataset?'
          isOpen={isDeleting}
          onClose={() => setIsDeleting(false)}
          onConfirm={handleDelete}
          confirmText='DELETE'
          cancelText='CANCEL'
        />
      </div>
    </div>
  )
}
