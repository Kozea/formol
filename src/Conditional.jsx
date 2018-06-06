import deepEqual from 'deep-equal'
import React from 'react'

import { ConditionalContext } from './ConditionalContext'
import FormolContextWrapper from './FormolContext'
import { get } from './utils/object'

class Conditional extends React.PureComponent {
  static contextFromProps(
    {
      children,
      show,
      context: { transientItem },
      ...callableProps
    },
    { conditionalContext }
  ) {
    return {
      show: !show || show(transientItem),
      conditionalContext: {
        ...conditionalContext,
        propsOverride: Object.entries(callableProps).reduce(
          (calledProps, [key, prop]) => {
            calledProps[key] = prop(transientItem)
            return calledProps
          },
          {}
        ),
      },
      currentProps: { show, ...callableProps },
    }
  }

  constructor(props) {
    super(props)
    this.names = []
    this.state = Conditional.contextFromProps(props, {
      conditionalContext: {
        register: this.register.bind(this),
      },
    })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { children, context, ...nextCallableProps } = nextProps
    if (
      !deepEqual(
        nextProps.context.transientItem,
        prevState.conditionalContext.transientItem
      ) ||
      !deepEqual(nextCallableProps, prevState.currentProps)
    ) {
      return Conditional.contextFromProps(nextProps, prevState)
    }
    return null
  }

  componentDidUpdate() {
    const {
      show,
      context: { handleChange, transientItem, unregister },
    } = this.props

    if (show && !show(transientItem)) {
      // This is mandatory for removing values when using Conditional
      this.names.map(unregister)
      this.names.map(name => {
        if (get(transientItem, name)) {
          handleChange(name, void 0)
        }
      })
    }
  }

  register(name) {
    if (!this.names.includes(name)) {
      this.names.push(name)
    }
  }

  unregister(name) {
    if (this.names.includes(name)) {
      this.names.splice(this.names.indexOf(name), 1)
    }
  }

  render() {
    const { children } = this.props
    const { show, conditionalContext } = this.state
    if (!show) {
      return null
    }

    return (
      <ConditionalContext.Provider value={conditionalContext}>
        {children}
      </ConditionalContext.Provider>
    )
  }
}

export default FormolContextWrapper(Conditional)
