/* eslint-disable react/no-multi-comp */

import { withState } from '@dump247/storybook-state'
import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Formol, { Field } from '../src'
import { HTMLToEditor, editorToHTML } from '../src/utils/html'
import { countries, persons } from './fields'
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
    this.timeout = setTimeout(() => this.setState({ choices: countries }), 1000)
  }

  componentWillUnmount() {
    this.timeout && clearTimeout(this.timeout)
    this.timeout = null
  }

  timeout = null

  render() {
    const { choices } = this.state
    return (
      <Formol {...this.props}>
        <h1>Select fields with asynchronously loaded choices</h1>
        <Field>Text</Field>
        <Field name="country" type="select" choices={choices} required>
          Country {choices.length ? null : <small>(Loading)</small>}
        </Field>
        <Field name="country" type="select-menu" choices={choices} required>
          Country {choices.length ? null : <small>(Loading)</small>}
        </Field>
      </Formol>
    )
  }
}

const objectChoices = persons.reduce(
  (choices, person) => ({
    ...choices,
    [`${person.gender === 'woman' ? 'Ms.' : 'M.'} ${person.firstname} ${
      person.name
    }`]: person,
  }),
  { 'M. No Object': 'I am no object' }
)

const stressedChoices = new Array(5000).fill().reduce((choices, _, i) => {
  choices[`Element #${i}`] = `${i}`
  return choices
}, {})

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
        <h1>Edition of nested object properties in an empty object</h1>
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
          <h1>Edition of nested object properties in an existing object</h1>
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
  .add(
    'Non string select values',
    withStateForm(
      props => (
        <Formol {...props}>
          <h1>Select with objects as choices</h1>
          <Field name="simple" type="select" choices={objectChoices}>
            Object select
          </Field>
          <Field multiple name="multiple" type="select" choices={objectChoices}>
            Object select multiple
          </Field>
          <Field name="simple-menu" type="select-menu" choices={objectChoices}>
            Object select menu
          </Field>
          <Field
            multiple
            name="multiple-menu"
            type="select-menu"
            choices={objectChoices}
          >
            Object select multiple menu
          </Field>
        </Formol>
      ),
      {
        simple: {
          id: 'dkschrute',
          name: 'K. Schrute',
          firstname: 'Dwight',
          gender: 'man',
        },
        multiple: [
          {
            id: 'pbeesly',
            name: 'Beesly',
            firstname: 'Pam',
            gender: 'woman',
          },
          {
            id: 'dkschrute',
            name: 'K. Schrute',
            firstname: 'Dwight',
            gender: 'man',
          },
        ],
        'simple-menu': {
          id: 'dkschrute',
          name: 'K. Schrute',
          firstname: 'Dwight',
          gender: 'man',
        },
        'multiple-menu': [
          {
            id: 'pbeesly',
            name: 'Beesly',
            firstname: 'Pam',
            gender: 'woman',
          },
          {
            id: 'dkschrute',
            name: 'K. Schrute',
            firstname: 'Dwight',
            gender: 'man',
          },
        ],
      }
    )
  )
  .add(
    'Select menu stress test',
    withStateForm(
      props => (
        <Formol {...props}>
          <h1>Select with a huge number of choice</h1>
          <Field name="stressed" type="select-menu" choices={stressedChoices}>
            Stressed select
          </Field>
          <Field
            name="multiStressed"
            type="select-menu"
            choices={stressedChoices}
            multiple
          >
            Multi Stressed select
          </Field>
        </Formol>
      ),
      {
        stressed: '12',
        multiStressed: [
          '12',
          '123',
          '213',
          '987',
          '2810',
          '3',
          '1938',
          '3432',
          '3923',
          '191',
          '533',
          '2734',
          '2892',
          '9',
          '82',
          '812',
          '871',
          '918',
        ],
      }
    )
  )
  .add(
    'Select menu long options',
    withStateForm(
      props => (
        <Formol {...props}>
          <h1>Select with long options</h1>
          <Field
            name="looong"
            type="select-menu"
            multiple
            choices={{
              'A normal option': 'normal',
              'A very very very very long option': 'long',
              'A very very very very very very very very loooooooonnnnng option':
                'verylong',
              'A very very very very very very very very very very very very very loooooooooooooooooonnnnnnnnng option':
                'veryverylong',
            }}
          >
            Stressed select
          </Field>
        </Formol>
      ),
      {
        looong: 'verylong',
      }
    )
  )
