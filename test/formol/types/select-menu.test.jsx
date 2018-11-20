import { mount } from 'enzyme'
import {
  ExactWordIndexStrategy,
  LowerCaseSanitizer,
  SimpleTokenizer,
  StopWordsTokenizer,
  TfIdfSearchIndex,
} from 'js-search'
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
      wrapper.find('.Formol_SelectMenuField__hidden-input').find('input')

    const singleValue = () => wrapper.find('SingleValue')
    const selectControl = () =>
      wrapper
        .find('Control')
        .find('div')
        .first()
    const selectOptions = () => wrapper.find('MenuList').find('Option')
    const selectMenu = () => wrapper.find('Menu')
    const selectInput = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(input().props().defaultValue).toEqual('II')
    expect(singleValue().text()).toEqual('two')
    expect(selectOptions()).toHaveLength(0)
    expect(selectMenu()).toHaveLength(0)
    await selectInput().simulate('focus')
    await selectControl().simulate('mousedown', { button: 0 })

    expect(selectOptions()).toHaveLength(3)
    await selectOptions()
      .at(0)
      .simulate('click')

    await selectInput().simulate('blur')

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(input().props().defaultValue).toEqual('##formol_memo_0')

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith(
      { selectMenu: 1 },
      { selectMenu: 'II' },
      ['selectMenu'],
      true
    )
    expect(input().props().defaultValue).toEqual('##formol_memo_0')

    wrapper.unmount()
  })
  it('handles changes in simple but virtualized', async () => {
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
          virtualizedThreshold={2}
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
      wrapper.find('.Formol_SelectMenuField__hidden-input').find('input')

    const singleValue = () => wrapper.find('SingleValue')
    const selectControl = () =>
      wrapper
        .find('Control')
        .find('div')
        .first()
    const selectOptions = () => wrapper.find('MenuList').find('Option')
    const selectMenu = () => wrapper.find('Menu')
    const selectInput = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(input().props().defaultValue).toEqual('II')
    expect(singleValue().text()).toEqual('two')
    expect(selectOptions()).toHaveLength(0)
    expect(selectMenu()).toHaveLength(0)
    await selectInput().simulate('focus')
    await selectControl().simulate('mousedown', { button: 0 })

    expect(selectOptions()).toHaveLength(3)
    await selectOptions()
      .at(0)
      .simulate('click')

    await selectInput().simulate('blur')

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(input().props().defaultValue).toEqual('##formol_memo_0')

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith(
      { selectMenu: 1 },
      { selectMenu: 'II' },
      ['selectMenu'],
      true
    )
    expect(input().props().defaultValue).toEqual('##formol_memo_0')

    wrapper.unmount()
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
      wrapper.find('.Formol_SelectMenuField__hidden-input').find('input')

    const singleValue = () => wrapper.find('SingleValue')
    const selectControl = () =>
      wrapper
        .find('Control')
        .find('div')
        .first()
    const selectOptions = () => wrapper.find('MenuList').find('Option')
    const selectMenu = () => wrapper.find('Menu')
    const selectInput = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(input().props().defaultValue).toEqual('##formol_memo_0')
    expect(singleValue().text()).toEqual('one')
    expect(selectOptions()).toHaveLength(0)
    expect(selectMenu()).toHaveLength(0)
    await selectInput().simulate('focus')
    await selectControl().simulate('mousedown', { button: 0 })

    expect(selectOptions()).toHaveLength(3)
    await selectOptions()
      .at(1)
      .simulate('click')

    await selectInput().simulate('blur')

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(input().props().defaultValue).toEqual('II')

    await cancel().simulate('click')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(input().props().defaultValue).toEqual('##formol_memo_0')
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
      wrapper.find('.Formol_SelectMenuField__hidden-input').find('input')

    const multiValue = () => wrapper.find('MultiValue')
    const selectControl = () =>
      wrapper
        .find('Control')
        .find('div')
        .first()
    const selectOptions = () => wrapper.find('MenuList').find('Option')
    const selectMenu = () => wrapper.find('Menu')
    const selectInput = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().defaultValue).toEqual('##formol_memo_0__/__II')

    expect(selectOptions()).toHaveLength(0)
    expect(selectMenu()).toHaveLength(0)
    await selectInput().simulate('focus')
    await selectControl().simulate('mousedown', { button: 0 })

    expect(selectOptions()).toHaveLength(1)
    await selectOptions()
      .at(0)
      .simulate('click')
    expect(selectOptions()).toHaveLength(0)
    await multiValue()
      .at(0)
      .find('MultiValueRemove')
      .find('div')
      .first()
      .simulate('click')

    await selectInput().simulate('blur')

    expect(input().props().defaultValue).toEqual('II__/__##formol_memo_2')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith(
      { selectMenu: ['II', true] },
      { selectMenu: [1, 'II'] },
      ['selectMenu'],
      true
    )
    expect(input().props().defaultValue).toEqual('II__/__##formol_memo_2')
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
      wrapper.find('.Formol_SelectMenuField__hidden-input').find('input')

    const multiValue = () => wrapper.find('MultiValue')
    const selectControl = () =>
      wrapper
        .find('Control')
        .find('div')
        .first()
    const selectOptions = () => wrapper.find('MenuList').find('Option')
    const selectMenu = () => wrapper.find('Menu')
    const selectInput = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().defaultValue).toEqual('##formol_memo_0__/__II')

    expect(selectOptions()).toHaveLength(0)
    expect(selectMenu()).toHaveLength(0)
    await selectInput().simulate('focus')
    await selectControl().simulate('mousedown', { button: 0 })

    expect(selectOptions()).toHaveLength(1)
    await selectOptions()
      .at(0)
      .simulate('click')

    expect(selectOptions()).toHaveLength(0)
    await multiValue()
      .at(0)
      .find('MultiValueRemove')
      .find('div')
      .first()
      .simulate('click')

    await selectInput().simulate('blur')

    expect(input().props().defaultValue).toEqual('II__/__##formol_memo_2')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await cancel().simulate('click')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(input().props().defaultValue).toEqual('##formol_memo_0__/__II')
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

    const input = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().disabled).toEqual(true)
  })
  it('handles correctly choices change', async () => {
    const onSubmit = jest.fn()
    class ChoicesChanger extends React.Component {
      state = {
        choices: {
          one: 1,
          two: 'II',
          three: true,
        },
        required: false,
      }

      render() {
        const { choices, required } = this.state
        return (
          <Formol onSubmit={onSubmit} item={{ selectMenu: 'II' }}>
            <a
              className="changer"
              onClick={() =>
                choices.one === 1
                  ? this.setState({
                      choices: { un: 'I', deux: 2, trois: true },
                    })
                  : this.setState({ required: true })
              }
            />
            <Field type="select-menu" choices={choices} required={required}>
              Select Menu
            </Field>
          </Formol>
        )
      }
    }
    const wrapper = mount(<ChoicesChanger />)
    const asyncWrapper = () => wrapper.find('AsyncWrapper')
    expect(asyncWrapper().text()).toEqual('Loading')
    await asyncWrapper().instance()._promise
    wrapper.update()
    expect(asyncWrapper().text()).not.toEqual('Loading')

    const changer = () => wrapper.find('.changer')

    const input = () =>
      wrapper.find('.Formol_SelectMenuField__hidden-input').find('input')
    const selectControl = () =>
      wrapper
        .find('Control')
        .find('div')
        .first()
    const selectOptions = () => wrapper.find('MenuList').find('Option')
    const selectInput = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    await selectInput().simulate('focus')
    await selectControl().simulate('mousedown', { button: 0 })

    expect(input().props().required).toBeFalsy()

    expect(selectOptions()).toHaveLength(3)

    expect(selectOptions().map(v => v.text())).toEqual(['one', 'two', 'three'])

    await changer().simulate('click')

    expect(selectOptions().map(v => v.text())).toEqual(['un', 'deux', 'trois'])

    await changer().simulate('click')

    expect(selectOptions().map(v => v.text())).toEqual(['un', 'deux', 'trois'])
    expect(input().props().required).toBeTruthy()
  })
  it('filters options', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ selectMenu: null }}>
        <Field
          type="select-menu"
          animated={false}
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
      wrapper.find('.Formol_SelectMenuField__hidden-input').find('input')

    const singleValue = () => wrapper.find('SingleValue')
    const selectControl = () =>
      wrapper
        .find('Control')
        .find('div')
        .first()
    const selectOptions = () => wrapper.find('MenuList').find('Option')
    const selectMenu = () => wrapper.find('Menu')
    const selectInput = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(input().props().defaultValue).toEqual('')
    expect(singleValue()).toHaveLength(0)
    expect(selectOptions()).toHaveLength(0)
    expect(selectMenu()).toHaveLength(0)
    await selectInput().simulate('focus')
    await selectControl().simulate('mousedown', { button: 0 })
    // Hard setting value since the react-select
    // handler is based on e.currentTarget
    selectInput().getDOMNode().value = 'o'
    await selectInput().simulate('change', { target: { value: 'o' } })

    expect(selectOptions()).toHaveLength(2)

    selectInput().getDOMNode().value = 'oo'
    await selectInput().simulate('change', { target: { value: 'oo' } })

    expect(selectOptions()).toHaveLength(0)
  })
  it('respects filter options', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ selectMenu: null }}>
        <Field
          type="select-menu"
          choices={{
            one: 1,
            two: 'II',
            three: true,
          }}
          indexStrategy={new ExactWordIndexStrategy()}
          searchIndex={new TfIdfSearchIndex()}
          tokenizer={new StopWordsTokenizer(new SimpleTokenizer())}
          indexes={['label']}
          sanitizer={new LowerCaseSanitizer()}
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
      wrapper.find('.Formol_SelectMenuField__hidden-input').find('input')

    const singleValue = () => wrapper.find('SingleValue')
    const selectControl = () =>
      wrapper
        .find('Control')
        .find('div')
        .first()
    const selectOptions = () => wrapper.find('MenuList').find('Option')
    const selectMenu = () => wrapper.find('Menu')
    const selectInput = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(input().props().defaultValue).toEqual('')
    expect(singleValue()).toHaveLength(0)
    expect(selectOptions()).toHaveLength(0)
    expect(selectMenu()).toHaveLength(0)
    await selectInput().simulate('focus')
    await selectControl().simulate('mousedown', { button: 0 })
    // Hard setting value since the react-select
    // handler is based on e.currentTarget
    selectInput().getDOMNode().value = 'o'
    await selectInput().simulate('change', { target: { value: 'o' } })

    expect(selectOptions()).toHaveLength(0)

    selectInput().getDOMNode().value = 'ONE'
    await selectInput().simulate('change', { target: { value: 'ONE' } })

    expect(selectOptions()).toHaveLength(1)
  })
  it('handles lot of choices with virtualization', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ selectMenu: '4831' }}>
        <Field
          type="select-menu"
          choices={Array(5000)
            .fill()
            .map((_, i) => `${i}`)}
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
      wrapper.find('.Formol_SelectMenuField__hidden-input').find('input')

    const singleValue = () => wrapper.find('SingleValue')
    const selectControl = () =>
      wrapper
        .find('Control')
        .find('div')
        .first()
    const selectOptions = () => wrapper.find('MenuList').find('Option')
    const selectMenu = () => wrapper.find('Menu')
    const selectInput = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(input().props().defaultValue).toEqual('4831')
    expect(singleValue().text()).toEqual('4831')
    expect(selectOptions()).toHaveLength(0)
    expect(selectMenu()).toHaveLength(0)
    await selectInput().simulate('focus')
    await selectControl().simulate('mousedown', { button: 0 })

    await selectInput().simulate('focus')
    // Hard setting value since the react-select
    // handler is based on e.currentTarget
    selectInput().getDOMNode().value = '8341'
    await selectInput().simulate('change', { target: { value: '8341' } })

    expect(selectOptions()).toHaveLength(0)

    selectInput().getDOMNode().value = '834'
    await selectInput().simulate('change', { target: { value: '834' } })

    expect(selectOptions()).toHaveLength(5)
    await selectOptions()
      .at(3)
      .simulate('click')

    selectInput().getDOMNode().value = '83'
    await selectInput().simulate('change', { target: { value: '83' } })

    await selectInput().simulate('blur')

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(input().props().defaultValue).toEqual('3834')

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith(
      { selectMenu: '3834' },
      { selectMenu: '4831' },
      ['selectMenu'],
      true
    )
    expect(input().props().defaultValue).toEqual('3834')

    wrapper.unmount()
  })
})
