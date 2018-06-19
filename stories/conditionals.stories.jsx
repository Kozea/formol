import { withKnobs } from 'addon-knobs-null-number-fix'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Formol, { Conditional, Field } from '../src'
import { withStateForm } from './utils'

storiesOf('Conditionals', module)
  .addDecorator(withKnobs)
  .add(
    'Simple Conditional',
    withStateForm(props => (
      <Formol {...props}>
        <h1>Simple Conditional</h1>
        <Field name="areyouok" type="switch">
          Are you ok?
        </Field>
        <Conditional show={({ areyouok }) => areyouok}>
          <Field name="why">Why?</Field>
        </Conditional>
        <Conditional show={({ areyouok }) => !areyouok}>
          <Field name="whynot">Why not?</Field>
        </Conditional>
      </Formol>
    ))
  )
  .add(
    'Simple Conditional on props',
    withStateForm(props => (
      <Formol {...props}>
        <h1>Simple Conditional on props</h1>
        <Field name="areyouok" type="switch">
          Are you ok?
        </Field>
        <Conditional disabled={({ areyouok }) => areyouok}>
          <Field name="why">Why?</Field>
        </Conditional>
        <Conditional disabled={({ areyouok }) => !areyouok}>
          <Field name="whynot">Why not?</Field>
        </Conditional>
      </Formol>
    ))
  )
  .add(
    'Grouped conditionals',
    withStateForm(props => (
      <Formol {...props}>
        <h1>Grouped conditionals</h1>
        <Field name="areyouok" type="switch">
          Are you ok?
        </Field>
        <Conditional show={({ areyouok }) => areyouok}>
          <Field name="why">Why?</Field>
          <Field name="tellmemore">Tell me more</Field>
        </Conditional>
        <Conditional show={({ areyouok }) => !areyouok}>
          <Field name="whynot">Why not?</Field>
          <Field name="iwilltryagain" type="checkbox">
            I will try again
          </Field>
        </Conditional>
      </Formol>
    ))
  )
  .add(
    'Undirect children Conditional',
    withStateForm(props => (
      <Formol {...props}>
        <h1>Undirect children Conditional</h1>
        <Field name="areyouok" type="switch">
          Are you ok?
        </Field>
        <Conditional show={({ areyouok }) => areyouok}>
          <div>
            <Field name="why">Why?</Field>
          </div>
          <div>
            <Field name="tellmemore">Tell me more</Field>
          </div>
        </Conditional>
        <Conditional show={({ areyouok }) => !areyouok}>
          <ul>
            <li>
              <Field name="whynot">Why not?</Field>
            </li>
            <li>
              <Field name="iwilltryagain" type="checkbox">
                I will try again
              </Field>
            </li>
          </ul>
        </Conditional>
      </Formol>
    ))
  )
  .add(
    'Original conditionals',
    withStateForm(props => (
      <Formol {...props}>
        <h1>Even name can be used on conditional</h1>
        <small>Even though it might not be a good idea</small>
        <Field name="name">What’s your name?</Field>
        <Conditional name={({ name }) => name || 'none'}>
          <Field name="none">Say something</Field>
        </Conditional>
      </Formol>
    ))
  )
