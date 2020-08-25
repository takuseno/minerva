import { BrowserRouter } from 'react-router-dom'
import { GlobalProvider } from './context'
import Main from './components/Main'
import React from 'react'
import ReactDOM from 'react-dom'

const App = () => (
  <BrowserRouter>
    <GlobalProvider>
      <Main />
    </GlobalProvider>
  </BrowserRouter>
)

ReactDOM.render(<App />, document.getElementById('root'))
