import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'

import { Field } from '../src'
import Formol from '../src/Formol'

storiesOf('Formol', module)
  .add('with nothing', () => <Formol />)
  .add('with a field', () => (
    <Formol>
      <Field name="field" />
    </Formol>
  ))
