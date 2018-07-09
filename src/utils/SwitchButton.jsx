import React from 'react'

import BooleanField from '../fields/BooleanField'
import { block } from '../utils'

@block
export default class SwitchButton extends React.PureComponent {
  static defaultProps = {
    mode: 'switch',
    name: Math.random(),
  }
  render(b) {
    const { type, name, label, labelRight, mode, ...props } = this.props
    return (
      <div className={b.m({ mode })}>
        {label && <label htmlFor={name}>{label}</label>}
        <BooleanField id={name} name={name} type="checkbox" {...props} />
        <label htmlFor={name} />
        {labelRight && <label htmlFor={name}>{labelRight}</label>}
      </div>
    )
  }
}
