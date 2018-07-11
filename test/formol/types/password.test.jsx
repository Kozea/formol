import { mount } from 'enzyme'
import React from 'react'

import Formol, { Field } from '../../../src'

describe('Password field', () => {
  it('handles changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ password: 'passw0rd' }}>
        <Field type="password">Password</Field>
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
    expect(input().props().type).toEqual('password')
    expect(input().props().value).toEqual('passw0rd')

    await input().simulate('focus')
    await input().simulate('change', {
      target: { value: 'u#@*/p=u58+e' },
    })
    await input().simulate('blur')

    expect(input().props().value).toEqual('u#@*/p=u58+e')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith(
      { password: 'u#@*/p=u58+e' },
      { password: 'passw0rd' },
      ['password']
    )
    expect(input().props().value).toEqual('u#@*/p=u58+e')
  })
  it('cancels changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ password: 'passw0rd' }}>
        <Field type="password">Password</Field>
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
    expect(input().props().value).toEqual('passw0rd')

    await input().simulate('focus')
    await input().simulate('change', {
      target: { value: 'u#@*/p=u58+e' },
    })
    await input().simulate('blur')

    expect(input().props().value).toEqual('u#@*/p=u58+e')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await cancel().simulate('click')

    expect(input().props().value).toEqual('passw0rd')
  })
  it('shows password on eye click', async () => {
    const wrapper = mount(
      <Formol item={{ password: 'passw0rd' }}>
        <Field type="password">Password</Field>
      </Formol>
    )
    const input = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()
    const eye = () => wrapper.find('Field').find('.Formol_PasswordField__eye')

    expect(input().props().value).toEqual('passw0rd')
    expect(input().props().type).toEqual('password')
    await eye().simulate('click')
    expect(input().props().value).toEqual('passw0rd')
    expect(input().props().type).toEqual('text')

    await input().simulate('focus')
    await input().simulate('change', {
      target: { value: 'u#@*/p=u58+e' },
    })
    await input().simulate('blur')
    // bluring the field should restore password type
    expect(input().props().type).toEqual('password')
    expect(input().props().value).toEqual('u#@*/p=u58+e')

    await eye().simulate('click')

    expect(input().props().value).toEqual('u#@*/p=u58+e')
    expect(input().props().type).toEqual('text')

    await eye().simulate('click')

    expect(input().props().value).toEqual('u#@*/p=u58+e')
    expect(input().props().type).toEqual('password')
  })
})
