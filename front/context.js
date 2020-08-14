import React, { useEffect, useState } from 'react'
import { List } from 'immutable'
import { Dataset } from './models/dataset'
import { Project } from './models/project'
import { Experiment } from './models/experiment'

export const GlobalContext = React.createContext({})

export function GlobalProvider ({ children }) {
  const [datasets, setDatasets] = useState(List([]))
  const [projects, setProjects] = useState(List([]))
  const [experiments, setExperiments] = useState(List([]))

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

  const createProject = (datasetId, name, progressCallback) => {
    return Project.create(datasetId, name, progressCallback)
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
    setProjects(projects.set(index, project))
    return project.update()
  }

  const fetchExperiments = (projectId) => {
    return Experiment.getAll(projectId)
      .then((experiments) => {
        setExperiments(List(experiments))
        return experiments
      })
  }

  const createExperiment = (projectId, name, config, progressCallback) => {
    return Experiment.create(projectId, name, config, progressCallback)
      .then((experiment) => {
        setExperiments(experiments.insert(0, experiment))
        return experiment
      })
  }

  const deleteExperiment = (experiment) => {
    const newExperiments = experiments.filter((e) => e.id !== experiment.id)
    setExperiments(newExperiments)
    return experiment.delete()
  }

  const updateExperiment = (experiment) => {
    const index = experiments.findIndex((e) => e.id === experiment.id)
    setExperiments(experiments.set(index, experiment))
    return experiment.update()
  }

  return (
    <GlobalContext.Provider
      value={{
        datasets,
        setDatasets,
        projects,
        setProjects,
        experiments,
        setExperiments,
        uploadDataset,
        deleteDataset,
        updateDataset,
        createProject,
        updateProject,
        deleteProject,
        fetchExperiments,
        createExperiment,
        deleteExperiment,
        updateExperiment
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
