import React from 'react'

export default function choicesAdapter(WrappedComponent) {
  class ChoicesAdapter extends React.PureComponent {
    render() {
      const { choices, ...props } = this.props
      const normalizedChoices = Array.isArray(choices)
        ? choices.map((c) => (Array.isArray(c) ? c : [c, c]))
        : Object.entries(choices || {})
      return <WrappedComponent choices={normalizedChoices} {...props} />
    }
  }

  ChoicesAdapter.defaultFieldProps = WrappedComponent.defaultFieldProps
  ChoicesAdapter.formolFieldLabelElement =
    WrappedComponent.formolFieldLabelElement
  return ChoicesAdapter
}
