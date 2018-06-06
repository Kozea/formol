import React from 'react'

import { block } from '../utils'
import BooleanField from './BooleanField'

@block
export default class CheckboxField extends React.PureComponent {
  render(b) {
    const { className, ...props } = this.props
    return <BooleanField className={b.mix(className)} {...props} />
  }
}
