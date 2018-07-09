import { mount } from 'enzyme'
import React from 'react'

import Formol, { Field } from '../../src'
import InputField from '../../src/fields/InputField'

describe('Formol field', () => {
  it('is rendered', () => {
    const wrapper = mount(
      <Formol>
        <Field />
      </Formol>
    )
    expect(wrapper.find('form')).toBeTruthy()

    const field = wrapper
      .find('Field')
      .children()
      .first()
    expect(field).toBeTruthy()
    expect(field.hasClass('Formol_Field')).toBeTruthy()
    expect(field.hasClass('Formol_Field--name-field-1')).toBeTruthy()
    expect(field.hasClass('Formol_Field--type-text')).toBeTruthy()
    expect(field.type()).toEqual('div')
    expect(field.children()).toHaveLength(1)

    const label = field.children().first()
    expect(label.type()).toEqual('label')
    expect(label.hasClass('Formol_Field__label')).toBeTruthy()
    expect(label.children()).toHaveLength(1)

    const inputField = label.children().first()
    expect(inputField.type()).toEqual(InputField)

    const input = inputField.children().first()
    expect(input.type()).toEqual('input')
    expect(input.props().name).toEqual('field-1')
    expect(input.props().type).toEqual('text')
    expect(input.props().value).toEqual('')
  })
  it('respects the name attribute', () => {
    const wrapper = mount(
      <Formol>
        <Field name="foo" />
      </Formol>
    )
    const field = wrapper.find('Field')
    expect(
      field.find('.Formol_Field').hasClass('Formol_Field--name-foo')
    ).toBeTruthy()
    expect(field.find('input').props().name).toEqual('foo')
  })
  it('gets the name from the text when attribute is omitted', () => {
    const wrapper = mount(
      <Formol>
        <Field>Foo Bar</Field>
      </Formol>
    )
    const field = wrapper.find('Field')
    expect(
      field.find('.Formol_Field').hasClass('Formol_Field--name-fooBar')
    ).toBeTruthy()
    expect(field.find('input').props().name).toEqual('fooBar')
  })
  it('gets the value from the item', () => {
    const wrapper = mount(
      <Formol item={{ foo: 'bar' }}>
        <Field name="foo" />
      </Formol>
    )
    const field = wrapper.find('Field')
    expect(field.find('InputField').props().value).toEqual('bar')
    expect(field.find('input').props().value).toEqual('bar')
  })
  it('handles changes', () => {
    const wrapper = mount(
      <Formol item={{ foo: 'bar' }}>
        <Field name="foo" />
      </Formol>
    )
    // Using getter here as https://github.com/airbnb/enzyme/issues/76
    const field = () => wrapper.find('Field')
    const input = () => field().find('input')

    expect(input().props().value).toEqual('bar')
    input().simulate('change', { target: { value: 'ba' } })
    input().simulate('change', { target: { value: 'baz' } })
    expect(input().props().value).toEqual('baz')
    expect(
      field()
        .find('InputField')
        .props().value
    ).toEqual('baz')
  })
  it('handles modifications', () => {
    const onChange = jest.fn()
    const wrapper = mount(
      <Formol item={{ foo: 'bar' }} onChange={onChange}>
        <Field name="foo" />
      </Formol>
    )
    // Using getter here as https://github.com/airbnb/enzyme/issues/76
    const field = () => wrapper.find('Field')
    const input = () => field().find('input')
    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    input().simulate('change', { target: { value: 'ba' } })
    input().simulate('change', { target: { value: 'baz' } })
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenCalledWith({ foo: 'baz' })

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()
  })
  it('cancels changes', () => {
    const wrapper = mount(
      <Formol item={{ foo: 'bar' }}>
        <Field name="foo" />
      </Formol>
    )
    // Using getter here as https://github.com/airbnb/enzyme/issues/76
    const field = () => wrapper.find('Field')
    const input = () => field().find('input')
    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    input().simulate('change', { target: { value: 'ba' } })
    input().simulate('change', { target: { value: 'baz' } })
    expect(input().props().value).toEqual('baz')
    expect(
      field()
        .find('InputField')
        .props().value
    ).toEqual('baz')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()
    cancel().simulate('click')
    expect(input().props().value).toEqual('bar')
    expect(
      field()
        .find('InputField')
        .props().value
    ).toEqual('bar')
    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
  })
  it('submits changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol item={{ foo: 'bar' }} onSubmit={onSubmit}>
        <Field name="foo" />
      </Formol>
    )
    // Using getter here as https://github.com/airbnb/enzyme/issues/76
    const field = () => wrapper.find('Field')
    const input = () => field().find('input')

    const submit = () => wrapper.find('.Formol_Formol__submit')

    expect(input().props().value).toEqual('bar')
    input().simulate('change', { target: { value: 'ba' } })
    input().simulate('change', { target: { value: 'baz' } })
    await submit().simulate('click')
    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith({ foo: 'baz' }, { foo: 'bar' }, [
      'foo',
    ])
  })
})
