import deepEqual from 'deep-equal'
import React from 'react'

export default function memoizedChoices(WrappedComponent) {
  return class MemoizedChoices extends React.PureComponent {
    static memoPrefix = '##formol_memo_'

    constructor(props) {
      super(props)
      this.state = {
        choices: [],
        _rawChoices: [],
        value: null,
        _rawValue: null,
        objectMemo: {},
      }
      this.handleChange = this.handleChange.bind(this)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      const { choices, multiple, value } = nextProps
      let state = null

      if (choices !== prevState._rawChoices) {
        const newMemo = {}
        const normalizedChoices = choices.map(([key, val], i) => {
          if (typeof val === 'string') {
            return [key, val]
          }
          const memoKey = `${MemoizedChoices.memoPrefix}${i}`
          newMemo[memoKey] = val
          return [key, memoKey]
        })
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
          newValue = multiple
            ? value.map(getToMemoMaybe)
            : getToMemoMaybe(value)
        }
        state = {
          ...(state || {}),
          value: newValue,
        }
      }
      return state
    }

    handleChange(value) {
      const { objectMemo } = this.state
      const { multiple, onChange } = this.props
      const getFromMemoMaybe = v =>
        v.startsWith(MemoizedChoices.memoPrefix) ? objectMemo[v] : v
      return onChange(
        multiple ? value.map(getFromMemoMaybe) : getFromMemoMaybe(value)
      )
    }

    render() {
      const { choices, value } = this.state
      return (
        <WrappedComponent
          {...this.props}
          onChange={this.handleChange}
          choices={choices}
          value={value}
        />
      )
    }
  }
}
