import React from 'react'
import { Link, useParams } from 'react-router-dom'
import '../styles/sidebar.scss'

export function DatasetSidebar (props) {
  const datasets = props.datasets
  const { id } = useParams()
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
            const itemClass = dataset.id === Number(id) ? 'item active' : 'item'
            return (
              <li key={dataset.id} className={itemClass}>
                <Link className='option' to={`/datasets/${dataset.id}`}>
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
                <Link className='option' to={`projects/${project.id}`}>
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
