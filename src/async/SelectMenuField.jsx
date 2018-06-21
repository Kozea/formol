import 'react-select/dist/react-select.css'

import React from 'react'
import Select from 'react-select'

import { block } from '../utils'
import choicesAdapter from '../utils/choicesAdapter'
import memoizedChoices from '../utils/memoizedChoices'
import multipleAdapter from '../utils/multipleAdapter'

@multipleAdapter
@choicesAdapter
@memoizedChoices
@block
export default class SelectMenuField extends React.PureComponent {
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
    const { multiple, onChange } = this.props
    return onChange(
      newValue &&
        (multiple ? newValue.map(({ value }) => value) : newValue.value)
    )
  }

  render(b) {
    const {
      i18n,
      className,
      multiple,
      readOnly,
      value,
      choices,
      ...inputProps
    } = this.props
    delete inputProps.onChange
    const options = choices.map(([label, choice]) => ({
      value: choice,
      label,
    }))

    return (
      <Select
        className={b.mix(className).s}
        ref={ref => (this.select = ref)}
        disabled={readOnly /* There's no readOnly */}
        options={options}
        multi={multiple}
        value={value}
        onChange={this.handleChange}
        {...inputProps}
      />
    )
  }
}
