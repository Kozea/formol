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
  'Calendar',
  'Switch',
  'Html',
  'File',
].forEach(name => {
  typeFields[name] = makeField(name)
})

typeFields.Select = makeField('Select', { choices })
typeFields.Checkbox = makeField('Checkbox', { values: choices })
typeFields.Radio = makeField('Radio', { values: choices })
typeFields.SelectMenu = makeField('SelectMenu', { choices })
typeFields.SelectMenuMultiple = makeField('SelectMenu', {
  choices,
  multiple: true,
})
