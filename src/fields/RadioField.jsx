import React from 'react'

import { block } from '../utils'
import BooleanField from './BooleanField'
import withLabel from '../utils/withLabel'

@withLabel
@block
export default class RadioField extends React.PureComponent {
  static defaultFieldProps = {
    classNameModifiers: (_, value) => ({
      label: { on: value },
    }),
  }
  render(b) {
    const { className, ...props } = this.props
    return <BooleanField className={b.mix(className)} {...props} />
  }
}
