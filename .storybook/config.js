import '@storybook/addon-console'

import { setOptions } from '@storybook/addon-options'
import { configure } from '@storybook/react'

setOptions({
  name: 'Formol',
  url: 'https://github.com/Kozea/formol',
  addonPanelInRight: true,
})

function loadStories() {
  require('../stories/index.jsx')
}

configure(loadStories, module)
