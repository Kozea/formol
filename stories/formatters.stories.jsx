import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Formol, { Field } from '../src'
import { persons } from './fields'
import { withStateForm } from './utils'

const creditCard = v =>
  v
    ? v
        .replace(/\D/g, '')
        .split('')
        .map((digit, i) => ((i + 1) % 4 ? digit : `${digit}-`))
        .join('')
        .replace(/-$/, '')
    : ''

const numberWithSpace = v =>
  v
    ? v
        .replace(/ /g, '')
        .split('')
        .reverse()
        .map((digit, i) => (i % 3 ? digit : `${digit} `))
        .reverse()
        .join('')
        .trim()
    : ''

const rgbToHex = rgb => {
  if (!rgb) {
    return ''
  }
  const [r, g, b] = rgb.match(/\d+/g).map(x => parseInt(x))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

const hexToRgb = hex =>
  hex
    ? `rgb(${hex
        .substring(1)
        .match(/.{2}/g)
        .map(x => parseInt(x, 16))
        .join(', ')}`
    : ''

storiesOf('Formatters', module)
  .addDecorator(withKnobs)
  .add(
    'Item to field formatter',
    withStateForm(props => (
      <Formol {...props}>
        <h1>Item to field formatter</h1>
        <Field name="text" formatter={v => v || 'Non empty'}>
          Default value
        </Field>
      </Formol>
    ))
  )
  .add(
    'Field to item formatter',
    withStateForm(
      props => (
        <Formol {...props}>
          <h1>Field to item formatter</h1>
          <Field name="strnumber" unformatter={v => +v.replace(/\D/g, '')}>
            String cleaned and parsed as a number
          </Field>
        </Formol>
      ),
      { strnumber: 1337 }
    )
  )
  .add(
    'Field normalizer',
    withStateForm(
      props => (
        <Formol {...props}>
          <h1>Field normalizer</h1>
          <Field name="strnumber" normalizer={v => v && +v.replace(/\D/g, '')}>
            String cleaned and parsed as a number on blur
          </Field>
        </Formol>
      ),
      { strnumber: 1337 }
    )
  )
  .add(
    'Bidirectional formatters',
    withStateForm(
      props => (
        <Formol {...props}>
          <h1>Bidirectional formatters</h1>
          <Field
            name="money"
            formatter={v => (v ? `${v} $` : '')}
            unformatter={v => +v.replace(/\D/g, '') || ''}
          >
            Money
          </Field>
          <Field
            name="bignumber"
            formatter={numberWithSpace}
            unformatter={numberWithSpace}
          >
            Big number (actually a formatted string)
          </Field>
          <Field
            name="rgbcolor"
            type="color"
            formatter={rgbToHex}
            unformatter={hexToRgb}
          >
            rgb(r, g, b) color
          </Field>
          <Field
            name="creditcard"
            pattern="\d{4}-\d{4}-\d{4}-\d{4}"
            formatter={creditCard}
            unformatter={creditCard}
          >
            Credit Card
          </Field>
          <Field
            name="persons"
            type="select-menu"
            multiple
            choices={persons.reduce(
              (choices, { id, name, firstname }) =>
                (choices[`${name} ${firstname}`] = id) && choices,
              {}
            )}
            formatter={currentPersons => currentPersons.map(({ id }) => id)}
            unformatter={ids => persons.filter(({ id }) => ids.includes(id))}
          >
            Persons
          </Field>
        </Formol>
      ),
      {
        money: 42,
        bignumber: '0123456789',
        rgbcolor: 'rgb(255, 125, 2)',
        persons: [
          {
            id: 'mscott',
            name: 'Scott',
            firstname: 'Michael',
            gender: 'man',
          },
          {
            id: 'dkschrute',
            name: 'K. Schrute',
            firstname: 'Dwight',
            gender: 'man',
          },
          {
            id: 'pbeesly',
            name: 'Beesly',
            firstname: 'Pam',
            gender: 'woman',
          },
        ],
      }
    )
  )
