import React, { useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { DatasetSidebar, ProjectSidebar } from './Sidebar'
import { DatasetDashboard, ProjectDashboard } from './Dashboard'
import { DatasetUploadDialog } from './CreateDialog'
import '../styles/content.scss'

export function DatasetContent (props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  return (
    <div className='content'>
      {props.datasets.size > 0 &&
        <Switch>
          <Route path='/datasets/:id'>
            <DatasetSidebar
              datasets={props.datasets}
              openUploadDialog={() => setIsDialogOpen(true)}
            />
            <DatasetDashboard datasets={props.datasets} />
          </Route>
          <Route exact path='/datasets'>
            <Redirect to={`/datasets/${props.datasets.first().id}`} />
          </Route>
        </Switch>}
      {props.datasets.size === 0 &&
        <Route path='/datasets'>
          <DatasetSidebar
            datasets={props.datasets}
            openUploadDialog={() => setIsDialogOpen(true)}
          />
        </Route>}
      <DatasetUploadDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
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
