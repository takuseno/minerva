import '../styles/dataset-dashboard.scss'
import { Button, TextForm } from './forms'
import React, { useContext, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { ConfirmationDialog } from './ConfirmationDialog.js'
import { GlobalContext } from '../context'
import { Histogram } from './graphs'

const StatisticsItem = (props) => (
  <div className='statistics-item'>
    <p className='statistics-title'>{props.title}</p>
    <table className='statistics-table'>
      <tr>
        <th>mean</th>
        <td>{props.mean.toFixed(2)}</td>
      </tr>
      <tr>
        <th>standard deviation</th>
        <td>{props.std.toFixed(2)}</td>
      </tr>
      <tr>
        <th>maximum value</th>
        <td>{props.max.toFixed(2)}</td>
      </tr>
      <tr>
        <th>minimum value</th>
        <td>{props.min.toFixed(2)}</td>
      </tr>
    </table>
    <div className='graph'>
      <Histogram
        title={props.graphTitle}
        values={props.values}
        labels={props.labels}
        xLabel={props.xLabel}
        yLabel={props.yLabel}
        discrete={props.discrete}
      />
    </div>
  </div>
)

const DatasetHeader = (props) => {
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

const convertByteToString = (size) => {
  if (size < 2 ** 10) {
    return `${size.toString()}B`
  } else if (size < 2 ** 20) {
    return `${(size / (2 ** 10)).toFixed(2).toString()}KiB`
  } else if (size < 2 ** 30) {
    return `${(size / (2 ** 20)).toFixed(2).toString()}MiB`
  }
  return `${(size / (2 ** 30)).toFixed(2).toString()}GiB`
}

const DatasetStatistics = (props) => {
  const { dataset } = props
  const stats = dataset.statistics
  const actionSpace = dataset.isDiscrete ? 'discrete' : 'continuous'
  const observationSpace = dataset.isImage ? 'image' : 'vector'
  const returnHist = stats.return.histogram
  const rewardHist = stats.reward.histogram
  const actionHist = stats.action.histogram
  return (
    <div className='dataset-body'>
      <div className='dataset-section'>
        <span className='section-title'>Information</span>
      </div>
      <div className='detail'>
        <table>
          <tr>
            <th>observation type</th>
            <td>{observationSpace}</td>
          </tr>
          <tr>
            <th>observation shape</th>
            <td>{stats.observation_shape}</td>
          </tr>
          <tr>
            <th>action type</th>
            <td>{actionSpace}</td>
          </tr>
          <tr>
            <th>action size</th>
            <td>{stats.action_size}</td>
          </tr>
          <tr>
            <th>number of episodes</th>
            <td>{dataset.episodeSize}</td>
          </tr>
          <tr>
            <th>number of steps</th>
            <td>{dataset.stepSize}</td>
          </tr>
          <tr>
            <th>dataset size</th>
            <td>{convertByteToString(dataset.dataSize)}</td>
          </tr>
        </table>
      </div>
      <div className='dataset-section'>
        <span className='section-title'>Statistics</span>
      </div>
      <StatisticsItem
        title='Return Statistics'
        mean={stats.return.mean}
        std={stats.return.std}
        max={stats.return.max}
        min={stats.return.min}
        graphTitle='histogram'
        values={returnHist[0]}
        labels={returnHist[1]}
        xLabel='return'
        yLabel='number of episodes'
      />
      <StatisticsItem
        title='Reward Statistics'
        mean={stats.reward.mean}
        std={stats.reward.std}
        max={stats.reward.max}
        min={stats.reward.min}
        graphTitle='histogram'
        values={rewardHist[0]}
        labels={rewardHist[1]}
        xLabel='reward'
        yLabel='number of steps'
      />
      {dataset.isDiscrete &&
        <div className='statistics-item'>
          <p className='statistics-title'>Action Statistics</p>
          <Histogram
            title='histogram'
            values={actionHist[0]}
            labels={actionHist[1]}
            xLabel='action id'
            yLabel='number of steps'
            discrete
          />
        </div>}
      {!dataset.isDiscrete &&
        actionHist.map((hist, i) => (
          <StatisticsItem
            key={i}
            title={`Action Statistics (dim=${i})`}
            mean={stats.action.mean[i]}
            std={stats.action.std[i]}
            max={stats.action.max[i]}
            min={stats.action.min[i]}
            graphTitle='histogram'
            values={hist[0]}
            labels={hist[1]}
            xLabel={`action (dim=${i})`}
            yLabel='number of steps'
          />
        ))}
    </div>
  )
}

export const DatasetDashboard = (props) => {
  const { id } = useParams()
  const { datasets } = props
  const dataset = datasets.find((d) => d.id === Number(id))
  if (dataset === undefined) {
    // TODO: show error page
    return (<div className='dashboard' />)
  }
  return (
    <div className='dashboard'>
      <DatasetHeader dataset={dataset} />
      <div className='dataset-body-wrapper'>
        <DatasetStatistics dataset={dataset} />
      </div>
    </div>
  )
}
