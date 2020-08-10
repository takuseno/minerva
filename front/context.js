import React, { useEffect, useState } from 'react'
import { List } from 'immutable'
import { Dataset } from './models/dataset'

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
    setProjects(List([{ id: 1, name: 'test_project' }]))
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
    return dataset.delete()
      .then(() => {
        setDatasets(datasets.filter((d) => d.id !== dataset.id))
        return dataset
      })
  }

  const updateDataset = (dataset) => {
    return dataset.update()
      .then(() => {
        const index = datasets.findIndex((d) => d.id === dataset.id)
        setDatasets(datasets.set(index, dataset))
        return dataset
      })
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
        updateDataset
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
