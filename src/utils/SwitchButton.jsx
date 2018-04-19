import './SwitchButton.sass'

import React from 'react'

import { block } from '../utils'

const b = block('SwitchButton')
export default function SwitchButton({
  name,
  label,
  labelRight,
  disabled,
  mode,
  className,
  onChange,
  ...props
}) {
  mode = mode === 'select' ? 'select' : 'switch'
  name = name || Math.random()
  return (
    <div className={b.mix(className).m({ mode, disabled })}>
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
