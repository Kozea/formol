import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
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
