import { mount } from 'enzyme'
import React from 'react'

import Formol, { Field } from '../../../src'

describe('Email field', () => {
  it('handles changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ email: 'foo@bar.baz' }}>
        <Field type="email">Email</Field>
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
    expect(input().props().type).toEqual('email')
    expect(input().props().value).toEqual('foo@bar.baz')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'fuu@bar.baz' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('fuu@bar.baz')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith(
      { email: 'fuu@bar.baz' },
      { email: 'foo@bar.baz' },
      ['email']
    )
    expect(input().props().value).toEqual('fuu@bar.baz')
  })
  it('cancels changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ email: 'foo@bar.baz' }}>
        <Field type="email">Email</Field>
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
    expect(input().props().value).toEqual('foo@bar.baz')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'fuu@bar.baz' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('fuu@bar.baz')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await cancel().simulate('click')

    expect(input().props().value).toEqual('foo@bar.baz')
  })
  it('prevents submission on field error', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ email: 'foo@bar.baz' }}>
        <Field type="email">Email</Field>
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
    expect(input().props().value).toEqual('foo@bar.baz')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'not an email' } })
    await input().simulate('blur')
    expect(wrapper.find('.Formol_Field__error-text').text()).toEqual(
      'Constraints not satisfied'
    )

    expect(input().props().value).toEqual('not an email')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).not.toHaveBeenCalled()

    expect(input().props().value).toEqual('not an email')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'bar@bar.bar' } })
    await input().simulate('blur')
    expect(wrapper.find('.Formol_Field__error-text').length).toEqual(0)

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith(
      { email: 'bar@bar.bar' },
      { email: 'foo@bar.baz' },
      ['email']
    )
    expect(input().props().value).toEqual('bar@bar.bar')
  })
})
