import { List, Map } from 'immutable'
import React, { useEffect, useReducer, useState } from 'react'
import { Dataset } from './models/dataset'
import { Experiment } from './models/experiment'
import { Project } from './models/project'
import { STATUS_API_CALL_INTERVAL } from './constants'
import { Status } from './models/status'
import { toast } from 'react-toastify'

export const GlobalContext = React.createContext({})

// Reducers
const experimentReducer = (experiments, action) => {
  const actions = {
    fetch: () => experiments.set(action.projectId, List(action.experiments)),
    create: () => {
      if (experiments.has(action.projectId)) {
        const target = experiments.get(action.projectId)
        const newExperiments = target.unshift(action.experiment)
        return experiments.set(action.projectId, newExperiments)
      }
      return experiments.set(action.projectId, List([action.experiment]))
    },
    update: () => {
      const { experiment } = action
      const target = experiments.get(action.projectId)
      const index = target.findIndex((ex) => ex.id === experiment.id)
      const newExperiments = target.set(index, experiment)
      return experiments.set(action.projectId, newExperiments)
    },
    delete: () => {
      const { experiment } = action
      const target = experiments.get(action.projectId)
      const newExperiments = target.filter((ex) => ex.id !== experiment.id)
      return experiments.set(action.projectId, newExperiments)
    }
  }
  return actions[action.type]()
}

export const GlobalProvider = ({ children }) => {
  const [datasets, setDatasets] = useState(List([]))
  const [projects, setProjects] = useState(List([]))
  const [experiments, dispatch] = useReducer(experimentReducer, Map({}))
  const [examples, setExamples] = useState(Map({}))
  const [status, setStatus] = useState({})
  const [statusTime, setStatusTime] = useState(Date.now())

  // Initialization
  useEffect(() => {
    Dataset.getAll()
      .then((newDatasets) => setDatasets(List(newDatasets)))
      .catch((err) => showNetworkErrorToast(err))

    Project.getAll()
      .then((newProjects) => setProjects(List(newProjects)))
      .catch((err) => showNetworkErrorToast(err))

    Status.get()
      .then((newStatus) => setStatus(newStatus))
      .catch((err) => showNetworkErrorToast(err))
  }, [])

  // Periodical API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setStatusTime(Date.now())
      Status.get()
        .then((newStatus) => setStatus(newStatus))
        .catch((err) => showNetworkErrorToast(err))
    }, STATUS_API_CALL_INTERVAL)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [statusTime])

  // Actions

  const showErrorToast = (message) => {
    toast.error(message, {
      position: 'bottom-center',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false
    })
  }

  const showNetworkErrorToast = (err) => {
    const { url, method } = err.config
    let message = `${method.toUpperCase()}: ${url} "${err.message}"`
    if (err.response) {
      message = `${method.toUpperCase()}: ${url} "${err.status}: ${err.data}"`
    }
    showErrorToast(message)
  }

  const uploadDataset = (
    file,
    isImage,
    isDiscrete,
    imageFiles,
    progressCallback
  ) => (
    Dataset.upload(file, isImage, isDiscrete, imageFiles, progressCallback)
      .then((dataset) => {
        setDatasets(datasets.unshift(dataset))
        return dataset
      })
      .catch((err) => showNetworkErrorToast(err))
  )

  const deleteDataset = (dataset) => {
    const newDatasets = datasets.filter((d) => d.id !== dataset.id)
    setDatasets(newDatasets)
    return dataset.delete().catch((err) => showNetworkErrorToast(err))
  }

  const updateDataset = (dataset) => {
    const index = datasets.findIndex((d) => d.id === dataset.id)
    setDatasets(datasets.set(index, dataset))
    return dataset.update().catch((err) => showNetworkErrorToast(err))
  }

  const createProject = (datasetId, name, progressCallback) => (
    Project.create(datasetId, name, progressCallback)
      .then((project) => {
        setProjects(projects.unshift(project))
        return project
      })
      .catch((err) => showNetworkErrorToast(err))
  )

  const deleteProject = (project) => {
    const newProjects = projects.filter((p) => p.id !== project.id)
    setProjects(newProjects)
    return project.delete().catch((err) => showNetworkErrorToast(err))
  }

  const updateProject = (project) => {
    const index = projects.findIndex((p) => p.id === project.id)
    setProjects(projects.set(index, project))
    return project.update().catch((err) => showNetworkErrorToast(err))
  }

  const fetchExperiments = (projectId) => (
    Experiment.getAll(projectId)
      .then((newExperiments) => {
        dispatch({
          type: 'fetch',
          projectId: projectId,
          experiments: newExperiments
        })
        return newExperiments
      })
      .catch((err) => showNetworkErrorToast(err))
  )

  const createExperiment = (projectId, name, config, progressCallback) => (
    Experiment.create(projectId, name, config, progressCallback)
      .then((experiment) => {
        dispatch({
          type: 'create',
          projectId: projectId,
          experiment: experiment
        })
        return experiment
      })
      .catch((err) => showNetworkErrorToast(err))
  )

  const deleteExperiment = (experiment) => {
    dispatch({
      type: 'delete',
      projectId: experiment.projectId,
      experiment: experiment
    })
    return experiment.delete().catch((err) => showNetworkErrorToast(err))
  }

  const updateExperiment = (experiment) => {
    dispatch({
      type: 'update',
      projectId: experiment.projectId,
      experiment: experiment
    })
    return experiment.update().catch((err) => showNetworkErrorToast(err))
  }

  const cancelExperiment = (experiment) => {
    dispatch({
      type: 'update',
      projectId: experiment.projectId,
      experiment: experiment.set('isActive', false)
    })
    return experiment.cancel().catch((err) => showNetworkErrorToast(err))
  }

  const fetchExampleObservations = (dataset) => {
    dataset.getExampleObservations()
      .then((observations) => {
        const newExamples = examples.set(dataset.id, observations)
        setExamples(newExamples)
        return observations
      })
      .catch((err) => showErrorToast(err))
  }

  return (
    <GlobalContext.Provider
      value={{
        datasets,
        projects,
        experiments,
        examples,
        status,
        uploadDataset,
        deleteDataset,
        updateDataset,
        createProject,
        updateProject,
        deleteProject,
        fetchExperiments,
        createExperiment,
        deleteExperiment,
        updateExperiment,
        cancelExperiment,
        fetchExampleObservations,
        showErrorToast,
        showNetworkErrorToast
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
