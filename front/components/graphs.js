import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  LineChart,
  Line as RechartsLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { DISPLAY_DECIMAL_LENGTH, GRAPH_DIMMED_OPACITY } from '../constants'
import React, { useState } from 'react'
import { Range } from 'immutable'

export const Histogram = (props) => {
  const { discrete, labels, values } = props
  const data = values.map((value, index) => {
    const label = labels[index]
    return {
      x: discrete ? label.toString() : label.toFixed(DISPLAY_DECIMAL_LENGTH),
      y: value
    }
  })
  return (
    <ResponsiveContainer width='100%' height={400}>
      <BarChart
        data={data}
        width={500}
        height={300}
        margin={{ top: 0, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis
          dataKey='x'
          label={{
            value: props.xLabel,
            position: 'insideBottom',
            offset: -20
          }}
        />
        <YAxis
          label={{
            value: props.yLabel,
            angle: -90,
            position: 'insideLeft'
          }}
        />
        <Tooltip />
        <Bar dataKey='y' fill='#2980b9' />
      </BarChart>
    </ResponsiveContainer>
  )
}

export const Line = (props) => {
  const [activeTitle, setIsActiveTitle] = useState('')

  const colors = [
    '#2980b9', '#c0392b', '#16a085', '#d35400', '#f39c12', '#7f8c8d',
    '#3498db', '#e74c3c', '#1abc9c', '#e67e22', '#f1c40f'
  ]

  // Make up recharts data
  const maxX = Math.max(...props.values.map((value) => value.length))
  const data = Range(0, maxX).map((i) => ({ x: i })).toArray()
  props.values.forEach((value, dataIndex) => {
    value.forEach((v, timeIndex) => {
      data[timeIndex][props.titles[dataIndex]] = v
    })
  })

  const handleMouseEnter = ({ dataKey }) => {
    setIsActiveTitle(dataKey)
  }

  const handleMouseLeave = () => {
    setIsActiveTitle('')
  }

  return (
    <ResponsiveContainer>
      <LineChart
        data={data}
        height={300}
        margin={{ top: 0, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis
          dataKey='x'
          label={{
            value: props.xLabel,
            position: 'insideBottom',
            offset: -10
          }}
        />
        <YAxis
          label={{
            value: props.yLabel,
            angle: -90,
            position: 'insideLeft'
          }}
        />
        <Tooltip />
        <Legend
          wrapperStyle={{ fontSize: 10, paddingTop: 15 }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
        {props.titles.map((title, i) => {
          let opacity = 1.0
          if (activeTitle !== '' && activeTitle !== title) {
            opacity = GRAPH_DIMMED_OPACITY
          }
          return (
            <RechartsLine
              strokeWidth={2}
              key={title}
              type='monotone'
              dataKey={title}
              strokeOpacity={opacity}
              stroke={colors[i % colors.length]}
              fill={colors[i % colors.length]}
              dot={false}
              isAnimationActive
              animationDuration={500}
            />
          )
        })}
      </LineChart>
    </ResponsiveContainer>
  )
}
