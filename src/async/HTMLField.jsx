import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import 'draft-js/dist/Draft.css'

import './HTMLField.sass'

import { ContentState, EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import React from 'react'
import { Editor } from 'react-draft-wysiwyg'

import { block, readAsBase64 } from '../utils'

const stateFromValue = value => {
  if (!value) {
    return EditorState.createEmpty()
  }
  const contentBlock = htmlToDraft(value)
  const editorContent = EditorState.createWithContent(
    ContentState.createFromBlockArray(contentBlock.contentBlocks)
  )
  return editorContent
}

export const stateToValue = editorState =>
  draftToHtml(convertToRaw(editorState.getCurrentContent()))

@block
export default class HTMLField extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editorState: null,
    }
    this.onChange = this.onChange.bind(this)
  }

  componentWillMount() {
    const { value } = this.props
    this.newState(value || '')
  }

  componentWillReceiveProps({ value }) {
    if (value !== this.input.value) {
      this.newState(value)
    }
  }

  prepareValue(value) {
    return value === '<p></p>\n' ? '' : value ? value.trim() : ''
  }

  newState(value) {
    const newValue = this.prepareValue(value)
    this.value = newValue
    this.setState({
      editorState: stateFromValue(newValue),
    })
  }

  onChange(editorState) {
    const { onChange } = this.props
    const value = this.prepareValue(stateToValue(editorState))
    // Synchronise value with input for html5 form validation
    this.input.value = value
    this.setState({ editorState })
    onChange(value, this.input)
  }

  render(b) {
    const {
      className,
      i18n,
      readOnly,
      onFocus,
      onBlur,
      onKeyDown,
      toolbar,
      placeholder,
      ...props
    } = this.props
    const { editorState } = this.state
    const HTMLToolbar = toolbar || {
      image: {
        uploadCallback: async file => ({
          data: { link: await readAsBase64(file) },
        }),
        previewImage: true,
        alt: { present: true, mandatory: false },
      },
    }
    return (
      <div className={b.mix(className)}>
        <Editor
          editorClassName={b.e('editor')}
          editorState={editorState}
          localization={{
            locale: 'fr',
          }}
          onBlur={onBlur}
          ref={ref => (this.drafteditor = ref)}
          /* eslint-disable-next-line react/jsx-handler-names */
          onEditorStateChange={this.onChange}
          onFocus={onFocus}
          handleReturn={onKeyDown}
          placeholder={placeholder || i18n.html.placeholder}
          readOnly={readOnly}
          toolbar={HTMLToolbar}
          toolbarClassName={b.e('toolbar')}
          wrapperClassName={b.e('wrapper')}
        />
        <input
          className={b.e('hidden-input')}
          ref={ref => (this.input = ref)}
          {...props}
        />
      </div>
    )
  }
}
