import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'

import { Field } from '../src'
import Formol from '../src/Formol'

const log = (...args) => {
  action('item submited')(...args)
  return false
}

storiesOf('Formol', module)
  .add('An empty form', () => <Formol />)
  .add('A simple form with a field', () => (
    <Formol onSubmit={log}>
      <Field name="field">Field</Field>
    </Formol>
  ))

storiesOf('Formol fields', module)
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
