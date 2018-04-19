import React from 'react'

import Field from '../Field'
import { block, moneyFormat } from '../utils'

@block
export default class MoneyField extends React.Component {
  render() {
    const { ...inputProps } = this.props
    return <Field min={0} formatter={moneyFormat} {...inputProps} />
  }
}
