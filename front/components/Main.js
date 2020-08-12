import React, { useContext } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { DatasetContent, ProjectContent } from './Content'
import { Header } from './Header'
import { GlobalContext } from '../context'
import '../styles/main.scss'

export default function Main () {
  const { datasets, projects } = useContext(GlobalContext)
  return (
    <div className='main'>
      <Header />
      <Switch>
        <Route path='/projects'>
          <ProjectContent projects={projects} datasets={datasets} />
        </Route>
        <Route path='/datasets'>
          <DatasetContent datasets={datasets} />
        </Route>
        <Route path='/'>
          <Redirect to='/projects' />
        </Route>
      </Switch>
    </div>
  )
}
