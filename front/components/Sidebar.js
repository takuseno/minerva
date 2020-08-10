import React from 'react'
import { Switch, Link, Route, useRouteMatch } from 'react-router-dom'
import '../styles/sidebar.scss'

export function DatasetSidebar (props) {
  const datasets = props.datasets
  const match = useRouteMatch()
  return (
    <div className='sidebar'>
      <div className='list'>
        <p className='item add'>
          <span
            className='option'
            onClick={() => props.openUploadDialog()}
          >
            ADD DATASET
          </span>
        </p>
        <ul>
          {datasets.map((dataset) => {
            return (
              <li key={dataset.id} className='item'>
                <Link className='option' to={`${match.url}/${dataset.id}`}>
                  {dataset.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export function ProjectSidebar (props) {
  const projects = props.projects
  const match = useRouteMatch()
  return (
    <div className='sidebar'>
      <div className='list'>
        <p className='item add'>
          <span className='option'>ADD PROJECT</span>
        </p>
        <ul>
          {projects.map((project) => {
            return (
              <li key={project.id} className='item'>
                <Link className='option' to={`${match.url}/${project.id}`}>
                  {project.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
