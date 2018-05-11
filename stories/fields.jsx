import { boolean, number, text } from '@storybook/addon-knobs/react'
import React from 'react'

import Formol, { Field } from '../src'

const choices = {
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

// eslint-disable-next-line react/display-name
const makeField = (name, extraProps) => props => (
  <Field type={name} name={name} {...extraProps} {...props}>
    {name}
  </Field>
)

const extrasProps = {
  checkbox: { extraLabel: 'Label' },
  radio: { extraLabel: 'Label' },
  'checkbox-set': { choices },
  'radio-set': { choices },
  select: { choices },
  'select-menu': { choices },
}

export const typeFields = Object.keys(Formol.defaultFields).reduce(
  (fields, name) => {
    fields[name] = makeField(name, extrasProps[name])
    return fields
  },
  {}
)

export const testFieldValue = name =>
  ({
    area: 'Text\nArea',
    email: 'email@exemple.com',
    number: 12,
    tel: '1-541-754-3010',
    radio: true,
    checkbox: true,
    'checkbox-set': ['#800000', '#ffff00'],
    'radio-set': '#ffff00',
    select: '#800000',
    'select-menu': '#800000',
    'select-menu-multiple': ['#800000', '#ffff00'],
    color: '#123456',
    html:
      '<p><span style="color: rgb(251,160,38);">H</span><strong>T</strong><del>M</del><em>L</em></p>', // eslint-disable-line max-len
    calendar: '2018-08-01',
    date: '2018-08-01',
    time: '17:14',
    switch: true,
    datetimelocal: '2018-08-01T17:14',
    week: '2018-W12',
    month: '2018-08',
    file: {
      data:
        'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHZpZXdCb3g9IjAgMCA5MzMgODgyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxnIHN0eWxlPSJmb250LXNpemU6MjM4LjcwMzY4OTU4cHg7Zm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDpub3JtYWw7Zm9udC1zdHJldGNoOm5vcm1hbDtsaW5lLWhlaWdodDoxMDAlO3dyaXRpbmctbW9kZTpsci10Yjt0ZXh0LWFuY2hvcjpzdGFydDtmaWxsOmJsYWNrO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxcHQ7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW9wYWNpdHk6MTtmb250LWZhbWlseTpBcmlhbCI+CiAgICA8dGV4dCB4PSIzNzEuMzkwMTQiIHk9IjIzMS43ODY1Ij5PPC90ZXh0PgogICAgPHRleHQgeD0iMzUuNzQxNTU0IiB5PSI4MjkuMjk0MzEiPkg8L3RleHQ+CiAgICA8dGV4dCB4PSI3MjYuNzMzNjQiIHk9IjgyOS4yOTQzMSI+SDwvdGV4dD4KICAgIDx0ZXh0IHg9IjM3OS4xMzQyMiIgeT0iNjI2LjU0NTA0Ij5DPC90ZXh0PgogIDwvZz4KICA8ZyBzdHlsZT0iZmlsbDpub25lO2ZpbGwtb3BhY2l0eTowLjc1O2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZTpibGFjaztzdHJva2Utd2lkdGg6MTU7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSI+CiAgICA8cGF0aCBkPSJNIDIzMC44Nzc2LDY3Ny44MjAwMSBMIDM2OS44OTY5Myw1OTcuNTU3MTYiIC8+CiAgICA8cGF0aCBkPSJNIDcwMy43NzcxNSw2NzcuODIwMDEgTCA1NjQuNzU3ODIsNTk3LjU1NzE2IiAvPgogICAgPHBhdGggZD0iTSA0MzYuNDg3MzIsMjU5Ljg0MjcxIEwgNDM2LjQ4NzMyLDQyNC4zMzk3OSIgLz4KICAgIDxwYXRoIGQ9Ik0gNDk3LjU2Mjk3LDI1OS44NDI3MSBMIDQ5Ny41NjI5Nyw0MjQuMzM5NzkiIC8+CiAgPC9nPgo8L3N2Zz4K', // eslint-disable-line max-len
      ext: 'svg',
      name: 'formol',
      size: 1086,
      type: 'image/svg+xml',
    },
  }[name] || name)

export const knobs = name => {
  const knob = {
    required: boolean('Required', false, name),
    readOnly: boolean('Read Only', false, name),
    disabled: boolean('Disabled', false, name),
    autoFocus: boolean('AutoFocus', false, name),
    placeholder: text('PlaceHolder', name, name),
  }
  if (name === 'file') {
    knob.accept = text('Accept', 'image/*', name)
  }
  if (['file', 'select', 'select-menu'].includes(name)) {
    knob.multiple = boolean('Multiple', false, name)
  }
  if (['number', 'range'].includes(name)) {
    knob.min = number('Min', 0, name)
    knob.max = number('Max', 100, name)
    knob.step = number('Step', 5, name)
  }
  return knob
}
