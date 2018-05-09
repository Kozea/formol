import React from 'react'

import { block, cleanProps, normalizeChoices } from '../utils'

@block
export default class SelectField extends React.Component {
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
        onChange={e => onChange(e.target.value, e.target)}
        {...cleanProps(props)}
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
