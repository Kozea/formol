import React from 'react'

import { block } from '../utils'
import InputField from './InputField'

const MAX_SAFE_INTEGER = 9007199254740991 // Number.MAX_SAFE_INTEGER

@block
export default class MoneyField extends React.PureComponent {
  static defaultFieldProps = {
    unit: ({ unit, context: { i18n } }) => (unit ? unit : i18n.money.unit),
    normalizer: ({ precision, context: { i18n } }) => value => {
      precision = precision === void 0 ? i18n.money.precision : precision
      if (!value) {
        return
      }
      if (value.includes('.')) {
        const decimalLength = value.split('.')[1].length
        if (decimalLength > precision) {
          value = value.slice(0, precision - decimalLength)
        } else if (decimalLength < precision) {
          value += '0'.repeat(precision - decimalLength)
        }
      }
      return value
    },
  }

  render(b) {
    const { className, precision, ...props } = this.props
    const order = precision === void 0 ? props.i18n.money.precision : precision
    if (props.min === void 0) {
      props.min = 0
    }
    if (props.max === void 0 || props.max > MAX_SAFE_INTEGER) {
      props.max = MAX_SAFE_INTEGER
    }
    props.type = 'number'
    return (
      <InputField
        className={b.mix(className)}
        step={Math.pow(10, -order)}
        {...props}
      />
    )
  }
}
