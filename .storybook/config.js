import { setOptions } from '@storybook/addon-options'
import { configure } from '@storybook/react'

setOptions({
  name: 'Formol',
  url: 'https://github.com/Kozea/formol',
  addonPanelInRight: true,
})

function loadStories() {
  require('../stories/exemples.stories.jsx')
  require('../stories/fields.stories.jsx')
  require('../stories/all-fields.stories.jsx')
  require('../stories/conditionals.stories.jsx')
  require('../stories/formatters.stories.jsx')
  require('../stories/validators.stories.jsx')
  require('../stories/misc.stories.jsx')
}

configure(loadStories, module)
