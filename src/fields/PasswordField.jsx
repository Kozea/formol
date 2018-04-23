/* eslint-disable react/prefer-stateless-function */
import React from 'react'

import ReactPasswordStrength from '../async/ReactPasswordStrength'
import { block } from '../utils'

@block
export default class PasswordField extends React.Component {
  render(b) {
    const { className, name, onChange, ...props } = this.props
    return (
      <ReactPasswordStrength
        changeCallback={({ password, isValid }) =>
          onChange({ target: { value: isValid ? password : false } })
        }
        className={b.mix(className).s}
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
