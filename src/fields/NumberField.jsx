import React from 'react'

import InputField from './InputField'

// eslint-disable-next-line react/prefer-stateless-function
export default class NumberField extends React.Component {
  focus() {
    this.native && this.native.focus()
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { i18n, onChange, ...props } = this.props
    return (
      <InputField
        {...props}
        ref={ref => (this.native = ref)}
        onChange={v => onChange(parseInt(v))}
      />
    )
  }
}
