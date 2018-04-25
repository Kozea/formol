import './Formol.sass'

import deepEqual from 'deep-equal'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'

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
  static defaultProps = {
    item: {},
    getPk: item => item,
    onError: console.error.bind(console),
  }

  static childContextTypes = {
    edited: PropTypes.object,
    item: PropTypes.object,
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

  constructor(props) {
    super(props)
    const { item } = props
    this.state = {
      disablePrompt: false,
      focused: null,
      errors: {},
      ...this.newEdited(item),
    }
    this.ref = {}
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  getChildContext() {
    const { item, readOnly, state } = this.props
    const { edited, focused, errors } = this.state
    return {
      edited,
      item,
      refs: this.ref,
      errors,
      focused,
      state,
      readOnly,
      handleFocus: this.handleFocus.bind(this),
      handleBlur: this.handleBlur.bind(this),
      handleChange: this.handleChange.bind(this),
      handleSubmit: this.handleSubmit.bind(this),
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!deepEqual(nextProps.item, this.props.item)) {
      this.setState(this.newEdited(nextProps.item))
    }
  }

  fromItem(item) {
    return nullVoidValuesRec(clone(item))
  }

  newEdited(item) {
    return { edited: this.fromItem(item) }
  }

  handleCancel() {
    const { item } = this.props
    this.setState(this.newEdited(item))
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
    const { edited } = this.state
    if (this.ref.form.checkValidity()) {
      if (onSubmit) {
        try {
          const report = await onSubmit(edited)
          if (report === false) {
            // We manually force return at some point
            return
          }
          if (report.metadata.code === 202) {
            this.setState({ errors: report.metadata.errors[0].fields })
            throw new Error('Validation error')
          }
          this.handleNoError()
        } catch (err) {
          this.handleError(err)
        }
      } else if (add) {
        this.setState({ disablePrompt: true })
        try {
          const report = await onCreate(edited)
          if (report === false) {
            // We manually force return at some point
            return
          }
          if (report.metadata.code === 202) {
            this.setState({ errors: report.metadata.errors[0].fields })
            throw new Error('Validation error')
          }
          this.handleNoError()
        } catch (err) {
          this.handleError(err)
        }
        this.setState({ disablePrompt: false })
      } else if (forceAlwaysSubmit || !deepEqual(item, edited)) {
        const pk = getPk(item)
        const diff = diffObject(edited, item, noRecursiveKeys)
        try {
          const report = await onPatch(pk, diff)
          if (report === false) {
            // We manually force return at some point
            return
          }
          if (report.metadata.code === 202) {
            this.setState({ errors: report.metadata.errors[0].fields })
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
    const { onChange } = this.props
    const newEdited = clone(this.state.edited)
    set(newEdited, name, value)
    this.setState({
      edited: newEdited,
    })
    onChange && onChange(newEdited)
  }

  validateState() {
    const edited = Object.entries(this.state.edited).reduce(
      (rv, [key, value]) => {
        if (value && value.trim) {
          value = value.trim()
        }
        rv[key] = value
        return rv
      },
      {}
    )
    if (!deepEqual(edited, this.state.edited)) {
      this.setState({ edited })
    }
  }

  handleFocus(name) {
    this.setState({ focused: name })
  }

  handleError() {
    const {
      noNotifications,
      noErrorNotification,
      errorNotificationText,
      onError,
    } = this.props
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
    this.setState({ errors: {}, ...this.newEdited(item) })
    noNotifications || noValidNotification || onValid(validNotificationText)
  }

  handleBlur() {
    const { readOnly } = this.props
    if (readOnly) {
      return
    }
    this.setState({ focused: null })
    this.validateState()
  }

  isModified() {
    const { item } = this.props
    const { edited } = this.state
    return !deepEqual(alignKeysRec(nullVoidValuesRec(item), edited), edited)
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
    const { errors, disablePrompt } = this.state
    // We add edited keys to item in comparison and then null all undefined
    const modified = this.isModified()
    const submitDisabled = !forceAlwaysSubmit && !modified
    const Btn = Button || 'button'
    return (
      <form
        className={b.mix(className).m({
          add,
          errors: !!Object.keys(errors).length,
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
        {children}
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
