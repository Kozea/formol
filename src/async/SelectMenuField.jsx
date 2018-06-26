import 'react-select/dist/react-select.css'
import 'react-virtualized-select/styles.css'

import React from 'react'
import createFilterOptions from 'react-select-fast-filter-options'
import VirtualizedSelect from 'react-virtualized-select'

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
    this.state = {
      filterOptions: null,
      options: [],
      _rawChoices: null,
    }

    this.handleChange = this.handleChange.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { choices } = nextProps
    let state = null

    if (choices !== prevState._rawChoices) {
      const options = choices.map(([label, choice]) => ({
        value: choice,
        label,
      }))
      state = {
        options,
        filterOptions: createFilterOptions({ options }),
        _rawChoices: choices,
      }
    }

    return state
  }

  componentDidMount() {
    const { elementRef } = this.props
    elementRef.current = this.select._selectRef.input.input
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
    const { options, filterOptions } = this.state
    delete inputProps.onChange

    return (
      <VirtualizedSelect
        className={b.mix(className).s}
        ref={ref => (this.select = ref)}
        disabled={readOnly /* There's no readOnly */}
        options={options}
        filterOptions={filterOptions}
        multi={multiple}
        value={value}
        onChange={this.handleChange}
        {...inputProps}
      />
    )
  }
}
