import { Histogram } from '../graphs'
import React from 'react'
import { StatisticsItem } from './StatisticsItem'

export const MetricGraphs = (props) => {
  const { dataset } = props
  const stats = dataset.statistics
  const returnHist = stats.return.histogram
  const rewardHist = stats.reward.histogram
  const actionHist = stats.action.histogram
  return (
    <div>
      <StatisticsItem
        title='Return Statistics'
        stats={stats.return}
        graphTitle='histogram'
        values={returnHist[0]}
        labels={returnHist[1]}
        xLabel='return'
        yLabel='number of episodes'
      />
      <StatisticsItem
        title='Reward Statistics'
        stats={stats.reward}
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
        actionHist.map((hist, i) => {
          const data = {
            mean: stats.action.mean[i],
            std: stats.action.std[i],
            max: stats.action.max[i],
            min: stats.action.min[i]
          }
          return (
            <StatisticsItem
              key={i}
              title={`Action Statistics (dim=${i})`}
              stats={data}
              graphTitle='histogram'
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
