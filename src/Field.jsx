import React from 'react'

import { FieldBase } from './FieldBase'
import { block } from './utils'
import fieldPropsAdapter from './utils/fieldPropsAdapter'

@fieldPropsAdapter
@block
export default class Field extends React.PureComponent {
  render(b) {
    const FieldComp = this.props.fieldComponent || FieldBase
    return <FieldComp {...this.props} b={b} />
  }
}
