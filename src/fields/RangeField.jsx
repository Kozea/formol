import React from 'react'

import { block } from '../utils'
import NumberField from './NumberField'

@block
export default class RangeField extends React.PureComponent {
  static defaultProps = {
    min: 0,
    max: 100,
  }

  render(b) {
    const { className, noLabels, min, max, value, ...props } = this.props
    const range = (
      <NumberField
        className={b.e('range').mix(className)}
        min={min}
        max={max}
        value={value}
        {...props}
      />
    )
    return (
      <div className={b}>
        {noLabels ? (
          range
        ) : (
          <>
            <div className={b.e('min')}>{min}</div>
            <div className={b.e('value-wrapper')}>
              {range}
              <span className={b.e('value')}>
                {[null, void 0, ''].includes(value) ? '' : value}
              </span>
            </div>
            <div className={b.e('max')}>{max}</div>
          </>
        )}
      </div>
    )
  }
}
