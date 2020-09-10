import '../../styles/dataset/dataset-detail.scss'
import React from 'react'

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

const ExampleObservations = (props) => {
  const { dataset, example } = props
  if (dataset.isImage) {
    return (
      <div className='example-wrapper'>
        <div className='example'>
          <div class='images'>
            {example.map((image, i) => (
              <img key={i} src={`data:image/jpeg;base64,${image}`} />
            ))}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className='example-wrapper'>
      <div className='example'>
        <div className='table-wrapper'>
          <table>
            <tr className='table-header'>
              <th>step</th>
              {example[0].map((data, i) => (
                <th key={i}>{i}</th>
              ))}
            </tr>
            {example.map((data, i) => (
              <tr key={i}>
                <th>{i}</th>
                {data.map((column, j) => (
                  <td key={j}>{column.toFixed(4)}</td>
                ))}
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  )
}

export const DatasetDetail = (props) => {
  const { dataset, example } = props
  const stats = dataset.statistics
  const actionSpace = dataset.isDiscrete ? 'discrete' : 'continuous'
  const observationSpace = dataset.isImage ? 'image' : 'vector'
  return (
    <div className='detail'>
      <table>
        <tr>
          <th>observation type</th>
          <td>{observationSpace}</td>
        </tr>
        <tr>
          <th>observation shape</th>
          <td>({stats.observation_shape.join(', ')})</td>
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
      {example !== undefined &&
        <ExampleObservations dataset={dataset} example={example} />}
    </div>
  )
}
