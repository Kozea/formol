import React from 'react'
import { FixedSizeList } from 'react-window'

const height = 35

export default class MenuList extends React.PureComponent {
  render() {
    let { children } = this.props
    const { options, maxHeight, getValue, innerRef } = this.props
    const [value] = getValue()
    const initialOffset = options.indexOf(value) * height

    if (!Array.isArray(children)) {
      children = [children]
    }

    return (
      <div ref={innerRef}>
        <FixedSizeList
          height={Math.min(maxHeight, height * children.length)}
          itemCount={children.length}
          itemSize={height}
          initialScrollOffset={initialOffset}
        >
          {({ index, style }) => <div style={style}>{children[index]}</div>}
        </FixedSizeList>
      </div>
    )
  }
}
