import React, { useEffect, useState } from 'react'
import { List } from 'immutable'
import { Dataset } from './models/dataset'
import { Project } from './models/project'

export const GlobalContext = React.createContext({})

export function GlobalProvider ({ children }) {
  const [datasets, setDatasets] = useState([])
  const [projects, setProjects] = useState([])

  // initialization
  useEffect(() => {
    Dataset.getAll()
      .then((datasets) => {
        setDatasets(List(datasets))
      })
  }, [])
  useEffect(() => {
    Project.getAll()
      .then((projects) => {
        setProjects(List(projects))
      })
  }, [])

  // actions
  const uploadDataset = (file, isImage, isDiscrete, progressCallback) => {
    return Dataset.upload(file, isImage, isDiscrete, progressCallback)
      .then((dataset) => {
        setDatasets(datasets.insert(0, dataset))
        return dataset
      })
  }

  const deleteDataset = (dataset) => {
    const newDatasets = datasets.filter((d) => d.id !== dataset.id)
    setDatasets(newDatasets)
    return dataset.delete()
  }

  const updateDataset = (dataset) => {
    const index = datasets.findIndex((d) => d.id === dataset.id)
    setDatasets(datasets.set(index, dataset))
    return dataset.update()
  }

  const createProject = (datasetId, name) => {
    return Project.create(datasetId, name)
      .then((project) => {
        setProjects(projects.insert(0, project))
        return project
      })
  }

  const deleteProject = (project) => {
    const newProjects = projects.filter((p) => p.id !== project.id)
    setProjects(newProjects)
    return project.delete()
  }

  const updateProject = (project) => {
    const index = projects.findIndex((p) => p.id === project.id)
    setProjects(projects.get(index, project))
    return project.update()
  }

  return (
    <GlobalContext.Provider
      value={{
        datasets,
        setDatasets,
        projects,
        setProjects,
        uploadDataset,
        deleteDataset,
        updateDataset,
        createProject,
        updateProject,
        deleteProject
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
