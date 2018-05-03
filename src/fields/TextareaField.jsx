import React from 'react'

// eslint-disable-next-line react/prefer-stateless-function
export default class TextAreaField extends React.Component {
  render() {
    const { type, onChange, ...props } = this.props
    return <textarea {...props} onChange={e => onChange(e.target.value)} />
  }
}
