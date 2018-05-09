import './Field.sass'

import React from 'react'

import InputField from './fields/InputField'
import FormolContextWrapper from './FormolContext'
import { block } from './utils'
import { get } from './utils/object'

@block
class Field extends React.Component {
  static defaultProps = {
    formatter: v => v,
    valueFormatter: v => v,
  }

  constructor(props) {
    super(props)
    if (props.value) {
      throw new Error(
        `Do not use value on fields.
        Set a value for this field in the form item attribute.`
      )
    }
  }

  componentWillUnmount() {
    // This is mandatory for removing values when using Conditional
    const {
      name,
      context: { handleChange },
    } = this.props
    handleChange(name, void 0)
  }

  render(b) {
    const {
      name,
      type,
      className,
      customValidator,
      extras,
      formatter,
      valueFormatter,
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
      focused,
      readOnly,
      handleFocus,
      handleBlur,
      handleKeyDown,
      handleChange,
    } = context

    if (!transientItem) {
      throw new Error('Field must be used inside Form')
    }
    const itemValue = get(item, name)
    const transientValue = get(transientItem, name)
    const modified = itemValue !== transientValue
    const value = formatter(transientValue)
    const focus = focused === name
    const error = errors[name]

    const TypeField = fields[type] || InputField
    const Label = TypeField.formolFieldLabelElement || 'label'

    return (
      <div
        className={b.mix(className).m({
          type,
          name,
          error: !!error,
          readOnly,
          modified,
        })}
      >
        <Label className={b.e('label')}>
          <TypeField
            name={name}
            value={value}
            type={type}
            readOnly={readOnly}
            i18n={i18n}
            className={b.e('field').m({ type, focus, modified })}
            onFocus={e => handleFocus(name, e)}
            onBlur={e => handleBlur(name, e)}
            onChange={(v, target) => {
              v = valueFormatter(v)
              customValidator &&
                target &&
                target.setCustomValidity(customValidator(v, transientItem))
              return handleChange(name, v)
            }}
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
