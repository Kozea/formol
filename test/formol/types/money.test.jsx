import { mount } from 'enzyme'
import React from 'react'

import Formol, { Field } from '../../../src'

// Most of tests are skipped here due to
// https://github.com/jsdom/jsdom/issues/2288
describe('Money field', () => {
  it('handles changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ money: '1.50' }}>
        <Field type="money">Money</Field>
      </Formol>
    )
    const input = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()
    const unit = () => wrapper.find('.Formol_Field__unit')
    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().type).toEqual('number')
    expect(input().props().value).toEqual('1.50')
    expect(unit().text()).toEqual('$')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: '2.5' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('2.50')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await input().simulate('focus')
    await input().simulate('change', { target: { value: '3.14159265359879' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('3.14')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await input().simulate('focus')
    await input().simulate('change', { target: { value: '3.141592653e4' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('31415.93')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await input().simulate('focus')
    await input().simulate('change', { target: { value: '15' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('15')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await input().simulate('focus')
    await input().simulate('change', { target: { value: '' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()
  })

  it('handles options', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ money: '1.5084' }}>
        <Field type="money" unit="¥" precision={4}>
          Money
        </Field>
      </Formol>
    )
    const input = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()
    const unit = () => wrapper.find('.Formol_Field__unit')
    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(unit().text()).toEqual('¥')
    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().type).toEqual('number')
    expect(input().props().value).toEqual('1.5084')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: '3.14159265359879' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('3.1415')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()
  })

  it('avoids bad options', () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ money: '1.5084' }}>
        <Field type="money" min={-12} precision={0}>
          Money
        </Field>
      </Formol>
    )
    const input = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    expect(input().props().type).toEqual('number')
    expect(input().props().min).toEqual(-12)
    expect(input().props().step).toEqual(1)
  })

  it.skip('handles changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ money: '1.50' }}>
        <Field type="money">Money</Field>
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
    expect(input().props().value).toEqual('1.50')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: '2.5' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('2.50')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(wrapper.getDOMNode().checkValidity()).toBeTruthy()

    await submit().simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith(
      { money: '2.50' },
      { money: '1.50' },
      ['money'],
      true
    )
    expect(input().props().value).toEqual('2.50')
  })
  it.skip('cancels changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ money: '1.50' }}>
        <Field type="money">Money</Field>
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
    expect(input().props().value).toEqual('1.50')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: '2.5' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('2.50')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await cancel().simulate('click')

    expect(input().props().value).toEqual('1.50')
  })
  it.skip('prevents submission on field error', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ money: '1.50' }}>
        <Field type="money" max={2000}>
          Money
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
    expect(input().props().value).toEqual('1.50')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: '-5' } })
    await input().simulate('blur')

    expect(wrapper.find('.Formol_Field__error-text').text()).toEqual(
      'Constraints not satisfied'
    )

    expect(input().props().value).toEqual('-5')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(wrapper.getDOMNode().checkValidity()).toBeFalsy()

    expect(input().props().value).toEqual('-5')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: '25.25' } })
    await input().simulate('blur')
    expect(wrapper.find('.Formol_Field__error-text').length).toEqual(0)

    await submit().simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith(
      { money: '25' },
      { money: '1.50' },
      ['money'],
      true
    )
    expect(input().props().value).toEqual('25')
  })
  it.skip('prevents change when not a money', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ money: '1.50' }}>
        <Field type="money">Money</Field>
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
    expect(input().props().value).toEqual('1.50')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'not a money' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('')
  })
  it.skip('prevents change when not in default money', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ money: '1.50' }}>
        <Field type="money">Money</Field>
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
    expect(input().props().value).toEqual('1.50')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: '1.256' } })
    await input().simulate('blur')
    expect(wrapper.find('.Formol_Field__error-text').text()).toEqual(
      'Constraints not satisfied'
    )

    expect(input().props().value).toEqual('1.256')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(wrapper.getDOMNode().checkValidity()).toBeFalsy()
  })
})
