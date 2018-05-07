import React from 'react'

import { cleanProps, normalizeChoices } from '../utils'

// eslint-disable-next-line react/prefer-stateless-function
export default class SelectField extends React.Component {
  render() {
    const choices = normalizeChoices(this.props)
    // eslint-disable-next-line no-unused-vars
    const { i18n, readOnly, onChange, ...props } = this.props
    if (readOnly) {
      props.disabled = true
    }
    return (
      <select
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
