import './Field.sass'

import React from 'react'

import BooleanField from './fields/BooleanField'
import CalendarField from './fields/CalendarField'
import CheckboxesField from './fields/CheckboxesField'
import FileField from './fields/FileField'
import HTMLField from './fields/HTMLField'
import InputField from './fields/InputField'
import NumberField from './fields/NumberField'
import PasswordField from './fields/PasswordField'
import RadiosField from './fields/RadiosField'
import SelectField from './fields/SelectField'
import SelectMenuField from './fields/SelectMenuField'
import SwitchField from './fields/SwitchField'
import TextareaField from './fields/TextareaField'
import { block } from './utils'
import { get } from './utils/object'

const Fields = {
  text: InputField,
  number: NumberField,
  range: NumberField,
  html: HTMLField,
  area: TextareaField,
  calendar: CalendarField,
  file: FileField,
  files: FileField,
  'password-strengh': PasswordField,
  select: SelectField,
  'select-menu': SelectMenuField,
  switch: SwitchField,
  radio: BooleanField,
  checkbox: BooleanField,
  radios: RadiosField,
  checkboxes: CheckboxesField,
}

@block
export default class Field extends React.Component {
  static defaultProps = {
    formatter: v => v,
    valueFormatter: v => v,
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
      refs,
      errors,
      focused,
      readOnly,
      handleFocus,
      handleBlur,
      handleChange,
      handleSubmit,
    } = context
    if (!transientItem) {
      throw new Error('Field must be used inside Form')
    }

    const itemValue = get(item, name)
    const transientValue = get(transientItem, name)
    const modified = itemValue !== transientValue
    const error = errors[name]

    const TypeField = Fields[type] || InputField
    const Label = TypeField.formolFieldLabelElement || 'label'
    return (
      <fieldset
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
            value={formatter(transientValue)}
            type={type}
            ref={ref => (refs[name] = ref)}
            readOnly={readOnly}
            className={b.e('field').m({
              type,
              focus: focused === name,
              modified,
            })}
            onFocus={e => handleFocus(name, e)}
            onBlur={e => handleBlur(name, e)}
            onChange={v => {
              v = valueFormatter(v)
              customValidator &&
                refs[name].setCustomValidity(customValidator(v, transientItem))
              return handleChange(name, v)
            }}
            onKeyDown={e => {
              // This is not registered on most external fields
              if (e.keyCode === 13 && (e.shiftKey || type !== 'area')) {
                const fields = Object.keys(refs)
                const current = fields.indexOf(name)

                for (let i = current + 1; i < current + fields.length; i++) {
                  const nextName = fields[i % fields.length]
                  const next = refs[nextName]
                  if (nextName === 'submit') {
                    handleSubmit(e)
                    break
                  }
                  if (
                    nextName !== 'form' &&
                    next.offsetParent !== null &&
                    next.focus
                  ) {
                    next.focus()
                    e.preventDefault()
                    break
                  }
                }
              }
            }}
            {...props}
          />
          {children && <span className={b.e('label-text')}>{children}</span>}
          {extras}
        </Label>
        {error && <div className={b.e('error')}>{error}</div>}
      </fieldset>
    )
  }
}
