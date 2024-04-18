import { withKnobs } from '@storybook/addon-knobs'
import React from 'react'

import Formol, { Field } from '../src'
import { withStateForm } from './utils'

const isPrime = (n) =>
  ![...Array(n).keys()]
    .slice(2)
    .map((i) => !(n % i))
    .includes(true) && ![0, 1].includes(n)

export default {
  title: 'Validators',
  decorators: [withKnobs],
}

export const DomValidation = withStateForm((props) => (
  <Formol {...props}>
    <h1>Simple dom validation</h1>
    <Field
      name="hexColor"
      required
      minLength={4}
      pattern="#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})"
      title="A hexadecimal color: (i.e. #3c23ad)"
      validityErrors={({ valueMissing, patternMismatch, tooShort }) => {
        if (valueMissing) {
          return 'A color connot be empty, we need a color!'
        }
        if (tooShort) {
          return 'A color cannot be that short'
        }
        if (patternMismatch) {
          return (
            'A color must have a # followed by ' + '3 or 6 hexadecimal digit'
          )
        }
      }}
    >
      Hexadecimal color validated by a regexp pattern with custom error messages
    </Field>
  </Formol>
))

DomValidation.story = {
  name: 'DOM validation',
}

export const ComplexFieldValidation = withStateForm((props) => (
  <Formol {...props}>
    <h1>Complex field validation</h1>
    <Field
      name="prime"
      type="number"
      min={0}
      max={10000}
      required
      validator={(v) => !isPrime(v) && `${v} is not a prime number`}
    >
      Prime
    </Field>
  </Formol>
))

ComplexFieldValidation.story = {
  name: 'Complex field validation',
}

export const CrossFieldValidation = withStateForm((props) => (
  <Formol
    {...props}
    item={
      {} ||
      new Array(10).fill().reduce((item, _, i) => {
        item[`number-${i}`] = i
        return item
      }, {})
    }
    validator={(item) =>
      new Array(10).fill().reduce((validators, _, i) => {
        if (i !== 0) {
          validators[`number-${i}`] =
            item[`number-${i}`] <= item[`number-${i - 1}`]
              ? `Number ${i} must be superior to Number ${i}: ${
                  item[`number-${i}`]
                } > ${item[`number-${i - 1}`]}`
              : null
        }
        return validators
      }, {})
    }
  >
    <h1>Cross field validation</h1>
    {new Array(10).fill().map((_, i) => (
      <Field
        key={`number-${i}`} // eslint-disable-line react/no-array-index-key
        name={`number-${i}`}
        type="number"
        required
      >
        Number {i}
      </Field>
    ))}
  </Formol>
))

CrossFieldValidation.story = {
  name: 'Cross field validation',
}

export const CrossFieldAndSelfValidation = withStateForm((props) => (
  <Formol
    {...props}
    validator={({ text1, text2 }) => ({
      text1: text2 === text1 && 'Text1 must be different from text2',
      text2: text2 === text1 && 'Text2 must be different from text1',
    })}
  >
    <h1>Cross field and self validation</h1>
    <Field
      name="text1"
      validator={(v) =>
        v && v.length > 2 ? null : 'Text1 must be more than 2 character long'
      }
    >
      Text 1
    </Field>
    <Field
      name="text2"
      validator={(v) =>
        v && v.length > 4 ? '' : 'Text2 must be more than 4 character long'
      }
    >
      Text 2
    </Field>
  </Formol>
))

CrossFieldAndSelfValidation.story = {
  name: 'Cross field and self validation',
}

export const ServerSideValidation = withStateForm(
  (props) => (
    <Formol {...props}>
      <h1>Server side validation</h1>
      <Field name="text1">Text 1</Field>
      <Field name="text2">Text 2</Field>
    </Formol>
  ),
  {},
  ({ text1, text2 }) => ({
    text1: text1.match(/^\d/) ? '' : 'Text1 must begin with a number',
    text2: text2.match(/^\d/) ? 'Text2 mustn’t begin with a number' : '',
  })
)

ServerSideValidation.story = {
  name: 'Server side validation',
}
