import React from 'react'
import { VariableSizeList } from 'react-window'

const sum = (a, b) => a + b

class OptionWrapper extends React.PureComponent {
  render() {
    const { style, index, data } = this.props
    return <div style={style}>{data[index]}</div>
  }
}

export default (listDefaultHeight = 19, listApproximatedLengthBreak = 50) =>
  // eslint-disable-next-line react/no-multi-comp
  class MenuList extends React.PureComponent {
    constructor(props) {
      super(props)
      this.itemSize = this.itemSize.bind(this)
      this.list = React.createRef()

      this.state = {
        rawChildren: null,
        maxHeight: null,
        currentIndex: 0,
      }
    }

    static getDerivedStateFromProps(
      { children: rawChildren, maxHeight },
      state
    ) {
      if (rawChildren !== state.rawChildren || maxHeight !== state.maxHeight) {
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

        const focusedIndex = children.findIndex(
          ({ props: { isFocused } }) => isFocused
        )

        const currentIndex = Math.max(
          0,
          focusedIndex === -1
            ? children.findIndex(({ props: { isSelected } }) => isSelected)
            : focusedIndex
        )

        const estimatedItemSize = Math.floor(totalHeight / itemCount)
        return {
          height,
          itemCount,
          heights,
          estimatedItemSize,
          maxHeight,
          rawChildren,
          currentIndex,
        }
      }
      return null
    }

    componentDidMount() {
      this.componentDidUpdate()
    }

    componentDidUpdate() {
      const { currentIndex } = this.state
      this.list.current.scrollToItem(currentIndex)
    }

    itemSize(index) {
      return this.state.heights[index]
    }

    render() {
      const { children, innerRef } = this.props
      const { height, itemCount, estimatedItemSize } = this.state
      return (
        <div ref={innerRef}>
          <VariableSizeList
            ref={this.list}
            height={height}
            itemCount={itemCount}
            itemSize={this.itemSize}
            estimatedItemSize={estimatedItemSize}
            itemData={Array.isArray(children) ? children : [children]}
          >
            {OptionWrapper}
          </VariableSizeList>
        </div>
      )
    }
  }
