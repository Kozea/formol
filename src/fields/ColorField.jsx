import React from 'react'

import { block } from '../utils'
import InputField from './InputField'

@block
export default class ColorField extends React.PureComponent {
  static defaultFieldProps = {
    validator: () => v =>
      v && !v.match(/#[0-9bA-Fa-f]{6}/) && `${v} is not a valid color`,
  }
  render(b) {
    const { className, ...props } = this.props
    return <InputField className={b.mix(className)} {...props} />
  }
}
