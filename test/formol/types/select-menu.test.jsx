import { mount } from 'enzyme'
import React from 'react'

import Formol, { Field } from '../../../src'

describe('Select Menu field', () => {
  it('handles changes in simple', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ selectMenu: 'II' }}>
        <Field
          type="select-menu"
          choices={{
            one: 1,
            two: 'II',
            three: true,
          }}
        >
          Select Menu
        </Field>
      </Formol>
    )
    const asyncWrapper = () => wrapper.find('AsyncWrapper')
    expect(asyncWrapper().text()).toEqual('Loading')
    await asyncWrapper().instance()._promise
    wrapper.update()
    expect(asyncWrapper().text()).not.toEqual('Loading')

    const input = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    const selectValue = () => wrapper.find('.Select-value')
    const selectControl = () => wrapper.find('.Select-control')
    const selectOptions = () => wrapper.find('.VirtualizedSelectOption')
    const selectMenu = () => wrapper.find('.Select-menu')
    const selectInput = () =>
      wrapper
        .find('Field')
        .find('input')
        .at(1)

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(input().props().value).toEqual('II')
    expect(selectValue().text()).toEqual('two')
    expect(selectOptions()).toHaveLength(0)
    expect(selectMenu()).toHaveLength(0)
    await selectInput().simulate('focus')
    await selectControl().simulate('mousedown', { button: 0 })

    // Faking the sizer size otherwise options are not displayed
    const sizer = selectMenu().getDOMNode()
    Object.defineProperty(sizer, 'offsetWidth', {
      value: 1337,
    })
    Object.defineProperty(sizer, 'offsetHeight', {
      value: 1664,
    })
    wrapper
      .find('AutoSizer')
      .instance()
      ._onResize()
    wrapper.update()

    expect(selectOptions()).toHaveLength(3)
    await selectOptions()
      .at(0)
      .simulate('click')

    await selectInput().simulate('blur')

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(input().props().value).toEqual('##formol_memo_0')

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith(
      { selectMenu: 1 },
      { selectMenu: 'II' },
      ['selectMenu']
    )
    expect(input().props().value).toEqual('##formol_memo_0')
  })
  it('cancels changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ selectMenu: 1 }}>
        <Field
          type="select-menu"
          choices={{
            one: 1,
            two: 'II',
            three: true,
          }}
        >
          Select Menu
        </Field>
      </Formol>
    )
    const asyncWrapper = () => wrapper.find('AsyncWrapper')
    expect(asyncWrapper().text()).toEqual('Loading')
    await asyncWrapper().instance()._promise
    wrapper.update()
    expect(asyncWrapper().text()).not.toEqual('Loading')

    const input = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    const selectValue = () => wrapper.find('.Select-value')
    const selectControl = () => wrapper.find('.Select-control')
    const selectOptions = () => wrapper.find('.VirtualizedSelectOption')
    const selectMenu = () => wrapper.find('.Select-menu')
    const selectInput = () =>
      wrapper
        .find('Field')
        .find('input')
        .at(1)

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(input().props().value).toEqual('##formol_memo_0')
    expect(selectValue().text()).toEqual('one')
    expect(selectOptions()).toHaveLength(0)
    expect(selectMenu()).toHaveLength(0)
    await selectInput().simulate('focus')
    await selectControl().simulate('mousedown', { button: 0 })

    // Faking the sizer size otherwise options are not displayed
    const sizer = selectMenu().getDOMNode()
    Object.defineProperty(sizer, 'offsetWidth', {
      value: 1337,
    })
    Object.defineProperty(sizer, 'offsetHeight', {
      value: 1664,
    })
    wrapper
      .find('AutoSizer')
      .instance()
      ._onResize()
    wrapper.update()

    expect(selectOptions()).toHaveLength(3)
    await selectOptions()
      .at(1)
      .simulate('click')

    await selectInput().simulate('blur')

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(input().props().value).toEqual('II')

    await cancel().simulate('click')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(input().props().value).toEqual('##formol_memo_0')
  })
  it('handles changes with multiple values', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ selectMenu: [1, 'II'] }}>
        <Field
          type="select-menu"
          multiple
          choices={{
            one: 1,
            two: 'II',
            three: true,
          }}
        >
          Select Menu
        </Field>
      </Formol>
    )
    const asyncWrapper = () => wrapper.find('AsyncWrapper')
    expect(asyncWrapper().text()).toEqual('Loading')
    await asyncWrapper().instance()._promise
    wrapper.update()
    expect(asyncWrapper().text()).not.toEqual('Loading')

    const input = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    const selectValue = () => wrapper.find('.Select-value')
    const selectControl = () => wrapper.find('.Select-control')
    const selectOptions = () => wrapper.find('.VirtualizedSelectOption')
    const selectMenu = () => wrapper.find('.Select-menu')
    const selectInput = () =>
      wrapper
        .find('Field')
        .find('input')
        .at(1)

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().value).toEqual('##formol_memo_0,II')

    expect(selectOptions()).toHaveLength(0)
    expect(selectMenu()).toHaveLength(0)
    await selectInput().simulate('focus')
    await selectControl().simulate('mousedown', { button: 0 })

    // Faking the sizer size otherwise options are not displayed
    const sizer = selectMenu().getDOMNode()
    Object.defineProperty(sizer, 'offsetWidth', {
      value: 1337,
    })
    Object.defineProperty(sizer, 'offsetHeight', {
      value: 1664,
    })
    wrapper
      .find('AutoSizer')
      .instance()
      ._onResize()
    wrapper.update()

    expect(selectOptions()).toHaveLength(1)
    await selectOptions()
      .at(0)
      .simulate('click')
    expect(selectOptions()).toHaveLength(0)
    await selectValue()
      .at(0)
      .find('.Select-value-icon')
      .simulate('mousedown')

    await selectInput().simulate('blur')

    expect(input().props().value).toEqual('II,##formol_memo_2')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith(
      { selectMenu: ['II', true] },
      { selectMenu: [1, 'II'] },
      ['selectMenu']
    )
    expect(input().props().value).toEqual('II,##formol_memo_2')
  })
  it('cancels changes in multiple', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ selectMenu: [1, 'II'] }}>
        <Field
          type="select-menu"
          multiple
          choices={{
            one: 1,
            two: 'II',
            three: true,
          }}
        >
          Select Menu
        </Field>
      </Formol>
    )
    const asyncWrapper = () => wrapper.find('AsyncWrapper')
    expect(asyncWrapper().text()).toEqual('Loading')
    await asyncWrapper().instance()._promise
    wrapper.update()
    expect(asyncWrapper().text()).not.toEqual('Loading')

    const input = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    const selectValue = () => wrapper.find('.Select-value')
    const selectControl = () => wrapper.find('.Select-control')
    const selectOptions = () => wrapper.find('.VirtualizedSelectOption')
    const selectMenu = () => wrapper.find('.Select-menu')
    const selectInput = () =>
      wrapper
        .find('Field')
        .find('input')
        .at(1)

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().value).toEqual('##formol_memo_0,II')

    expect(selectOptions()).toHaveLength(0)
    expect(selectMenu()).toHaveLength(0)
    await selectInput().simulate('focus')
    await selectControl().simulate('mousedown', { button: 0 })

    // Faking the sizer size otherwise options are not displayed
    const sizer = selectMenu().getDOMNode()
    Object.defineProperty(sizer, 'offsetWidth', {
      value: 1337,
    })
    Object.defineProperty(sizer, 'offsetHeight', {
      value: 1664,
    })
    wrapper
      .find('AutoSizer')
      .instance()
      ._onResize()
    wrapper.update()

    expect(selectOptions()).toHaveLength(1)
    await selectOptions()
      .at(0)
      .simulate('click')
    expect(selectOptions()).toHaveLength(0)
    await selectValue()
      .at(0)
      .find('.Select-value-icon')
      .simulate('mousedown')

    await selectInput().simulate('blur')

    expect(input().props().value).toEqual('II,##formol_memo_2')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await cancel().simulate('click')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(input().props().value).toEqual('##formol_memo_0,II')
  })
  it('sets disabled when readOnly', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ selectMenu: 'II' }}>
        <Field type="select-menu" readOnly>
          Checkbox
        </Field>
      </Formol>
    )
    const asyncWrapper = () => wrapper.find('AsyncWrapper')
    expect(asyncWrapper().text()).toEqual('Loading')
    await asyncWrapper().instance()._promise
    wrapper.update()
    expect(asyncWrapper().text()).not.toEqual('Loading')

    const input = () => wrapper.find('Field').find('input')

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().disabled).toEqual(true)
  })
})
