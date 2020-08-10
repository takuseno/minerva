import React from 'react'
import { useParams } from 'react-router-dom'
import HighCharts from 'highcharts'
import HighChartsReact from 'highcharts-react-official'
import '../styles/dashboard.scss'

function Histogram (props) {
  const values = props.values
  const labels = props.labels.map((v) => v.toFixed(2))
  const option = {
    title: {
      text: props.title,
      style: {
        'font-size': '1.2em',
        'font-weight': '200'
      }
    },
    chart: {
      type: 'area'
    },
    xAxis: {
      title: {
        text: props.xLabel
      },
      categories: labels
    },
    yAxis: {
      title: {
        text: props.yLabel
      }
    },
    legend: {
      enabled: false
    },
    series: [{ data: values }]
  }
  return (
    <HighChartsReact highcharts={HighCharts} options={option} />
  )
}

function Card ({ children }) {
  return (
    <div className='card'>
      {children}
    </div>
  )
}

export function DatasetDashboard (props) {
  const { id } = useParams()
  const datasets = props.datasets
  const dataset = datasets.find((d) => d.id === Number(id))
  const stats = dataset.statistics
  const actionSpace = dataset.is_discrete ? 'discrete' : 'continuous'
  const observationSpace = dataset.is_image ? 'image' : 'vector'
  const returnHist = stats.return.histogram
  const rewardHist = stats.reward.histogram
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
      <div className='statistics'>
        <Card>
          <p className='statistics-title'>Return Statistics</p>
          <table>
            <tr>
              <th>mean</th>
              <td>{stats.return.mean.toFixed(2)}</td>
            </tr>
            <tr>
              <th>standard deviation</th>
              <td>{stats.return.std.toFixed(2)}</td>
            </tr>
            <tr>
              <th>maximum value</th>
              <td>{stats.return.max.toFixed(2)}</td>
            </tr>
            <tr>
              <th>minimum value</th>
              <td>{stats.return.min.toFixed(2)}</td>
            </tr>
          </table>
          <Histogram
            values={returnHist[0]}
            labels={returnHist[1]}
            title='Return Distribution'
            xLabel='Return'
            yLabel='Number of episodes'
          />
        </Card>
        <Card>
          <p className='statistics-title'>Reward Statistics</p>
          <table>
            <tr>
              <th>mean</th>
              <td>{stats.reward.mean.toFixed(2)}</td>
            </tr>
            <tr>
              <th>standard deviation</th>
              <td>{stats.reward.std.toFixed(2)}</td>
            </tr>
            <tr>
              <th>maximum value</th>
              <td>{stats.reward.max.toFixed(2)}</td>
            </tr>
            <tr>
              <th>minimum value</th>
              <td>{stats.reward.min.toFixed(2)}</td>
            </tr>
          </table>
          <Histogram
            values={rewardHist[0]}
            labels={rewardHist[1]}
            title='Reward Distribution'
            xLabel='Reward'
            yLabel='Number of steps'
          />
        </Card>
      </div>
    </div>
  )
}

export function ProjectDashboard () {
  return (
    <div className='dashboard' />
  )
}
