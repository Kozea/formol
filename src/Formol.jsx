import React from 'react'
import deepEqual from 'deep-equal'

import { FormolContext } from './FormolContext'
import { block } from './utils'
import { get, insert, isModified } from './utils/object'
import BooleanField from './fields/BooleanField'
import CalendarField from './fields/CalendarField'
import CheckboxSetField from './fields/CheckboxSetField'
import ColorField from './fields/ColorField'
import DateField from './fields/DateField'
import DatetimeLocalField from './fields/DatetimeLocalField'
import EmailField from './fields/EmailField'
import FileField from './fields/FileField'
import HTMLField from './fields/HTMLField'
import InputField from './fields/InputField'
import MonthField from './fields/MonthField'
import NumberField from './fields/NumberField'
import PasswordField from './fields/PasswordField'
import PasswordStrengthField from './fields/PasswordStrengthField'
import RadioSetField from './fields/RadioSetField'
import RangeField from './fields/RangeField'
import SelectField from './fields/SelectField'
import SelectMenuField from './fields/SelectMenuField'
import SwitchField from './fields/SwitchField'
import TelField from './fields/TelField'
import TextareaField from './fields/TextareaField'
import TimeField from './fields/TimeField'
import WeekField from './fields/WeekField'
import en from './i18n/en'
import fr from './i18n/fr'

// This is a tracer to validate form post first time render.
const errorsUnknown = {}

@block
export default class Formol extends React.PureComponent {
  static defaultTypes = {
    text: InputField,
    area: TextareaField,
    email: EmailField,
    number: NumberField,
    password: PasswordField,
    'password-strength': PasswordStrengthField,
    tel: TelField,
    color: ColorField,
    date: DateField,
    time: TimeField,
    datetimelocal: DatetimeLocalField,
    month: MonthField,
    week: WeekField,
    range: RangeField,
    calendar: CalendarField,
    switch: SwitchField,
    html: HTMLField,
    radio: BooleanField,
    'radio-set': RadioSetField,
    checkbox: BooleanField,
    'checkbox-set': CheckboxSetField,
    file: FileField,
    select: SelectField,
    'select-menu': SelectMenuField,
  }

  static i18n = {
    en,
    fr,
  }

  static defaultProps = {
    item: {},
    types: {},
    i18n: 'en',
    focusNextOnEnter: false,
  }

  constructor(props) {
    super(props)
    const { item, types, i18n, readOnly } = props
    this.form = React.createRef()
    this.submit = React.createRef()

    this.fields = {
      names: [],
      elements: {},
      validators: {},
    }

    this.state = {
      loading: false,
      context: {
        item,
        transientItem: { ...item },
        types: { ...Formol.defaultTypes, ...types },
        i18n: Formol.i18n[i18n],
        errors: errorsUnknown,
        readOnly,
        register: this.register.bind(this),
        unregister: this.unregister.bind(this),
        handleKeyDown: this.handleKeyDown.bind(this),
        handleChange: this.handleChange.bind(this),
        handleChanged: this.handleChanged.bind(this),
      },
      modified: false,
    }
    this.errorsFromFields = {}
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const context = {}
    let { modified } = prevState
    if (!deepEqual(nextProps.item, prevState.context.item)) {
      context.item = nextProps.item
      context.transientItem = { ...nextProps.item }
      context.errors = errorsUnknown
      modified = false
    }
    if (nextProps.readOnly !== prevState.context.readOnly) {
      context.readOnly = nextProps.readOnly
    }
    const nextTypes = { ...Formol.defaultTypes, ...nextProps.types }
    if (
      Object.entries(nextTypes).some(
        ([k, v]) => v !== prevState.context.types[k]
      )
    ) {
      context.types = nextTypes
    }
    if (nextProps.i18n !== prevState.context.i18n) {
      context.i18n = Formol.i18n[nextProps.i18n]
    }
    if (Object.keys(context).length) {
      return { context: { ...prevState.context, ...context }, modified }
    }
    return null
  }

  componentDidUpdate() {
    const { errors } = this.state.context
    if (errors === errorsUnknown) {
      this.handleChanged()
    }
  }

  register(name, element, validator) {
    this.fields.names.push(name)
    this.fields.elements[name] = element
    this.fields.validators[name] = validator
  }

  unregister(name) {
    if (this.fields.names.includes(name)) {
      this.fields.names.splice(this.fields.names.indexOf(name), 1)
    }
    delete this.fields.elements[name]
    delete this.fields.validators[name]
  }

  setStateNewItem(transientItem) {
    const { item, onChange } = this.props
    const modified = isModified(transientItem, item, this.fields.names)
    this.setStateContext({ transientItem }, { modified })
    onChange && onChange(transientItem)
  }

  setStateContext(context, extra = {}) {
    this.setState({ context: { ...this.state.context, ...context }, ...extra })
  }

  handleCancel() {
    const { item } = this.props
    this.setStateNewItem({ ...item })
  }

