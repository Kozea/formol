import { mount } from 'enzyme'
import React from 'react'

import Formol, { Field } from '../../../src'

describe('Select field', () => {
  it('handles changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ select: 'II' }}>
        <Field
          type="select"
          choices={{
            one: 1,
            two: 'II',
            three: true,
          }}
        >
          Select
        </Field>
      </Formol>
    )
    const select = () => wrapper.find('Field').find('select')

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(select().children()).toHaveLength(4)
    select()
      .children()
      .forEach(option => expect(option.type()).toEqual('option'))
    expect(
      select()
        .children()
        .at(0)
        .text()
    ).toEqual('')
    expect(
      select()
        .children()
        .at(1)
        .text()
    ).toEqual('one')
    expect(
      select()
        .children()
        .at(2)
        .text()
    ).toEqual('two')
    expect(
      select()
        .children()
        .at(3)
        .text()
    ).toEqual('three')
    expect(
      select()
        .children()
        .at(0)
        .props().value
    ).toEqual('')
    expect(
      select()
        .children()
        .at(1)
        .props().value
    ).toEqual('##formol_memo_0')
    expect(
      select()
        .children()
        .at(2)
        .props().value
    ).toEqual('II')
    expect(
      select()
        .children()
        .at(3)
        .props().value
    ).toEqual('##formol_memo_2')

    expect(select().props().value).toEqual('II')

    await select().simulate('focus')
    await select().simulate('change', {
      target: {
        value: select()
          .children()
          .at(1)
          .props().value,
      },
    })
    await select().simulate('blur')

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(select().props().value).toEqual('##formol_memo_0')

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith({ select: 1 }, { select: 'II' }, [
      'select',
    ])
    expect(select().props().value).toEqual('##formol_memo_0')
  })
  it('cancels changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ select: 1 }}>
        <Field
          type="select"
          choices={{
            one: 1,
            two: 'II',
            three: true,
          }}
        >
          Select
        </Field>
      </Formol>
    )
    const select = () => wrapper.find('Field').find('select')

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(select().props().value).toEqual('##formol_memo_0')

    await select().simulate('focus')
    await select().simulate('change', { target: { value: 'II' } })
    await select().simulate('blur')

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(select().props().value).toEqual('II')

    await cancel().simulate('click')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(select().props().value).toEqual('##formol_memo_0')
  })
})
