import React from 'react'

// eslint-disable-next-line react/prefer-stateless-function
export default class TextAreaField extends React.Component {
  render() {
    // eslint-disable-next-line no-unused-vars
    const { type, i18n, onChange, ...props } = this.props
    return <textarea {...props} onChange={e => onChange(e.target.value)} />
  }
}
