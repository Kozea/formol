import Async from '../utils/Async'

const FileField = Async(() =>
  import(/* webpackChunkName: "FileField" */ '../async/FileField')
)
FileField.formolFieldLabelElement = 'div'
export default FileField
