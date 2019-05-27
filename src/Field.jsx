import React from 'react'

import { FieldBase } from './FieldBase'
import { block } from './utils'
import fieldPropsAdapter from './utils/fieldPropsAdapter'

@fieldPropsAdapter
@block
export default class Field extends React.PureComponent {
  render(b) {
    const { fieldComponent, ...rest } = this.props
    const FieldComp = fieldComponent || FieldBase
    return <FieldComp {...rest} b={b} />
  }
}
