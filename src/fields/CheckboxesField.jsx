import React from 'react'

import { block } from '../utils'
import FieldSet from '../utils/FieldSet'

@block
export default class CheckboxesField extends React.Component {
  static defaultProps = { value: [] }
  static formolFieldLabelElement = 'div'

  render(b) {
    const { onChange, readOnly, ...props } = this.props
    if (readOnly) {
      props.disabled = true
    }
    return (
      <FieldSet
        className={b}
        isChecked={(choice, value) => value.includes(choice)}
        onChange={(choice, value, checked) =>
          onChange(
            checked ? [...value, choice] : value.filter(val => val !== choice)
          )
        }
        {...props}
        type="checkbox"
      />
    )
  }
}
