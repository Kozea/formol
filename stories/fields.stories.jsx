import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Formol from '../src'
import { knobs, testFieldValue, typeFields } from './fields'
import { withStateForm } from './utils'

const filterDefined = o =>
  Object.entries(o).reduce((filtered, [k, v]) => {
    if (v || v === 0) {
      filtered[k] = v
    }
    return filtered
  }, {})

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
        <TypeField {...filterDefined(knobs(name))} />
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
          <TypeField {...filterDefined(knobs(name))} />
        </Formol>
      ),
      { [name]: testFieldValue(name) }
    )
  )
})

storiesOf('Field Test', module)
  .addDecorator(withKnobs)
  .add(
    'All fields',
    withStateForm(props => (
      <Formol {...props}>
        <h1>All fields</h1>
        {Object.entries(typeFields).map(([name, TypeField]) => (
          <TypeField key={name} {...filterDefined(knobs(name))} />
        ))}
      </Formol>
    ))
  )
  .add(
    'All fields with initial value',
    withStateForm(
      props => (
        <Formol {...props}>
          <h1>All fields</h1>
          {Object.entries(typeFields).map(([name, TypeField]) => (
            <TypeField key={name} {...filterDefined(knobs(name))} />
          ))}
        </Formol>
      ),
      Object.entries(typeFields).reduce((values, [name]) => {
        values[name] = testFieldValue(name)
        return values
      }, {})
    )
  )
