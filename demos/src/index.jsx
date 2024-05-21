import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import '../../src/sass/default.sass'
import './demos.sass'

import AllFieldsDemo from './pages/AllFieldsDemo'
import FeaturesDemo from './pages/FeaturesDemo'

const App = () => {
  const [currentDemo, setCurrentDemo] = useState('AllFieldsDemo')

  return (
    <div className="app-container">
      <nav className="navbar">
        <button onClick={() => setCurrentDemo('AllFieldsDemo')}>Fields</button>
        <button onClick={() => setCurrentDemo('FeaturesDemo')}>Features</button>
      </nav>

      <div className="demo-container">
        {currentDemo === 'AllFieldsDemo' ? <AllFieldsDemo /> : <FeaturesDemo />}
      </div>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

export default App
