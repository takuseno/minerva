import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import Main from './components/Main'
import { GlobalProvider } from './context'

function App () {
  return (
    <BrowserRouter>
      <GlobalProvider>
        <Main />
      </GlobalProvider>
    </BrowserRouter>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
