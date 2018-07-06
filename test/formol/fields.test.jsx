import { mount } from 'enzyme'
import React from 'react'

import Formol, { Field } from '../../src'
import InputField from '../../src/fields/InputField'

describe('Formol fields', () => {
  it('are rendered', () => {
    const wrapper = mount(
      <Formol>
        <Field />
      </Formol>
    )
    expect(wrapper.find('form')).toBeTruthy()

    const field = wrapper.find('.Formol_Field')
    expect(field).toBeTruthy()
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
  it('respect the name attribute', () => {
    const wrapper = mount(
      <Formol>
        <Field name="joe" />
      </Formol>
    )
    const field = wrapper.find('.Formol_Field')
    expect(field.hasClass('Formol_Field--name-joe')).toBeTruthy()
    expect(field.find('input').props().name).toEqual('joe')
  })
  it('gets the name from the text when attribute is omitted', () => {
    const wrapper = mount(
      <Formol>
        <Field>Joey Due</Field>
      </Formol>
    )
    const field = wrapper.find('.Formol_Field')
    expect(field.hasClass('Formol_Field--name-joeyDue')).toBeTruthy()
    expect(field.find('input').props().name).toEqual('joeyDue')
  })
})
