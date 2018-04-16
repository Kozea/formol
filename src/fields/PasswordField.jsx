/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import ReactPasswordStrength from 'react-password-strength'

export default class PasswordField extends React.Component {
  render() {
    const { className, login, name, onChange, ...props } = this.props
    if (login) {
      return (
        <input
          className={className}
          name={name}
          onChange={onChange}
          type="password"
          {...props}
        />
      )
    }
    return (
      <ReactPasswordStrength
        changeCallback={({ password, isValid }) =>
          onChange({ target: { value: isValid ? password : false } })
        }
        className={className.s}
        inputProps={{ name, ...props }}
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
