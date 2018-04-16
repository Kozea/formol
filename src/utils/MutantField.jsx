import PropTypes from 'prop-types'
import React from 'react'

export default function MutantField({ children, show, ...props }, { edited }) {
  if (show && !show(edited)) {
    return null
  }
  Object.keys(props).forEach(key => (props[key] = props[key](edited)))
  return React.Children.map(
    children,
    child => child && React.cloneElement(child, { ...props })
  )
}

MutantField.contextTypes = {
  edited: PropTypes.object,
}
