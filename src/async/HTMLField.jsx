import 'draft-js/dist/Draft.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import { Editor } from 'react-draft-wysiwyg'
import { EditorState } from 'draft-js'
import React from 'react'

import { HTMLToEditor, editorToHTML, normalize } from '../utils/html'
import { block, noOp, readAsBase64 } from '../utils'

const stateFromValue = (value, fast) => {
  if (!value) {
    return EditorState.createEmpty()
  }
  return fast ? value : HTMLToEditor(value)
}

export const stateToValue = (editorState, fast) =>
  fast ? editorState : editorToHTML(editorState)

const inputValue = (v, fast) =>
  fast
    ? !v ||
      !v
        .getCurrentContent()
        .getBlockMap()
        .first()
        .getText()
      ? ''
      : '_'
    : v

@block
export default class HTMLField extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      editorState: null,
      value: null,
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }

  static getDerivedStateFromProps(
    {
      elementRef: { current },
      fast,
      value,
    },
    { value: oldValue }
  ) {
    if (value !== oldValue) {
      value = normalize(value, fast)
      current && (current.value = inputValue(value, fast))
      return {
        editorState: stateFromValue(value, fast),
        value,
      }
    }
    return null
  }

  handleChange(editorState) {
    const {
      elementRef: { current },
      fast,
      onChange,
    } = this.props
    const value = normalize(stateToValue(editorState, fast), fast)
    // Synchronise value with input for html5 form validation
    current.value = inputValue(value, fast)
    this.setState({ editorState, value })
    onChange(value)
  }

  handleFocus(e) {
    const { onFocus } = this.props
    onFocus(e)
  }

  handleBlur(e) {
    const { onBlur } = this.props
    onBlur(e)
  }

  render(b) {
    const {
      className,
      elementRef,
      i18n,
      readOnly,
      value,
      disabled,
      onFocus,
      onBlur,
      onKeyDown,
      toolbar,
      fast, // Fast allow putting directly content state in transientItem
      placeholder,
      type,
      onChange,
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
      <div className={b}>
        <Editor
          editorClassName={b.e('editor')}
          editorState={editorState}
          localization={{
            locale: 'fr',
          }}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onEditorStateChange={this.handleChange}
          handleReturn={onKeyDown}
          placeholder={placeholder || i18n.html.placeholder}
          readOnly={readOnly || disabled}
          toolbar={HTMLToolbar}
          toolbarClassName={b.e('toolbar')}
          wrapperClassName={b.e('wrapper')}
        />
        <input
          className={b.e('hidden-input').mix(className)}
          ref={elementRef}
          {...props}
          value={inputValue(value, fast)}
          onChange={noOp}
          type="text"
        />
      </div>
    )
  }
}
