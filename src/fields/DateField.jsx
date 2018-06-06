import React from 'react'

import { block } from '../utils'
import InputField from './InputField'

@block
export default class DateField extends React.PureComponent {
  render(b) {
    const { className, ...props } = this.props
    return <InputField className={b.mix(className)} {...props} />
  }
}
