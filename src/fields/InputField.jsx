import React from 'react'

import { block } from '../utils'

@block
export default class InputField extends React.Component {
  static defaultProps = { type: 'text' }

  render(b) {
    // eslint-disable-next-line no-unused-vars
    const { i18n, className, onChange, ...props } = this.props
    return (
      <input
        className={b.mix(className)}
        onChange={e => onChange(e.target.value, e.target)}
        {...props}
      />
    )
  }
}
