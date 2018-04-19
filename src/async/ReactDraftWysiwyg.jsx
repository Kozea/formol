import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import 'draft-js/dist/Draft.css'

import Async from '../utils/Async'

export default Async(
  () =>
    import(/*
    webpackChunkName: "ReactDraftWysiwyg"
  */ 'react-draft-wysiwyg'),
  { path: 'Editor' }
)
