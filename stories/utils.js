import { withState } from 'storybook4-state'
import { boolean, number, select } from '@storybook/addon-knobs'

import Formol from '../src'
import { diff as objDiff } from '../src/utils/object'

export const withStateForm = (form, initial, response) =>
  withState({ transient: initial, item: initial })(({ store }) => {
    const delay = number('Fake delay (ms)', null, {}, 'form')
    return form({
      onSubmit: async (item, transient, names) => {
        const errors = response ? response(item, diff) : {}
        if (Object.values(errors).some(e => e)) {
          return errors
        }
        await new Promise(resolve => setTimeout(resolve, delay))
        const oldItem = store.state.item || {}
        const diff = objDiff(item, oldItem, names)
        store.set({ item, diff })
        return errors
      },
      onChange: transient => store.set({ transient }),
      item: store.state.item,
      transient: store.state.transient,
      readOnly: boolean('Form read only', false, 'form'),
      i18n: select('I18n', Object.keys(Formol.i18n), 'en', 'form'),
    })
  })
