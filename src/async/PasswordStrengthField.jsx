import React from 'react'
import zxcvbn from 'zxcvbn'

import { block } from '../utils'
import PasswordField from '../fields/PasswordField'

/* Inspired from https://github.com/mmw/react-password-strength
   Forked here to handle a value instead of a value and
   props change
*/
@block
export default class PasswordStrengthField extends React.PureComponent {
  static getState(value, minScore, minLength, userInputs, basic) {
    const rawScore = zxcvbn(value, userInputs).score

    return {
      value,
      score:
        !value || value.length < minLength
          ? -1 // Too short
          : basic
            ? Math.floor(rawScore / minScore)
            : rawScore,
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
      isPristine: true,
    }
    this.handleChange = this.handleChange.bind(this)
  }

  static getDerivedStateFromProps(
    { value, userInputs, minLength, minScore, basic },
    { value: oldValue }
  ) {
    if (value !== oldValue) {
      return PasswordStrengthField.getState(
        value,
        minScore,
        minLength,
        userInputs,
        basic
      )
    }
    return null
  }

  handleChange(value) {
    const { i18n, minScore, minLength, userInputs, onChange, basic } =
      this.props
    const state = PasswordStrengthField.getState(
      value,
      minScore,
      minLength,
      userInputs,
      basic
    )
    this.setState((prevState) => ({
      ...state,
      isPristine: prevState.isPristine && value.length === 0,
    }))
    const isTooWeak = basic ? state.score < 1 : state.score < minScore
    onChange(value, isTooWeak ? i18n.passwordStrength.error : '')
  }

  render(b) {
    const { className, i18n, scoreWords, onChange, minScore, basic, ...props } =
      this.props
    const { value, score, isPristine } = this.state
    const strengthLevels = basic
      ? [
          i18n.passwordStrength.tooshort,
          i18n.passwordStrength.weak,
          i18n.passwordStrength.strong,
        ]
      : [
          i18n.passwordStrength.tooshort,
          i18n.passwordStrength.tooweak,
          i18n.passwordStrength.weak,
          i18n.passwordStrength.average,
          i18n.passwordStrength.strong,
          i18n.passwordStrength.stronger,
        ]
    const description = (scoreWords || strengthLevels)[score + 1]

    return (
      <div className={b.e(`${basic ? 'basic' : 'default'}`)}>
        <div className={b.m({ score: score + 1 })}>
          <PasswordField
            className={b.mix(className)}
            onChange={this.handleChange}
            {...props}
          />
          <div className={b.m({ pristine: !value && isPristine })}>
            <div className={b.e('strength')} />
            <span className={b.e('description')}>{description}</span>
          </div>
        </div>
      </div>
    )
  }
}
