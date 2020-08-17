import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/header.scss'

export function Header () {
  const location = useLocation()
  return (
    <div className='header'>
      <div className='logo'>
        <span>MINERVA</span>
      </div>
      <div className='links'>
        {['projects', 'datasets'].map((link) => {
          const isActive = location.pathname.split('/')[1] === link
          const className = isActive ? 'link active' : 'link'
          const to = '/' + link
          return (
            <Link key={link} to={to} className={className}>
              <span>{link.toUpperCase()}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
