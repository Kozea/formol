import React from 'react'

import { block } from '../utils'
import FieldSet from '../utils/FieldSet'

@block
export default class CheckboxSetField extends React.PureComponent {
  static defaultProps = { value: [] }
  static formolFieldLabelElement = 'div'

  render(b) {
    const { i18n, type, className, onChange, readOnly, ...props } = this.props
    if (readOnly) {
      props.disabled = true
    }
    return (
      <FieldSet
        className={b.mix(className)}
        isChecked={(choice, value) => value.includes(choice)}
        onChange={(choice, value, checked) =>
          onChange(
            checked ? [...value, choice] : value.filter(val => val !== choice)
          )
        }
        type="checkbox"
        {...props}
      />
    )
  }
}