  async handleSubmit() {
    const { item, onSubmit } = this.props
    const { transientItem } = this.state.context
    const { current: form } = this.form
    this.validateForm()
    if (form.checkValidity()) {
      this.setState({ loading: true })
      const errors =
        (await onSubmit(transientItem, item, this.fields.names)) || {}
      this.setState({ loading: false })
      if (errors) {
        if (
          errors.constructor !== Object ||
          Object.values(errors).some(v => v && typeof v !== 'string')
        ) {
          console.error(
            `onSubmit return value must be a mapping of server errors
            (ie: { fieldName: 'error' }) got:`,
            errors
          )
        } else {
          this.setStateContext({ errors })
        }
      }
    } else if (form.reportValidity) {
      form.reportValidity()
    } else {
      // Would be better to always use form.reportValidity
      // but browser support is not as good
      this.submit.current && this.submit.current.click()
    }
  }

  handleChange(name, value, error) {
    const {
      context: { transientItem },
    } = this.state
    const { names, elements } = this.fields
    if (error !== void 0) {
      this.errorsFromFields[name] = error
      if (error !== elements[name].current.validationMessage) {
        elements[name].current.setCustomValidity(error)
      }
    }
    if (get(transientItem, name) !== value) {
      const newTransientItem = insert(transientItem, name, value, names)
      this.setStateNewItem(newTransientItem)
    }
  }

  handleChanged() {
    const { transientItem } = this.state.context
    const errors = this.validateForm(transientItem)
    this.setStateContext({ errors })
  }

  validateForm(newTransientItem) {
    const { validator } = this.props
    const { transientItem } = this.state.context
    const { elements, validators } = this.fields
    const item = newTransientItem || transientItem
    const normalize = v => (typeof v === 'string' && v ? v : '')
    // Resetting all custom validity before validation
    Object.entries(elements).forEach(
      ([name, { current }]) =>
        current && !this.errorsFromFields[name] && current.setCustomValidity('')
    )
    return Object.entries(elements).reduce((validity, [name, { current }]) => {
      if (validators[name]) {
        validity[name] =
          normalize(validators[name](item[name])) || normalize(validity[name])
      }
      validity[name] = validity[name] || ''
      if (current) {
        if (current.checkValidity()) {
          current.setCustomValidity(validity[name])
        } else {
          // If there's already a DOM validation error
          validity[name] = current.validationMessage
        }
      }
      return validity
    }, validator ? validator(item) : {})
  }

  handleKeyDown(e) {
    const { focusNextOnEnter } = this.props
    if (focusNextOnEnter && e.keyCode === 13) {
      // GORE HACK but it makes everything simpler
      const focused = e.target
      if (!e.ctrlKey) {
        if (focused.tagName === 'TEXTAREA') {
          return
        }
        if (focused.getAttribute('contenteditable')) {
          return
        }
      }
      const fields = [...this.form.current.querySelectorAll('.Formol_Field')]
      const focusables = fields.map(field => [
        ...field.querySelectorAll(`
            input:not([disabled]):not([tabindex='-1']),
            select:not([disabled]):not([tabindex='-1']),
            textarea:not([disabled]):not([tabindex='-1']),
            [tabindex]:not([tabindex='-1']),
            [contentEditable=true]:not([tabindex='-1'])
          `),
      ])
      const focusedFieldIndex = focusables.findIndex(focusableFields =>
        focusableFields.includes(focused)
      )
      const step = e.shiftKey ? -1 : +1
      const nextFieldIndex = (focusedFieldIndex + step) % fields.length
      if (step === 1 && focusedFieldIndex === fields.length - 1) {
        this.handleSubmit(e)
        e.preventDefault()
        return false
      }
      // Let's focus the first focusable
      const [nextFieldFirstFocusable] = focusables[nextFieldIndex]
      nextFieldFirstFocusable.focus()
      e.preventDefault()
      return false
    }
  }

  render(b) {
    const {
      children,
      className,
      readOnly,
      submitText,
      cancelText,
      noCancel,
      allowUnmodifiedSubmit,
      extra,
    } = this.props
    const { loading, context, modified } = this.state
    return (
      <form
        className={b.mix(className).m({
          loading,
          errors: !!Object.values(context.errors).some(e => e),
        })}
        onSubmit={e => e.preventDefault()}
        ref={this.form}
      >
        <FormolContext.Provider value={context}>
          {children}
        </FormolContext.Provider>
        {!readOnly && (
          <>
            {/* This input is required to validate the form
              if reportValidity isn't available */}
            <input
              type="submit"
              ref={this.submit}
              style={{ display: 'none' }}
            />
            <button
              onClick={this.handleSubmit}
              className={b.e('submit')}
              disabled={!modified || allowUnmodifiedSubmit}
              type="button"
            >
              {submitText || context.i18n.submit}
            </button>
            {!noCancel && (
              <button
                onClick={this.handleCancel}
                className={b.e('cancel')}
                disabled={!modified}
                type="button"
              >
                {cancelText || context.i18n.cancel}
              </button>
            )}
          </>
        )}
        {extra && extra(this.state)}
      </form>
    )
  }
}
