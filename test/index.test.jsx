import { mount } from 'enzyme'
import React from 'react'

import Formol from '../src'

it('is mountable', () => {
  const wrapper = mount(<Formol />)
  expect(wrapper.find('form')).toBeTruthy()
})
