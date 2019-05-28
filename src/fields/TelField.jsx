import React from 'react'

import { block } from '../utils'
import InputField from './InputField'
import withLabel from '../utils/withLabel'

@withLabel
@block
export default class TelField extends React.PureComponent {
  render(b) {
    const { className, pattern, ...props } = this.props
    props.pattern = pattern || props.i18n.tel.pattern.source
    return <InputField className={b.mix(className)} {...props} />
  }
}
