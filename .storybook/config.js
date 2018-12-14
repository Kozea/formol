import { addDecorator, configure } from '@storybook/react'
import { withOptions } from '@storybook/addon-options'

const themes = ['default.css', 'clean.css']

addDecorator(
  withOptions({
    name: 'Formol',
    url: 'https://github.com/Kozea/formol',
    addonPanelInRight: true,
  })
)

configure(() => require('../stories'), module)
