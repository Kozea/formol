import './Form.sass'

import block from 'bemboo'
import deepEqual from 'deep-equal'
import React from 'react'
import { error, info } from 'react-notification-system-redux'
import { connect } from 'react-redux'
import { Prompt } from 'react-router-dom'
import { goBack } from 'react-router-redux'

import {
  alignKeysRec,
  clone,
  diffObject,
  entriesToObj,
  get,
  nullVoidValuesRec,
  set,
} from './utils/object'
import {
  isStateEqual,
  emptyContent,
  stateFromValue,
  stateToValue,
} from './fields/HTMLField/utils'

const b = block('Form')

class Form extends React.Component {
  constructor(props) {
    super(props)
    const { item } = props
    this.state = {
      disablePrompt: false,
      focused: null,
      errors: {},
      ...this.newEdited(item),
    }
    this.initHtmlFields()
    this.ref = {}
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  getChildContext() {
    const { item, readOnly, state } = this.props
    const { edited, editedHtml, focused, errors } = this.state
    return {
      edited,
      item,
      editedHtml,
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

  initHtmlFields(edited) {
    const { htmlFields } = this.props
    if (!htmlFields) {
      return {}
    }
    return entriesToObj(
      htmlFields.map(name => [name, stateFromValue(get(edited, name))])
    )
  }

  fromItem(item) {
    return nullVoidValuesRec(clone(item))
  }

  newEdited(item) {
    const edited = this.fromItem(item)
    return {
      edited,
      initialHtml: this.initHtmlFields(edited),
      editedHtml: this.initHtmlFields(edited),
    }
  }

  handleCancel() {
    const { item } = this.props
    this.setState(this.newEdited(item))
  }

  async handleSubmit(e) {
    const {
      add,
      htmlFields,
      htmlFieldsRequired,
      getPk,
      item,
      noRecursiveKeys,
      forceAlwaysSubmit,
      onCreate,
      onHTMLFieldRequired,
      onPatch,
      onSubmit,
    } = this.props
    const { edited, editedHtml } = this.state
    if (this.ref.form.checkValidity()) {
      if (htmlFieldsRequired) {
        const emptyFields = []
        Object.entries(htmlFieldsRequired).forEach(([name, label]) => {
          if (emptyContent(stateToValue(editedHtml[name]))) {
            emptyFields.push(label)
          }
        })
        if (emptyFields.length) {
          return onHTMLFieldRequired(emptyFields)
        }
      }
      if (htmlFields) {
        htmlFields.forEach(name => {
          set(edited, name, stateToValue(editedHtml[name]))
        })
      }
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
    const { htmlFields } = this.props
    if ((htmlFields || []).includes(name)) {
      this.setState({
        editedHtml: {
          ...this.state.editedHtml,
          [name]: value,
        },
      })
      return
    }
    const newEdited = clone(this.state.edited)
    set(newEdited, name, value)
    this.setState({
      edited: newEdited,
    })
  }

  validateState() {
    const { htmlFields } = this.props
    const edited = Object.entries(this.state.edited).reduce(
      (rv, [key, value]) => {
        if (!(htmlFields || []).includes(key) && value && value.trim) {
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
    const { edited, initialHtml, editedHtml } = this.state
    return (
      !deepEqual(alignKeysRec(nullVoidValuesRec(item), edited), edited) ||
      !Object.keys(editedHtml).every(key =>
        isStateEqual(initialHtml[key], editedHtml[key])
      )
    )
  }

  render() {
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
    } = this.props
    const { errors, disablePrompt } = this.state
    // We add edited keys to item in comparison and then null all undefined
    const modified = this.isModified()
    const submitDisabled = !forceAlwaysSubmit && !modified

    return (
      <form
        className={b.mix(className).m({
          add,
          errors: !!Object.keys(errors).length,
        })}
        onSubmit={e => e.preventDefault()}
        ref={ref => (this.ref.form = ref)}
      >
        <Prompt
          when={!forceDisablePrompt && !disablePrompt && modified}
          message={
            'Vous avez des modifications en cours. ' +
            'Voulez-vous vraiment changer de page ?'
          }
        />
        {children}
        {/* This input is required to validate the form */}
        {!readOnly && (
          <>
            <input
              type="submit"
              ref={ref => (this.ref.submit = ref)}
              style={{ display: 'none' }}
            />
            <button
              onClick={this.handleSubmit}
              className={b.e('submit')}
              disabled={submitDisabled}
              type="button"
              kind={submitKind || 'important'}
            >
              {submitText || 'Envoyer'}
            </button>
            {!noCancel && (
              <button
                onClick={this.handleCancel}
                className={b.e('cancel')}
                disabled={submitDisabled}
                type="button"
                kind="mute"
              >
                Annuler
              </button>
            )}
          </>
        )}
      </form>
    )
  }
}

export default connect(
  () => ({}),
  dispatch => ({
    onBack: () => dispatch(goBack()),
    onHTMLFieldRequired: labels => {
      const plural = labels.length > 1
      return dispatch(
        error({
          title: 'Erreur',
          message: `Le${plural ? 's' : ''} champ${plural ? 's' : ''}
          « ${labels.join(', ')} » ${plural ? 'sont' : 'est'} requis.`,
          position: 'br',
          autoDismiss: 4,
        })
      )
    },
    onValid: text =>
      dispatch(
        info({
          title: 'Succès',
          message: text || 'Vos modifications ont bien été enregistrées.',
          position: 'br',
          autoDismiss: 4,
        })
      ),
    onError: text =>
      dispatch(
        error({
          title: 'Erreur',
          message:
            text ||
            'Vos modifications n’ont pu être enregistrées. ' +
              'Veuillez vérifier vos données ou réessayer ultérieurement.',
          position: 'br',
          autoDismiss: 4,
        })
      ),
  })
)(Form)

Form.childContextTypes = {
  edited: () => null, // PropTypes.object,
  item: () => null, // PropTypes.object,
  editedHtml: () => null, // PropTypes.object,
  refs: () => null, // PropTypes.object,
  errors: () => null, // PropTypes.object,
  focused: () => null, // PropTypes.string,
  state: () => null, // PropTypes.object,
  readOnly: () => null, // PropTypes.bool,
  handleFocus: () => null, // PropTypes.func,
  handleBlur: () => null, // PropTypes.func,
  handleChange: () => null, // PropTypes.func,
  handleSubmit: () => null, // PropTypes.func,
}
