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

  constructor(props) {
    super(props)
    const { item, fields, i18n, readOnly } = props
    this.form = React.createRef()
    this.submit = React.createRef()
    this.state = {
      disablePrompt: false,
      context: {
        item,
        transientItem: this.fromItem(item),
        fields: { ...Formol.defaultFields, ...fields },
        elements: {},
        validators: {},
        i18n: Formol.i18n[i18n],
        errors: {},
        readOnly,
        handleKeyDown: this.handleKeyDown.bind(this),
        handleFocus: this.handleFocus.bind(this),
        handleBlur: this.handleBlur.bind(this),
        handleChange: this.handleChange.bind(this),
      },
    }
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!deepEqual(nextProps.item, this.props.item)) {
      this.setContextState({
        item: nextProps.item,
        transientItem: this.fromItem(nextProps.item),
      })
    }
    if (nextProps.readOnly !== this.props.readOnly) {
      this.setContextState({
        readOnly: nextProps.readOnly,
      })
    }
    if (nextProps.fields !== this.props.fields) {
      this.setContextState({
        fields: { ...Formol.defaultFields, ...nextProps.fields },
      })
    }
    if (nextProps.i18n !== this.props.i18n) {
      this.setContextState({
        i18n: Formol.i18n[nextProps.i18n],
      })
    }
  }

  setContextState(context) {
    const { onChange } = this.props
    this.setState({ context: { ...this.state.context, ...context } })
    if ('transientItem' in context) {
      onChange && onChange(context.transientItem)
    }
  }

  fromItem(item) {
    return nullVoidValuesRec(clone(item))
  }

  handleCancel() {
    const { item } = this.props
    this.setContextState({
      transientItem: this.fromItem(item),
    })
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
    this.validateForm()
    if (this.form.current && this.form.current.checkValidity()) {
      if (onSubmit) {
        try {
          const report = await onSubmit(transientItem)
          if (report === false) {
            // We manually force return at some point
            return
          }
          if (report.metadata.code === 202) {
            this.setContextState({
              re: report.metadata.errors[0].fields,
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
            this.setContextState({
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
            this.setContextState({
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
    const newtransientItem = clone(this.state.context.transientItem)
    set(newtransientItem, name, value)
    this.setContextState({
      transientItem: newtransientItem,
    })
    this.validateForm(newtransientItem)
  }

  validateState() {
    const transientItem = Object.entries(
      this.state.context.transientItem
    ).reduce((rv, [key, value]) => {
      if (value && value.trim) {
        value = value.trim()
      }
      rv[key] = value
      return rv
    }, {})
    if (!deepEqual(transientItem, this.state.context.transientItem)) {
      this.setContextState({
        transientItem,
      })
      this.validateForm(transientItem)
    }
  }

  validateForm(newTransientItem) {
    const { validator } = this.props
    const { transientItem, elements, validators } = this.state.context
    const item = newTransientItem || transientItem
    const validity = validator ? validator(item) : {}
    Object.entries(elements).forEach(([name, element]) => {
      if (validators[name]) {
        validity[name] = validators[name](item[name]) || validity[name]
      }
      validity[name] = validity[name] || ''

      if (!element.current) {
        return
      }
      // Return if there's already a DOM validation error
      if (element.current.validity) {
        // Can't use Object.values here...
        if (
          [
            'patternMismatch',
            'rangeOverflow',
            'rangeUnderflow',
            'stepMismatch',
            'tooLong',
            'typeMismatch',
            'valueMissing',
          ].some(key => element.current.validity[key])
        ) {
          return
        }
      }
      element.current.setCustomValidity(validity[name])
    })
  }

  // eslint-disable-next-line no-unused-vars
  handleFocus(name) {
    // name is focused
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
    this.setContextState({
      errors: {},
      transientItem: this.fromItem(item),
    })
    noNotifications || noValidNotification || onValid(validNotificationText)
  }

  handleBlur() {
    const { readOnly } = this.props
    if (readOnly) {
      return
    }
    this.validateState()
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
