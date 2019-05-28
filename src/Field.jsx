import React from 'react'

import { block } from './utils'
import fieldPropsAdapter from './utils/fieldPropsAdapter'

@fieldPropsAdapter
@block
export default class Field extends React.PureComponent {
  constructor(props) {
    super(props)
    this.element = React.createRef()
    this.state = {
      focus: false,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }

  componentDidMount() {
    const { register, name, validator, validityErrors } = this.props
    register(name, this.element, validator, validityErrors)
  }

  componentWillUnmount() {
    const { unregister, name } = this.props
    unregister(name)
    this.handleChange()
  }

  handleChange(value, error) {
    const { name, unformatter, handleChange } = this.props
    handleChange(name, unformatter(value), error)
  }

  handleFocus() {
    this.setState({
      focus: true,
    })
  }

  handleBlur() {
    const { name, value, normalizer, handleChange, handleEntered } = this.props
    // Normalize data
    const normalized = normalizer(value)
    if (normalized !== value) {
      handleChange(name, normalized)
    }
    this.setState({
      focus: false,
    })
    handleEntered(name)
  }

  render(b) {
    const {
      className,
      validator,
      formatter,
      normalizer,
      unformatter,
      TypeField,
      validityErrors,
      handleChange,
      handleEntered,
      register,
      unregister,
      children,
      ...props
    } = this.props
    const { focus } = this.state
    const Label = TypeField.formolFieldLabelElement || 'label'

    return (
      <TypeField
        elementRef={this.element}
        className={b.e('element')}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        focus={focus}
        LabelComponent={Label}
        fieldClassName={b.mix(className)}
        labelChildren={children}
        {...props}
      />
    )
  }
}
