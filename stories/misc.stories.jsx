import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Formol, { Field } from '../src'

class FastHTMLFieldFormol extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      item: {},
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(item) {
    console.log('New', item)
    this.setState({ item })
  }

  render() {
    const { item } = this.state
    console.log('Render', item)
    return (
      <Formol item={item} onSubmit={this.handleSubmit}>
        <h1>Showcase of the fast HTMLField attribute</h1>
        <Field name="bightml" type="html" fast>
          Big HTML Field
        </Field>
      </Formol>
    )
  }
}

storiesOf('Miscellaneous', module).add('Fast HTML Field', () => (
  <FastHTMLFieldFormol />
))
