import React from 'react'

import { block } from './utils'

@block
export default class Inliner extends React.PureComponent {
  render(b) {
    const { children } = this.props
    return <div className={b}>{children}</div>
  }
}
