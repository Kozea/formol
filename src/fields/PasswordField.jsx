import React from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

import { block } from '../utils'
import InputField from './InputField'

@block
export default class PasswordField extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      type: 'password',
    }
    this.handleBlur = this.handleBlur.bind(this)
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
  }

  handleVisibilityChange() {
    const { type } = this.state
    this.setState({ type: type === 'password' ? 'text' : 'password' })
  }

  handleBlur(e) {
    const { onBlur } = this.props
    this.setState({ type: 'password' })
    return onBlur(e)
  }

  render(b) {
    const { className, onBlur, ...props } = this.props
    const { type } = this.state
    return (
      <div className={b.e('wrapper')}>
        <InputField
          className={b.mix(className)}
          onBlur={this.handleBlur}
          {...props}
          type={type}
        />
        <button
          type="button"
          className={b.e('eye')}
          onClick={this.handleVisibilityChange}
        >
          {type === 'text' ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    )
  }
}
