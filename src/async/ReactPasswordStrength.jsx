import Async from '../utils/Async'

export default Async(() =>
  import(/*
    webpackChunkName: "ReactPasswordStrength"
  */ 'react-password-strength')
)
