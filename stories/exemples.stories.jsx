import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Formol, { Conditional, Field } from '../src'
import molecule from './molecule.svg.base64'
import { withStateForm } from './utils'

const personExemple = {
  name: 'Houston',
  firstname: 'Liza',
  email: 'houston.liza@exemple.com',
  height: 1.78,
  phone: '1-541-754-3010',
  sex: true,
  pregnant: true,
  weight: 64,
  address: '12 Norfolk St',
  city: 'Haigler',
  zip: '69030',
  avatar: [
    {
      data: molecule,
      ext: 'svg',
      name: 'formol',
      size: 1086,
      type: 'image/svg+xml',
    },
  ],
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
  .add(
    'Editing a nested item',
    withStateForm(
      props => (
        <Formol {...props}>
          <Field type="number">Identifier</Field>
          <Field name="properties.name">Properties -&gt; Name</Field>
          <Field name="properties.root.realm">
            Properties -&gt; Root -&gt; Realm
          </Field>
          <Field name="properties.extra.0">
            Properties -&gt; Extra -&gt; first array item
          </Field>
          <Field name="properties.extra.1.more.again.0.hereweare" type="number">
            Properties -&gt; Extra -&gt; second array item -&gt; more -&gt;
            again -&gt; first array item -&gt; hereweare
          </Field>
        </Formol>
      ),
      {
        identifier: 4,
        properties: {
          name: 'paul',
          root: {
            realm: '*',
          },
          extra: [
            'extra info',
            {
              more: {
                again: [
                  {
                    hereweare: 42,
                  },
                ],
              },
            },
          ],
        },
      }
    )
  )
