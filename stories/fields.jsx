import { boolean, number, text } from '@storybook/addon-knobs/react'
import React from 'react'

import { Field } from '../src'

const choices = {
  '#ffffff': 'White',
  '#c0c0c0': 'Silver',
  '#808080': 'Gray',
  '#000000': 'Black',
  '#ff0000': 'Red',
  '#800000': 'Maroon',
  '#ffff00': 'Yellow',
  '#808000': 'Olive',
  '#00ff00': 'Lime',
  '#008000': 'Green',
  '#00ffff': 'Aqua',
  '#008080': 'Teal',
  '#0000ff': 'Blue',
  '#000080': 'Navy',
  '#ff00ff': 'Fuchsia',
  '#800080': 'Purple',
}

const pascalCaseToKebabCase = word =>
  word
    .replace(/\w[A-Z]/g, match => `${match[0]}-${match[1].toLowerCase()}`)
    .toLowerCase()

// eslint-disable-next-line react/display-name
const makeField = (name, specificProps) => props => (
  <Field
    type={pascalCaseToKebabCase(name)}
    name={name}
    {...specificProps}
    {...props}
  >
    {name}
  </Field>
)

export const typeFields = {}
;[
  'Text',
  'Area',
  'Email',
  'Number',
  'Password',
  'PasswordStrengh',
  'Tel',
  'Checkbox',
  'Radio',
  'Color',
  'Date',
  'Time',
  'DatetimeLocal',
  'Month',
  'Week',
  'Range',
  'Calendar',
  'Switch',
  'Html',
  'File',
  'Files',
].forEach(name => {
  typeFields[name] = makeField(name)
})

typeFields.Select = makeField('Select', { choices })
typeFields.Checkboxes = makeField('Checkboxes', { choices })
typeFields.Radios = makeField('Radios', { choices })
typeFields.SelectMenu = makeField('SelectMenu', { choices })
typeFields.SelectMenuMultiple = makeField('SelectMenu', {
  choices,
  multiple: true,
})

export const testFieldValue = name =>
  ({
    Area: 'Text\nArea',
    Email: 'email@exemple.com',
    Number: 12,
    Tel: '1-541-754-3010',
    Radio: true,
    Checkbox: true,
    Checkboxes: ['#800000', '#ffff00'],
    Radios: '#ffff00',
    Select: '#800000',
    SelectMenu: '#800000',
    SelectMenuMultiple: ['#800000', '#ffff00'],
    Color: '#123456',
    Html:
      '<p><span style="color: rgb(251,160,38);">H</span><b>T</b><del>M</del><em>L</em></p>', // eslint-disable-line max-len
    Calendar: '2018-08-01',
    Date: '2018-08-01',
    Time: '17:14',
    DatetimeLocal: '2018-08-01T17:14',
    Week: '2018-W12',
    Month: '2018-08',
    File: [
      {
        data:
          'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHZpZXdCb3g9IjAgMCA5MzMgODgyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxnIHN0eWxlPSJmb250LXNpemU6MjM4LjcwMzY4OTU4cHg7Zm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDpub3JtYWw7Zm9udC1zdHJldGNoOm5vcm1hbDtsaW5lLWhlaWdodDoxMDAlO3dyaXRpbmctbW9kZTpsci10Yjt0ZXh0LWFuY2hvcjpzdGFydDtmaWxsOmJsYWNrO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxcHQ7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW9wYWNpdHk6MTtmb250LWZhbWlseTpBcmlhbCI+CiAgICA8dGV4dCB4PSIzNzEuMzkwMTQiIHk9IjIzMS43ODY1Ij5PPC90ZXh0PgogICAgPHRleHQgeD0iMzUuNzQxNTU0IiB5PSI4MjkuMjk0MzEiPkg8L3RleHQ+CiAgICA8dGV4dCB4PSI3MjYuNzMzNjQiIHk9IjgyOS4yOTQzMSI+SDwvdGV4dD4KICAgIDx0ZXh0IHg9IjM3OS4xMzQyMiIgeT0iNjI2LjU0NTA0Ij5DPC90ZXh0PgogIDwvZz4KICA8ZyBzdHlsZT0iZmlsbDpub25lO2ZpbGwtb3BhY2l0eTowLjc1O2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZTpibGFjaztzdHJva2Utd2lkdGg6MTU7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSI+CiAgICA8cGF0aCBkPSJNIDIzMC44Nzc2LDY3Ny44MjAwMSBMIDM2OS44OTY5Myw1OTcuNTU3MTYiIC8+CiAgICA8cGF0aCBkPSJNIDcwMy43NzcxNSw2NzcuODIwMDEgTCA1NjQuNzU3ODIsNTk3LjU1NzE2IiAvPgogICAgPHBhdGggZD0iTSA0MzYuNDg3MzIsMjU5Ljg0MjcxIEwgNDM2LjQ4NzMyLDQyNC4zMzk3OSIgLz4KICAgIDxwYXRoIGQ9Ik0gNDk3LjU2Mjk3LDI1OS44NDI3MSBMIDQ5Ny41NjI5Nyw0MjQuMzM5NzkiIC8+CiAgPC9nPgo8L3N2Zz4K', // eslint-disable-line max-len
        ext: 'svg',
        name: 'formol',
        size: 1086,
        type: 'image/svg+xml',
      },
    ],
    Files: [],
  }[name] || name)

export const knobs = name => {
  const knob = {
    required: boolean('Required', false),
    readOnly: boolean('Read Only', false),
    disabled: boolean('Disabled', false),
    autoFocus: boolean('AutoFocus', false),
    placeholder: text('PlaceHolder', name),
  }
  if (name === 'File') {
    knob.accept = text('Accept', 'image/*')
  }
  if (['Number', 'Range'].includes(name)) {
    knob.min = number('Min', 0)
    knob.max = number('Max', 100)
    knob.step = number('Step', 5)
  }
  return knob
}
