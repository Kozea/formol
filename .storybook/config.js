import { withOptions } from '@storybook/addon-options'
import { addDecorator, configure } from '@storybook/react'
import { withCssResources } from '@storybook/addon-cssresources'

const themes = ['default.css', 'clean.css']

addDecorator(
  withOptions({
    name: 'Formol',
    url: 'https://github.com/Kozea/formol',
    addonPanelInRight: true,
  })
)

addDecorator(
  withCssResources({
    cssresources: themes.map(theme => ({
      name: `Theme: ${theme}`,
      code: `<link rel="stylesheet" type="text/css" href="${theme}"></link>`,
      picked: theme === 'default.css',
    })),
  })
)

configure(() => require('../stories'), module)
