import { mount } from 'enzyme'
import React from 'react'

import Formol, { Field } from '../../../src'

describe('Range field', () => {
  it('handles changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ range: 42 }}>
        <Field type="range">Range</Field>
      </Formol>
    )
    const input = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()
    const min = () => wrapper.find('.Formol_RangeField__min')
    const value = () => wrapper.find('.Formol_RangeField__value-wrapper')
    const max = () => wrapper.find('.Formol_RangeField__max')
    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().value).toEqual(42)
    expect(min().text()).toEqual('0')
    expect(max().text()).toEqual('100')
    expect(value().text()).toEqual('42')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 96 } })
    await input().simulate('blur')

    expect(input().props().value).toEqual(96)
    expect(min().text()).toEqual('0')
    expect(max().text()).toEqual('100')
    expect(value().text()).toEqual('96')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith({ range: 96 }, { range: 42 }, [
      'range',
    ])
    expect(input().props().value).toEqual(96)
  })
  it('cancels changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ range: 42 }}>
        <Field type="range">Range</Field>
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
    await input().simulate('change', { target: { value: 96 } })
    await input().simulate('blur')

    expect(input().props().value).toEqual(96)
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await cancel().simulate('click')

    expect(input().props().value).toEqual(42)
  })
  it('prevents submission on field error', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ range: 42 }}>
        <Field type="range" max={2000}>
          Range
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
    expect(input().props().type).toEqual('range')
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
    expect(onSubmit).toHaveBeenCalledWith({ range: 1664 }, { range: 42 }, [
      'range',
    ])
    expect(input().props().value).toEqual(1664)
  })
  it('prevents change when not a range', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ range: 42 }}>
        <Field type="range">Range</Field>
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
    await input().simulate('change', { target: { value: 'not a range' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('')
  })
  it('prevents change when not in default range', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ range: 42 }}>
        <Field type="range">Range</Field>
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
    await input().simulate('change', {
      target: { value: 1337 },
    })
    await input().simulate('blur')
    expect(wrapper.find('.Formol_Field__error-text').text()).toEqual(
      'Constraints not satisfied'
    )

    expect(input().props().value).toEqual(1337)
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).not.toHaveBeenCalled()
  })
  it('prevents change when not in custom range', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ range: 42 }}>
        <Field type="range" min={3} max={28} step={5}>
          Range
        </Field>
      </Formol>
    )
    const input = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()
    const min = () => wrapper.find('.Formol_RangeField__min')
    const value = () => wrapper.find('.Formol_RangeField__value-wrapper')
    const max = () => wrapper.find('.Formol_RangeField__max')
    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().value).toEqual(42)
    expect(min().text()).toEqual('3')
    expect(max().text()).toEqual('28')
    expect(value().text()).toEqual('42')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 1337 } })
    await input().simulate('blur')
    expect(wrapper.find('.Formol_Field__error-text').text()).toEqual(
      'Constraints not satisfied'
    )

    expect(input().props().value).toEqual(1337)
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).not.toHaveBeenCalled()

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 1 } })
    await input().simulate('blur')
    expect(wrapper.find('.Formol_Field__error-text').text()).toEqual(
      'Constraints not satisfied'
    )

    expect(input().props().value).toEqual(1)
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).not.toHaveBeenCalled()

    await input().simulate('focus')
    await input().simulate('change', {
      target: { value: 9 },
    })
    await input().simulate('blur')
    expect(wrapper.find('.Formol_Field__error-text').text()).toEqual(
      'Constraints not satisfied'
    )

    expect(input().props().value).toEqual(9)
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).not.toHaveBeenCalled()

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 18 } })
    await input().simulate('blur')

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith({ range: 18 }, { range: 42 }, [
      'range',
    ])
    expect(input().props().value).toEqual(18)
  })
  it('respects noLabel prop', () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ range: 42 }}>
        <Field type="range" min={3} max={28} step={5} noLabels>
          Range
        </Field>
      </Formol>
    )
    const input = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()
    const min = () => wrapper.find('.Formol_RangeField__min')
    const value = () => wrapper.find('.Formol_RangeField__value-wrapper')
    const max = () => wrapper.find('.Formol_RangeField__max')
    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().value).toEqual(42)
    expect(min().length).toEqual(0)
    expect(max().length).toEqual(0)
    expect(value().length).toEqual(0)
  })
})
