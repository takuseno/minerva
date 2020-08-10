import React, { useEffect, useState } from 'react'
import { DatasetSidebar, ProjectSidebar } from './Sidebar'
import { DatasetDashboard, ProjectDashboard } from './Dashboard'
import { DatasetUploadDialog } from './CreateDialog'
import '../styles/content.scss'

export function DatasetContent (props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  return (
    <div className='content'>
      <DatasetSidebar
        datasets={props.datasets}
        openUploadDialog={() => setIsDialogOpen(true)}
      />
      <DatasetDashboard />
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
