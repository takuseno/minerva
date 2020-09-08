import '../styles/content.scss'
import { DatasetSidebar, ProjectSidebar } from './Sidebar'
import { Redirect, Route, Switch } from 'react-router-dom'
import { DatasetDashboard } from './DatasetDashboard'
import { ProjectDashboard } from './ProjectDashboard'
import React from 'react'

const EmptyContent = (props) => (
  <div className='empty'>
    <div className='label'>
      <span>{props.label}</span>
    </div>
  </div>
)

export const DatasetContent = (props) => (
  // TODO: show empty page
  <div className='content'>
    {props.datasets.size > 0 &&
      <Switch>
        <Route path='/datasets/:id'>
          <DatasetSidebar datasets={props.datasets} />
          <DatasetDashboard
            datasets={props.datasets}
            examples={props.examples}
          />
        </Route>
        <Route exact path='/datasets'>
          <Redirect to={`/datasets/${props.datasets.first().id}`} />
        </Route>
      </Switch>}
    {props.datasets.size === 0 &&
      <Route path='/datasets'>
        <DatasetSidebar datasets={props.datasets} />
        <EmptyContent label='NO DATASETS' />
      </Route>}
  </div>
)

export const ProjectContent = (props) => (
  <div className='content'>
    {props.projects.size > 0 &&
      <Switch>
        <Route path='/projects/:id'>
          <ProjectSidebar
            projects={props.projects}
            datasets={props.datasets}
          />
          <ProjectDashboard
            projects={props.projects}
            datasets={props.datasets}
            experiments={props.experiments}
          />
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
        <EmptyContent label='NO PROJECTS' />
      </Route>}
  </div>
)
