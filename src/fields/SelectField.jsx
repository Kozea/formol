import React from 'react'

import { block, normalizeChoices, normalizeMultipleProps } from '../utils'

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
    const normalizedChoices = normalizeChoices(this.props)
    const {
      i18n,
      readOnly,
      className,
      elementRef,
      choices,
      asyncChoices,
      choiceGetter,
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
        {...normalizeMultipleProps(props)}
      >
        {normalizedChoices.every(([k]) => k) && <option value="" />}
        {normalizedChoices.map(([label, key]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    )
  }
}
