/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import ReactPasswordStrength from 'react-password-strength'

import { block } from '../utils'

@block
export default class PasswordField extends React.Component {
  render(b) {
    const { className, name, value, onChange, ...props } = this.props
    return (
      <ReactPasswordStrength
        changeCallback={({ password, isValid }) =>
          onChange(isValid ? password : false)
        }
        defaultValue={value}
        className={b.mix(className).s}
        inputProps={{ name, ...props, type: 'password' }}
        scoreWords={[
          'très peu sécurisé',
          'peu sécurisé',
          'correct',
          'sécurisé',
          'très sécurisé',
        ]}
        tooShortWord="trop court"
      />
    )
  }
}
