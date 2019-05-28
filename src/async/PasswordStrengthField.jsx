import React from 'react'
import zxcvbn from 'zxcvbn'

import { block } from '../utils'
import PasswordField from '../fields/PasswordField'
import withLabel from '../utils/withLabel'

/* Inspired from https://github.com/mmw/react-password-strength
   Forked here to handle a value instead of a value and
   props change
*/

@withLabel
@block
export default class PasswordStrengthField extends React.PureComponent {
  static getState(value, minLength, userInputs) {
    return {
      value,
      score:
        !value || value.length < minLength
          ? -1 // Too short
          : zxcvbn(value, userInputs).score,
    }
  }

  static defaultProps = {
    minLength: 5,
    minScore: 3,
  }

  constructor(props) {
    super(props)
    this.state = {
      value: null,
      score: -1,
    }
    this.handleChange = this.handleChange.bind(this)
  }

  static getDerivedStateFromProps(
    { value, userInputs, minLength },
    { value: oldValue }
  ) {
    if (value !== oldValue) {
      return PasswordStrengthField.getState(value, minLength, userInputs)
    }
    return null
  }

  handleChange(value) {
    const { i18n, minScore, minLength, userInputs, onChange } = this.props
    const state = PasswordStrengthField.getState(value, minLength, userInputs)
    this.setState(state)
    onChange(value, state.score < minScore ? i18n.passwordStrength.error : '')
  }

  render(b) {
    const {
      className,
      i18n,
      minScore,
      scoreWords,
      onChange,
      ...props
    } = this.props
    const { score } = this.state
    const description = (scoreWords || [
      i18n.passwordStrength.tooshort,
      i18n.passwordStrength.weak,
      i18n.passwordStrength.okay,
      i18n.passwordStrength.good,
      i18n.passwordStrength.strong,
      i18n.passwordStrength.stronger,
    ])[score + 1]

    return (
      <div className={b.m({ score: score + 1 })}>
        <PasswordField
          className={b.mix(className)}
          onChange={this.handleChange}
          {...props}
        />
        <div className={b.e('strength')} />
        <span className={b.e('description')}>{description}</span>
      </div>
    )
  }
}
