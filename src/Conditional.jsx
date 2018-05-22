import React from 'react'

import FormolContextWrapper from './FormolContext'
import { get } from './utils/object'

class Conditional extends React.Component {
  componentDidUpdate() {
    const {
      show,
      children,
      context: { handleChange, transientItem },
    } = this.props

    if (show && !show(transientItem)) {
      // This is mandatory for removing values when using Conditional
      React.Children.map(children, ({ props: { name } }) => {
        if (get(transientItem, name)) {
          handleChange(name, void 0)
        }
      })
    }
  }
  render() {
    const { children, show, context, ...props } = this.props
    const { transientItem } = context

    if (show && !show(transientItem)) {
      return null
    }

    const newProps = Object.entries(props).reduce(
      (calledProps, [key, prop]) => {
        calledProps[key] = prop(transientItem)
        return calledProps
      },
      {}
    )

    return React.Children.map(
      children,
      child => child && React.cloneElement(child, newProps)
    )
  }
}

export default FormolContextWrapper(Conditional)
