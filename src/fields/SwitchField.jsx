import React from 'react'

import { block } from '../utils'
import SwitchButton from '../utils/SwitchButton'

// eslint-disable-next-line react/prefer-stateless-function
@block
export default class SwitchField extends React.Component {
  render(b) {
    // eslint-disable-next-line no-unused-vars
    const { type, i18n, leftLabel, rightLabel, ...props } = this.props

    return (
      <SwitchButton
        label={leftLabel || i18n.no}
        labelRight={rightLabel || i18n.yes}
        {...props}
        className={b}
      />
    )
  }
}
