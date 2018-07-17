import { mount } from 'enzyme'
import React from 'react'

import Formol, { Field } from '../../../src'

describe('Number field', () => {
  it('handles changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ number: 42 }}>
        <Field type="number">Number</Field>
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
    expect(input().props().value).toEqual(42)

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 1337 } })
    await input().simulate('blur')

    expect(input().props().value).toEqual(1337)
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith({ number: 1337 }, { number: 42 }, [
      'number',
    ])
    expect(input().props().value).toEqual(1337)
  })
  it('cancels changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ number: 42 }}>
        <Field type="number">Number</Field>
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
    expect(input().props().value).toEqual(42)

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 1337 } })
    await input().simulate('blur')

    expect(input().props().value).toEqual(1337)
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await cancel().simulate('click')

    expect(input().props().value).toEqual(42)
  })
  it('prevents submission on field error', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ number: 42 }}>
        <Field type="number" max={2000}>
          Number
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
    expect(input().props().type).toEqual('number')
    expect(input().props().value).toEqual(42)

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 4000 } })
    await input().simulate('blur')

    expect(wrapper.find('.Formol_Field__error-text').text()).toEqual(
      'Constraints not satisfied'
    )

    expect(input().props().value).toEqual(4000)
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).not.toHaveBeenCalled()

    expect(input().props().value).toEqual(4000)

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 1664 } })
    await input().simulate('blur')
    expect(wrapper.find('.Formol_Field__error-text').length).toEqual(0)

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith({ number: 1664 }, { number: 42 }, [
      'number',
    ])
    expect(input().props().value).toEqual(1664)
  })
  it('prevents change when not a number', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ number: 42 }}>
        <Field type="number">Number</Field>
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
    expect(input().props().value).toEqual(42)

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'not a number' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('')
  })
})
