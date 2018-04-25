import Async from '../utils/Async'

export default Async(() =>
  import(/* webpackChunkName: "HTMLField" */ '../async/HTMLField')
)
