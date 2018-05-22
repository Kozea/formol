import './Formol.sass'

import deepEqual from 'deep-equal'
import React, { Fragment } from 'react'

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
import { FormolContext } from './FormolContext'
import en from './i18n/en'
import fr from './i18n/fr'
import { block } from './utils'
import {
  alignKeysRec,
  clone,
  diffObject,
  get,
  nullVoidValuesRec,
  set,
} from './utils/object'

@block
export default class Formol extends React.Component {
  static defaultFields = {
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
    fields: {},
    i18n: 'en',
    focusNextOnEnter: false,
    getPk: item => item,
    onError: console.error.bind(console),
  }

  static fromItem(item) {
    return nullVoidValuesRec(clone(item))
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const context = {}
    if (!deepEqual(nextProps.item, prevState.context.item)) {
      context.item = nextProps.item
      context.transientItem = Formol.fromItem(nextProps.item)
    }
    if (nextProps.readOnly !== prevState.context.readOnly) {
      context.readOnly = nextProps.readOnly
    }
    if (nextProps.fields !== prevState.context.fields) {
      context.fields = { ...Formol.defaultFields, ...nextProps.fields }
    }
    if (nextProps.i18n !== prevState.context.i18n) {
      context.i18n = Formol.i18n[nextProps.i18n]
    }
    if (Object.keys(context).length) {
      return { context: { ...prevState.context, ...context } }
    }
    return null
  }

