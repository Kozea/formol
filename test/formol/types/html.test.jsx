import { mount } from 'enzyme'
import React from 'react'

import Formol, { Field } from '../../../src'

const voidSelection = () => () => ({
  anchorNode: null,
  anchorOffset: 0,
  baseNode: null,
  baseOffset: 0,
  extentNode: null,
  extentOffset: 0,
  focusNode: null,
  focusOffset: 0,
  isCollapsed: true,
  rangeCount: 0,
  type: 'None',
})

const simpleSelection = (node, start, end) => () => ({
  anchorNode: node,
  anchorOffset: start,
  baseNode: node,
  baseOffset: start,
  extentNode: node,
  extentOffset: end,
  focusNode: node,
  focusOffset: end,
  isCollapsed: false,
  rangeCount: 1,
  type: 'Range',
  removeAllRanges() {
    Object.assign(this, voidSelection()())
  },
})

describe('Html field', () => {
  it('handles changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ html: '<p>foo</p>' }}>
        <Field type="html">Html</Field>
      </Formol>
    )
    const asyncWrapper = () => wrapper.find('AsyncWrapper')
    expect(asyncWrapper().text()).toEqual('Loading')
    await asyncWrapper().instance()._promise
    wrapper.update()
    expect(asyncWrapper().text()).not.toEqual('Loading')

    const field = () => wrapper.find('HTMLField').first()
    const input = () =>
      wrapper
        .find('.Formol_Field__element')
        .find('input')
        .first()
    const bold = () => wrapper.find('.rdw-option-wrapper').first()

    const editorContent = () => wrapper.find('.public-DraftEditor-content')

    const fooSpan = () =>
      wrapper.find('.public-DraftEditor-content DraftEditorTextNode span')

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(field().props().type).toEqual('html')
    expect(input().props().type).toEqual('text')
    expect(fooSpan().text()).toEqual('foo')
    expect(field().props().value).toEqual('<p>foo</p>')
    expect(input().props().defaultValue).toEqual('<p>foo</p>')

    await fooSpan().simulate('focus')

    // emulate a selection of "oo"
    const [fooNode] = fooSpan().getDOMNode().childNodes
    global.window.getSelection = simpleSelection(fooNode, 1, 3)
    await editorContent().simulate('select')

    await fooSpan().simulate('blur')

    await bold().simulate('click')

    expect(field().props().value).toEqual('<p>f<strong>oo</strong></p>')
    expect(input().props().defaultValue).toEqual('<p>f<strong>oo</strong></p>')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith(
      { html: '<p>f<strong>oo</strong></p>' },
      { html: '<p>foo</p>' },
      ['html']
    )
    expect(field().props().value).toEqual('<p>f<strong>oo</strong></p>')
    expect(input().props().defaultValue).toEqual('<p>f<strong>oo</strong></p>')
  })
  it('cancels changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ html: '<p>foo</p>' }}>
        <Field type="html">Html</Field>
      </Formol>
    )
    const asyncWrapper = () => wrapper.find('AsyncWrapper')
    expect(asyncWrapper().text()).toEqual('Loading')
    await asyncWrapper().instance()._promise
    wrapper.update()
    expect(asyncWrapper().text()).not.toEqual('Loading')

    const field = () => wrapper.find('HTMLField').first()
    const input = () =>
      wrapper
        .find('.Formol_Field__element')
        .find('input')
        .first()
    const bold = () => wrapper.find('.rdw-option-wrapper').first()

    const editorContent = () => wrapper.find('.public-DraftEditor-content')

    const fooSpan = () =>
      wrapper.find('.public-DraftEditor-content DraftEditorTextNode span')

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(field().props().value).toEqual('<p>foo</p>')
    expect(input().props().defaultValue).toEqual('<p>foo</p>')

    await fooSpan().simulate('focus')

    // emulate a selection of "oo"
    const [fooNode] = fooSpan().getDOMNode().childNodes
    global.window.getSelection = simpleSelection(fooNode, 1, 3)
    await editorContent().simulate('select')

    await fooSpan().simulate('blur')

    await bold().simulate('click')

    expect(field().props().value).toEqual('<p>f<strong>oo</strong></p>')
    expect(input().props().defaultValue).toEqual('<p>f<strong>oo</strong></p>')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await cancel().simulate('click')

    expect(field().props().value).toEqual('<p>foo</p>')
    expect(input().props().defaultValue).toEqual('<p>foo</p>')
  })
})
