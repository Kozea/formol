import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import React from 'react'

import { block, noOp } from '../utils'

export const normalize = value =>
  value === '<p><br></p>' ? '' : value ? value.trim() : ''

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
      value,
    },
    { value: oldValue }
  ) {
    if (value !== oldValue) {
      value = normalize(value)
      current && (current.value = value)
      return {
        value,
      }
    }
    return null
  }

  handleChange(value) {
    const {
      elementRef: { current },
      onChange,
    } = this.props
    value = normalize(value)
    // Synchronise value with input for html5 form validation
    current && (current.value = value)
    this.setState({ value })
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
      disabled,
      onFocus,
      onBlur,
      onKeyDown,
      toolbar,
      placeholder,
      type,
      reactQuillRef,
      modules,
      formats,
      onChange,
      ...props
    } = this.props
    const { value } = this.state
    return (
      <div className={b}>
        <ReactQuill
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          value={value}
          onChange={this.handleChange}
          handleReturn={onKeyDown}
          placeholder={placeholder || i18n.html.placeholder}
          readOnly={readOnly || disabled}
          modules={modules}
          formats={formats}
          ref={reactQuillRef}
        />
        <input
          className={b.e('hidden-input').mix(className)}
          ref={elementRef}
          {...props}
          value={value}
          onChange={noOp}
          type="text"
        />
      </div>
    )
  }
}
