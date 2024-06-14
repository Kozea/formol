import React from 'react'

import { block } from '../utils'
import choicesAdapter from '../utils/choicesAdapter'
import FieldSet from '../utils/FieldSet'
import memoizedChoices from '../utils/memoizedChoices'
import multipleAdapter from '../utils/multipleAdapter'

@multipleAdapter
@choicesAdapter
@memoizedChoices
@block
export default class CheckboxSetField extends React.PureComponent {
  static formolFieldLabelElement = 'div'
  static defaultProps = { value: [] }
  static defaultFieldProps = {
    multiple: () => true,
  }

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
            checked ? [...value, choice] : value.filter((val) => val !== choice)
          )
        }
        type="checkbox"
        {...props}
      />
    )
  }
}
