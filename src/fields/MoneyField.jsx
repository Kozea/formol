import React from 'react'

import { block } from '../utils'
import NumberField from './NumberField'

const MAX_SAFE_INTEGER = 9007199254740991 // Number.MAX_SAFE_INTEGER

@block
export default class MoneyField extends React.PureComponent {
  static defaultFieldProps = {
    unit: ({ unit, context: { i18n } }) => (unit ? unit : i18n.money.unit),
  }

  render(b) {
    const { value, className, onChange, precision, ...props } = this.props
    const order = precision === void 0 ? props.i18n.money.precision : precision
    const scale = Math.pow(10, order)
    if (props.min === void 0) {
      props.min = 0
    }
    if (props.max === void 0 || props.max > MAX_SAFE_INTEGER / (scale * 10)) {
      props.max = MAX_SAFE_INTEGER / (scale * 10)
    }
    props.type = 'number'
    return (
      <NumberField
        className={b.mix(className)}
        onChange={v => onChange(v || v === 0 ? Math.round(v * scale) : '')}
        value={value || value === 0 ? value / scale : value}
        step={1 / scale}
        {...props}
      />
    )
  }
}
