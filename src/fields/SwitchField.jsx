import React from 'react'

import { block } from '../utils'
import SwitchButton from '../utils/SwitchButton'

@block
export default class SwitchField extends React.PureComponent {
  render(b) {
    const {
      type,
      i18n,
      leftLabel,
      rightLabel,
      className,
      ...props
    } = this.props

    return (
      <SwitchButton
        className={b.mix(className)}
        label={leftLabel || i18n.no}
        labelRight={rightLabel || i18n.yes}
        {...props}
      />
    )
  }
}
