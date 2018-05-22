import deepEqual from 'deep-equal'
import React from 'react'

import { ConditionalContext } from './ConditionalContext'
import FormolContextWrapper from './FormolContext'
import { get } from './utils/object'

class Conditional extends React.Component {
  static contextFromProps(
    {
      children,
      show,
      context: { transientItem },
      ...callableProps
    },
    names = {}
  ) {
    return {
      show: !show || show(transientItem),
      conditionalContext: {
        propsOverride: Object.entries(callableProps).reduce(
          (calledProps, [key, prop]) => {
            calledProps[key] = prop(transientItem)
            return calledProps
          },
          {}
        ),
        names,
      },
      currentProps: { show, ...callableProps },
    }
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
      return Conditional.contextFromProps(
        nextProps,
        prevState.conditionalContext.names
      )
    }
    return null
  }

  constructor(props) {
    super(props)
    this.state = Conditional.contextFromProps(props)
  }

  componentDidUpdate() {
    const {
      show,
      context: { handleChange, transientItem },
    } = this.props
    const {
      conditionalContext: { names },
    } = this.state

    if (show && !show(transientItem)) {
      // This is mandatory for removing values when using Conditional
      Object.keys(names).map(name => {
        if (get(transientItem, name)) {
          handleChange(name, void 0)
        }
      })
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
