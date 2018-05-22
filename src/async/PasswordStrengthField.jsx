import './PasswordStrengthField.sass'

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

  render(b) {
    const { className, name, value, i18n, elementRef, ...props } = this.props
    return (
      <ReactPasswordStrength
        className={b.mix(className).s}
        /* eslint-disable-next-line react/jsx-handler-names */
        changeCallback={this.handleChange}
        defaultValue={value}
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
