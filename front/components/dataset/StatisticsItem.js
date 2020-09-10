import '../../styles/dataset/statistics-item.scss'
import { Histogram } from '../graphs'
import React from 'react'

export const StatisticsItem = (props) => (
  <div className='statistics-item'>
    <p className='statistics-title'>{props.title}</p>
    <table className='statistics-table'>
      <tr>
        <th>mean</th>
        <td>{props.stats.mean.toFixed(2)}</td>
      </tr>
      <tr>
        <th>standard deviation</th>
        <td>{props.stats.std.toFixed(2)}</td>
      </tr>
      <tr>
        <th>maximum value</th>
        <td>{props.stats.max.toFixed(2)}</td>
      </tr>
      <tr>
        <th>minimum value</th>
        <td>{props.stats.min.toFixed(2)}</td>
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
