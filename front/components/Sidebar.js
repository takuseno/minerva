import '../styles/sidebar.scss'
import { Link, useParams } from 'react-router-dom'
import React, { useState } from 'react'
import { DatasetUploadDialog } from './DatasetUploadDialog'
import { ProjectCreateDialog } from './ProjectCreateDialog'

export const DatasetSidebar = (props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { datasets } = props
  const { id } = useParams()
  return (
    <div className='sidebar'>
      <div className='list'>
        <p className='item add'>
          <span className='option' onClick={() => setIsDialogOpen(true)}>
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
      <DatasetUploadDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  )
}

export const ProjectSidebar = (props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { projects } = props
  const { id } = useParams()
  return (
    <div className='sidebar'>
      <div className='list'>
        <p className='item add'>
          <span className='option' onClick={() => setIsDialogOpen(true)}>
            ADD PROJECT
          </span>
        </p>
        <ul>
          {projects.map((project) => {
            const activeId = project.id
            const itemClass = activeId === Number(id) ? 'item active' : 'item'
            return (
              <li key={project.id} className={itemClass}>
                <Link className='option' to={`/projects/${project.id}`}>
                  {project.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
      <ProjectCreateDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        datasets={props.datasets}
      />
    </div>
  )
}
