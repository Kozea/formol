import { addParameters, configure } from '@storybook/react'

const themes = ['default.css', 'clean.css']

addParameters({
  options: {
    name: 'Formol',
    url: 'https://github.com/Kozea/formol',
    panelPosition: 'right',
    showPanel: true,
  },
})

configure(() => require('../stories'), module)
