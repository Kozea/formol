import React from 'react'
import deepEqual from 'deep-equal'

import { ConditionalContext } from './ConditionalContext'
import FormolContextWrapper from './FormolContext'

@FormolContextWrapper
export default class Conditional extends React.PureComponent {
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
      transientItem,
    }
  }

  constructor(props) {
    super(props)
    this.names = []
    this.state = Conditional.contextFromProps(props, {
      conditionalContext: {
        register: this.register.bind(this),
        unregister: this.unregister.bind(this),
      },
    })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { children, context, ...nextCallableProps } = nextProps
    const { transientItem } = context
    if (
      !deepEqual(transientItem, prevState.transientItem) ||
      !deepEqual(nextCallableProps, prevState.currentProps)
    ) {
      return Conditional.contextFromProps(nextProps, prevState)
    }
    return null
  }

  register(name) {
    this.names.push(name)
  }

  unregister(name) {
    this.names.splice(this.names.indexOf(name), 1)
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
