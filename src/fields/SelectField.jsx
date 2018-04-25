import Async from '../utils/Async'

export default Async(() =>
  import(/* webpackChunkName: "SelectField" */ '../async/SelectField')
)
