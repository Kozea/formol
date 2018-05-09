import React from 'react'

import { block } from '../utils'
import NumberField from './BooleanField'

@block
export default class RangeField extends React.Component {
  render(b) {
    const { className, ...props } = this.props
    return <NumberField className={b.mix(className)} {...props} />
  }
}
