import React from 'react'

export const FormolContext = React.createContext({})

export default function FormolContextWrapper(Component) {
  // eslint-disable-next-line react/display-name
  return (props) => (
    <FormolContext.Consumer>
      {(context) => <Component {...props} context={context} />}
    </FormolContext.Consumer>
  )
}
