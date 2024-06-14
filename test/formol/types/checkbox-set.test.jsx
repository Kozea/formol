import { mount } from 'enzyme'
import React from 'react'

import Formol, { Field } from '../../../src'

describe('Checkbox Set field', () => {
  it('handles changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ checkboxSet: [1, true] }}>
        <Field
          type="checkbox-set"
          choices={{
            one: 1,
            two: 'II',
            three: true,
          }}
        >
          Checkbox Set
        </Field>
      </Formol>
    )
    const inputs = () => wrapper.find('Field').find('input')

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    inputs().map((input) => expect(input.props().type).toEqual('checkbox'))
    const expectValues = (...values) =>
      inputs().map((input, i) =>
        expect(input.props().checked).toEqual(values[i])
      )

    expectValues(true, false, true)

    await inputs().at(1).simulate('focus')
    await inputs()
      .at(1)
      .simulate('change', { target: { checked: true } })
    await inputs().at(1).simulate('blur')

    expectValues(true, true, true)

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(wrapper.getDOMNode().checkValidity()).toBeTruthy()

    await submit().simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith(
      { checkboxSet: [1, true, 'II'] },
      { checkboxSet: [1, true] },
      ['checkboxSet'],
      true
    )

    expectValues(true, true, true)
  })
  it('cancels changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ checkboxSet: [1, true] }}>
        <Field
          type="checkbox-set"
          choices={{
            one: 1,
            two: 'II',
            three: true,
          }}
        >
          Checkbox Set
        </Field>
      </Formol>
    )
    const inputs = () => wrapper.find('Field').find('input')

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    inputs().map((input) => expect(input.props().type).toEqual('checkbox'))
    const expectValues = (...values) =>
      inputs().map((input, i) =>
        expect(input.props().checked).toEqual(values[i])
      )

    expectValues(true, false, true)

    await inputs().at(0).simulate('focus')
    await inputs()
      .at(0)
      .simulate('change', { target: { checked: false } })
    await inputs().at(0).simulate('blur')

    expectValues(false, false, true)

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await cancel().simulate('click')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expectValues(true, false, true)
  })
  it('sets disabled when readOnly', () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ checkboxSet: ['II'] }}>
        <Field type="checkbox-set" readOnly>
          Checkbox Set
        </Field>
      </Formol>
    )
    const inputs = () => wrapper.find('Field').find('input')
    inputs().map((input) => expect(input.props().disabled).toEqual(true))
  })
})
