import React from 'react'

import { block, cleanProps, normalizeChoices } from '../utils'

@block
export default class CheckboxesField extends React.Component {
  render(b) {
    const { value, onChange, ...props } = this.props
    const values = value || []
    return (
      <fieldset className={b}>
        {normalizeChoices(props).map(([choice, choiceLabel]) => (
          <label
            key={choice}
            className={b.e('label').m({ on: values.includes(choice) })}
          >
            <input
              {...cleanProps(props)}
              type="checkbox"
              checked={values.includes(choice)}
              onChange={e =>
                onChange(
                  e.target.checked
                    ? [...values, choice]
                    : values.filter(val => val !== choice)
                )
              }
            />
            <span className={b.e('label-text')}>{choiceLabel}</span>
          </label>
        ))}
      </fieldset>
    )
  }
}
