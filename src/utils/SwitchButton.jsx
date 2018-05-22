import './SwitchButton.sass'

import React from 'react'

import BooleanField from '../fields/BooleanField'
import { block } from '../utils'

// eslint-disable-next-line react/prefer-stateless-function
@block
export default class SwitchButton extends React.Component {
  static defaultProps = {
    mode: 'switch',
    name: Math.random(),
  }
  render(b) {
    const {
      type,
      name,
      label,
      labelRight,
      mode,
      className,
      ...props
    } = this.props
    return (
      <div className={b.mix(className).m({ mode })}>
        {label && <label htmlFor={name}>{label}</label>}
        <BooleanField id={name} name={name} type="checkbox" {...props} />
        <label htmlFor={name} />
        {labelRight && <label htmlFor={name}>{labelRight}</label>}
      </div>
    )
  }
}
