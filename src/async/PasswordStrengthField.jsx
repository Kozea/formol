import React from 'react'
import FaEye from 'react-icons/lib/fa/eye'
import FaEyeSlash from 'react-icons/lib/fa/eye-slash'
import ReactPasswordStrength from 'react-password-strength'

import { block } from '../utils'

@block
export default class PasswordStrengthField extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 'password',
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
  }

  componentDidMount() {
    const { elementRef } = this.props
    elementRef.current = this.passwordInput.reactPasswordStrengthInput
  }

  componentWillUnmount() {
    const { elementRef } = this.props
    elementRef.current = null
  }

  handleChange({ password, isValid }) {
    const { onChange } = this.props
    onChange(isValid ? password : void 0)
  }

  handleVisibilityChange() {
    const { type } = this.state
    this.setState({ type: type === 'password' ? 'text' : 'password' })
  }

  render(b) {
    const { className, name, value, i18n, elementRef, ...props } = this.props
    const { type } = this.state

    return (
      <div className={b.e('wrapper')}>
        <ReactPasswordStrength
          className={b.mix(className).s}
          /* eslint-disable-next-line react/jsx-handler-names */
          changeCallback={this.handleChange}
          defaultValue={value}
          ref={ref => (this.passwordInput = ref)}
          inputProps={{ name, ...props, type }}
          scoreWords={[
            i18n.passwordStrength.weak,
            i18n.passwordStrength.okay,
            i18n.passwordStrength.good,
            i18n.passwordStrength.strong,
            i18n.passwordStrength.stronger,
          ]}
          tooShortWord={i18n.passwordStrength.tooshort}
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
