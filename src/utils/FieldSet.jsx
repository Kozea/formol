import React from 'react'

import { block, cleanProps, normalizeChoices } from '../utils'

@block
export default class FieldSet extends React.Component {
  render(b) {
    const {
      type,
      isChecked,
      value,
      className,
      elementRef,
      onChange,
      ...props
    } = this.props
    return (
      <fieldset className={b.mix(className)} ref={elementRef}>
        {normalizeChoices(props).map(([choiceLabel, choice]) => (
          <label
            key={choice}
            className={b.e('label').m({ on: isChecked(choice, value) })}
          >
            <input
              {...cleanProps(props)}
              type={type}
              checked={isChecked(choice, value)}
              onChange={e => onChange(choice, value, e.target.checked)}
            />
            <span className={b.e('label-text')}>{choiceLabel}</span>
          </label>
        ))}
      </fieldset>
    )
  }
}
