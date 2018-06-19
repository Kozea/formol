import { withKnobs } from 'addon-knobs-null-number-fix'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Formol, { Field } from '../src'
import { withStateForm } from './utils'

storiesOf('Native and Contrib fields', module)
  .addDecorator(withKnobs)
  .add(
    'Native fields',
    withStateForm(props => (
      <Formol {...props}>
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
          choices={{
            'Choice 1': 'key1',
            'Choice 2': 'key2',
            'Choice 3': 'key3',
          }}
        >
          Select
        </Field>
        <Field
          type="checkbox"
          name="checkbox"
          choices={{
            'Choice 1': 'c1',
            'Choice 2': 'c2',
          }}
        >
          Checkbox
        </Field>
        <Field
          type="radio"
          name="radio"
          choices={{
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
  )
  .add(
    'From libraries',
    withStateForm(props => (
      <Formol {...props}>
        <Field type="switch" name="switch">
          Switch
        </Field>
        <Field
          name="select-menu"
          type="select-menu"
          choices={{
            'Choice 1': 'key1',
            'Choice 2': 'key2',
            'Choice 3': 'key3',
          }}
        >
          Select Menu
        </Field>
        <Field
          name="select-menu-multiple"
          type="select-menu"
          multiple
          choices={{
            'Choice 1': 'key1',
            'Choice 2': 'key2',
            'Choice 3': 'key3',
          }}
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
          type="filedrop"
          name="filedrop"
          accept="image/*"
          placeholder="Drop an image"
        >
          File
        </Field>
        <Field type="password-strength" name="password-strength">
          Password strength
        </Field>
      </Formol>
    ))
  )
