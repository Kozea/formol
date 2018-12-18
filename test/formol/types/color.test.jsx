import { mount } from 'enzyme'
import React from 'react'

import Formol, { Field } from '../../../src'

describe('Color field', () => {
  it('handles changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ color: '#bada55' }}>
        <Field type="color">Color</Field>
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
    expect(input().props().type).toEqual('color')
    expect(input().props().value).toEqual('#bada55')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: '#c0ffee' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('#c0ffee')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(wrapper.getDOMNode().checkValidity()).toBeTruthy()

    await submit().simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith(
      { color: '#c0ffee' },
      { color: '#bada55' },
      ['color'],
      true
    )
    expect(input().props().value).toEqual('#c0ffee')
  })
  it('cancels changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ color: '#bada55' }}>
        <Field type="color">Color</Field>
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
    expect(input().props().value).toEqual('#bada55')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: '#c0ffee' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('#c0ffee')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await cancel().simulate('click')

    expect(input().props().value).toEqual('#bada55')
  })
  it('prevents submission on field error', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ color: '#bada55' }}>
        <Field type="color">Color</Field>
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
    expect(input().props().value).toEqual('#bada55')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'not an color' } })
    await input().simulate('blur')
    expect(wrapper.find('.Formol_Field__error-text').text()).toEqual(
      'not an color is not a valid color'
    )

    expect(input().props().value).toEqual('not an color')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(wrapper.getDOMNode().checkValidity()).toBeFalsy()

    expect(input().props().value).toEqual('not an color')

    await input().simulate('focus')
    await input().simulate('change', {
      target: { value: '#deadbe' },
    })
    await input().simulate('blur')
    expect(wrapper.find('.Formol_Field__error-text').length).toEqual(0)

    await submit().simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith(
      { color: '#deadbe' },
      { color: '#bada55' },
      ['color'],
      true
    )
    expect(input().props().value).toEqual('#deadbe')
  })
})
