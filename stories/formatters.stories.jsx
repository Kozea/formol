import { withKnobs } from '@storybook/addon-knobs'
import React from 'react'

import Formol, { Field } from '../src'
import { persons } from './fields'
import { withStateForm } from './utils'

const creditCard = (v) =>
  v
    ? v
        .replace(/\D/g, '')
        .split('')
        .map((digit, i) => ((i + 1) % 4 ? digit : `${digit}-`))
        .join('')
        .replace(/-$/, '')
    : ''

const numberWithSpace = (v) =>
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

const rgbToHex = (rgb) => {
  if (!rgb) {
    return ''
  }
  const [r, g, b] = rgb.match(/\d+/g).map((x) => parseInt(x))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

const hexToRgb = (hex) =>
  hex
    ? `rgb(${hex
        .substring(1)
        .match(/.{2}/g)
        .map((x) => parseInt(x, 16))
        .join(', ')})`
    : ''

export default {
  title: 'Formatters',
  decorators: [withKnobs],
}

export const ItemToFieldFormatter = withStateForm((props) => (
  <Formol {...props}>
    <h1>Item to field formatter</h1>
    <Field name="text" formatter={(v) => v || 'Non empty'}>
      Default value
    </Field>
  </Formol>
))

ItemToFieldFormatter.story = {
  name: 'Item to field formatter',
}

export const FieldToItemFormatter = withStateForm(
  (props) => (
    <Formol {...props}>
      <h1>Field to item formatter</h1>
      <Field
        name="strnumber"
        unformatter={(v) => v && +v.toString().replace(/\D/g, '')}
      >
        String cleaned and parsed as a number
      </Field>
    </Formol>
  ),
  { strnumber: 1337 }
)

FieldToItemFormatter.story = {
  name: 'Field to item formatter',
}

export const FieldNormalizer = withStateForm(
  (props) => (
    <Formol {...props}>
      <h1>Field normalizer</h1>
      <Field
        name="strnumber"
        normalizer={(v) => v && +v.toString().replace(/\D/g, '')}
      >
        String cleaned and parsed as a number on blur
      </Field>
    </Formol>
  ),
  { strnumber: 1337 }
)

FieldNormalizer.story = {
  name: 'Field normalizer',
}

export const BidirectionalFormatters = withStateForm(
  (props) => (
    <Formol {...props}>
      <h1>Bidirectional formatters</h1>
      <Field
        name="money"
        formatter={(v) => (v ? `${v} $` : '')}
        unformatter={(v) => (v && +v.toString().replace(/\D/g, '')) || ''}
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
        validator={(v) =>
          v &&
          !v.match(/rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)/) &&
          `${v} is not a valid color`
        }
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
        name="iLetters"
        type="number"
        min={0}
        formatter={(s) => s && s.length}
        unformatter={(n) => 'i'.repeat(n)}
      >
        I letters
      </Field>
      <Field
        name="numberOfI"
        formatter={(n) => 'i'.repeat(n)}
        unformatter={(s) => s && s.length}
        pattern="i*"
      >
        Number of letter i
      </Field>
    </Formol>
  ),
  {
    money: 42,
    bignumber: '0123456789',
    rgbcolor: 'rgb(255, 125, 2)',
    iLetters: 'iiiiiiiiiiii',
    numberOfI: 7,
  }
)

BidirectionalFormatters.story = {
  name: 'Bidirectional formatters',
}
