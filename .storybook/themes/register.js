import addons from '@storybook/addons'
import React from 'react'

import Themes from '.'

addons.register('formol_themes', api => {
  addons.addPanel('formol_themes/panel', {
    title: 'Formol Themes',
    render: ({ active }) => <Themes api={api} active={active} />,
  })
})
