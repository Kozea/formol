import {
  AllSubstringsIndexStrategy,
  Search,
  UnorderedSearchIndex,
} from 'js-search'
import React from 'react'
import Select, { makeAnimated } from 'react-select'
import deepEqual from 'deep-equal'

import { block, noOp } from '../utils'
import choicesAdapter from '../utils/choicesAdapter'
import getMenuList from '../utils/MenuList'
import memoizedChoices from '../utils/memoizedChoices'
import multipleAdapter from '../utils/multipleAdapter'
import withLabel from '../utils/withLabel'

export const DELIMITER = '__/__'

@multipleAdapter
@choicesAdapter
@memoizedChoices
@withLabel
@block
export default class SelectMenuField extends React.PureComponent {
  static defaultProps = {
    virtualizedThreshold: 100,
  }

  constructor(props) {
    super(props)
    this.state = {
      inputValue: null,
      search: null,
      filterOptions: null,
      options: [],
      value: null,
      _rawChoices: null,
      _rawValue: null,
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
      elementRef: { current },
      indexes,
      value,
      multiple,
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
    if (
      !deepEqual(value, prevState._rawValue, { strict: true }) ||
      (state && state.options)
    ) {
      const opts = state ? state.options : prevState.options
      state = {
        ...(state === null ? {} : state),
        value: multiple
          ? value.map(single => opts.find(({ value: v }) => v === single))
          : opts.find(({ value: v }) => v === value) || null,
        _rawValue: value,
      }
      current && (current.value = value)
    }

    return state
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
      placeholder,
      value: rawValue,
      choices,
      searchIndex,
      indexStrategy,
      sanitizer,
      tokenizer,
      indexes,
      windowThreshold,
      elementRef,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      animated,
      styles,
      listApproximatedLengthBreak,
      listDefaultHeight,
      virtualizedThreshold,
      ...props
    } = this.props
    const { value, options } = this.state
    const virtualized = options.length > virtualizedThreshold
    return (
      <div className={b}>
        <Select
          className={b.e('select')}
          classNamePrefix={b.s}
          ref={this.select}
          isDisabled={disabled || readOnly /* There's no readOnly */}
          options={options}
          placeholder={placeholder || i18n.selectMenu.select}
          isMulti={multiple}
          value={value}
          components={{
            ...(animated === false ? {} : makeAnimated()),
            ...(virtualized
              ? {
                  MenuList: getMenuList(
                    listDefaultHeight,
                    listApproximatedLengthBreak
                  ),
                }
              : {}),
          }}
          onChange={this.handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          onInputChange={this.handleInputChange}
          delimiter={DELIMITER}
          styles={styles}
          isClearable
          filterOption={this.filter}
          noOptionsMessage={i18n.selectMenu.noOptions}
          loadingMessage={i18n.selectMenu.loading}
        />
        {
          // We have to add another input field since the
          // react-select one is not overridable
        }
        <input
          className={b.mix(className).e('hidden-input')}
          ref={elementRef}
          {...props}
          value={multiple ? rawValue.join(DELIMITER) : rawValue}
          onChange={noOp}
          type="text"
        />
      </div>
    )
  }
}
