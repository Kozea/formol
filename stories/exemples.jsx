import React from 'react'

import Formol, { Field, MutantField } from '../src'

export const PersonForm = props => (
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
      type="radio"
      name="sex"
      values={{
        Woman: true,
        'Man or other': false,
      }}
    >
      Gender
    </Field>
    <MutantField show={item => item && item.sex}>
      <Field name="pregnant" type="switch">
        Pregnant
      </Field>
    </MutantField>
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
)

export const personExemple = {
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
      data:
        'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHZpZXdCb3g9IjAgMCA5MzMgODgyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxnIHN0eWxlPSJmb250LXNpemU6MjM4LjcwMzY4OTU4cHg7Zm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDpub3JtYWw7Zm9udC1zdHJldGNoOm5vcm1hbDtsaW5lLWhlaWdodDoxMDAlO3dyaXRpbmctbW9kZTpsci10Yjt0ZXh0LWFuY2hvcjpzdGFydDtmaWxsOmJsYWNrO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxcHQ7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW9wYWNpdHk6MTtmb250LWZhbWlseTpBcmlhbCI+CiAgICA8dGV4dCB4PSIzNzEuMzkwMTQiIHk9IjIzMS43ODY1Ij5PPC90ZXh0PgogICAgPHRleHQgeD0iMzUuNzQxNTU0IiB5PSI4MjkuMjk0MzEiPkg8L3RleHQ+CiAgICA8dGV4dCB4PSI3MjYuNzMzNjQiIHk9IjgyOS4yOTQzMSI+SDwvdGV4dD4KICAgIDx0ZXh0IHg9IjM3OS4xMzQyMiIgeT0iNjI2LjU0NTA0Ij5DPC90ZXh0PgogIDwvZz4KICA8ZyBzdHlsZT0iZmlsbDpub25lO2ZpbGwtb3BhY2l0eTowLjc1O2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZTpibGFjaztzdHJva2Utd2lkdGg6MTU7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSI+CiAgICA8cGF0aCBkPSJNIDIzMC44Nzc2LDY3Ny44MjAwMSBMIDM2OS44OTY5Myw1OTcuNTU3MTYiIC8+CiAgICA8cGF0aCBkPSJNIDcwMy43NzcxNSw2NzcuODIwMDEgTCA1NjQuNzU3ODIsNTk3LjU1NzE2IiAvPgogICAgPHBhdGggZD0iTSA0MzYuNDg3MzIsMjU5Ljg0MjcxIEwgNDM2LjQ4NzMyLDQyNC4zMzk3OSIgLz4KICAgIDxwYXRoIGQ9Ik0gNDk3LjU2Mjk3LDI1OS44NDI3MSBMIDQ5Ny41NjI5Nyw0MjQuMzM5NzkiIC8+CiAgPC9nPgo8L3N2Zz4K', // eslint-disable-line max-len
      ext: 'svg',
      name: 'formol',
      size: 1086,
      type: 'image/svg+xml',
    },
  ],
}
