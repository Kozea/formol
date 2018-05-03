import React from 'react'

import { cleanProps, normalizeChoices } from '../utils'

// eslint-disable-next-line react/prefer-stateless-function
export default class SelectField extends React.Component {
  render() {
    const choices = normalizeChoices(this.props)
    const { onChange, ...props } = this.props
    // TODO: handle no readonly: disabled={readOnly /* There's no readOnly */}
    return (
      <select onChange={e => onChange(e.target.value)} {...cleanProps(props)}>
        {choices.every(([k]) => k) && <option value="" />}
        {choices.map(([key, val]) => (
          <option key={key} value={key}>
            {val}
          </option>
        ))}
      </select>
    )
  }
}
