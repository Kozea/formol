import React from 'react'

export const ConditionalContext = React.createContext({})

export default function ConditionalContextWrapper(Component) {
  // eslint-disable-next-line react/display-name
  return props => (
    <ConditionalContext.Consumer>
      {conditionalContext => (
        <Component {...props} conditionalContext={conditionalContext} />
      )}
    </ConditionalContext.Consumer>
  )
}
