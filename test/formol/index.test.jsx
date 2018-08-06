import React from 'react'

import { mount } from 'enzyme'

import Formol, { Field } from '../../src'

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
  it('does nothing on form submit', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(<Formol onSubmit={onSubmit} />)
    await wrapper.find('form').simulate('submit')
    expect(onSubmit).not.toHaveBeenCalled()
  })
  it('renders extra attribute', () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol
        onSubmit={onSubmit}
        item={{ text: 'foo' }}
        extra={({ context: { transientItem } }) => (
          <code>{JSON.stringify(transientItem)}</code>
        )}
      >
        <Field type="text">Text</Field>
      </Formol>
    )

    expect(wrapper.find('code').text()).toEqual('{"text":"foo"}')
    expect(
      wrapper
        .find('form')
        .children()
        .map(p => p.type())
        .slice(1)
    ).toEqual(['input', 'button', 'button', 'code'])
  })
})
