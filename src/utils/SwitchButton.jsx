import './SwitchButton.sass'

import React from 'react'

import BooleanField from '../fields/BooleanField'
import { block } from '../utils'

const b = block('SwitchButton')

export default function SwitchButton({
  name,
  label,
  labelRight,
  mode,
  className,
  disabled,
  ...props
}) {
  mode = mode === 'select' ? 'select' : 'switch'
  name = name || Math.random()
  return (
    <div className={b.mix(className).m({ mode, disabled })}>
      {label && <label htmlFor={name}>{label}</label>}
      <BooleanField
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
