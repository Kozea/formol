import React from 'react'
import deepEqual from 'deep-equal'

import { FormolContext } from './FormolContext'
import { block } from './utils'
import { get, insert, isModified } from './utils/object'
import CalendarField from './fields/CalendarField'
import CheckboxField from './fields/CheckboxField'
import CheckboxSetField from './fields/CheckboxSetField'
import ColorField from './fields/ColorField'
import DateField from './fields/DateField'
import DatetimeLocalField from './fields/DatetimeLocalField'
import EmailField from './fields/EmailField'
import FileField from './fields/FileField'
import HTMLField from './fields/HTMLField'
import InputField from './fields/InputField'
import MoneyField from './fields/MoneyField'
import MonthField from './fields/MonthField'
import NumberField from './fields/NumberField'
import PasswordField from './fields/PasswordField'
import PasswordStrengthField from './fields/PasswordStrengthField'
import RadioField from './fields/RadioField'
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
const emptyItem = {}

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
    'datetime-local': DatetimeLocalField,
    month: MonthField,
    week: WeekField,
    range: RangeField,
    money: MoneyField,
    calendar: CalendarField,
    switch: SwitchField,
    html: HTMLField,
    radio: RadioField,
    'radio-set': RadioSetField,
    checkbox: CheckboxField,
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
    item: emptyItem,
    types: {},
    i18n: 'en',
    classes: {},
  }

  constructor(props) {
    super(props)
    const { item, types, i18n, readOnly } = props
    this.form = React.createRef()
    this.mounted = false

    this.fields = {
      names: [],
      elements: {},
      validators: {},
      validityErrors: {},
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
        enteredFields: [],
        register: this.register.bind(this),
        unregister: this.unregister.bind(this),
        handleEntered: this.handleEntered.bind(this),
        handleChange: this.handleChange.bind(this),
        handleChanged: this.handleChanged.bind(this),
      },
      modified: false,
      _i18nKey: props.i18n,
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
    if (nextProps.i18n !== prevState._i18nKey) {
      context.i18n = Formol.i18n[nextProps.i18n]
    }
    if (Object.keys(context).length) {
      return {
        context: { ...prevState.context, ...context },
        modified,
        _i18nKey: nextProps.i18n,
      }
    }
    return null
  }

  componentDidMount() {
    this.mounted = true
  }

  componentDidUpdate() {
    const { errors } = this.state.context
    if (errors === errorsUnknown) {
      this.handleChanged()
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  register(name, element, validator, validityErrors) {
    this.fields.names.push(name)
    this.fields.elements[name] = element
    this.fields.validators[name] = validator
    this.fields.validityErrors[name] = validityErrors
  }

  unregister(name) {
    this.fields.names.splice(this.fields.names.indexOf(name), 1)
    delete this.fields.elements[name]
    delete this.fields.validators[name]
    delete this.fields.validityErrors[name]
  }

  setStateNewItem(transientItem, extra = {}) {
    const { item, onChange } = this.props
    const modified = isModified(transientItem, item, this.fields.names)
    this.setStateContext({ transientItem, ...extra }, { modified })
    onChange && onChange(transientItem)
  }

  asyncSetState(state) {
    return new Promise(resolve => this.setState(state, resolve))
  }

  setStateContext(context, extra = {}) {
    this.setState(({ context: prevContext }) => ({
      context: { ...prevContext, ...context },
      ...extra,
    }))
  }

  handleCancel() {
    const { item } = this.props
    this.setStateNewItem({ ...item }, { enteredFields: [] })
  }

  handleEntered(name) {
    const { enteredFields } = this.state.context
    this.setStateContext({
      enteredFields: [...enteredFields.filter(field => field !== name), name],
    })
  }

  async handleSubmit(e) {
    const { item, allowUnmodifiedSubmit, onSubmit } = this.props
    const { modified } = this.state
    const { transientItem } = this.state.context

    e.preventDefault()
    if (!modified && !allowUnmodifiedSubmit) {
      return
    }

    await this.asyncSetState({ loading: true })
    const errors =
      (await onSubmit(transientItem, item, this.fields.names, modified)) || {}
    if (!this.mounted) {
      // Protect from unmounting in onSubmit
      return
    }
    await this.asyncSetState({ loading: false })
    if (
      (errors && errors.constructor !== Object) ||
      Object.values(errors).some(v => v && typeof v !== 'string')
    ) {
      console.error(
        'onSubmit return value must be a mapping of server errors ' +
          "(ie: { fieldName: 'error' }) got:",
        errors
      )
      return
    }
    // Setting errors or removing them if there are no more
    this.setStateContext({ errors })

    if (!Object.keys(errors).length) {
      // No errors on submit
      if (item === emptyItem) {
        // Resetting form if no item was given
        this.handleCancel()
      }
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
    const errors = this.validateForm()
    this.setStateContext({ errors })
  }

  validateForm() {
    const { validator } = this.props
    const { transientItem } = this.state.context
    const { elements, validators, validityErrors } = this.fields

    const normalize = v => (typeof v === 'string' && v ? v : '')
    // Resetting all custom validity before validation
    Object.entries(elements).forEach(
      ([name, { current }]) =>
        current && !this.errorsFromFields[name] && current.setCustomValidity('')
    )
    return Object.entries(elements).reduce(
      (validity, [name, { current }]) => {
        if (validators[name]) {
          validity[name] =
            normalize(validators[name](transientItem[name])) ||
            normalize(validity[name])
        }
        validity[name] = validity[name] || ''
        if (current) {
          if (current.checkValidity()) {
            current.setCustomValidity(validity[name])
          } else {
            // If there's already a DOM validation error
            validity[name] =
              (validityErrors[name] &&
                validityErrors[name](current.validity)) ||
              current.validationMessage
          }
        }
        return validity
      },
      validator ? validator(transientItem) : {}
    )
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
      classes,
      onSubmit,
    } = this.props
    const { loading, context, modified } = this.state
    return (
      <form
        className={b.mix(className).m({
          loading,
          errors: !!Object.values(context.errors).some(e => e),
        })}
        onSubmit={this.handleSubmit}
        ref={this.form}
      >
        <FormolContext.Provider value={context}>
          {children}
        </FormolContext.Provider>
        {!readOnly && onSubmit && (
          <>
            <button
              className={b.e('submit').mix(classes.submit)}
              disabled={!modified && !allowUnmodifiedSubmit}
              type="submit"
            >
              {submitText || context.i18n.submit}
            </button>
            {!noCancel && (
              <button
                onClick={this.handleCancel}
                className={b.e('cancel').mix(classes.cancel)}
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
