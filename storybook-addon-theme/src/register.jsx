import addons, { types } from '@storybook/addons'
import React from 'react'

import Themes from '.'

addons.register('formol_themes', api => {
  addons.addPanel('formol_themes/panel', {
    type: types.PANEL,
    title: 'Formol Themes',
    // eslint-disable-next-line react/display-name
    render: ({ active, key }) => <Themes api={api} active={active} key={key} />,
  })
})
