import 'react-day-picker/lib/style.css'

import Async from '../utils/Async'

export default Async(() =>
  import(/*
    webpackChunkName: "DayPickerInput"
  */ 'react-day-picker/DayPickerInput')
)
