import block from 'bemboo'
import React from 'react'

import { moneyFormat } from '../../utils'
import Field from './Field'

@block
export default class MoneyField extends React.Component {
  render() {
    const { ...inputProps } = this.props
    return <Field min={0} formatter={moneyFormat} {...inputProps} />
  }
}
