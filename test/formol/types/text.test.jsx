import { mount } from 'enzyme'
import React from 'react'

import Formol, { Field } from '../../../src'

describe('Text field', () => {
  it('handles changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ text: 'foo' }}>
        <Field type="text">Text</Field>
      </Formol>
    )
    const input = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()
    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().type).toEqual('text')
    expect(input().props().value).toEqual('foo')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'foo bar' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('foo bar')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith(
      { text: 'foo bar' },
      { text: 'foo' },
      ['text'],
      true
    )
    expect(input().props().value).toEqual('foo bar')
  })
  it('cancels changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ text: 'foo' }}>
        <Field type="text">Text</Field>
      </Formol>
    )
    const input = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()
    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().value).toEqual('foo')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'foo bar' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('foo bar')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await cancel().simulate('click')

    expect(input().props().value).toEqual('foo')
  })
})
