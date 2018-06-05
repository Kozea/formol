import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Formol, { Conditional, Field } from '../src'
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
        <Field required type="email" name="email">
          E-mail
        </Field>
        <Field
          type="file"
          name="avatar"
          accept="image/*"
          placeholder="Drop your avatar here"
          rejectedMessage="Your avatar is invalid"
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
        <Field name="zip">Zip code</Field>
        <Field name="city">City</Field>
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
          <Field required type="email" name="email">
            E-mail
          </Field>
          <Field
            type="file"
            name="avatar"
            accept="image/*"
            placeholder="Drop your avatar here"
            rejectedMessage="Your avatar is invalid"
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
          <Field name="zip">Zip code</Field>
          <Field name="city">City</Field>
        </Formol>
      ),
      personExemple
    )
  )
