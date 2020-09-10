import '../styles/dataset-dashboard.scss'
import React, { useContext, useEffect } from 'react'
import { DatasetDetail } from './dataset/DatasetDetail'
import { DatasetHeader } from './dataset/DatasetHeader'
import { GlobalContext } from '../context'
import { MetricGraphs } from './dataset/MetricGraphs'
import { useParams } from 'react-router-dom'

export const DatasetDashboard = (props) => {
  const { fetchExampleObservations } = useContext(GlobalContext)
  const { id } = useParams()
  const { datasets, examples } = props
  const dataset = datasets.find((d) => d.id === Number(id))
  const example = examples.get(dataset.id)

  if (dataset === undefined) {
    // TODO: show error page
    return (<div className='dashboard' />)
  }

  // Load example observations
  useEffect(() => {
    if (example === undefined) {
      fetchExampleObservations(dataset)
    }
  }, [dataset.id])

  return (
    <div className='dashboard'>
      <DatasetHeader dataset={dataset} />
      <div className='dataset-body-wrapper'>
        <div className='dataset-body'>
          <div className='dataset-section'>
            <span className='section-title'>Information</span>
          </div>
          <DatasetDetail dataset={dataset} example={example} />
          <div className='dataset-section'>
            <span className='section-title'>Statistics</span>
          </div>
          <MetricGraphs dataset={dataset} />
        </div>
      </div>
    </div>
  )
}
