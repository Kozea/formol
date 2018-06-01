import 'react-select/dist/react-select.css'

import React from 'react'
import Select from 'react-select'

import { block, normalizeChoices, normalizeMultipleProps } from '../utils'

@block
export default class SelectMenuField extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }
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
    const normalizedChoices = normalizeChoices(this.props)
    const {
      i18n,
      className,
      multiple,
      readOnly,
      value,
      nonStringValue,
      ...inputProps
    } = normalizeMultipleProps(this.props)
    delete inputProps.onChange
    const maybeStringify = v => (nonStringValue ? JSON.stringify(v) : v)
    const options = normalizedChoices.map(([label, choice]) => ({
      value: maybeStringify(choice),
      label,
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
        onChange={this.handleChange}
        {...inputProps}
      />
    )
  }
}
