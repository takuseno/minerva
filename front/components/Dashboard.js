import React from 'react'
import { useParams } from 'react-router-dom'
import { Histogram } from './graphs'
import '../styles/dashboard.scss'

function Card ({ children }) {
  return (
    <div className='card'>
      {children}
    </div>
  )
}

function StatisticsCard (props) {
  return (
    <Card>
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
      <Histogram
        title={props.graphTitle}
        values={props.values}
        labels={props.labels}
        xLabel={props.xLabel}
        yLabel={props.yLabel}
      />
    </Card>
  )
}

export function DatasetDashboard (props) {
  const { id } = useParams()
  const datasets = props.datasets
  const dataset = datasets.find((d) => d.id === Number(id))
  const stats = dataset.statistics
  const actionSpace = dataset.isDiscrete ? 'discrete' : 'continuous'
  const observationSpace = dataset.isImage ? 'image' : 'vector'
  const returnHist = stats.return.histogram
  const rewardHist = stats.reward.histogram
  const actionHist = stats.action.histogram
  return (
    <div className='dashboard'>
      <div className='dataset-header'>
        <span className='dataset-name'>{dataset.name}</span>
      </div>
      <div className='dataset-section'>
        <span className='section-title'>Information</span>
      </div>
      <div className='detail'>
        <table>
          <tr>
            <th>observation type:</th>
            <td>{observationSpace}</td>
          </tr>
          <tr>
            <th>observation shape:</th>
            <td>{stats.observation_shape}</td>
          </tr>
          <tr>
            <th>action type:</th>
            <td>{actionSpace}</td>
          </tr>
          <tr>
            <th>action size:</th>
            <td>{stats.action_size}</td>
          </tr>
        </table>
      </div>
      <div className='dataset-section'>
        <span className='section-title'>Statistics</span>
      </div>
      <StatisticsCard
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
      <StatisticsCard
        title='Reward Statistics'
        mean={stats.reward.mean}
        std={stats.reward.std}
        max={stats.reward.max}
        min={stats.reward.min}
        graphTitle='histogram'
        values={rewardHist[0]}
        labels={rewardHist[1]}
        xLabel='reward'
        yLabel='number of episodes'
      />
      {dataset.isDiscrete &&
        <Card>
          <p className='statistics-title'>Action Statistics</p>
          <Histogram
            title='histogram'
            values={actionHist[0]}
            labels={actionHist[1]}
            xLabel='action id'
            yLabel='number of steps'
          />
        </Card>}
      {!dataset.isDiscrete &&
        actionHist.map((hist, i) => {
          return (
            <StatisticsCard
              key={i}
              title={`Action Statistics (dim=${i})`}
              mean={stats.action.mean[i]}
              std={stats.action.std[i]}
              max={stats.action.max[i]}
              min={stats.action.min[i]}
              values={hist[0]}
              labels={hist[1]}
              xLabel={`action (dim=${i})`}
              yLabel='number of steps'
            />
          )
        })}
    </div>
  )
}

export function ProjectDashboard () {
  return (
    <div className='dashboard' />
  )
}
