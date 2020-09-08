import '../styles/main.scss'
import 'react-toastify/dist/ReactToastify.css'
import { DatasetContent, ProjectContent } from './Content'
import React, { useContext } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { GlobalContext } from '../context'
import { Header } from './Header'
import { ToastContainer } from 'react-toastify'

export default function Main () {
  const {
    datasets,
    projects,
    experiments,
    examples
  } = useContext(GlobalContext)
  return (
    <div className='main'>
      <Header />
      <Switch>
        <Route path='/projects'>
          <ProjectContent
            projects={projects}
            datasets={datasets}
            experiments={experiments}
          />
        </Route>
        <Route path='/datasets'>
          <DatasetContent datasets={datasets} examples={examples} />
        </Route>
        <Route path='/'>
          <Redirect to='/projects' />
        </Route>
      </Switch>
      <ToastContainer />
    </div>
  )
}
