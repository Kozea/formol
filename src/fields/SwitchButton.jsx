import './SwitchButton.sass'

import block from 'bemboo'
import React from 'react'

const b = block('SwitchButton')

export function SwitchButton({
  name,
  label,
  labelRight,
  disabled,
  mode,
  onChange,
  ...props
}) {
  mode = mode === 'select' ? 'select' : 'switch'
  name = name || Math.random()
  return (
    <div className={b.m({ mode, disabled })}>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        onChange={onChange}
        id={name}
        name={name}
        type="checkbox"
        disabled={disabled}
        {...props}
      />
      <label htmlFor={name} />
      {labelRight && <label htmlFor={name}>{labelRight}</label>}
    </div>
  )
}
