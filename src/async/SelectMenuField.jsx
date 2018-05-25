import 'react-select/dist/react-select.css'

import React from 'react'
import Select from 'react-select'

import { block, normalizeMultipleProps } from '../utils'

@block
export default class SelectMenuField extends React.Component {
  componentDidMount() {
    const { elementRef } = this.props
    elementRef.current = this.select.input.input
  }

  componentWillUnmount() {
    const { elementRef } = this.props
    elementRef.current = null
  }

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
      i18n,
      className,
      multiple,
      readOnly,
      value,
      nonStringValue,
      choiceGetter,
      ...inputProps
    } = normalizeMultipleProps(this.props)
    delete inputProps.onChange
    const maybeStringify = v =>
      nonStringValue ? JSON.stringify(choiceGetter(v)[0]) : v
    const { choices } = this.props
    const options = Object.entries(choices).map(([choiceLabel, choice]) => ({
      value: maybeStringify(choice),
      label: choiceLabel,
    }))
    const strValue = multiple
      ? value.map(maybeStringify)
      : maybeStringify(value)
    return (
      <Select
        className={b.mix(className).s}
        ref={ref => (this.select = ref)}
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
