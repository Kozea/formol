import './Formol.sass'

import deepEqual from 'deep-equal'
import React, { Fragment } from 'react'

import BooleanField from './fields/BooleanField'
import CalendarField from './fields/CalendarField'
import CheckboxesField from './fields/CheckboxesField'
import FileField from './fields/FileField'
import HTMLField from './fields/HTMLField'
import InputField from './fields/InputField'
import NumberField from './fields/NumberField'
import PasswordStrengthField from './fields/PasswordStrengthField'
import RadiosField from './fields/RadiosField'
import SelectField from './fields/SelectField'
import SelectMenuField from './fields/SelectMenuField'
import SwitchField from './fields/SwitchField'
import TextareaField from './fields/TextareaField'
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
    number: NumberField,
    range: NumberField,
    html: HTMLField,
    area: TextareaField,
    calendar: CalendarField,
    file: FileField,
    files: FileField,
    'password-strength': PasswordStrengthField,
    select: SelectField,
    'select-menu': SelectMenuField,
    switch: SwitchField,
    radio: BooleanField,
    checkbox: BooleanField,
    radios: RadiosField,
    checkboxes: CheckboxesField,
  }

  static i18n = {
    en,
    fr,
  }

  static defaultProps = {
    item: {},
    fields: {},
    i18n: 'en',
    getPk: item => item,
    onError: console.error.bind(console),
  }

  constructor(props) {
    super(props)
    const { item, fields, i18n, readOnly } = props
    this.ref = {}
    this.state = {
      disablePrompt: false,
      context: {
        item,
        transientItem: this.fromItem(item),
        fields: { ...Formol.defaultFields, ...fields },
        i18n: Formol.i18n[i18n],
        refs: this.ref,
        errors: {},
        focused: null,
        readOnly,
        handleFocus: this.handleFocus.bind(this),
        handleBlur: this.handleBlur.bind(this),
        handleChange: this.handleChange.bind(this),
        handleSubmit: this.handleSubmit.bind(this),
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

  async handleSubmit(e) {
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
    if (this.ref.form.checkValidity()) {
      if (onSubmit) {
        try {
          const report = await onSubmit(transientItem)
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
    } else {
      this.ref.submit && this.ref.submit.click()
      e.preventDefault()
    }
  }

  handleChange(name, value) {
    const newtransientItem = clone(this.state.context.transientItem)
    set(newtransientItem, name, value)
    this.setContextState({
      transientItem: newtransientItem,
    })
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
    }
  }

  handleFocus(name) {
    this.setContextState({
      focused: name,
    })
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
    this.setContextState({
      focused: null,
    })
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
        ref={ref => (this.ref.form = ref)}
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
              ref={ref => (this.ref.submit = ref)}
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
