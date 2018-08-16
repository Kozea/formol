import React from 'react'
import { FixedSizeList } from 'react-window'

const height = 35

export default class MenuList extends React.PureComponent {
  render() {
    const { options, children, maxHeight, getValue } = this.props
    const [value] = getValue()
    const initialOffset = options.indexOf(value) * height

    return (
      <FixedSizeList
        height={maxHeight || 0}
        itemCount={children.length}
        itemSize={height}
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </FixedSizeList>
    )
  }
}
