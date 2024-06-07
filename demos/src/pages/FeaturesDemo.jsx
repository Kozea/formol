import React, { useState } from 'react'
import Formol, { Field, Conditional } from 'formol'

const initialFormState = {
  newsletter: {
    subscribe: false,
    name: '',
    email: '',
  },
  edit: {
    enabled: false,
    text: 'The quick brown fox jumps over the lazy dog',
  },
  format: {
    text: 'why are you yelling?',
    number: '1337',
    numberblur: '42',
  },
  bidir: {
    rgbColor: 'rgb(102, 51, 153)',
  },
  valid: {
    color: '#c0ffee',
  },
  prime: 127843,
}

const initialCrossedState = {
  number0: 0,
  number1: 1,
  number2: 2,
}

const initialDifferedState = {
  text: 'Saved on submit',
}

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
        .join(', ')})`
    : ''

function isPrimeNumber(n) {
  // 0 and 1 are not prime numbers
  if (n <= 1) {
    return false
  }
  // 2 and 3 are prime numbers
  if (n <= 3) {
    return true
  }

  // Eliminate even numbers and multiples of 3
  if (n % 2 === 0 || n % 3 === 0) {
    return false
  }

  // 6k±1 rule, from 5 to square root of n
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) {
      return false
    }
  }

  return true
}

const FeaturesDemo = () => {
  const [formValues, setFormValues] = useState(initialFormState)
  const [crossedValues, setCrossedValues] = useState(initialCrossedState)
  const [differedValues, setDifferedValues] = useState(initialDifferedState)

  return (
    <>
      <div className="form-container">
        <h1>Features</h1>
        <Formol item={formValues} onChange={item => setFormValues(item)}>
          <h2>Conditionals</h2>
          <h3>- show</h3>
          <Field name="newsletter.subscribe" type="switch">
            Subscribe to the newsletter
          </Field>
          <Conditional show={({ newsletter }) => newsletter.subscribe}>
            Cool 😎, please fill these fields:
            <div>
              <Field name="newsletter.name">Name</Field>
              <Field name="newsletter.email">Email</Field>
            </div>
          </Conditional>

          <h3>- disabled</h3>
          <Field name="edit.enabled" type="switch">
            Edit mode
          </Field>
          <Conditional disabled={({ edit }) => !edit.enabled}>
            <Field name="edit.text">Text</Field>
          </Conditional>

          <h2>Formatters</h2>
          <h3>- Item to field</h3>
          <Field name="format.text" formatter={v => v.toUpperCase()}>
            CAPSLOCK
          </Field>

          <h3>- Field to item</h3>
          <Field
            name="format.number"
            unformatter={v => v && v.replace(/\D/g, '')}
          >
            String allowing only numbers
          </Field>

          <h3>- Field normalizer</h3>
          <Field
            name="format.numberblur"
            normalizer={v => v && v.replace(/\D/g, '')}
          >
            String cleaned and parsed as a number on blur
          </Field>

          <h3>- Bidirectional formatter</h3>
          <Field
            name="bidir.rgbColor"
            type="color"
            validator={v =>
              v &&
              !v.match(/rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)/) &&
              `${v} is not a valid color`
            }
            formatter={rgbToHex}
            unformatter={hexToRgb}
          >
            rgb(r, g, b) color
          </Field>

          <h2>Validators</h2>
          <h3>- Pattern + custom error messages</h3>
          <Field
            name="valid.color"
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
                return 'A color must have a # followed by 3 or 6 hexadecimal digit'
              }
            }}
          >
            Hexadecimal color
          </Field>

          <h3>- Complex</h3>
          <Field
            name="prime"
            type="number"
            min={0}
            max={100000000}
            validator={v => !isPrimeNumber(v) && `${v} is not a prime number`}
          >
            Prime
          </Field>
        </Formol>

        <Formol
          item={crossedValues}
          validator={item =>
            new Array(3).fill().reduce((validators, _, i) => {
              if (i !== 0) {
                validators[`number${i}`] =
                  item[`number${i}`] <= item[`number${i - 1}`]
                    ? `Number ${i} must be superior to Number ${i - 1}:
                    ${item[`number${i - 1}`]}`
                    : null
              }
              return validators
            }, {})
          }
          onChange={item => setCrossedValues(item)}
        >
          <h3>- Cross field validation</h3>
          {new Array(3).fill().map((_, i) => (
            <Field
              key={Object.keys(crossedValues)[i]}
              name={`number${i}`}
              type="number"
            >
              Number {i}
            </Field>
          ))}
        </Formol>

        <div
          style={{
            border: '1px solid #bbb',
            width: 'fit-content',
            padding: '0 10px',
          }}
        >
          <Formol
            item={differedValues}
            onSubmit={item => setDifferedValues(item)}
            >
            <h2>Saved on submit</h2>
            <Field name="text">Text</Field>
          </Formol>
        </div>
      </div>

      <pre className="panel">
        {JSON.stringify(formValues, null, 2)}
        <br />
        <br />
        {JSON.stringify(crossedValues, null, 2)}
        <br />
        <br />
        {JSON.stringify(differedValues, null, 2)}
      </pre>
    </>
  )
}

export default FeaturesDemo
