import React from 'react'

import BooleanField from '../fields/BooleanField'
import { block, normalizeChoices } from '../utils'

@block
export default class FieldSet extends React.Component {
  render(b) {
    const normalizedChoices = normalizeChoices(this.props)
    const {
      type,
      isChecked,
      value,
      choices,
      className,
      elementRef,
      onChange,
      ...props
    } = this.props
    return (
      <fieldset className={b.mix(className)} ref={elementRef}>
        {normalizedChoices.map(([choiceLabel, choice]) => (
          <label
            key={choice}
            className={b.e('label').m({ on: isChecked(choice, value) })}
          >
            <BooleanField
              {...props}
              type={type}
              checked={isChecked(choice, value)}
              onChange={checked => onChange(choice, value, checked)}
            />
            <span className={b.e('label-text')}>{choiceLabel}</span>
          </label>
        ))}
      </fieldset>
    )
  }
}
