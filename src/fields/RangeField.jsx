import React from 'react'

import { block } from '../utils'
import NumberField from './NumberField'

@block
export default class RangeField extends React.PureComponent {
  render(b) {
    const { className, ...props } = this.props
    return <NumberField className={b.mix(className)} {...props} />
  }
}
