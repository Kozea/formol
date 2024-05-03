import { withKnobs } from '@storybook/addon-knobs'
import React from 'react'

import Formol from '../src'
import { knobs, testFieldValue, typeFields } from './fields'
import { withStateForm } from './utils'

const filterDefined = (o) =>
  Object.entries(o).reduce((filtered, [k, v]) => {
    if (v || v === 0) {
      filtered[k] = v
    }
    return filtered
  }, {})

export default {
  title: 'Field Test',
  decorators: [withKnobs],
}

export const AllFields = withStateForm((props) => (
  <Formol {...props}>
    <h1>All fields</h1>
    {Object.entries(typeFields).map(([name, TypeField]) => (
      <TypeField key={name} {...filterDefined(knobs(name))} />
    ))}
  </Formol>
))

AllFields.story = {
  name: 'All fields',
}

export const AllFieldsWithInitialValue = withStateForm(
  (props) => (
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

AllFieldsWithInitialValue.story = {
  name: 'All fields with initial value',
}
