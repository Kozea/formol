import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Formol, { Field } from '../src'
import { withStateForm } from './utils'

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

storiesOf('Miscellaneous', module)
  .addDecorator(withKnobs)
  .add('Fast HTML Field', () => <FastHTMLFieldFormol />)
  .add(
    'Adding a nested item',
    withStateForm(props => (
      <Formol {...props}>
        <Field type="number">Identifier</Field>
        <Field name="properties.name">Properties -&gt; Name</Field>
        <Field name="properties.root.realm">
          Properties -&gt; Root -&gt; Realm
        </Field>
        <Field name="properties.extra.0">
          Properties -&gt; Extra -&gt; first array item
        </Field>
        <Field name="properties.extra.1.more.again.0.hereweare" type="number">
          Properties -&gt; Extra -&gt; second array item -&gt; more -&gt; again
          -&gt; first array item -&gt; hereweare
        </Field>
      </Formol>
    ))
  )
  .add(
    'Editing a nested item',
    withStateForm(
      props => (
        <Formol {...props}>
          <Field type="number">Identifier</Field>
          <Field name="properties.name">Properties -&gt; Name</Field>
          <Field name="properties.root.realm">
            Properties -&gt; Root -&gt; Realm
          </Field>
          <Field name="properties.extra.0">
            Properties -&gt; Extra -&gt; first array item
          </Field>
          <Field name="properties.extra.1.more.again.0.hereweare" type="number">
            Properties -&gt; Extra -&gt; second array item -&gt; more -&gt;
            again -&gt; first array item -&gt; hereweare
          </Field>
        </Formol>
      ),
      {
        identifier: 4,
        properties: {
          name: 'paul',
          root: {
            realm: '*',
          },
          extra: [
            'extra info',
            {
              more: {
                again: [
                  {
                    hereweare: 42,
                  },
                ],
              },
            },
          ],
        },
      }
    )
  )
