import React from 'react'

import { block } from '../utils'

@block
export default class TextAreaField extends React.PureComponent {
  render(b) {
    const { type, i18n, className, elementRef, onChange, ...props } = this.props
    return (
      <textarea
        ref={elementRef}
        className={b.mix(className)}
        onChange={e => onChange(e.target.value)}
        {...props}
      />
    )
  }
}
