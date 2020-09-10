import '../../styles/project/params-list.scss'
import React from 'react'

export const ParamsList = (props) => {
  const { experiments } = props
  const paramKeys = []

  experiments.forEach((experiment) => {
    Object.keys(experiment.config).forEach((key) => {
      if (!paramKeys.includes(key)) {
        paramKeys.push(key)
      }
    })
  })

  // Sort parameters in alphabetical order
  paramKeys.sort()

  return (
    <div className='params-list'>
      <table className='parameter-table'>
        <tr className='table-header'>
          <th className='name'>NAME</th>
          {paramKeys.map((key) => (
            <th key={key}>{key.toUpperCase().replace(/_/gu, ' ')}</th>
          ))}
        </tr>
        {experiments.map((experiment) => (
          <tr key={experiment.id} className='table-body'>
            <th className='name'>{experiment.name}</th>
            {paramKeys.map((key) => {
              let value = experiment.config[key]
              if ((typeof value) === 'boolean') {
                value = value ? 'true' : 'false'
              } else if ((typeof value) === 'object') {
                if (value === null) {
                  value = 'none'
                } else if (Array.isArray(value)) {
                  if (value.length === 0) {
                    value = 'none'
                  } else {
                    value = value.join(', ')
                  }
                }
              }
              return (
                <td key={key}>{value}</td>
              )
            })}
          </tr>
        ))}
      </table>
    </div>
  )
}
