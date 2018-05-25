import { withState } from '@dump247/storybook-state'
import { boolean, number, select } from '@storybook/addon-knobs'

import Formol from '../src'

export const withStateForm = (form, initial) =>
  withState({ transient: initial, item: initial })(({ store }) => {
    const delay = number('Fake delay (ms)', 10, 'form')
    return form({
      onSubmit: async item => {
        await new Promise(resolve => setTimeout(resolve, delay))
        store.set({ item })
      },
      onChange: transient => store.set({ transient }),
      item: store.state.item,
      readOnly: boolean('Form read only', false, 'form'),
      focusNextOnEnter: boolean('Focus next field with [Enter]', false, 'form'),
      i18n: select('I18n', Object.keys(Formol.i18n), 'en', 'form'),
    })
  })
