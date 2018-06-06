import React from 'react'

import { block } from '../utils'
import InputField from './InputField'

@block
export default class NumberField extends React.PureComponent {
  render(b) {
    const { className, onChange, ...props } = this.props
    return (
      <InputField
        className={b.mix(className)}
        onChange={v => onChange(isNaN(parseFloat(v)) ? null : parseFloat(v))}
        {...props}
      />
    )
  }
}
