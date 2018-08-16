import deepEqual from 'deep-equal'
import React from 'react'
import Select from 'react-select'

import { block } from '../utils'
import choicesAdapter from '../utils/choicesAdapter'
import memoizedChoices from '../utils/memoizedChoices'
import MenuList from '../utils/MenuList'
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
    this.select = React.createRef()
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { choices } = nextProps
    let state = null
    if (!deepEqual(choices, prevState._rawChoices, { strict: true })) {
      const options = choices.map(([label, choice]) => ({
        value: choice,
        label,
      }))
      state = {
        options,
        _rawChoices: choices,
      }
    }

    return state
  }

  componentDidMount() {
    const { className, elementRef } = this.props
    elementRef.current = this.select.current.select.inputRef
    elementRef.current.classList.add(className)
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
      ...props
    } = this.props
    const { options } = this.state
    delete props.onChange

    const fullValue = multiple
      ? value.map(single => options.find(({ value: v }) => v === single))
      : options.find(({ value: v }) => v === value) || null

    const components = options.length > 30 ? { MenuList } : {}

    return (
      <Select
        className={b.s}
        ref={this.select}
        disabled={readOnly /* There's no readOnly */}
        options={options}
        isMulti={multiple}
        value={fullValue}
        components={components}
        onChange={this.handleChange}
        joinValues
        inputProps={{ className: b.e('input').s }}
        {...props}
      />
    )
  }
}
