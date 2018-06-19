import React from 'react'

import { block } from '../utils'
import InputField from './InputField'

@block
export default class MoneyField extends React.PureComponent {
  static defaultFieldProps = {
    unit: ({ unit, context: { i18n } }) => (unit ? unit : i18n.money.unit),
    normalizer: ({ precision, context: { i18n } }) => value => {
      precision =
        !precision && precision !== 0 ? i18n.money.precision : precision
      if (!value) {
        return
      }
      if (value.includes('.') && ![...value].every(c => '0.'.includes(c))) {
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
    const { className, precision, onChange, ...props } = this.props
    const order =
      !precision && precision !== 0 ? props.i18n.money.precision : precision
    if (!props.min) {
      props.min = 0
    }
    props.type = 'number'
    return (
      <InputField
        className={b.mix(className)}
        onChange={value =>
          // Convert back exponential notation to classic number
          onChange(
            value && value.includes('e')
              ? parseFloat(value).toFixed(precision)
              : value
          )
        }
        step={order === 0 ? 1 : `0.${'0'.repeat(order - 1)}1`}
        {...props}
      />
    )
  }
}
