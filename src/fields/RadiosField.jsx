import React from 'react'

import { block } from '../utils'
import FieldSet from '../utils/FieldSet'

@block
export default class RadiosField extends React.Component {
  static formolFieldLabelElement = 'div'

  render(b) {
    // eslint-disable-next-line no-unused-vars
    const { i18n, onChange, readOnly, ...props } = this.props
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
