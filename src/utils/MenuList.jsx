import React from 'react'
import { VariableSizeList } from 'react-window'

const sum = (a, b) => a + b

export default (listDefaultHeight = 19, listApproximatedLengthBreak = 50) =>
  class MenuList extends React.PureComponent {
    constructor(props) {
      super(props)

      this.list = React.createRef()
    }

    componentDidMount() {
      this.list.current.resetAfterIndex(0)
    }

    render() {
      let { children } = this.props
      const { options, maxHeight, getValue, innerRef } = this.props
      const [value] = getValue()

      if (!Array.isArray(children)) {
        children = [children]
      }

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
      const initialScrollOffset =
        currentIndex > 0 ? heights.slice(0, currentIndex).reduce(sum) : 0
      const estimatedItemSize = Math.floor(totalHeight / itemCount)

      const itemSize = index => heights[index]

      return (
        <div ref={innerRef}>
          <VariableSizeList
            ref={this.list}
            height={height}
            itemCount={itemCount}
            itemSize={itemSize}
            estimatedItemSize={estimatedItemSize}
            initialScrollOffset={initialScrollOffset}
          >
            {({ index, style }) => <div style={style}>{children[index]}</div>}
          </VariableSizeList>
        </div>
      )
    }
  }
