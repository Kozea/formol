import './Field.sass'

import React from 'react'

import InputField from './fields/InputField'
import FormolContextWrapper from './FormolContext'
import { block } from './utils'
import { get } from './utils/object'

@block
class Field extends React.Component {
  static defaultProps = {
    formatter: v => (v && v.trim ? v.trim() : v),
    normalizer: v => v,
    unformatter: v => v,
  }

  constructor(props) {
    super(props)
    if (props.value) {
      throw new Error(
        `Do not use value on fields.
        Set a value for this field in the form item attribute.`
      )
    }
    this.element = React.createRef()
    this.state = {
      focus: false,
      alreadyFocused: false,
    }
    // Antipattern ahead, setting field info to form context
    props.context.elements[props.name] = this.element
    props.context.validators[props.name] = props.validator

    this.handleChange = this.handleChange.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }

  componentDidUpdate({ context: { transientItem: oldTransientItem } }) {
    const {
      name,
      context: { transientItem, handleChanged },
    } = this.props

    if (get(transientItem, name) !== get(oldTransientItem, name)) {
      handleChanged(name)
    }
  }

  handleChange(value) {
    const {
      name,
      unformatter,
      context: { handleChange },
    } = this.props
    handleChange(name, unformatter(value))
  }

  handleFocus() {
    this.setState({
      focus: true,
    })
  }

  handleBlur() {
    const {
      name,
      normalizer,
      context: { transientItem, handleChange },
    } = this.props
    // Normalize data
    const value = get(transientItem, name)
    const normalized = normalizer(value)
    if (normalized !== value) {
      handleChange(name, normalized)
    }
    this.setState({
      focus: false,
      alreadyFocused: true,
    })
  }

  render(b) {
    const {
      name,
      type,
      className,
      validator, // eslint-disable-line no-unused-vars
      extras,
      formatter,
      normalizer, // eslint-disable-line no-unused-vars
      unformatter, // eslint-disable-line no-unused-vars
      children,
      context,
      ...props
    } = this.props

    const {
      item,
      transientItem,
      fields,
      i18n,
      errors,
      readOnly,
      handleKeyDown,
    } = context
    const { focus, alreadyFocused } = this.state

    if (!transientItem) {
      throw new Error('Field must be used inside Form')
    }
    const itemValue = get(item, name)
    const transientValue = get(transientItem, name)
    const modified = itemValue !== transientValue
    const value = formatter(transientValue)

    const TypeField = fields[type] || InputField
    const Label = TypeField.formolFieldLabelElement || 'label'
    const error = alreadyFocused || errors[name] ? errors[name] : null

    return (
      <div
        className={b.mix(className).m({
          type,
          name,
          error: !!error,
          readOnly,
          modified,
          focus,
        })}
      >
        <Label className={b.e('label')}>
          <TypeField
            name={name}
            value={value}
            type={type}
            readOnly={readOnly}
            i18n={i18n}
            elementRef={this.element}
            className={b.e('field')}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            onKeyDown={handleKeyDown}
            {...props}
          />
          {children && <span className={b.e('label-text')}>{children}</span>}
          {extras}
        </Label>
        {error && <div className={b.e('error')}>{error}</div>}
      </div>
    )
  }
}

export default FormolContextWrapper(Field)
