import React from 'react'

import { block } from '../utils'
import choicesAdapter from '../utils/choicesAdapter'
import memoizedChoices from '../utils/memoizedChoices'
import multipleAdapter from '../utils/multipleAdapter'
import withLabel from '../utils/withLabel'

@multipleAdapter
@choicesAdapter
@memoizedChoices
@withLabel
@block
export default class SelectField extends React.PureComponent {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    const { multiple, onChange } = this.props
    return onChange(
      multiple
        ? [...e.target.options].filter(o => o.selected).map(o => o.value)
        : e.target.value
    )
  }

  render(b) {
    const {
      choices,
      i18n,
      readOnly,
      className,
      elementRef,
      onChange,
      ...props
    } = this.props
    if (readOnly) {
      props.disabled = true
    }
    return (
      <select
        ref={elementRef}
        className={b.mix(className)}
        onChange={this.handleChange}
        {...props}
      >
        {!props.multiple && choices.every(([k]) => k) && <option value="" />}
        {choices.map(([label, key]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    )
  }
}
