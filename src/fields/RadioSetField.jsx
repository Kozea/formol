import React from 'react'

import { block } from '../utils'
import FieldSet from '../utils/FieldSet'

@block
export default class RadioSetField extends React.Component {
  static formolFieldLabelElement = 'div'

  render(b) {
    const { type, i18n, onChange, readOnly, className, ...props } = this.props
    if (readOnly) {
      props.disabled = true
    }
    return (
      <FieldSet
        type="radio"
        className={b.mix(className)}
        isChecked={(choice, value) => choice === value}
        onChange={(choice, value, checked) => checked && onChange(choice)}
        {...props}
      />
    )
  }
}
