import React from 'react'

export const FormolContext = React.createContext({})

export default function FormolContextWrapper(Component) {
  return (props) => (
    <FormolContext.Consumer>
      {(context) => <Component {...props} context={context} />}
    </FormolContext.Consumer>
  )
}
