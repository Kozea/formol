import React from 'react'

import { block, cleanProps, normalizeChoices } from '../utils'

@block
export default class RadiosField extends React.Component {
  render(b) {
    const { value, onChange, ...props } = this.props
    return (
      <fieldset className={b}>
        {normalizeChoices(props).map(([choice, choiceLabel]) => (
          <label
            key={choice}
            className={b.e('label').m({ on: choice === value })}
          >
            <input
              {...cleanProps(props)}
              type="radio"
              checked={choice === value}
              onChange={e => e.target.checked && onChange(choice)}
            />
            <span className={b.e('label-text')}>{choiceLabel}</span>
          </label>
        ))}
      </fieldset>
    )
  }
}
