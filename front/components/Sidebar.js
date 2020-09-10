import '../styles/sidebar.scss'
import { Link, useParams } from 'react-router-dom'
import React, { useState } from 'react'
import { DatasetUploadDialog } from './DatasetUploadDialog'
import { ProjectCreateDialog } from './ProjectCreateDialog'

const SideBarItem = (props) => {
  const { isActive, name, url } = props
  const itemClass = isActive ? 'item active' : 'item'
  return (
    <li className={itemClass}>
      <Link className='option' to={url}>{name}</Link>
    </li>
  )
}

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
          {datasets.map((dataset) => (
            <SideBarItem
              key={dataset.id}
              isActive={dataset.id === Number(id)}
              name={dataset.name}
              url={`/datasets/${dataset.id}`}
            />
          ))}
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
          {projects.map((project) => (
            <SideBarItem
              key={project.id}
              isActive={project.id === Number(id)}
              name={project.name}
              url={`/projects/${project.id}`}
            />
          ))}
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
