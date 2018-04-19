import 'react-select/dist/react-select.css'

import Async from '../utils/Async'

export default Async(() =>
  import(/*
    webpackChunkName: "ReactSelect"
  */ 'react-select')
)
