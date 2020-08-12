import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { DatasetSidebar, ProjectSidebar } from './Sidebar'
import { DatasetDashboard } from './DatasetDashboard'
import { ProjectDashboard } from './ProjectDashboard'
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
      {props.projects.size > 0 &&
        <Switch>
          <Route path='/projects/:id'>
            <ProjectSidebar
              projects={props.projects}
              datasets={props.datasets}
            />
            <ProjectDashboard projects={props.projects} />
          </Route>
          <Route exact path='/projects'>
            <Redirect to={`/projects/${props.projects.first().id}`} />
          </Route>
        </Switch>}
      {props.projects.size === 0 &&
        <Route path='/projects'>
          <ProjectSidebar
            projects={props.projects}
            datasets={props.datasets}
          />
        </Route>}
    </div>
  )
}
