import '../styles/sidebar.scss'
import { Link, useParams } from 'react-router-dom'
import React, { useState } from 'react'
import { DatasetUploadDialog } from './DatasetUploadDialog'
import { ProjectCreateDialog } from './ProjectCreateDialog'

const SidebarItem = (props) => {
  const { isActive, name, url } = props
  const itemClass = isActive ? 'item active' : 'item'
  return (
    <li className={itemClass}>
      <Link className='option' to={url}>{name}</Link>
    </li>
  )
}

const Sidebar = (props) => {
  const { data, title, dialog, urlBase, onOpenDialog } = props
  const { id } = useParams()
  return (
    <div className='sidebar'>
      <div className='list'>
        <p className='item add'>
          <span className='option' onClick={onOpenDialog}>
            ADD {title}
          </span>
        </p>
        <ul>
          {data.map((datum) => (
            <SidebarItem
              key={datum.id}
              isActive={datum.id === Number(id)}
              name={datum.name}
              url={`${urlBase}/${datum.id}`}
            />
          ))}
        </ul>
      </div>
      {dialog}
    </div>
  )
}

export const DatasetSidebar = (props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  return (
    <Sidebar
      data={props.datasets}
      title='DATASET'
      urlBase='/datasets'
      onOpenDialog={() => setIsDialogOpen(true)}
      dialog={
        <DatasetUploadDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      }
    />
  )
}

export const ProjectSidebar = (props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  return (
    <Sidebar
      data={props.projects}
      title='PROJECT'
      urlBase='/projects'
      onOpenDialog={() => setIsDialogOpen(true)}
      dialog={
        <ProjectCreateDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          datasets={props.datasets}
        />
      }
    />
  )
}
