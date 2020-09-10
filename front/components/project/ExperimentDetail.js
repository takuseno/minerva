import '../../styles/project/experiment-detail.scss'
import {
  Q_FUNC_TYPE_OPTIONS,
  SCALER_OPTIONS
} from '../../constants'
import React, { useContext, useState } from 'react'
import { Button } from '../forms'
import { ConfirmationDialog } from '../ConfirmationDialog'
import { DownloadPolicyDialog } from './DownloadPolicyDialog'
import { GlobalContext } from '../../context'
import { Progress } from 'react-sweet-progress'

const ProgressCircle = (props) => {
  const { isActive, progress } = props
  let progressStatus = 'success'
  let progressColor = '#2ecc71'
  if (isActive) {
    progressStatus = 'active'
    progressColor = '#3498db'
  } else if (progress !== 1.0) {
    progressStatus = 'error'
    progressColor = '#e74c3c'
  }
  const percentage = Math.round(100.0 * (isActive ? progress : 1.0))
  return (
    <Progress
      type='circle'
      percent={percentage}
      strokeWidth='10'
      width='35'
      status={progressStatus}
      theme={{
        error: {
          color: progressColor
        },
        success: {
          color: progressColor
        },
        active: {
          symbol: `${percentage.toString()}%`,
          color: progressColor
        }
      }}
    />
  )
}

export const ExperimentDetail = (props) => {
  const { cancelExperiment, deleteExperiment } = useContext(GlobalContext)
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { experiment } = props
  const { metrics, isActive } = experiment
  const totalEpoch = experiment.config.n_epochs
  const currentEpoch = metrics.td_error ? metrics.td_error.length : 0

  const progress = currentEpoch / totalEpoch
  let status = 'success'
  if (isActive) {
    status = 'running'
  } else if (progress !== 1.0) {
    status = 'failed'
  }

  return (
    <div className='experiment-detail'>
      <div className='top-line'>
        <ProgressCircle
          isActive={isActive}
          progress={progress}
        />
        <span className='experiment-name'>
          {experiment.name}
        </span>
        <span className={status}>
          {status}
        </span>
      </div>
      <div className='middle-line'>
        <table>
          <tr>
            <th>EPOCH</th>
            <td>{currentEpoch}/{totalEpoch}</td>
          </tr>
          <tr>
            <th>Q FUNCTION</th>
            <td>{Q_FUNC_TYPE_OPTIONS[experiment.config.q_func_type]}</td>
          </tr>
          <tr>
            <th>SCALER</th>
            <td>{SCALER_OPTIONS[experiment.config.scaler]}</td>
          </tr>
        </table>
      </div>
      <div className='bottom-line'>
        <Button
          text='DOWNLOAD'
          onClick={() => setIsDownloadDialogOpen(true)}
        />
        {isActive &&
          <Button
            text='CANCEL'
            onClick={() => cancelExperiment(experiment)}
          />}
        {!isActive &&
          <Button
            text='DELETE'
            onClick={() => setIsDeleting(true)}
          />}
      </div>
      <DownloadPolicyDialog
        isOpen={isDownloadDialogOpen}
        totalEpoch={currentEpoch}
        experiment={experiment}
        onClose={() => setIsDownloadDialogOpen(false)}
      />
      <ConfirmationDialog
        title={`Deleting ${experiment.name}.`}
        message='Are you sure to delete this experiment?'
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={() => deleteExperiment(experiment)}
        confirmText='DELETE'
        cancelText='CANCEL'
      />
    </div>
  )
}
