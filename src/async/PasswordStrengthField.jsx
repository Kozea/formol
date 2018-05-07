/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import ReactPasswordStrength from 'react-password-strength'

import { block } from '../utils'

@block
export default class PasswordStrengthField extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange({ password, isValid }) {
    const { onChange } = this.props
    onChange(
      isValid ? password : void 0,
      this.passwordInput.reactPasswordStrengthInput
    )
  }

  render(b) {
    const { className, name, value, i18n, ...props } = this.props
    return (
      <ReactPasswordStrength
        /* eslint-disable-next-line react/jsx-handler-names */
        changeCallback={this.handleChange}
        defaultValue={value}
        className={b.mix(className).s}
        ref={ref => (this.passwordInput = ref)}
        inputProps={{ name, ...props, type: 'password' }}
        scoreWords={[
          i18n.passwordStrength.weak,
          i18n.passwordStrength.okay,
          i18n.passwordStrength.good,
          i18n.passwordStrength.strong,
          i18n.passwordStrength.stronger,
        ]}
        tooShortWord={i18n.passwordStrength.tooshort}
      />
    )
  }
}
