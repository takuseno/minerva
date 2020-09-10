import '../../styles/dataset/statistics-item.scss'
import { Histogram } from '../graphs'
import React from 'react'

export const StatisticsItem = (props) => (
  <div className='statistics-item'>
    <p className='statistics-title'>{props.title}</p>
    <table className='statistics-table'>
      {['mean', 'std', 'max', 'min'].map((name, i) => (
        <tr key={i}>
          <th>{name.toUpperCase()}</th>
          <td>{props.stats[name].toFixed(2)}</td>
        </tr>
      ))}
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
