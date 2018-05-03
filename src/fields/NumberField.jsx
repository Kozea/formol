import React from 'react'

import InputField from './InputField'

// eslint-disable-next-line react/prefer-stateless-function
export default class NumberField extends React.Component {
  render() {
    const { onChange, ...props } = this.props
    return <InputField {...props} onChange={v => onChange(parseInt(v))} />
  }
}
