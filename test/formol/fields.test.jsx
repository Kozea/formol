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
  it('handles changes', async () => {
    const wrapper = mount(
      <Formol item={{ foo: 'bar' }}>
        <Field name="foo" />
      </Formol>
    )
    // Using getter here as https://github.com/airbnb/enzyme/issues/76
    const field = () => wrapper.find('Field')
    const input = () => field().find('input')

    expect(input().props().value).toEqual('bar')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'ba' } })
    await input().simulate('change', { target: { value: 'baz' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('baz')
    expect(
      field()
        .find('InputField')
        .props().value
    ).toEqual('baz')
  })
  it('handles modifications', async () => {
    const onChange = jest.fn()
    const wrapper = mount(
      <Formol item={{ foo: 'bar' }} onChange={onChange}>
        <Field name="foo" />
      </Formol>
    )
    // Using getter here as https://github.com/airbnb/enzyme/issues/76
    const field = () => wrapper.find('Field')
    const input = () => field().find('input')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'ba' } })
    await input().simulate('change', { target: { value: 'baz' } })
    await input().simulate('blur')

    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenCalledWith({ foo: 'baz' })
  })
  it('cancels changes', async () => {
    const wrapper = mount(
      <Formol item={{ foo: 'bar' }} onSubmit={() => {}}>
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

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'ba' } })
    await input().simulate('change', { target: { value: 'baz' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('baz')
    expect(
      field()
        .find('InputField')
        .props().value
    ).toEqual('baz')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await cancel().simulate('click')

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

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'ba' } })
    await input().simulate('change', { target: { value: 'baz' } })
    await input().simulate('blur')

    expect(wrapper.getDOMNode().checkValidity()).toBeTruthy()

    await submit().simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith(
      { foo: 'baz' },
      { foo: 'bar' },
      ['foo'],
      true
    )
  })
  it('handles dom validation', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol item={{ foo: 'bar' }} onSubmit={onSubmit}>
        <Field name="foo" pattern="b\w+" required />
      </Formol>
    )
    // Using getter here as https://github.com/airbnb/enzyme/issues/76
    const field = () => wrapper.find('Field')
    const input = () => field().find('input')

    const error = () => wrapper.find('.Formol_Field__error-text')
    const submit = () => wrapper.find('.Formol_Formol__submit')

    expect(input().props().value).toEqual('bar')
    expect(error()).not.toHaveLength()

    await input().simulate('focus')
    await input().simulate('change', { target: { value: '' } })
    await input().simulate('blur')

    expect(wrapper.getDOMNode().checkValidity()).toBeFalsy()
    expect(input().props().value).toEqual('')
    expect(error()).not.toHaveLength()

    expect(error()).toHaveLength(1)
    expect(error().text()).toEqual('Constraints not satisfied')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'faz' } })
    await input().simulate('blur')

    expect(wrapper.getDOMNode().checkValidity()).toBeFalsy()

    expect(input().props().value).toEqual('faz')

    expect(error()).toHaveLength(1)
    expect(error().text()).toEqual('Constraints not satisfied')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'baz' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('baz')

    await submit().simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith(
      { foo: 'baz' },
      { foo: 'bar' },
      ['foo'],
      true
    )
  })
  it('handles custom dom validation messages', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol item={{ foo: 'bar' }} onSubmit={onSubmit}>
        <Field
          name="foo"
          pattern="b\w+"
          required
          validityErrors={({ patternMismatch }) => {
            if (patternMismatch) {
              return 'Must start with a b'
            }
          }}
        />
      </Formol>
    )
    // Using getter here as https://github.com/airbnb/enzyme/issues/76
    const field = () => wrapper.find('Field')
    const input = () => field().find('input')

    const error = () => wrapper.find('.Formol_Field__error-text')
    const submit = () => wrapper.find('.Formol_Formol__submit')

    expect(input().props().value).toEqual('bar')
    expect(error()).not.toHaveLength()

    await input().simulate('focus')
    await input().simulate('change', { target: { value: '' } })
    await input().simulate('blur')

    expect(wrapper.getDOMNode().checkValidity()).toBeFalsy()

    expect(input().props().value).toEqual('')
    expect(error()).not.toHaveLength()

    expect(error()).toHaveLength(1)
    expect(error().text()).toEqual('Constraints not satisfied')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'faz' } })
    await input().simulate('blur')

    expect(wrapper.getDOMNode().checkValidity()).toBeFalsy()

    expect(input().props().value).toEqual('faz')

    expect(error()).toHaveLength(1)
    expect(error().text()).toEqual('Must start with a b')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'baz' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('baz')

    await submit().simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith(
      { foo: 'baz' },
      { foo: 'bar' },
      ['foo'],
      true
    )
  })
  it('raises on unknown field', () => {
    // Prevent console.error from cluttering the output
    jest.spyOn(console, 'error')
    global.console.error.mockImplementation(() => {})

    expect(() =>
      mount(
        <Formol>
          <Field type="temperature" name="foo" />
        </Formol>
      )
    ).toThrow('Unknown type "temperature" for field "foo"')

    global.console.error.mockRestore()
  })
  it('raises on field outside of form', () => {
    // // Prevent console.error from cluttering the output
    jest.spyOn(console, 'error')
    global.console.error.mockImplementation(() => {})

    expect(() =>
      mount(
        <div>
          <Field name="foo" />
        </div>
      )
    ).toThrow('Field must be used inside Form')

    global.console.error.mockRestore()
  })
  it('raises when setting the value attribute on field', () => {
    // // Prevent console.error from cluttering the output
    jest.spyOn(console, 'error')
    global.console.error.mockImplementation(() => {})

    expect(() =>
      mount(
        <Formol>
          <Field name="foo" value="bar" />
        </Formol>
      )
    ).toThrow(
      'Do not use value on fields. ' +
        'Set a value for this field in the form item attribute.'
    )

    global.console.error.mockRestore()
  })
})
