import Async from '../utils/Async'

export default Async(() =>
  import(/* webpackChunkName: "CalendarField" */ '../async/CalendarField')
)
