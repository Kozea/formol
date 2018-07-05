import React from 'react'

import BooleanField from '../fields/BooleanField'
import { block } from '../utils'
import choicesAdapter from './choicesAdapter'

@choicesAdapter
@block
export default class FieldSet extends React.PureComponent {
  render(b) {
    const {
      type,
      isChecked,
      value,
      choices,
      elementRef,
      onChange,
      ...props
    } = this.props
    return (
      <fieldset className={b} ref={elementRef}>
        {choices.map(([choiceLabel, choice]) => (
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
