import React from 'react'

import { block } from '../utils'
import SwitchButton from '../utils/SwitchButton'

// eslint-disable-next-line react/prefer-stateless-function
@block
export default class SwitchField extends React.Component {
  render(b) {
    const { switchLabels, ...props } = this.props
    const [leftLabel, rightLabel] = switchLabels || ['Non', 'Oui']
    return (
      <SwitchButton
        label={leftLabel}
        labelRight={rightLabel}
        {...props}
        className={b}
      />
    )
  }
}
