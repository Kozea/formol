import React from 'react'

export default function choicesAdapter(WrappedComponent) {
  return class ChoicesAdapter extends React.PureComponent {
    render() {
      const { choices, ...props } = this.props
      const normalizedChoices = Array.isArray(choices)
        ? choices.map(c => [c, c])
        : Object.entries(choices || {})
      return <WrappedComponent choices={normalizedChoices} {...props} />
    }
  }
}
