import { withOptions } from '@storybook/addon-options'
import { addDecorator, configure } from '@storybook/react'

addDecorator(
  withOptions({
    name: 'Formol',
    url: 'https://github.com/Kozea/formol',
    addonPanelInRight: true,
  })
)

configure(() => require('../stories'), module)
