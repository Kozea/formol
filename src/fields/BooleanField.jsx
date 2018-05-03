import React from 'react'

// eslint-disable-next-line react/prefer-stateless-function
export default class BooleanField extends React.Component {
  render() {
    const { value, onChange, ...props } = this.props
    return (
      <input
        checked={value}
        onChange={e => onChange(e.target.checked)}
        {...props}
      />
    )
  }
}
