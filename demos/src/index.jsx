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
        <img
          src="./formol-simple-logo.svg"
          alt="Formol logo"
          className="navbar-logo"
        />
        <div className="demo-selector">
          <button
            onClick={() => setCurrentDemo('AllFieldsDemo')}
            className={currentDemo === 'AllFieldsDemo' ? 'active' : ''}
          >
            Fields
          </button>
          <button
            onClick={() => setCurrentDemo('FeaturesDemo')}
            className={currentDemo === 'FeaturesDemo' ? 'active' : ''}
          >
            Features
          </button>
        </div>
        <a href="https://github.com/Kozea/formol" className="github-link">
          <img src="./github.svg" alt="GitHub icon" className="github-icon" />
          GitHub
        </a>
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
