import React from 'react'

import { block } from '../utils'

@block
export default class TextAreaField extends React.Component {
  render(b) {
    // eslint-disable-next-line no-unused-vars
    const { type, i18n, className, onChange, ...props } = this.props
    return (
      <textarea
        className={b.mix(className)}
        onChange={e => onChange(e.target.value, e.target)}
        {...props}
      />
    )
  }
}
