import { withKnobs } from 'addon-knobs-null-number-fix'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Formol, { Field } from '../src'
import { withStateForm } from './utils'

const isPrime = n =>
  ![...Array(n).keys()]
    .slice(2)
    .map(i => !(n % i))
    .includes(true) && ![0, 1].includes(n)

storiesOf('Validators', module)
  .addDecorator(withKnobs)
  .add(
    'Complex field validation',
    withStateForm(props => (
      <Formol {...props}>
        <h1>Complex field validation</h1>
        <Field
          name="prime"
          type="number"
          min={0}
          max={10000}
          required
          validator={v => !isPrime(v) && `${v} is not a prime number`}
        >
          Prime
        </Field>
      </Formol>
    ))
  )
  .add(
    'Cross field validation',
    withStateForm(props => (
      <Formol
        {...props}
        item={
          {} ||
          new Array(10).fill().reduce((item, _, i) => {
            item[`number-${i}`] = i
            return item
          }, {})
        }
        validator={item =>
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
  )
  .add(
    'Cross field and self validation',
    withStateForm(props => (
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
          validator={v =>
            v && v.length > 2
              ? null
              : 'Text1 must be more than 2 character long'
          }
        >
          Text 1
        </Field>
        <Field
          name="text2"
          validator={v =>
            v && v.length > 4 ? '' : 'Text2 must be more than 4 character long'
          }
        >
          Text 2
        </Field>
      </Formol>
    ))
  )