  constructor(props) {
    super(props)
    const { item, fields, i18n, readOnly } = props
    this.form = React.createRef()
    this.submit = React.createRef()
    this.state = {
      disablePrompt: false,
      context: {
        item,
        transientItem: Formol.fromItem(item),
        fields: { ...Formol.defaultFields, ...fields },
        elements: {},
        validators: {},
        i18n: Formol.i18n[i18n],
        errors: {},
        readOnly,
        handleKeyDown: this.handleKeyDown.bind(this),
        handleChange: this.handleChange.bind(this),
        handleChanged: this.handleChanged.bind(this),
      },
    }
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  setStateNewItem(transientItem) {
    const { onChange } = this.props
    this.setStateContext({ transientItem })
    onChange && onChange(transientItem)
  }

  setStateContext(context) {
    this.setState({ context: { ...this.state.context, ...context } })
  }

  handleCancel() {
    const { item } = this.props
    this.setStateNewItem(Formol.fromItem(item))
  }

  async handleSubmit() {
    const {
      add,
      getPk,
      item,
      noRecursiveKeys,
      forceAlwaysSubmit,
      onCreate,
      onPatch,
      onSubmit,
    } = this.props
    const { transientItem } = this.state.context
    this.validateForm() // TODO: Remove if useless
    if (this.form.current && this.form.current.checkValidity()) {
      if (onSubmit) {
        try {
          const report = await onSubmit(transientItem)
          if (report === false) {
            // We manually force return at some point
            return
          }
          if (report.metadata.code === 202) {
            this.setStateContext({
              errors: report.metadata.errors[0].fields,
            })
            throw new Error('Validation error')
          }
          this.handleNoError()
        } catch (err) {
          this.handleError(err)
        }
      } else if (add) {
        this.setState({ disablePrompt: true })
        try {
          const report = await onCreate(transientItem)
          if (report === false) {
            // We manually force return at some point
            return
          }
          if (report.metadata.code === 202) {
            this.setStateContext({
              errors: report.metadata.errors[0].fields,
            })
            throw new Error('Validation error')
          }
          this.handleNoError()
        } catch (err) {
          this.handleError(err)
        }
        this.setState({ disablePrompt: false })
      } else if (forceAlwaysSubmit || !deepEqual(item, transientItem)) {
        const pk = getPk(item)
        const diff = diffObject(transientItem, item, noRecursiveKeys)
        try {
          const report = await onPatch(pk, diff)
          if (report === false) {
            // We manually force return at some point
            return
          }
          if (report.metadata.code === 202) {
            this.setStateContext({
              errors: report.metadata.errors[0].fields,
            })
            throw new Error('Validation error')
          }
          this.handleNoError()
        } catch (err) {
          this.handleError(err)
        }
      }
    } else if (this.form.current.reportValidity) {
      this.form.current.reportValidity()
    } else {
      // Would be better to always use this.form.current.reportValidity
      // but browser support is not as good
      this.submit.current && this.submit.current.click()
    }
  }

  handleChange(name, value) {
    const {
      context: { transientItem },
    } = this.state
    if (get(transientItem, name) !== value) {
      const newtransientItem = clone(transientItem)
      set(newtransientItem, name, value)
      this.setStateNewItem(newtransientItem)
    }
  }

  handleChanged() {
    const { transientItem } = this.state.context
    const errors = this.validateForm(transientItem)
    this.setStateContext({ errors })
  }

  validateForm(newTransientItem) {
    const { validator } = this.props
    const { transientItem, elements, validators } = this.state.context
    const item = newTransientItem || transientItem
    const normalize = v => (typeof v === 'string' && v ? v : '')

    return Object.entries(elements).reduce((validity, [name, { current }]) => {
      if (validators[name]) {
        validity[name] =
          normalize(validators[name](item[name])) || normalize(validity[name])
      }
      validity[name] = validity[name] || ''

      if (current) {
        // If there's already a DOM validation error
        if (
          current.validity &&
          // Can't use Object.values here...
          [
            'patternMismatch',
            'rangeOverflow',
            'rangeUnderflow',
            'stepMismatch',
            'tooLong',
            'typeMismatch',
            'valueMissing',
          ].some(key => current.validity[key])
        ) {
          validity[name] = current.validationMessage
        } else {
          current.setCustomValidity(validity[name])
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

  handleError(err) {
    const {
      noNotifications,
      noErrorNotification,
      errorNotificationText,
      onError,
    } = this.props
    console.error(err)
    noNotifications || noErrorNotification || onError(errorNotificationText)
  }

  handleNoError() {
    const {
      item,
      noNotifications,
      noValidNotification,
      validNotificationText,
      onValid,
    } = this.props
    // We reset form from state since it must be synced with the server
    this.setStateNewItem(Formol.fromItem(item))
    noNotifications || noValidNotification || onValid(validNotificationText)
  }

  isModified() {
    const { item } = this.props
    const { transientItem } = this.state.context
    return !deepEqual(
      alignKeysRec(nullVoidValuesRec(item), transientItem),
      transientItem
    )
  }

  render(b) {
    const {
      add,
      children,
      className,
      readOnly,
      submitText,
      submitKind,
      noCancel,
      forceAlwaysSubmit,
      forceDisablePrompt,
      Prompt,
      Button,
    } = this.props
    const { disablePrompt, context } = this.state
    const modified = this.isModified()
    const submitDisabled = !forceAlwaysSubmit && !modified
    const Btn = Button || 'button'
    return (
      <form
        className={b.mix(className).m({
          add,
          errors: !!Object.keys(context.errors).length,
        })}
        onSubmit={e => e.preventDefault()}
        ref={this.form}
      >
        {Prompt && (
          <Prompt
            when={!forceDisablePrompt && !disablePrompt && modified}
            message={
              'Vous avez des modifications en cours. ' +
              'Voulez-vous vraiment changer de page ?'
            }
          />
        )}
        <FormolContext.Provider value={context}>
          {children}
        </FormolContext.Provider>
        {/* This input is required to validate the form */}
        {!readOnly && (
          <Fragment>
            <input
              type="submit"
              ref={ref => (this.submit = ref)}
              style={{ display: 'none' }}
            />
            <Btn
              onClick={this.handleSubmit}
              className={b.e('submit')}
              disabled={submitDisabled}
              type="button"
              kind={submitKind || 'important'}
            >
              {submitText || 'Envoyer'}
            </Btn>
            {!noCancel && (
              <Btn
                onClick={this.handleCancel}
                className={b.e('cancel')}
                disabled={submitDisabled}
                type="button"
                kind="mute"
              >
                Annuler
              </Btn>
            )}
          </Fragment>
        )}
      </form>
    )
  }
}
