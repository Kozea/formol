import './Field.sass'

import PropTypes from 'prop-types'
import React from 'react'

import CalendarField from './fields/CalendarField'
import FileField from './fields/FileField'
import HTMLField from './fields/HTMLField'
import PasswordField from './fields/PasswordField'
import SelectField from './fields/SelectField'
import SwitchField from './fields/SwitchField'
import { block } from './utils'
import { get } from './utils/object'

const b = block('Field')

export default function Field(
  {
    asyncChoices,
    children,
    choiceGetter,
    choices,
    customValidator,
    extras,
    fieldsetClassName,
    formatter,
    name,
    sub,
    type,
    value,
    valueFormatter,
    values,
    ...props
  },
  {
    edited,
    editedHtml,
    item,
    refs,
    errors,
    focused,
    state,
    readOnly,
    handleFocus,
    handleBlur,
    handleChange,
    handleSubmit,
  }
) {
  if (!edited) {
    throw new Error('Field must be used inside Form')
  }
  const modified = get(item, name) !== get(edited, name)

  let input
  if (values) {
    input = (
      <div className={b.e('group')}>
        {Object.entries(values).map(([key, val]) => (
          <Field key={key} name={name} type={type} value={val} sub {...props}>
            {key}
          </Field>
        ))}
      </div>
    )
  } else {
    const valueProp = {}
    if (sub) {
      valueProp.checked = get(edited, name) === value
    } else if (['checkbox', 'switch'].includes(type)) {
      valueProp.checked = get(edited, name)
      valueProp.id = name
    } else {
      valueProp.value =
        (formatter && formatter(get(edited, name))) || get(edited, name)
    }
    const getVal = e => {
      let rv
      if (sub) {
        rv = value
      } else if (['checkbox', 'switch'].includes(type)) {
        rv = e.target.checked
      } else if (type === 'select-menu') {
        rv = e
      } else {
        rv = e.target.value
      }
      if (type === 'number') {
        rv = +rv
      }
      if (type === 'money') {
        rv = +rv.replace(/[^0-9.-]+/g, '')
      }
      if (type === 'select' && rv === '') {
        rv = null
      }
      return valueFormatter ? valueFormatter(rv) : rv
    }
    const commonProps = {
      name: name,
      ref: ref => (refs[name] = ref),
      readOnly,
      className: b.e('field').m({
        type,
        focus: focused === name,
        modified,
        loading:
          (modified && (state && state.loading)) ||
          (asyncChoices && asyncChoices.loading),
      }),
      onFocus: e => handleFocus(name, e),
      onBlur: e => handleBlur(name, e),
      onChange: e => handleChange(name, getVal(e)),
      onKeyDown: e => {
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
      },
      onInput: e => {
        if (customValidator) {
          e.target.setCustomValidity(
            customValidator(getVal(e), edited, editedHtml)
          )
        }
      },
    }
    if (['checkbox', 'radio', 'switch'].includes(type)) {
      commonProps.disabled = commonProps.readOnly
    }

    if (['select', 'select-menu'].includes(type)) {
      if (asyncChoices && !asyncChoices.loading) {
        choices = asyncChoices.objects.map(choiceGetter)
      } else {
        choices = choices || []
      }
    }

    if (type === 'html') {
      input = (
        <HTMLField
          {...props}
          {...commonProps}
          {...valueProp}
          value={editedHtml[name]}
        />
      )
    } else if (type === 'area') {
      input = <textarea {...props} {...commonProps} {...valueProp} />
    } else if (type === 'calendar') {
      input = <CalendarField {...props} {...commonProps} {...valueProp} />
    } else if (type === 'file') {
      input = <FileField {...props} {...commonProps} {...valueProp} />
    } else if (type === 'files') {
      input = <FileField multiple {...props} {...commonProps} {...valueProp} />
    } else if (type === 'password') {
      input = <PasswordField {...props} {...commonProps} {...valueProp} />
    } else if (type === 'select') {
      input = (
        <select
          {...props}
          {...commonProps}
          {...valueProp}
          disabled={readOnly /* There's no readOnly */}
        >
          {choices.every(([k]) => k) && <option value="" />}
          {choices.map(([key, val]) => (
            <option key={key} value={key}>
              {val}
            </option>
          ))}
        </select>
      )
    } else if (type === 'select-menu') {
      input = (
        <SelectField
          choices={choices}
          name={name}
          choiceGetter={choiceGetter}
          {...props}
          {...commonProps}
          {...valueProp}
        />
      )
    } else if (type === 'switch') {
      input = (
        <SwitchField name={name} {...props} {...commonProps} {...valueProp} />
      )
    } else {
      input = (
        <input
          {...props}
          type={type || 'text'}
          {...commonProps}
          {...valueProp}
        />
      )
    }
  }
  if (sub) {
    return (
      <label className={b.e('label').m({ on: get(edited, name) === value })}>
        {input}
        {children}
        {extras}
      </label>
    )
  }

  const Label = type && type.match(/files?/) ? 'span' : 'label'

  const error = errors[name]
  return (
    <fieldset
      className={b.m({
        type,
        name,
        error: !!error,
        readOnly,
        modified,
        group: !!values,
        [fieldsetClassName]: !!fieldsetClassName,
      })}
    >
      <Label className={b.e('label')}>
        {input}
        {children && <span className={b.e('label-text')}>{children}</span>}
        {extras}
      </Label>
      {error && <div className={b.e('error')}>{error}</div>}
    </fieldset>
  )
}

Field.contextTypes = {
  edited: PropTypes.object,
  item: PropTypes.object,
  editedHtml: PropTypes.object,
  refs: PropTypes.object,
  errors: PropTypes.object,
  focused: PropTypes.string,
  state: PropTypes.object,
  readOnly: PropTypes.bool,
  handleFocus: PropTypes.func,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
}
