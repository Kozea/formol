import { mount } from 'enzyme'
import React from 'react'

import Formol, { Field } from '../../../src'

describe('Textarea field', () => {
  it('handles changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ area: 'foo\nbar' }}>
        <Field type="area">Area</Field>
      </Formol>
    )
    const input = () =>
      wrapper
        .find('Field')
        .find('textarea')
        .first()
    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().value).toEqual('foo\nbar')

    await input().simulate('focus')
    await input().simulate('change', {
      target: { value: 'foo\nbar\nbaz' },
    })
    await input().simulate('blur')

    expect(input().props().value).toEqual('foo\nbar\nbaz')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith(
      { area: 'foo\nbar\nbaz' },
      { area: 'foo\nbar' },
      ['area']
    )
    expect(input().props().value).toEqual('foo\nbar\nbaz')
  })
  it('cancels changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ area: 'foo\nbar' }}>
        <Field type="area">Area</Field>
      </Formol>
    )
    const input = () =>
      wrapper
        .find('Field')
        .find('textarea')
        .first()
    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().value).toEqual('foo\nbar')

    await input().simulate('focus')
    await input().simulate('change', {
      target: { value: 'foo\nbar\nbaz' },
    })
    await input().simulate('blur')

    expect(input().props().value).toEqual('foo\nbar\nbaz')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await cancel().simulate('click')

    expect(input().props().value).toEqual('foo\nbar')
  })
})
