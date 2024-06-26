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
      .forEach((option) => expect(option.type()).toEqual('option'))
    expect(select().children().at(0).text()).toEqual('')
    expect(select().children().at(1).text()).toEqual('one')
    expect(select().children().at(2).text()).toEqual('two')
    expect(select().children().at(3).text()).toEqual('three')
    expect(select().children().at(0).props().value).toEqual('')
    expect(select().children().at(1).props().value).toEqual('##formol_memo_0')
    expect(select().children().at(2).props().value).toEqual('II')
    expect(select().children().at(3).props().value).toEqual('##formol_memo_2')

    expect(select().props().value).toEqual('II')

    await select().simulate('focus')
    await select().simulate('change', {
      target: {
        value: select().children().at(1).props().value,
      },
    })
    await select().simulate('blur')

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(select().props().value).toEqual('##formol_memo_0')

    expect(wrapper.getDOMNode().checkValidity()).toBeTruthy()

    await submit().simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith(
      { select: 1 },
      { select: 'II' },
      ['select'],
      true
    )
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
  it('handles changes with multiple values', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ select: [1, 'II'] }}>
        <Field
          type="select"
          multiple
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

    // There's no empty option in multiple
    expect(select().children()).toHaveLength(3)

    select()
      .children()
      .forEach((option) => expect(option.type()).toEqual('option'))
    expect(select().children().at(0).text()).toEqual('one')
    expect(select().children().at(1).text()).toEqual('two')
    expect(select().children().at(2).text()).toEqual('three')
    expect(select().children().at(0).props().value).toEqual('##formol_memo_0')
    expect(select().children().at(1).props().value).toEqual('II')
    expect(select().children().at(2).props().value).toEqual('##formol_memo_2')

    expect(select().props().value).toEqual(['##formol_memo_0', 'II'])
    // Simulating removal of first property and the add of the last
    await select().simulate('focus')
    await select().simulate('change', {
      target: {
        options: select()
          .children()
          .map((option, i) => ({ ...option.props(), selected: i > 0 })),
      },
    })
    await select().simulate('blur')

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(select().props().value).toEqual(['II', '##formol_memo_2'])

    expect(wrapper.getDOMNode().checkValidity()).toBeTruthy()

    await submit().simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith(
      { select: ['II', true] },
      { select: [1, 'II'] },
      ['select'],
      true
    )
    expect(select().props().value).toEqual(['II', '##formol_memo_2'])
  })
  it('cancels changes in multiple', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ select: [1, 'II'] }}>
        <Field
          type="select"
          multiple
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

    expect(select().props().value).toEqual(['##formol_memo_0', 'II'])
    // Simulating removal of first property and the add of the last
    await select().simulate('focus')
    await select().simulate('change', {
      target: {
        options: select()
          .children()
          .map((option, i) => ({ ...option.props(), selected: i > 0 })),
      },
    })
    await select().simulate('blur')

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(select().props().value).toEqual(['II', '##formol_memo_2'])

    await cancel().simulate('click')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(select().props().value).toEqual(['##formol_memo_0', 'II'])
  })
  it('sets disabled when readOnly', () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ select: 'II' }}>
        <Field type="select" readOnly>
          Select
        </Field>
      </Formol>
    )
    const input = () => wrapper.find('Field').find('select')

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().disabled).toEqual(true)
  })
  it('handles edge case of multiple and non array value and vice versa', () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ select: [] }}>
        <Field type="select">Select</Field>
      </Formol>
    )
    const select = (w) => w.find('Field').find('select')
    expect(select(wrapper).props().value).toEqual('')

    const wrapper2 = mount(
      <Formol onSubmit={onSubmit} item={{ select: 'II' }}>
        <Field type="select" multiple>
          Select
        </Field>
      </Formol>
    )
    expect(select(wrapper2).props().value).toEqual(['II'])
    const wrapper3 = mount(
      <Formol onSubmit={onSubmit}>
        <Field type="select" multiple>
          Select
        </Field>
      </Formol>
    )
    expect(select(wrapper3).props().value).toEqual([])
  })
})
