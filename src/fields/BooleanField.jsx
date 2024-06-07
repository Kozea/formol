import React from 'react'

import { block } from '../utils'

@block
export default class BooleanField extends React.PureComponent {
  render(b) {
    const { value, i18n, readOnly, className, elementRef, onChange, ...props } =
      this.props
    if (readOnly) {
      props.disabled = true
    }
    return (
      <input
        ref={elementRef}
        className={b.mix(className)}
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        {...props}
      />
    )
  }
}
