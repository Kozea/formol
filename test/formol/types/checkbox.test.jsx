import { mount } from 'enzyme'
import React from 'react'

import Formol, { Field } from '../../../src'

describe('Checkbox field', () => {
  it('handles changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ checkbox: true }}>
        <Field type="checkbox">Checkbox</Field>
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
    expect(input().props().type).toEqual('checkbox')
    expect(input().props().checked).toEqual(true)

    await input().simulate('focus')
    await input().simulate('change', { target: { checked: false } })
    await input().simulate('blur')

    expect(input().props().checked).toEqual(false)
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith(
      { checkbox: false },
      { checkbox: true },
      ['checkbox'],
      true
    )
    expect(input().props().checked).toEqual(false)
  })
  it('cancels changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ checkbox: true }}>
        <Field type="checkbox">Checkbox</Field>
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
    expect(input().props().checked).toEqual(true)

    await input().simulate('focus')
    await input().simulate('change', { target: { checked: false } })
    await input().simulate('blur')

    expect(input().props().checked).toEqual(false)
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await cancel().simulate('click')

    expect(input().props().checked).toEqual(true)
  })
  it('sets disabled when readOnly', () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ checkbox: true }}>
        <Field type="checkbox" readOnly>
          Checkbox
        </Field>
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
    expect(input().props().checked).toEqual(true)
    expect(input().props().disabled).toEqual(true)
  })
})
