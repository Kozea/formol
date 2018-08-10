import React from 'react'

import ConditionalContextWrapper from './ConditionalContext'
import FormolContextWrapper from './FormolContext'
import { block } from './utils'
import fieldPropsAdapter from './utils/fieldPropsAdapter'
import { get } from './utils/object'

@ConditionalContextWrapper
@FormolContextWrapper
@fieldPropsAdapter
@block
export default class Field extends React.PureComponent {
  constructor(props) {
    super(props)
    this.element = React.createRef()
    this.state = {
      focus: false,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }

  componentDidMount() {
    const { name, validator, context, conditionalContext } = this.props
    context.register(name, this.element, validator)
    conditionalContext.register && conditionalContext.register(name)
  }

  componentWillUnmount() {
    const { name, context, conditionalContext } = this.props
    context.unregister(name)
    conditionalContext.unregister && conditionalContext.unregister(name)
    this.handleChange()
  }

  handleChange(value, error) {
    const {
      name,
      unformatter,
      context: { handleChange },
    } = this.props
    handleChange(name, unformatter(value), error)
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
      context: { transientItem, handleChange, handleEntered },
    } = this.props
    const value = get(transientItem, name)
    // Normalize data
    const normalized = normalizer(value)
    if (normalized !== value) {
      handleChange(name, normalized)
    }
    this.setState({
      focus: false,
    })
    handleEntered(name)
  }

  render(b) {
    const {
      name,
      value,
      type,
      modified,
      className,
      validator,
      readOnly: fieldReadOnly,
      unit,
      extras,
      formatter,
      normalizer,
      unformatter,
      children,
      context,
      conditionalContext,
      classNameModifiers,
      TypeField,
      ...props
    } = this.props

    const {
      i18n,
      errors,
      readOnly: formReadOnly,
      enteredFields,
      handleKeyDown,
    } = context

    const readOnly = formReadOnly || fieldReadOnly
    const { focus } = this.state

    const Label = TypeField.formolFieldLabelElement || 'label'
    const error =
      enteredFields.includes(name) && errors[name] ? errors[name] : null
    return (
      <div
        className={b.mix(className).m({
          type,
          name,
          error: !!error,
          readOnly,
          required: !!props.required,
          modified,
          focus,
          ...classNameModifiers.field,
        })}
      >
        <Label className={b.e('label').m(classNameModifiers.label)}>
          {children && (
            <span className={b.e('title').m(classNameModifiers.labelText)}>
              {children}
            </span>
          )}
          <TypeField
            name={name}
            value={value}
            type={type}
            readOnly={readOnly}
            i18n={i18n}
            elementRef={this.element}
            className={b.e('element')}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            onKeyDown={handleKeyDown}
            {...props}
          />
          {unit && (
            <div className={b.e('unit').m(classNameModifiers.unit)}>{unit}</div>
          )}
          {extras}
        </Label>
        {error && (
          <div className={b.e('error-text').m(classNameModifiers.error)}>
            {error}
          </div>
        )}
      </div>
    )
  }
}
