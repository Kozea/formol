import { addParameters, configure } from '@storybook/react'

const themes = ['default.css', 'clean.css']

addParameters({
  options: {
    brandName: 'Formol',
    brandUrl: 'https://github.com/paradoxxxzero/formol',
    panelPosition: 'right',
    showPanel: true,
  },
})

configure(() => require('../stories'), module)
