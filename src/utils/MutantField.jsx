import React from 'react'

import FormolContext from '../FormolContext'

export default function MutantField({ children, show, ...props }) {
  return (
    <FormolContext.Consumer>
      {({ edited }) => {
        if (show && !show(edited)) {
          return null
        }
        Object.keys(props).forEach(key => (props[key] = props[key](edited)))
        return React.Children.map(
          children,
          child => child && React.cloneElement(child, { ...props })
        )
      }}
    </FormolContext.Consumer>
  )
}
