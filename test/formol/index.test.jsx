import { mount } from 'enzyme'
import React from 'react'

import Formol from '../../src'

describe('Formol', () => {
  it('is mountable and unmountable', () => {
    const wrapper = mount(<Formol />)
    expect(wrapper.find('form')).toBeTruthy()
    expect(wrapper.unmount()).toBeTruthy()
  })
  it('contains a submit button', () => {
    const wrapper = mount(<Formol />)
    expect(wrapper.find('.Formol_Formol__submit')).toBeTruthy()
    expect(wrapper.find('.Formol_Formol__submit').text()).toEqual('Submit')
  })
  it('contains a cancel button', () => {
    const wrapper = mount(<Formol />)
    expect(wrapper.find('.Formol_Formol__cancel')).toBeTruthy()
    expect(wrapper.find('.Formol_Formol__cancel').text()).toEqual('Cancel')
  })
  it('contains nothing else', () => {
    const wrapper = mount(<Formol />)
    expect(
      wrapper
        .find('form')
        .children()
        .map(e => e.type())
    ).toEqual(['input', 'button', 'button'])
  })
})
