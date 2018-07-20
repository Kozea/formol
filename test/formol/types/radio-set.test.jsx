import { mount } from 'enzyme'
import React from 'react'

import Formol, { Field } from '../../../src'

describe('Radio Set field', () => {
  it('handles changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ radioSet: 'II' }}>
        <Field
          type="radio-set"
          choices={{
            one: 1,
            two: 'II',
            three: true,
          }}
        >
          Radio Set
        </Field>
      </Formol>
    )
    const inputs = () => wrapper.find('Field').find('input')

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    inputs().map(input => expect(input.props().type).toEqual('radio'))
    const expectValues = (...values) =>
      inputs().map((input, i) =>
        expect(input.props().checked).toEqual(values[i])
      )

    expectValues(false, true, false)

    await inputs()
      .at(2)
      .simulate('focus')
    await inputs()
      .at(2)
      .simulate('change', { target: { checked: true } })
    await inputs()
      .at(2)
      .simulate('blur')

    expectValues(false, false, true)

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith(
      { radioSet: true },
      { radioSet: 'II' },
      ['radioSet']
    )

    expectValues(false, false, true)
  })
  it('cancels changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ radioSet: 'II' }}>
        <Field
          type="radio-set"
          choices={{
            one: 1,
            two: 'II',
            three: true,
          }}
        >
          Radio Set
        </Field>
      </Formol>
    )
    const inputs = () => wrapper.find('Field').find('input')

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    inputs().map(input => expect(input.props().type).toEqual('radio'))
    const expectValues = (...values) =>
      inputs().map((input, i) =>
        expect(input.props().checked).toEqual(values[i])
      )

    expectValues(false, true, false)

    await inputs()
      .at(2)
      .simulate('focus')
    await inputs()
      .at(2)
      .simulate('change', { target: { checked: true } })
    await inputs()
      .at(2)
      .simulate('blur')

    expectValues(false, false, true)

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await cancel().simulate('click')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expectValues(false, true, false)
  })
  it('sets disabled when readOnly', () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ radioSet: 'II' }}>
        <Field type="radio-set" readOnly>
          Radio Set
        </Field>
      </Formol>
    )
    const inputs = () => wrapper.find('Field').find('input')
    inputs().map(input => expect(input.props().disabled).toEqual(true))
  })
})
