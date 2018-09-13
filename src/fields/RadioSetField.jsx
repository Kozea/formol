import React from 'react'

import { block } from '../utils'
import choicesAdapter from '../utils/choicesAdapter'
import FieldSet from '../utils/FieldSet'
import memoizedChoices from '../utils/memoizedChoices'

@choicesAdapter
@memoizedChoices
@block
export default class RadioSetField extends React.PureComponent {
  static formolFieldLabelElement = 'div'
  static defaultFieldProps = {
    multiple: () => false,
  }

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
