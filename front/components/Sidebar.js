import React from 'react'
import { Switch, Link, Route, useRouteMatch } from 'react-router-dom'
import '../styles/sidebar.scss'

function DatasetSidebar () {
  const datasets = ['test_data1', 'test_data2']
  const match = useRouteMatch()
  return (
    <div className='list'>
      <p className='item add'>
        <span className='option'>ADD DATASET</span></p>
      <ul>
        {datasets.map((dataset) => {
          return (
            <li key={dataset} className='item'>
              <Link className='option' to={`${match.url}/${dataset}`}>
                {dataset}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function ProjectSidebar () {
  const projects = ['test_project1', 'test_project2']
  const match = useRouteMatch()
  return (
    <div className='list'>
      <p className='item add'>
        <span className='option'>ADD PROJECT</span>
      </p>
      <ul>
        {projects.map((project) => {
          return (
            <li key={project} className='item'>
              <Link className='option' to={`${match.url}/${project}`}>
                {project}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function Sidebar () {
  return (
    <div className='sidebar'>
      <Switch>
        <Route path='/projects'>
          <ProjectSidebar />
        </Route>
        <Route path='/datasets'>
          <DatasetSidebar />
        </Route>
      </Switch>
    </div>
  )
}
