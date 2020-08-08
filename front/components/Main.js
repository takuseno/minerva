import React from 'react'
import Header from './Header'
import Content from './Content'
import '../styles/main.scss'

export default function Main () {
  return (
    <div className='main'>
      <Header />
      <Content />
    </div>
  )
}
