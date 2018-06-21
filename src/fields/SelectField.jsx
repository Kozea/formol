import deepEqual from 'deep-equal'
import React from 'react'

import { block, normalizeChoices, normalizeMultipleProps } from '../utils'

@block
export default class SelectField extends React.PureComponent {
  static memoPrefix = '##formol_memo_'

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      choices: [],
      _rawChoices: [],
      value: null,
      _rawValue: null,
      objectMemo: {},
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { choices, multiple, value } = normalizeMultipleProps(nextProps)
    let state = null

    if (choices !== prevState._rawChoices) {
      const newMemo = {}
      const normalizedChoices = normalizeChoices({ choices }).map(
        ([key, val], i) => {
          if (typeof val === 'string') {
            return [key, val]
          }
          const memoKey = `${SelectField.memoPrefix}${i}`
          newMemo[memoKey] = val
          return [key, memoKey]
        }
      )
      state = {
        choices: normalizedChoices,
        objectMemo: newMemo,
        _rawChoices: choices,
      }
    }
    if (value !== prevState._rawValue) {
      const { objectMemo } = state || prevState
      let newValue = value
      if (Object.keys(objectMemo).length) {
        const getToMemoMaybe = val => {
          const memo = Object.entries(objectMemo).find(entry =>
            deepEqual(entry[1], val)
          )
          return memo ? memo[0] : val
        }
        newValue = multiple ? value.map(getToMemoMaybe) : getToMemoMaybe(value)
      }
      state = {
        ...(state || {}),
        value: newValue,
      }
    }
    return state
  }

  handleChange(e) {
    const { objectMemo } = this.state
    const { multiple, onChange } = this.props
    const getFromMemoMaybe = v =>
      v.startsWith(SelectField.memoPrefix) ? objectMemo[v] : v
    return onChange(
      multiple
        ? [...e.target.options]
            .filter(o => o.selected)
            .map(o => getFromMemoMaybe(o.value))
        : getFromMemoMaybe(e.target.value)
    )
  }

  render(b) {
    const {
      i18n,
      readOnly,
      className,
      elementRef,
      onChange,
      ...props
    } = this.props
    const { value } = this.state
    if (readOnly) {
      props.disabled = true
    }
    const { choices } = this.state

    return (
      <select
        ref={elementRef}
        className={b.mix(className)}
        onChange={this.handleChange}
        {...props}
        value={value}
      >
        {choices.every(([k]) => k) && <option value="" />}
        {choices.map(([label, key]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    )
  }
}
