import { withState } from '@dump247/storybook-state'
import { boolean, number, select } from 'addon-knobs-null-number-fix'

import Formol from '../src'
import { diff } from '../src/utils/object'

export const withStateForm = (form, initial) =>
  withState({ transient: initial, item: initial })(({ store }) => {
    const delay = number('Fake delay (ms)', null, {}, 'form')
    return form({
      onSubmit: async (item, transient, names) => {
        await new Promise(resolve => setTimeout(resolve, delay))
        const oldItem = store.state.item || {}
        store.set({ item, diff: diff(item, oldItem, names) })
      },
      onChange: transient => store.set({ transient }),
      item: store.state.item,
      readOnly: boolean('Form read only', false, 'form'),
      focusNextOnEnter: boolean('Focus next field with [Enter]', false, 'form'),
      i18n: select('I18n', Object.keys(Formol.i18n), 'en', 'form'),
    })
  })
