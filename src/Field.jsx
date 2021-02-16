import React from 'react'
import { FaQuestionCircle } from 'react-icons/fa'

import { block } from './utils'
import fieldPropsAdapter from './utils/fieldPropsAdapter'

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
    const { register, name, validator, validityErrors } = this.props
    register(name, this.element, validator, validityErrors)
  }

  componentWillUnmount() {
    const { unregister, name } = this.props
    unregister(name)
    this.handleChange()
  }

  handleChange(value, error) {
    const { name, unformatter, handleChange } = this.props
    handleChange(name, unformatter(value), error)
  }

  handleFocus() {
    this.setState({
      focus: true,
    })
  }

  handleBlur() {
    const { name, value, normalizer, handleChange, handleEntered } = this.props
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
      title,
      modified,
      className,
      validator,
      readOnly,
      disabled,
      unit,
      extras,
      formatter,
      normalizer,
      unformatter,
      children,
      classNameModifiers,
      TypeField,
      i18n,
      error,
      validityErrors,
      handleChange,
      handleEntered,
      register,
      unregister,
      ...props
    } = this.props

    const { focus } = this.state

    const Label = TypeField.formolFieldLabelElement || 'label'
    return (
      <div
        className={b.mix(className).m({
          type,
          name,
          error: !!error,
          disabled,
          readOnly,
          required: !!props.required,
          modified,
          focus,
          ...classNameModifiers.field,
        })}
      >
        <Label
          className={b.e('label').m(classNameModifiers.label)}
          title={title}
          onClick={evt => {
            /*
              To prevent the calendar from not closing when the datepicker is
              wrapped inside label. See this issue
              https://github.com/Hacker0x01/react-datepicker/issues/1012#issuecomment-735342311
            */
            if (type === 'date' && evt.target.id !== 'labelContent') {
              evt.preventDefault()
            }
          }}
        >
          {children && (
            <span
              className={b.e('title').m(classNameModifiers.labelText)}
              id="labelContent"
            >
              {children}
              {title && <FaQuestionCircle />}
            </span>
          )}
          <TypeField
            name={name}
            value={value}
            type={type}
            disabled={disabled}
            readOnly={readOnly}
            i18n={i18n}
            elementRef={this.element}
            className={b.e('element')}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
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
