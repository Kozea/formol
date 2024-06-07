import { mount } from 'enzyme'
import React from 'react'

import Formol, { Field } from '../../../src'

const nativeType = 'text' // react-datepicker uses input with type='text'
const rawValue1 = '1988-05-27'
const rawValue2 = '2121-12-12'
const title = 'Date'
const type = 'date'
const value1 = '05/27/1988'
const value2 = '12/12/2121'

describe('Datepicker field', () => {
  it('handles changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ [type]: rawValue1 }}>
        <Field name={type} type={type}>
          {title}
        </Field>
      </Formol>
    )
    const input = () => wrapper.find('Field').find('input').first()
    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().type).toEqual(nativeType)
    expect(input().props().value).toEqual(value1)

    await input().simulate('change', { target: { value: value2 } })

    expect(input().props().value).toEqual(value2)
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    // Validity is broken in current jsdom
    // TODO: Uncomment with jsdom 16
    // expect(wrapper.getDOMNode().checkValidity()).toBeTruthy()

    await submit().simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith(
      { [type]: rawValue2 },
      { [type]: rawValue1 },
      [type],
      true
    )
    expect(input().props().value).toEqual(value2)
  })
  it('cancels changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ [type]: rawValue1 }}>
        <Field name={type} type={type}>
          {title}
        </Field>
      </Formol>
    )
    const input = () => wrapper.find('Field').find('input').first()
    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().value).toEqual(value1)

    await input().simulate('change', { target: { value: value2 } })

    expect(input().props().value).toEqual(value2)
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await cancel().simulate('click')

    expect(input().props().value).toEqual(value1)
  })
  it('calls event.preventDefault when type is date', () => {
    const event = { preventDefault: jest.fn() }
    jest.spyOn(event, 'preventDefault')
    const wrapper = mount(
      <Formol>
        <Field type="date" />
      </Formol>
    )

    wrapper.find('label').simulate('click', event)
    expect(event.preventDefault).toBeCalled()
  })
  it('renders properly when read only', () => {
    const wrapper = mount(
      <Formol item={{ [type]: rawValue1 }}>
        <Field type="date" readOnly>
          {title}
        </Field>
      </Formol>
    )
    const input = () => wrapper.find('input')
    expect(input().props().readOnly).toBeTruthy()
    expect(input().props().value).toBe(value1)
  })
  it('handles empty value', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit}>
        <Field type={type} name={type}>
          {title}
        </Field>
      </Formol>
    )

    const input = () => wrapper.find(`input[name="${type}"]`)
    const clearDate = () => wrapper.find('button[aria-label="Close"]')

    expect(input().props().value).toEqual('')

    await input().simulate('change', { target: { value: rawValue1 } })
    expect(input().props().value).toEqual(value1)

    await clearDate().simulate('click')
    expect(input().props().value).toEqual('')
  })
})
