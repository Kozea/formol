import React from 'react'
import { VariableSizeList } from 'react-window'

const sum = (a, b) => a + b

export default (listDefaultHeight = 19, listApproximatedLengthBreak = 50) =>
  class MenuList extends React.PureComponent {
    constructor(props) {
      super(props)
      this.itemSize = this.itemSize.bind(this)

      this.state = {
        rawChildren: null,
        maxHeight: null,
        initialScrollOffset: 0,
      }
    }

    static getDerivedStateFromProps(
      { children: rawChildren, options, maxHeight, getValue },
      state
    ) {
      if (rawChildren !== state.rawChildren || maxHeight !== state.maxHeight) {
        const [value] = getValue()

        const children = Array.isArray(rawChildren)
          ? rawChildren
          : [rawChildren]

        // Waiting for https://github.com/bvaughn/react-window/issues/6
        const heights = children.map(
          ({ props: { label } }) =>
            8 +
            8 +
            listDefaultHeight *
              Math.ceil((label || '_').length / listApproximatedLengthBreak)
        )
        const totalHeight = heights.reduce(sum)
        const height = Math.min(maxHeight, totalHeight)
        const itemCount = children.length
        // initialScrollOffset is wrong if the list is sorted
        const currentIndex =
          options.length === children.length ? options.indexOf(value) : 0
        const initialScrollOffset = Math.min(
          totalHeight - height,
          currentIndex > 0 ? heights.slice(0, currentIndex).reduce(sum) : 0
        )

        const estimatedItemSize = Math.floor(totalHeight / itemCount)

        return {
          height,
          itemCount,
          heights,
          estimatedItemSize,
          initialScrollOffset,
          maxHeight,
          rawChildren,
        }
      }
      return null
    }

    itemSize(index) {
      return this.state.heights[index]
    }

    render() {
      const { children, innerRef } = this.props
      const {
        height,
        itemCount,
        estimatedItemSize,
        initialScrollOffset,
      } = this.state
      const row = Array.isArray(children)
        ? ({ index, style }) => <div style={style}>{children[index]}</div>
        : ({ style }) => <div style={style}>{children}</div>
      return (
        <div ref={innerRef}>
          <VariableSizeList
            height={height}
            itemCount={itemCount}
            itemSize={this.itemSize}
            estimatedItemSize={estimatedItemSize}
            initialScrollOffset={initialScrollOffset}
          >
            {row}
          </VariableSizeList>
        </div>
      )
    }
  }
