import React from 'react'

import { block } from '../utils'
import BooleanField from './BooleanField'

@block
export default class RadioField extends React.Component {
  render(b) {
    const { className, ...props } = this.props
    return <BooleanField className={b.mix(className)} {...props} />
  }
}
