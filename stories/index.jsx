import { withState } from '@dump247/storybook-state'
import { boolean, selectV2, withKnobs } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Formol, { Conditional, Field } from '../src'
import { PersonForm, personExemple } from './exemples'
import { knobs, testFieldValue, typeFields } from './fields'

const withStateForm = (form, initial) =>
  withState({ transient: initial, item: initial })(({ store }) =>
    form({
      onSubmit: item => store.set({ item }) || false, // TODO: Fix that
      onChange: transient => store.set({ transient }),
      item: store.state.item,
      readOnly: boolean('Form read only', false, 'form'),
      focusNextOnEnter: boolean('Focus next field with [Enter]', false, 'form'),
      i18n: selectV2('I18n', Object.keys(Formol.i18n), 'en', 'form'),
    })
  )

storiesOf('Formol exemples', module)
  .addDecorator(withKnobs)
  .add('Adding a person', withStateForm(props => <PersonForm {...props} />))
  .add(
    'Editing a person',
    withStateForm(props => <PersonForm {...props} />, personExemple)
  )

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
          values={{
            'Choice 1': 'c1',
            'Choice 2': 'c2',
          }}
        >
          Checkbox
        </Field>
        <Field
          type="radio"
          name="radio"
          values={{
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

storiesOf('Conditionals', module)
  .addDecorator(withKnobs)
  .add(
    'Simple Conditional',
    withStateForm(props => (
      <Formol {...props}>
        <h1>Complex field validation</h1>
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
        <TypeField {...knobs(name)} />
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
          <TypeField {...knobs(name)} />
        </Formol>
      ),
      { [name]: testFieldValue(name) }
    )
  )
})

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

storiesOf('Formatters', module)
  .addDecorator(withKnobs)
  .add(
    'Item to field formatter',
    withStateForm(
      props => (
        <Formol {...props}>
          <h1>Item to field formatter</h1>
          <Field
            name="bignumber"
            formatter={v =>
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
            }
          >
            Big number (actually a formatted string)
          </Field>
        </Formol>
      ),
      { bignumber: '0123456789' }
    )
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
          <Field name="strnumber" normalizer={v => +v.replace(/\D/g, '')}>
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
        </Formol>
      ),
      { money: 42 }
    )
  )
