import React from 'react'

import { block } from '../utils'
import withLabel from '../utils/withLabel'

@withLabel
@block
export default class InputField extends React.PureComponent {
  static defaultProps = { type: 'text' }

  render(b) {
    const { i18n, className, elementRef, onChange, ...props } = this.props
    return (
      <input
        ref={elementRef}
        className={b.mix(className)}
        onChange={e => onChange(e.target.value)}
        {...props}
      />
    )
  }
}
