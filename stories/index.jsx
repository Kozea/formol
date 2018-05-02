import { withState } from '@dump247/storybook-state'
import { withKnobs } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Formol from '../src'
import { PersonForm, personExemple } from './exemples'
import { knobs, testFieldValue, typeFields } from './fields'

const withStateForm = (form, initial) =>
  withState({ transient: initial, item: initial })(({ store }) =>
    form({
      onSubmit: item => store.set({ item }) || false, // TODO: Fix that
      onChange: transient => store.set({ transient }),
      item: store.state.item,
    })
  )

storiesOf('Formol exemples', module)
  .add('Adding a person', withStateForm(props => <PersonForm {...props} />))
  .add(
    'Editing a person',
    withStateForm(props => <PersonForm {...props} />, personExemple)
  )

storiesOf('Native and Contrib fields', module)
  .add(
    'Native fields',
    withStateForm(props => (
      <Formol {...props}>
        <Formol.Field name="text">Text</Formol.Field>
        <Formol.Field type="area" name="area">
          Area
        </Formol.Field>
        <Formol.Field type="email" name="email">
          E-mail
        </Formol.Field>
        <Formol.Field type="number" name="number">
          Number
        </Formol.Field>
        <Formol.Field type="password" name="password">
          Password
        </Formol.Field>
        <Formol.Field type="tel" name="tel">
          Phone number
        </Formol.Field>
        <Formol.Field
          name="select"
          type="select"
          choices={[
            ['key1', 'Choice 1'],
            ['key2', 'Choice 2'],
            ['key3', 'Choice 3'],
          ]}
        >
          Select
        </Formol.Field>
        <Formol.Field
          type="checkbox"
          name="checkbox"
          values={{
            'Choice 1': 'c1',
            'Choice 2': 'c2',
          }}
        >
          Checkbox
        </Formol.Field>
        <Formol.Field
          type="radio"
          name="radio"
          values={{
            'Choice 1': 'c1',
            'Choice 2': 'c2',
          }}
        >
          Radio
        </Formol.Field>
        <Formol.Field type="checkbox" name="simple-checkbox">
          Checkbox
        </Formol.Field>
      </Formol>
    ))
  )
  .add(
    'From libraries',
    withStateForm(props => (
      <Formol {...props}>
        <Formol.Field type="switch" name="switch">
          Switch
        </Formol.Field>
        <Formol.Field
          name="select-menu"
          type="select-menu"
          choices={[
            ['key1', 'Choice 1'],
            ['key2', 'Choice 2'],
            ['key3', 'Choice 3'],
          ]}
        >
          Select Menu
        </Formol.Field>
        <Formol.Field
          name="select-menu-multiple"
          type="select-menu"
          multiple
          choices={[
            ['key1', 'Choice 1'],
            ['key2', 'Choice 2'],
            ['key3', 'Choice 3'],
          ]}
        >
          Multiple Select Menu
        </Formol.Field>
        <Formol.Field type="calendar" name="calendar">
          Calendar
        </Formol.Field>
        <Formol.Field type="html" name="html">
          HTML
        </Formol.Field>
        <Formol.Field
          type="file"
          name="file"
          accept="image/*"
          placeholder="Drop an image"
        >
          File
        </Formol.Field>
        <Formol.Field type="password-strengh" name="password-strengh">
          Password strengh
        </Formol.Field>
      </Formol>
    ))
  )

storiesOf('Field Test', module)

const fieldStory = storiesOf('Field Test/Fields', module).addDecorator(
  withKnobs
)
Object.entries(typeFields).forEach(([name, TypeField]) => {
  fieldStory.add(
    `${name} field`,
    withStateForm(props => (
      <Formol {...props}>
        <h1>{name}</h1>
        <TypeField {...knobs(name)} />
      </Formol>
    ))
  )
})

const requiredFieldStory = storiesOf(
  'Field Test/Fields with initial value',
  module
).addDecorator(withKnobs)
Object.entries(typeFields).forEach(([name, TypeField]) => {
  requiredFieldStory.add(
    `${name} field`,
    withStateForm(
      props => (
        <Formol {...props}>
          <h1>{name}</h1>
          <TypeField {...knobs(name)} />
        </Formol>
      ),
      { [name]: testFieldValue(name) }
    )
  )
})
