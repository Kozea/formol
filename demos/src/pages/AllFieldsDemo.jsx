import React, { useState } from 'react'
import Formol, { Field } from 'formol'

import molecule from '../../../test/samples/molecule.svg.base64'

export const colorChoices = {
  White: '#ffffff',
  Silver: '#c0c0c0',
  Gray: '#808080',
  Black: 0,
  Red: '#ff0000',
  Maroon: '#800000',
  Yellow: '#ffff00',
  Olive: '#808000',
  Lime: '#00ff00',
  Green: '#008000',
  Aqua: '#00ffff',
  Teal: '#008080',
  Blue: '#0000ff',
  Navy: '#000080',
  Fuchsia: '#ff00ff',
  Purple: '#800080',
}

const initialState = {
  text: 'text',
  area: 'Text\nArea ',
  email: 'email@exemple.com',
  number: 12,
  password: 'P455w0rD',
  'password-strength': '57r0nG P455w0rD',
  tel: '541-754-3010',
  url: 'https://example.com/',
  color: '#663399',
  date: '2024-05-21',
  'date-native': '2024-05-21',
  time: '17:14',
  'datetime-local': '2018-08-01T17:14',
  month: '2018-08',
  week: '2018-W12',
  range: 42,
  money: '12.50',
  calendar: '2018-08-01',
  switch: true,
  html:
    '<p><span style="color: rgb(251,160,38);">H</span><strong>T</strong><del>M</del><em>L</em></p>', // eslint-disable-line max-len
  radio: true,
  'radio-set': '#ffff00',
  checkbox: true,
  'checkbox-set': ['#800000', '#ffff00'],
  file: {
    data: molecule,
    ext: 'svg',
    name: 'formol',
    size: 1086,
    type: 'image/svg+xml',
  },
  select: '#800000',
  'select-menu': '#800000',
}
const definitions = Object.keys(initialState).reduce((acc, key) => {
  acc[key] = { name: key, label: key }

  if (['radio-set', 'checkbox-set', 'select', 'select-menu'].includes(key)) {
    acc[key].choices = colorChoices
  }

  return acc
}, {})

const AllFieldsDemo = () => {
  const [formValues, setFormValues] = useState(initialState)

  return (
    <>
      <div className="form-container">
        <h1>All fields</h1>
        <Formol item={formValues} onChange={item => setFormValues(item)}>
          {Object.values(definitions).map(({ name, label, choices }) => (
            <Field key={name} name={name} type={name} choices={choices}>
              {label}
            </Field>
          ))}
        </Formol>
      </div>

      <pre className="panel">{JSON.stringify(formValues, null, 2)}</pre>
    </>
  )
}

export default AllFieldsDemo
