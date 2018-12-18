import React from 'react'

import ConditionalContextWrapper from '../ConditionalContext'
import FormolContextWrapper from '../FormolContext'
import { diff, get } from './object'

let UNAMED_COUNT = 0

// These aren't static because we need to know which props has been given
const defaultProps = {
  type: 'text',
  formatter: v => v,
  normalizer: v => (v && v.trim ? v.trim() : v),
  unformatter: v => v,
  classNameModifiers: {},
}

export default function fieldPropsAdapter(WrappedComponent) {
  @ConditionalContextWrapper
  @FormolContextWrapper
  class FieldPropsAdapter extends React.PureComponent {
    constructor(props) {
      super(props)
      if (props.value) {
        throw new Error(
          'Do not use value on fields. ' +
            'Set a value for this field in the form item attribute.'
        )
      }
      if (!props.context.transientItem) {
        throw new Error('Field must be used inside Form')
      }

      if (props.name) {
        this.name = props.name
      } else if (typeof props.children === 'string') {
        this.name = props.children
          .toLowerCase()
          .replace(/\W+(.)/g, (match, chr) => chr.toUpperCase())
      } else {
        this.name = `field-${++UNAMED_COUNT}`
      }

      this.register = this.register.bind(this)
      this.unregister = this.unregister.bind(this)
    }

    componentDidUpdate(oldProps) {
      const {
        context: { transientItem: oldTransientItem },
      } = oldProps
      const {
        context: { transientItem, handleChanged },
      } = this.props
      const propsDiff = diff(this.props, oldProps, Object.keys(this.props))
      if (
        get(transientItem, this.name) !== get(oldTransientItem, this.name) ||
        (Object.keys(propsDiff).length &&
          !Object.keys(propsDiff).every(prop =>
            ['context', 'conditionalContext'].includes(prop)
          ))
      ) {
        handleChanged(this.name)
      }
    }

    register(name, element, validator, validityErrors) {
      const { context, conditionalContext } = this.props
      context.register(name, element, validator, validityErrors)
      conditionalContext.register && conditionalContext.register(name)
    }

    unregister(name) {
      const { context, conditionalContext } = this.props
      context.unregister(name)
      conditionalContext.unregister && conditionalContext.unregister(name)
    }

    render() {
      const props = { ...defaultProps, ...this.props }
      const TypeField = props.context.types[props.type]
      if (!TypeField) {
        throw new Error(`Unknown type "${props.type}" for field "${this.name}"`)
      }
      const itemValue = get(props.context.item, this.name)
      const transientValue = get(props.context.transientItem, this.name)
      const value = props.formatter(transientValue)
      const propsDefaultsFromField = TypeField.defaultFieldProps
        ? Object.entries(TypeField.defaultFieldProps).reduce(
            (newProps, [name, getter]) => {
              newProps[name] = getter(props, value)
              return newProps
            },
            {}
          )
        : {}

      const {
        context: {
          readOnly: formReadOnly,
          i18n,
          errors,
          enteredFields,
          handleChange,
          handleEntered,
        },
        conditionalContext,
        readOnly,
        ...finalProps
      } = {
        name: this.name,
        value,
        modified: itemValue !== transientValue,
        TypeField,
        ...defaultProps,
        ...propsDefaultsFromField,
        ...this.props,
        ...props.conditionalContext.propsOverride,
      }

      return (
        <WrappedComponent
          {...finalProps}
          readOnly={formReadOnly || readOnly}
          i18n={i18n}
          error={
            enteredFields.includes(this.name) && errors[this.name]
              ? errors[this.name]
              : null
          }
          handleChange={handleChange}
          handleEntered={handleEntered}
          register={this.register}
          unregister={this.unregister}
        />
      )
    }
  }
  return FieldPropsAdapter
}
