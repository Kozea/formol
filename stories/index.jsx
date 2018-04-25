import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Formol, { Field } from '../src'
import { PersonForm, personExemple } from './exemples'
import { testFieldValue, typeFields } from './fields'

const log = (...args) => {
  console.log('Submited', args[0])
  action('item submited')(...args)
  return false
}

storiesOf('Formol exemples', module)
  .add('Adding a person', () => <PersonForm onSubmit={log} />)
  .add('Editing a person', () => (
    <PersonForm onSubmit={log} item={personExemple} />
  ))

storiesOf('Native and Contrib fields', module)
  .add('Native fields', () => (
    <Formol onSubmit={log}>
      <Field name="text">Text</Field>
      <Field type="area" name="area">
        Area
      </Field>
      <Field type="email" name="email">
        E-mail
      </Field>
      <Field type="number" name="number">
        Number
      </Field>
      <Field type="password" name="password">
        Password
      </Field>
      <Field type="tel" name="tel">
        Phone number
      </Field>
      <Field
        name="select"
        type="select"
        choices={[
          ['key1', 'Choice 1'],
          ['key2', 'Choice 2'],
          ['key3', 'Choice 3'],
        ]}
      >
        Select
      </Field>
      <Field
        type="checkbox"
        name="checkbox"
        values={{
          'Choice 1': 'c1',
          'Choice 2': 'c2',
        }}
      >
        Checkbox
      </Field>
      <Field
        type="radio"
        name="radio"
        values={{
          'Choice 1': 'c1',
          'Choice 2': 'c2',
        }}
      >
        Radio
      </Field>
      <Field type="checkbox" name="simple-checkbox">
        Checkbox
      </Field>
    </Formol>
  ))
  .add('From libraries', () => (
    <Formol onSubmit={log}>
      <Field type="switch" name="switch">
        Switch
      </Field>
      <Field
        name="select-menu"
        type="select-menu"
        choices={[
          ['key1', 'Choice 1'],
          ['key2', 'Choice 2'],
          ['key3', 'Choice 3'],
        ]}
      >
        Select Menu
      </Field>
      <Field
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
      </Field>
      <Field type="calendar" name="calendar">
        Calendar
      </Field>
      <Field type="html" name="html">
        HTML
      </Field>
      <Field
        type="file"
        name="file"
        accept="image/*"
        placeholder="Drop an image"
        rejectedMessage="Your image is invalid"
      >
        File
      </Field>
      <Field type="password-strengh" name="password-strengh">
        Password strengh
      </Field>
    </Formol>
  ))

storiesOf('Field Test')

const fieldStory = storiesOf('Field Test/Available fields', module)
Object.entries(typeFields).forEach(([name, TypeField]) => {
  fieldStory.add(`${name} field`, () => (
    <Formol onSubmit={log}>
      <h1>{name}</h1>
      <TypeField />
    </Formol>
  ))
})

const requiredFieldStory = storiesOf('Field Test/Required attribute', module)
Object.entries(typeFields).forEach(([name, TypeField]) => {
  requiredFieldStory.add(`${name} field`, () => (
    <Formol onSubmit={log} item={{ [name]: testFieldValue(name) }}>
      <h1>{name}</h1>
      <TypeField required />
    </Formol>
  ))
})

const readOnlyFieldStory = storiesOf('Field Test/Read only attribute', module)
Object.entries(typeFields).forEach(([name, TypeField]) => {
  readOnlyFieldStory.add(`${name} field`, () => (
    <Formol onSubmit={log}>
      <h1>{name}</h1>
      <TypeField readOnly />
    </Formol>
  ))
})
