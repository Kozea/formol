import deepEqual from 'deep-equal'
import {
  AllSubstringsIndexStrategy,
  Search,
  UnorderedSearchIndex,
} from 'js-search'
import React from 'react'
import { makeAnimated } from 'react-select'
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
      inputValue: null,
      search: null,
      filterOptions: null,
      options: [],
      _rawChoices: null,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.filter = this.filter.bind(this)
    this.select = React.createRef()
    this.searchResults = null
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      choices,
      searchIndex,
      indexStrategy,
      sanitizer,
      tokenizer,
      indexes,
    } = nextProps
    let state = null
    if (!deepEqual(choices, prevState._rawChoices, { strict: true })) {
      const options = choices.map(([label, choice]) => ({
        value: choice,
        label,
      }))

      // Prepare a searcher
      const search = new Search('value')
      search.searchIndex = searchIndex || new UnorderedSearchIndex()
      search.indexStrategy = indexStrategy || new AllSubstringsIndexStrategy()
      if (sanitizer) {
        search.sanitizer = sanitizer
      }

      if (tokenizer) {
        search.tokenizer = tokenizer
      }

      if (indexes) {
        indexes.forEach(index => {
          search.addIndex(index)
        })
      } else {
        search.addIndex('label')
      }

      search.addDocuments(options)

      state = {
        options,
        search,
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

  handleInputChange(inputValue) {
    const { search } = this.state
    this.setState({ inputValue })
    this.searchResults = inputValue
      ? search.search(inputValue).map(({ value }) => value)
      : null
  }

  filter({ value }) {
    // Looking up in the precomputed results
    return this.searchResults ? this.searchResults.indexOf(value) > -1 : true
  }

  render(b) {
    const {
      i18n,
      className,
      multiple,
      readOnly,
      disabled,
      value,
      choices,
      searchIndex,
      indexStrategy,
      sanitizer,
      tokenizer,
      indexes,
      windowThreshold,
      onChange,
      animated,
      ...props
    } = this.props
    const { options } = this.state

    const fullValue = multiple
      ? value.map(single => options.find(({ value: v }) => v === single))
      : options.find(({ value: v }) => v === value) || null

    return (
      <Select
        className={b.s}
        ref={this.select}
        isDisabled={disabled || readOnly /* There's no readOnly */}
        options={options}
        isMulti={multiple}
        value={fullValue}
        components={{ ...(animated === false ? {} : makeAnimated()), MenuList }}
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
        delimiter="__/__"
        isClearable
        inputProps={{ className: b.e('input').s }}
        filterOption={this.filter}
        {...props}
      />
    )
  }
}
