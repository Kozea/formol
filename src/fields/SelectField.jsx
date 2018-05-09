import React from 'react'

import {
  block,
  cleanProps,
  normalizeChoices,
  normalizeMultipleProps,
} from '../utils'

@block
export default class SelectField extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    const { multiple, onChange } = this.props
    return onChange(
      multiple
        ? [...e.target.options].filter(o => o.selected).map(o => o.value)
        : e.target.value,
      e.target
    )
  }

  render(b) {
    const choices = normalizeChoices(this.props)
    // eslint-disable-next-line no-unused-vars
    const { i18n, readOnly, className, onChange, ...props } = this.props
    if (readOnly) {
      props.disabled = true
    }

    return (
      <select
        className={b.mix(className)}
        onChange={this.handleChange}
        {...cleanProps(normalizeMultipleProps(props))}
      >
        {choices.every(([k]) => k) && <option value="" />}
        {choices.map(([label, key]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    )
  }
}
