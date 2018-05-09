import React, { Fragment } from 'react'

import { block } from '../utils'

@block
export default class BooleanField extends React.Component {
  render(b) {
    const {
      value,
      i18n, // eslint-disable-line no-unused-vars
      readOnly,
      className,
      onChange,
      extraLabel,
      ...props
    } = this.props
    if (readOnly) {
      props.disabled = true
    }
    return (
      <Fragment>
        <input
          className={b.mix(className)}
          checked={value}
          onChange={e => onChange(e.target.checked, e.target)}
          {...props}
        />
        {extraLabel}
      </Fragment>
    )
  }
}
