import { mount } from 'enzyme'
import React from 'react'

import Formol, { Field } from '../../../src'

describe('Radio field', () => {
  it('handles changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ radio: false }}>
        <Field type="radio">Radio</Field>
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
    expect(input().props().type).toEqual('radio')
    expect(input().props().checked).toEqual(false)

    await input().simulate('focus')
    await input().simulate('change', { target: { checked: true } })
    await input().simulate('blur')

    expect(input().props().checked).toEqual(true)
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith({ radio: true }, { radio: false }, [
      'radio',
    ])
    expect(input().props().checked).toEqual(true)
  })
  it('cancels changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ radio: false }}>
        <Field type="radio">Radio</Field>
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
    expect(input().props().checked).toEqual(false)

    await input().simulate('focus')
    await input().simulate('change', { target: { checked: true } })
    await input().simulate('blur')

    expect(input().props().checked).toEqual(true)
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await cancel().simulate('click')

    expect(input().props().checked).toEqual(false)
  })
  it('sets disabled when readOnly', () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ radio: false }}>
        <Field type="radio" readOnly>
          Radio
        </Field>
      </Formol>
    )
    const input = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    expect(input().props().checked).toEqual(false)
    expect(input().props().disabled).toEqual(true)
  })
})
