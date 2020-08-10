import React, { useEffect, useState } from 'react'
import { List } from 'immutable'
import { Dataset } from './models/dataset'

export const GlobalContext = React.createContext({})

export function GlobalProvider ({ children }) {
  const [datasets, setDatasets] = useState([])
  const [projects, setProjects] = useState([])

  // initialization
  useEffect(() => {
    setDatasets(List([new Dataset({ id: 1, name: 'test_dataset' })]))
  }, [])
  useEffect(() => {
    setProjects(List([{ id: 1, name: 'test_project' }]))
  }, [])

  return (
    <GlobalContext.Provider
      value={{
        datasets,
        setDatasets,
        projects,
        setProjects
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
