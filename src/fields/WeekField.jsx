import React from 'react'

import { block } from '../utils'
import InputField from './InputField'
import withLabel from '../utils/withLabel'

@withLabel
@block
export default class WeekField extends React.PureComponent {
  render(b) {
    const { className, ...props } = this.props
    return <InputField className={b.mix(className)} {...props} />
  }
}
