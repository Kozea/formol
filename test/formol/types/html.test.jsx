import React from 'react'
import { mount } from 'enzyme'

import { forCondition } from '../../helpers'
import Formol, { Field } from '../../../src'
import molecule from '../../samples/molecule.svg.base64'

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
  setStart() {},
  setEnd() {},
  addRange() {},
  getRangeAt(i) {
    if (i !== 0) {
      throw new Error('NotImplemented')
    }
    return {
      startContainer: node,
      endContainer: node,
      startOffset: start,
      endOffset: end,
      collapsed: start === end,
    }
  },
  removeAllRanges() {
    Object.assign(this, voidSelection()())
  },
})

describe('Html field', () => {
  it('handles changes', async () => {
    global.document.getSelection = simpleSelection(null, 0, 0)
    global.document.createRange = simpleSelection(null, 0, 0)
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

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(field().props().type).toEqual('html')
    expect(input().props().type).toEqual('text')

    expect(field().props().value).toEqual('<p>foo</p>')
    expect(input().props().value).toEqual('<p>foo</p>')

    const quill = wrapper
      .find('Quill')
      .instance()
      .getEditor()

    wrapper.find('Quill').prop('onFocus')()
    quill.clipboard.dangerouslyPasteHTML('<p>f<strong>oo</strong></p>')
    wrapper.find('Quill').prop('onBlur')()
    wrapper.update()

    expect(field().props().value).toEqual('<p>f<strong>oo</strong></p>')
    expect(input().props().value).toEqual('<p>f<strong>oo</strong></p>')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(wrapper.getDOMNode().checkValidity()).toBeTruthy()

    await submit().simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith(
      { html: '<p>f<strong>oo</strong></p>' },
      { html: '<p>foo</p>' },
      ['html'],
      true
    )
    expect(field().props().value).toEqual('<p>f<strong>oo</strong></p>')
    expect(input().props().value).toEqual('<p>f<strong>oo</strong></p>')
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

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(field().props().value).toEqual('<p>foo</p>')
    expect(input().props().value).toEqual('<p>foo</p>')

    const quill = wrapper
      .find('Quill')
      .instance()
      .getEditor()

    quill.clipboard.dangerouslyPasteHTML('<p>f<strong>oo</strong></p>')
    wrapper.update()

    expect(field().props().value).toEqual('<p>f<strong>oo</strong></p>')
    expect(input().props().value).toEqual('<p>f<strong>oo</strong></p>')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await cancel().simulate('click')

    expect(field().props().value).toEqual('<p>foo</p>')
    expect(input().props().value).toEqual('<p>foo</p>')
  })
  it('works with no initial value', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit}>
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

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(field().props().type).toEqual('html')
    expect(input().props().type).toEqual('text')
    expect(wrapper.find('Quill').prop('value')).toEqual('')
    expect(field().props().value).toEqual('')
    expect(input().props().value).toEqual('')
  })
  it('understands empty value', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ html: '<p><br></p>' }}>
        <Field type="html">Html</Field>
      </Formol>
    )
    const asyncWrapper = () => wrapper.find('AsyncWrapper')
    expect(asyncWrapper().text()).toEqual('Loading')
    await asyncWrapper().instance()._promise
    wrapper.update()
    expect(asyncWrapper().text()).not.toEqual('Loading')

    // Can't really test anything here for now
  })
})
