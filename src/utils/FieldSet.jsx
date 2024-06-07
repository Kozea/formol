import React from 'react'

import BooleanField from '../fields/BooleanField'
import { block } from '../utils'

@block
export default class FieldSet extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      focused: null,
    }
  }

  render(b) {
    const {
      type,
      isChecked,
      value,
      choices,
      elementRef,
      dangerousRawHTMLLabels,
      onChange,
      ...props
    } = this.props

    const { focused } = this.state

    return (
      <fieldset className={b} ref={elementRef}>
        {choices.map(([choiceLabel, choice]) => (
          <label
            key={choice}
            className={b
              .e('label')
              .m({ on: isChecked(choice, value), focus: focused === choice })}
          >
            <BooleanField
              {...props}
              type={type}
              onFocus={() => {
                this.setState({ focused: choice })
                props.onFocus()
              }}
              onBlur={() => {
                this.setState({ focused: null })
                props.onBlur()
              }}
              value={isChecked(choice, value)}
              onChange={(checked) => onChange(choice, value, checked)}
            />
            <span className={b.e('title')}>
              {dangerousRawHTMLLabels ? (
                // eslint-disable-next-line react/no-danger
                <span dangerouslySetInnerHTML={{ __html: choiceLabel }} />
              ) : (
                choiceLabel
              )}
            </span>
          </label>
        ))}
      </fieldset>
    )
  }
}
