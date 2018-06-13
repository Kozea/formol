/* eslint-disable react/no-multi-comp */

import { withState } from '@dump247/storybook-state'
import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Formol, { Field } from '../src'
import { HTMLToEditor, editorToHTML } from '../src/utils/html'
import { countries } from './fields'
import { withStateForm } from './utils'

class FastHTMLFieldFormol extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      item: { bightml: HTMLToEditor(props.html) },
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(item) {
    const { store } = this.props
    store.set({ submittedHTML: editorToHTML(item.bightml) })
    this.setState({ item })
  }

  render() {
    const { item } = this.state
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

class AsyncChoicesForm extends React.Component {
  state = {
    choices: [],
  }

  componentDidMount() {
    setTimeout(() => this.setState({ choices: countries }), 1000)
  }

  render() {
    const { choices } = this.state
    return (
      <Formol {...this.props}>
        <Field>Text</Field>
        <Field name="country" type="select" choices={choices} required>
          Country {choices.length ? null : <small>(Loading)</small>}
        </Field>
      </Formol>
    )
  }
}

storiesOf('Miscellaneous', module)
  .addDecorator(withKnobs)
  .add(
    'Fast HTML Field',
    withState({})(({ store }) => (
      <FastHTMLFieldFormol
        store={store}
        html={`
      <p>
        <span style="font-size: 96px;">BIG</span>
        <span style="font-size: 48px;">html</span>
      </p>
      `}
      />
    ))
  )
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
        <Field
          name="properties.extra.2"
          type="checkbox-set"
          choices={['red', 'blue', 'green', 'cyan', 'magenta', 'yellow']}
        >
          Properties -&gt; Extra -&gt; third array array
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
          <Field
            name="properties.extra.2"
            type="checkbox-set"
            choices={['red', 'blue', 'green', 'cyan', 'magenta', 'yellow']}
          >
            Properties -&gt; Extra -&gt; third array array
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
            ['blue', 'yellow'],
          ],
        },
      }
    )
  )
  .add(
    'Asynchronous choices',
    withStateForm(props => <AsyncChoicesForm {...props} />, {
      country: 'France',
    })
  )
