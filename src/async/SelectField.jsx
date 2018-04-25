import 'react-select/dist/react-select.css'

import React from 'react'
import Select from 'react-select'

import { block } from '../utils'

@block
export default class SelectField extends React.Component {
  handleChange(newValue) {
    const { multiple, nonStringValue, onChange } = this.props
    const maybeParse = v => (nonStringValue ? JSON.parse(v) : v)
    return onChange(
      newValue &&
        (multiple
          ? newValue.map(({ value }) => maybeParse(value))
          : maybeParse(newValue.value))
    )
  }

  render(b) {
    const {
      className,
      multiple,
      readOnly,
      value,
      nonStringValue,
      choiceGetter,
      ...inputProps
    } = this.props
    delete inputProps.onChange
    const maybeStringify = v =>
      nonStringValue ? JSON.stringify(choiceGetter(v)[0]) : v
    const { choices } = this.props
    const options = choices.map(([key, val]) => ({
      value: maybeStringify(key),
      label: val,
    }))
    const strValue = multiple
      ? (value || []).map(maybeStringify)
      : maybeStringify(value)
    return (
      <Select
        className={b.mix(className).s}
        disabled={readOnly /* There's no readOnly */}
        options={options}
        multi={multiple}
        value={strValue}
        onChange={o => this.handleChange(o)}
        {...inputProps}
      />
    )
  }
}
