import React from 'react'

export default function Conditional({ children, show, context, ...props }) {
  const { edited } = context
  if (show && !show(edited)) {
    return null
  }
  Object.keys(props).forEach(key => (props[key] = props[key](edited)))
  return React.Children.map(
    children,
    child => child && React.cloneElement(child, { edited, ...props })
  )
}
