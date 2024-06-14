import Async from '../utils/Async'

const HTMLField = Async(
  () => import(/* webpackChunkName: "HTMLField" */ '../async/HTMLField')
)

HTMLField.formolFieldLabelElement = 'div'

export default HTMLField
