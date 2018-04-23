import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'

import { Field } from '../src'
import Formol from '../src/Formol'

storiesOf('Formol', module)
  .add('An empty form', () => <Formol />)
  .add('A simple form with a field', () => (
    <Formol onCreate={action('item created')} onPatch={action('item patched')}>
      <Field name="field">Field</Field>
    </Formol>
  ))
