import React from 'react'

import { block } from './utils'
import { diff, get } from './utils/object'
import ConditionalContextWrapper from './ConditionalContext'
import FormolContextWrapper from './FormolContext'

let UNAMED_COUNT = 0

// These aren't static because we need to know which props has been given
const defaultProps = {
  type: 'text',
  formatter: v => v,
  normalizer: v => (v && v.trim ? v.trim() : v),
  unformatter: v => v,
  classNameModifiers: {},
}

@ConditionalContextWrapper
@FormolContextWrapper
@block
export default class Field extends React.PureComponent {
  constructor(props) {
    super(props)
    if (props.value) {
      throw new Error(
        'Do not use value on fields. ' +
          'Set a value for this field in the form item attribute.'
      )
    }
    if (!props.context.transientItem) {
      throw new Error('Field must be used inside Form')
    }

    if (props.name) {
      this.name = props.name
    } else if (typeof props.children === 'string') {
      this.name = props.children
        .toLowerCase()
        .replace(/\W+(.)/g, (match, chr) => chr.toUpperCase())
    } else {
      this.name = `field-${++UNAMED_COUNT}`
    }

    props = this.getProps(props)
    this.element = React.createRef()
    this.state = {
      focus: false,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }

  componentDidMount() {
    const { name, validator, context, conditionalContext } = this.getProps(
      this.props
    )
    context.register(name, this.element, validator)
    conditionalContext.register && conditionalContext.register(name)
  }

  componentDidUpdate(oldProps) {
    const {
      context: { transientItem: oldTransientItem },
    } = oldProps
    const {
      name,
      context: { transientItem, handleChanged },
    } = this.getProps(this.props)
    const propsDiff = diff(this.props, oldProps, Object.keys(this.props))
    if (
      get(transientItem, name) !== get(oldTransientItem, name) ||
      (Object.keys(propsDiff).length &&
        !Object.keys(propsDiff).every(prop =>
          ['context', 'conditionalContext'].includes(prop)
        ))
    ) {
      handleChanged(name)
    }
  }

  componentWillUnmount() {
    const { name, context, conditionalContext } = this.getProps(this.props)
    context.unregister(name)
    conditionalContext.unregister && conditionalContext.unregister(name)
    if (get(context.transientItem, name) !== void 0) {
      this.handleChange()
    }
  }

  getProps(rawProps) {
    // Put this in HOC?
    const props = { ...defaultProps, ...rawProps }
    const TypeField = props.context.types[props.type]
    if (!TypeField) {
      throw new Error(`Unknown type "${props.type}" for field "${this.name}"`)
    }
    const itemValue = get(props.context.item, this.name)
    const transientValue = get(props.context.transientItem, this.name)
    const value = props.formatter(transientValue)
    const propsDefaultsFromField = TypeField.defaultFieldProps
      ? Object.entries(TypeField.defaultFieldProps).reduce(
          (newProps, [name, getter]) => {
            newProps[name] = getter(props, value)
            return newProps
          },
          {}
        )
      : {}

    return {
      name: this.name,
      value,
      modified: itemValue !== transientValue,
      TypeField,
      ...defaultProps,
      ...propsDefaultsFromField,
      ...rawProps,
      ...props.conditionalContext.propsOverride,
    }
  }

  handleChange(value, error) {
    const {
      name,
      unformatter,
      context: { handleChange },
    } = this.getProps(this.props)
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
    } = this.getProps(this.props)
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
    } = this.getProps(this.props)

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
