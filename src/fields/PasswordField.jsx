import React from 'react'
import FaEye from 'react-icons/lib/fa/eye'
import FaEyeSlash from 'react-icons/lib/fa/eye-slash'

import { block } from '../utils'
import InputField from './InputField'

@block
export default class PasswordField extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 'password',
    }
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
  }

  handleVisibilityChange() {
    const { type } = this.state
    this.setState({ type: type === 'password' ? 'text' : 'password' })
  }

  render(b) {
    const { className, ...props } = this.props
    const { type } = this.state
    return (
      <div className={b.e('wrapper')}>
        <InputField className={b.mix(className)} {...props} type={type} />
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
