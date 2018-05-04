import React from 'react'

import { block } from '../utils'
import FieldSet from '../utils/FieldSet'

@block
export default class RadiosField extends React.Component {
  render(b) {
    const { onChange, readOnly, ...props } = this.props
    if (readOnly) {
      props.disabled = true
    }
    return (
      <FieldSet
        className={b}
        isChecked={(choice, value) => choice === value}
        onChange={(choice, value, checked) => checked && onChange(choice)}
        {...props}
        type="radio"
      />
    )
  }
}
