import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { DatasetSidebar, ProjectSidebar } from './Sidebar'
import { DatasetDashboard, ProjectDashboard } from './Dashboard'
import '../styles/content.scss'

export function DatasetContent (props) {
  // TODO: show empty page
  return (
    <div className='content'>
      {props.datasets.size > 0 &&
        <Switch>
          <Route path='/datasets/:id'>
            <DatasetSidebar datasets={props.datasets} />
            <DatasetDashboard datasets={props.datasets} />
          </Route>
          <Route exact path='/datasets'>
            <Redirect to={`/datasets/${props.datasets.first().id}`} />
          </Route>
        </Switch>}
      {props.datasets.size === 0 &&
        <Route path='/datasets'>
          <DatasetSidebar datasets={props.datasets} />
        </Route>}
    </div>
  )
}

export function ProjectContent (props) {
  return (
    <div className='content'>
      <ProjectSidebar projects={props.projects} />
      <ProjectDashboard />
    </div>
  )
}
