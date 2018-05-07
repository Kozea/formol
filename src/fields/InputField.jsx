import React from 'react'

// eslint-disable-next-line react/prefer-stateless-function
export default class InputField extends React.Component {
  static defaultProps = { type: 'text' }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { i18n, onChange, ...props } = this.props
    return (
      <input {...props} onChange={e => onChange(e.target.value, e.target)} />
    )
  }
}
