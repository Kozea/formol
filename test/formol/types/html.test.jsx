import React from 'react'

import { mount } from 'enzyme'

import { HTMLToEditor, editorToHTML } from '../../../src/utils/html'
import { forCondition } from './file.test'
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
  it('handles changes in fast mode', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ html: HTMLToEditor('<p>foo</p>') }}>
        <Field type="html" fast>
          Html
        </Field>
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
    expect(editorToHTML(field().props().value)).toEqual('<p>foo</p>')
    // expect(input().props().defaultValue).toEqual('<p>foo</p>')

    await fooSpan().simulate('focus')

    // emulate a selection of "oo"
    const [fooNode] = fooSpan().getDOMNode().childNodes
    global.window.getSelection = simpleSelection(fooNode, 1, 3)
    await editorContent().simulate('select')

    await fooSpan().simulate('blur')

    await bold().simulate('click')

    expect(editorToHTML(field().props().value)).toEqual(
      '<p>f<strong>oo</strong></p>'
    )
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    const [submitArgs] = onSubmit.mock.calls
    expect(editorToHTML(submitArgs[0].html)).toEqual(
      '<p>f<strong>oo</strong></p>'
    )
    expect(editorToHTML(submitArgs[1].html)).toEqual('<p>foo</p>')
    expect(submitArgs[2]).toEqual(['html'])
    expect(editorToHTML(field().props().value)).toEqual(
      '<p>f<strong>oo</strong></p>'
    )
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

    const fooSpan = () =>
      wrapper.find('.public-DraftEditor-content DraftEditorTextNode span')

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(field().props().type).toEqual('html')
    expect(input().props().type).toEqual('text')
    expect(fooSpan()).toHaveLength(0)
    expect(field().props().value).toEqual('')
    expect(input().props().defaultValue).toEqual('')
  })
  it('works with no initial value in fast mode', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit}>
        <Field fast type="html">
          Html
        </Field>
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

    const fooSpan = () =>
      wrapper.find('.public-DraftEditor-content DraftEditorTextNode span')

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(field().props().type).toEqual('html')
    expect(input().props().type).toEqual('text')
    expect(fooSpan()).toHaveLength(0)
    expect(field().props().value).toEqual('')
    expect(input().props().defaultValue).toEqual('')
  })
  it('uploads files as base64', async () => {
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

    const image = () =>
      wrapper
        .find('.rdw-image-wrapper')
        .find('.rdw-option-wrapper')
        .first()
    const file = () =>
      wrapper
        .find('.rdw-image-modal-upload-option-input')
        .find('input')
        .first()
    const ok = () =>
      wrapper
        .find('.rdw-image-wrapper')
        .find('.rdw-image-modal')
        .find('.rdw-image-modal-btn')
        .first()

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(field().props().type).toEqual('html')
    expect(input().props().type).toEqual('text')
    expect(field().props().value).toEqual('<p>foo</p>')
    expect(input().props().defaultValue).toEqual('<p>foo</p>')
    await image().simulate('click')
    expect(ok().props().disabled).toBeTruthy()

    const blob = new File([Buffer.from(molecule, 'base64')], 'molecule.svg', {
      type: 'image/svg+xml',
    })

    await file().simulate('change', { target: { files: [blob] } })

    // Wait for upload to finish
    await forCondition(() => !ok().props().disabled, wrapper)

    expect(ok().props().disabled).toBeFalsy()

    await ok().simulate('click')

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    const expectedHtml =
      '<p></p>\n' +
      `<img src="data:image/svg+xml;base64,${molecule}" alt="" style="float:none;height: auto;width: auto"/>\n` + // eslint-disable-line max-len
      '<p>foo</p>'
    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith(
      {
        html: expectedHtml,
      },
      { html: '<p>foo</p>' },
      ['html']
    )
    expect(field().props().value).toEqual(expectedHtml)
    expect(input().props().defaultValue).toEqual(expectedHtml)
  })
})
