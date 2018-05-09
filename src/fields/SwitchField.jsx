import React from 'react'

import { block } from '../utils'
import SwitchButton from '../utils/SwitchButton'

// eslint-disable-next-line react/prefer-stateless-function
@block
export default class SwitchField extends React.Component {
  render(b) {
    const {
      type, // eslint-disable-line no-unused-vars
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
