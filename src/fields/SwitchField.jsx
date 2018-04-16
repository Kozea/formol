import React from 'react'

import { SwitchButton } from './SwitchButton'

// eslint-disable-next-line react/prefer-stateless-function
export default class SwitchField extends React.Component {
  render() {
    const { switchLabels, ...props } = this.props
    const [leftLabel, rightLabel] = switchLabels || ['Non', 'Oui']
    return <SwitchButton label={leftLabel} labelRight={rightLabel} {...props} />
  }
}
