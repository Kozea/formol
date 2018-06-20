import { storiesOf } from '@storybook/react'
import { withKnobs } from 'addon-knobs-null-number-fix'
import React from 'react'

import Formol, { Conditional, Field, Inliner } from '../src'
import { countries } from './fields'
import molecule from './molecule.svg.base64'
import { withStateForm } from './utils'

const personExemple = {
  firstname: 'Liza',
  name: 'Houston',
  email: 'houston.liza@exemple.com',
  avatar: [
    {
      data: molecule,
      ext: 'svg',
      name: 'formol',
      size: 1086,
      type: 'image/svg+xml',
    },
  ],
  sex: 'woman',
  country: 'Germany',
  pregnant: true,
  weight: 64,
  height: 1.78,
  phone: '1-541-754-3010',
  address: '12 Norfolk St',
  zip: '69030',
  city: 'Haigler',
}

storiesOf('Formol exemples', module)
  .addDecorator(withKnobs)
  .add(
    'Adding a person',
    withStateForm(props => (
      <Formol {...props}>
        <h1>Create your profile</h1>
        <Field autoFocus required name="firstname">
          First name
        </Field>
        <Field required name="name">
          Name
        </Field>
        <Field required name="country" choices={countries} type="select">
          Country
        </Field>
        <Field required type="email" name="email">
          E-mail
        </Field>
        <Field
          type="file"
          name="avatar"
          accept="image/*"
          placeholder="Drop your avatar here"
        >
          Avatar
        </Field>
        <Field
          required
          type="radio-set"
          name="sex"
          choices={{
            Woman: 'woman',
            Man: 'man',
            Other: 'other',
          }}
        >
          Gender
        </Field>
        <Conditional show={item => item.sex && item.sex !== 'man'}>
          <Field name="pregnant" type="switch">
            Pregnant
          </Field>
        </Conditional>
        <Field type="number" name="weight" min="0" step="1">
          Weight
        </Field>
        <Field type="number" name="height" min="0" step="0.01" max="3">
          Height
        </Field>
        <Field type="tel" name="phone">
          Phone Number
        </Field>
        <Field name="address">Adress</Field>
        <Inliner>
          <Field name="zip" size={5}>
            Zip code
          </Field>
          <Field name="city">City</Field>
        </Inliner>
      </Formol>
    ))
  )
  .add(
    'Editing a person',
    withStateForm(
      props => (
        <Formol {...props}>
          <h1>Edit your profile</h1>
          <Field autoFocus required name="firstname">
            First name
          </Field>
          <Field required>Name</Field>
          <Field required name="country" choices={countries} type="select">
            Country
          </Field>
          <Field required type="email" name="email">
            E-mail
          </Field>
          <Field
            type="file"
            name="avatar"
            accept="image/*"
            placeholder="Drop your avatar here"
          >
            Avatar
          </Field>
          <Field
            required
            type="radio-set"
            name="sex"
            choices={{
              Woman: 'woman',
              Man: 'man',
              Other: 'other',
            }}
          >
            Gender
          </Field>
          <Conditional show={item => item.sex && item.sex !== 'man'}>
            <Field name="pregnant" type="switch">
              Pregnant
            </Field>
          </Conditional>
          <Field type="number" name="weight" min="0" step="1">
            Weight
          </Field>
          <Field type="number" name="height" min="0" step="0.01" max="3">
            Height
          </Field>
          <Field type="tel" name="phone">
            Phone Number
          </Field>
          <Field name="address">Adress</Field>
          <Inliner>
            <Field name="zip" size={5}>
              Zip code
            </Field>
            <Field name="city">City</Field>
          </Inliner>
        </Formol>
      ),
      personExemple
    )
  )
  .add(
    'Login form',
    withStateForm(({ item, transient, ...props }) => (
      <>
        <h1>Item and state handling</h1>
        <h2> Without item property</h2>
        <p>Form is self reset after a successful submit</p>
        <Formol {...props}>
          <Field pattern={/\w+\d{2}/.source} required>
            Login
          </Field>
          <Field type="password" required>
            Password
          </Field>
        </Formol>
        <h2> With an empty item</h2>
        <p>
          Form has no reset after submit and the item stay an empty one,
          therefore cancel is still available and reset back to the default item
          which is empty
        </p>
        <Formol item={{}} {...props}>
          <Field pattern={/\w+\d{2}/.source} required>
            Login
          </Field>
          <Field type="password" required>
            Password
          </Field>
        </Formol>
        <h2> With a controlled item</h2>
        <p>
          Item is updated with the submitted one, hence it becomes the new
          default state
        </p>
        <Formol item={item} {...props}>
          <Field pattern={/\w+\d{2}/.source} required>
            Login
          </Field>
          <Field type="password" required>
            Password
          </Field>
        </Formol>
        <h2> With a controlled item synchronized with onChange</h2>
        <p>
          The item here is continually updated from the transient state, cancel
          is never available (nor submit without the allowUnmodifiedSubmit
          property)
        </p>
        <Formol item={transient} {...props} allowUnmodifiedSubmit>
          <Field pattern={/\w+\d{2}/.source} required>
            Login
          </Field>
          <Field type="password" required>
            Password
          </Field>
        </Formol>
      </>
    ))
  )
