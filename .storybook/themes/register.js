import addons from '@storybook/addons'
import React from 'react'

import Themes from '.'

addons.register('formol/themes', api => {
  addons.addPanel('formol/themes/panel', {
    title: 'Themes',
    render: () => <Themes api={api} />,
  })
})
