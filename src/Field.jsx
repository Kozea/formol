import React from 'react'

import { FieldBase } from './FieldBase'
import { block } from './utils'
import fieldPropsAdapter from './utils/fieldPropsAdapter'

@fieldPropsAdapter
@block
export default class Field extends React.PureComponent {
  render(b) {
    console.log('props.fieldComponent', this.props.fieldComponent)
    const FieldComp = this.props.fieldComponent || FieldBase
    return <FieldComp {...this.props} b={b} />
  }
}
