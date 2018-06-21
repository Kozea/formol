import React from 'react'

export default function multipleAdapter(WrappedComponent) {
  return class MultipleAdapter extends React.PureComponent {
    render() {
      const { value, multiple, ...props } = this.props
      let normalizedValue = value
      if (!multiple && Array.isArray(value)) {
        normalizedValue = value.length ? value[0] : null
      }
      if (multiple && !Array.isArray(value)) {
        normalizedValue =
          value !== null && value !== void 0 && value !== '' ? [value] : []
      }
      return (
        <WrappedComponent
          value={normalizedValue}
          multiple={multiple}
          {...props}
        />
      )
    }
  }
}
