import React, { useEffect, useState, useReducer } from 'react'
import { List, Map } from 'immutable'
import { Dataset } from './models/dataset'
import { Project } from './models/project'
import { Experiment } from './models/experiment'

export const GlobalContext = React.createContext({})

function experimentReducer (experiments, action) {
  switch (action.type) {
    case 'fetch': {
      return experiments.set(action.projectId, List(action.experiments))
    }
    case 'create': {
      if (!experiments.has(action.projectId)) {
        return experiments.set(action.projectId, List([action.experiment]))
      } else {
        const target = experiments.get(action.projectId)
        const newExperiments = target.insert(0, action.experiment)
        return experiments.set(action.projectId, newExperiments)
      }
    }
    case 'update': {
      const experiment = action.experiment
      const target = experiments.get(action.projectId)
      const index = target.findIndex((e) => e.id === experiment.id)
      const newExperiments = target.set(index, experiment)
      return experiments.set(action.projectId, newExperiments)
    }
    case 'delete': {
      const experiment = action.experiment
      const target = experiments.get(action.projectId)
      const newExperiments = target.filter((e) => e.id !== experiment.id)
      return experiments.set(action.projectId, newExperiments)
    }
  }
}

export function GlobalProvider ({ children }) {
  const [datasets, setDatasets] = useState(List([]))
  const [projects, setProjects] = useState(List([]))
  const [experiments, dispatch] = useReducer(experimentReducer, Map({}))

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
      .then((newExperiments) => {
        dispatch({
          type: 'fetch',
          projectId: projectId,
          experiments: newExperiments
        })
        return newExperiments
      })
  }

  const createExperiment = (projectId, name, config, progressCallback) => {
    return Experiment.create(projectId, name, config, progressCallback)
      .then((experiment) => {
        dispatch({
          type: 'create',
          projectId: projectId,
          experiment: experiment
        })
        return experiment
      })
  }

  const deleteExperiment = (experiment) => {
    dispatch({
      type: 'delete',
      projectId: experiment.projectId,
      experiment: experiment
    })
    return experiment.delete()
  }

  const updateExperiment = (experiment) => {
    dispatch({
      type: 'update',
      projectId: experiment.projectId,
      experiment: experiment
    })
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
