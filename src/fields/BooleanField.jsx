import React from 'react'

// eslint-disable-next-line react/prefer-stateless-function
export default class BooleanField extends React.Component {
  render() {
    // eslint-disable-next-line no-unused-vars
    const { value, i18n, readOnly, onChange, ...props } = this.props
    if (readOnly) {
      props.disabled = true
    }
    return (
      <input
        checked={value}
        onChange={e => onChange(e.target.checked)}
        {...props}
      />
    )
  }
}
