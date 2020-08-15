import React from 'react'
import C3Chart from 'react-c3js'
import 'c3/c3.css'

export function Histogram (props) {
  const data = {
    columns: [[props.title].concat(props.values)],
    type: 'bar'
  }
  const axis = {
    y: {
      label: {
        text: props.yLabel,
        position: 'outer-middle'
      }
    },
    x: {
      label: {
        text: props.xLabel,
        position: 'outer-center'
      },
      type: 'category',
      categories: props.labels.map((v) => v.toFixed(2))
    }
  }
  const transition = {
    duration: 1000
  }
  const legend = {
    show: false
  }
  return (
    <C3Chart data={data} axis={axis} transition={transition} legend={legend} />
  )
}

export function Line (props) {
  const data = {
    columns: props.values.map((value, i) => [props.titles[i]].concat(value))
  }
  const axis = {
    y: {
      label: {
        text: props.yLabel,
        position: 'outer-middle'
      },
      tick: {
        format: (v) => v.toFixed(2)
      }
    },
    x: {
      label: {
        text: props.xLabel,
        position: 'outer-center'
      }
    }
  }
  const transition = {
    duration: 1000
  }
  return (
    <C3Chart
      data={data}
      axis={axis}
      transition={transition}
      unloadBeforeLoad={props.refresh}
    />
  )
}
