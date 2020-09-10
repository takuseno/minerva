import '../../styles/project/metrics-graph.scss'
import React, { useEffect, useState } from 'react'
import { Line } from '../graphs'
import { SelectForm } from '../forms'

export const MetricsGraph = (props) => {
  const [activeGraphIndex, setActiveGraphIndex] = useState(0)
  const { metrics, labels, project } = props
  const graphOptions = []

  useEffect(() => {
    setActiveGraphIndex(0)
  }, [project])

  Object.keys(metrics).forEach((key) => {
    graphOptions.push({
      key: key,
      text: key.toUpperCase().replace(/_/gu, ' '),
      value: graphOptions.length
    })
  })

  const graphKey = graphOptions[activeGraphIndex].key

  return (
    <div className='graph'>
      <SelectForm
        value={activeGraphIndex}
        options={graphOptions}
        onChange={(value) => setActiveGraphIndex(value)}
      />
      <div className='graph-item'>
        <Line
          values={metrics[graphKey]}
          titles={labels[graphKey]}
          xLabel='epoch'
          yLabel='value'
        />
      </div>
    </div>
  )
}
