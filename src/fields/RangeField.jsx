import React from 'react'

import { block } from '../utils'
import NumberField from './NumberField'

@block
export default class RangeField extends React.PureComponent {
  render(b) {
    const { className, noLabels, ...props } = this.props
    return (
      <div className={b.mix(className)}>
        {!noLabels && <span className={b.e('min')}>{props.min || 0}</span>}
        <NumberField className={b.e('range')} {...props} />
        {!noLabels && (
          <span className={b.e('value')}>
            {[null, void 0, ''].includes(props.value) ? '?' : props.value}
          </span>
        )}
        {!noLabels && ' / '}
        {!noLabels && <span className={b.e('max')}>{props.max || 100}</span>}
      </div>
    )
  }
}
