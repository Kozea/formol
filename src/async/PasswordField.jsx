/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import ReactPasswordStrength from 'react-password-strength'

import { block } from '../utils'

@block
export default class PasswordField extends React.Component {
  render(b) {
    const { className, name, value, i18n, onChange, ...props } = this.props
    return (
      <ReactPasswordStrength
        changeCallback={({ password, isValid }) =>
          onChange(isValid ? password : void 0)
        }
        defaultValue={value}
        className={b.mix(className).s}
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
