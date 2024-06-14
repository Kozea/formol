import { mount } from 'enzyme'
import React from 'react'

import Formol, { Field } from '../../../src'

describe('Tel field', () => {
  it('handles changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ tel: '311-555-2368' }}>
        <Field type="tel">Tel</Field>
      </Formol>
    )
    const input = () => wrapper.find('Field').find('input').first()
    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().type).toEqual('tel')
    expect(input().props().value).toEqual('311-555-2368')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: '311-555-1212' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('311-555-1212')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(wrapper.getDOMNode().checkValidity()).toBeTruthy()

    await submit().simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith(
      { tel: '311-555-1212' },
      { tel: '311-555-2368' },
      ['tel'],
      true
    )
    expect(input().props().value).toEqual('311-555-1212')
  })
  it('cancels changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ tel: '311-555-2368' }}>
        <Field type="tel">Tel</Field>
      </Formol>
    )
    const input = () => wrapper.find('Field').find('input').first()
    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().value).toEqual('311-555-2368')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: '311-555-1212' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('311-555-1212')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await cancel().simulate('click')

    expect(input().props().value).toEqual('311-555-2368')
  })
  it('prevents submission on field error', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ tel: '311-555-2368' }}>
        <Field type="tel">Tel</Field>
      </Formol>
    )
    const input = () => wrapper.find('Field').find('input').first()
    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().value).toEqual('311-555-2368')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'not an tel' } })
    await input().simulate('blur')
    expect(wrapper.find('.Formol_Field__error-text').text()).toEqual(
      'Constraints not satisfied'
    )

    expect(input().props().value).toEqual('not an tel')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(wrapper.getDOMNode().checkValidity()).toBeFalsy()

    expect(input().props().value).toEqual('not an tel')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: '888-235-5678' } })
    await input().simulate('blur')
    expect(wrapper.find('.Formol_Field__error-text').length).toEqual(0)

    await submit().simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith(
      { tel: '888-235-5678' },
      { tel: '311-555-2368' },
      ['tel'],
      true
    )
    expect(input().props().value).toEqual('888-235-5678')
  })
})
