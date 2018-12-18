/* eslint-disable react/no-multi-comp */
import React from 'react'
import { mount } from 'enzyme'

import { forCondition } from '../helpers'
import Formol, { Field, NoRequestNeeded, unrest } from '../../src'

describe('Formol redux-api-unrest adapter', () => {
  it('calls onCreate on a new object', async () => {
    const onCreate = jest.fn(() => ({ metadata: { code: 200 } }))
    const onPatch = jest.fn()
    const onValid = jest.fn()
    const onError = jest.fn()
    const onFail = jest.fn()

    const wrapper = mount(
      <Formol
        onSubmit={unrest({
          pk: item => ({
            id: item.id,
          }),
          onCreate,
          onPatch,
          onValid,
          onError,
          onFail,
        })}
        item={{}}
      >
        <Field type="text">Text</Field>
      </Formol>
    )
    const input = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()
    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().type).toEqual('text')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'bar' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('bar')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(wrapper.find('.Formol_Field__error-text').length).toEqual(0)

    expect(wrapper.getDOMNode().checkValidity()).toBeTruthy()

    await submit().simulate('submit')
    expect(onCreate).toHaveBeenCalled()
    expect(onCreate).toHaveBeenCalledWith({ text: 'bar' })

    await forCondition(() => onValid.mock.calls.length, wrapper)

    expect(onPatch).not.toHaveBeenCalled()
    expect(onValid).toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
    expect(onFail).not.toHaveBeenCalled()
  })
  it('calls onPatch on an existing object', async () => {
    const onCreate = jest.fn()
    const onPatch = jest.fn(() => ({ metadata: { code: 200 } }))
    const onValid = jest.fn()
    const onError = jest.fn()
    const onFail = jest.fn()

    const wrapper = mount(
      <Formol
        onSubmit={unrest({
          pk: item => ({
            id: item.id,
          }),
          onCreate,
          onPatch,
          onValid,
          onError,
          onFail,
        })}
        item={{ id: 12, text: 'foo' }}
      >
        <Field type="text">Text</Field>
      </Formol>
    )
    const input = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()
    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().type).toEqual('text')
    expect(input().props().value).toEqual('foo')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'bar' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('bar')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(wrapper.find('.Formol_Field__error-text').length).toEqual(0)

    expect(wrapper.getDOMNode().checkValidity()).toBeTruthy()

    await submit().simulate('submit')

    expect(onPatch).toHaveBeenCalled()
    expect(onPatch).toHaveBeenCalledWith({ id: 12 }, { text: 'bar' })
    await forCondition(() => onValid.mock.calls.length, wrapper)

    expect(onCreate).not.toHaveBeenCalled()
    expect(onValid).toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
    expect(onFail).not.toHaveBeenCalled()
  })
  it('handles field errors', async () => {
    const onCreate = jest.fn()
    const onPatch = jest.fn(() => ({
      metadata: {
        code: 202,
        errors: [{ fields: { text: 'Unrest server error' } }],
      },
    }))
    const onValid = jest.fn()
    const onError = jest.fn()
    const onFail = jest.fn()

    const wrapper = mount(
      <Formol
        onSubmit={unrest({
          pk: item => ({
            id: item.id,
          }),
          onCreate,
          onPatch,
          onValid,
          onError,
          onFail,
        })}
        item={{ id: 12, text: 'foo' }}
      >
        <Field type="text">Text</Field>
      </Formol>
    )
    const input = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()
    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().type).toEqual('text')
    expect(input().props().value).toEqual('foo')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'bar' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('bar')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(wrapper.find('.Formol_Field__error-text').length).toEqual(0)

    expect(wrapper.getDOMNode().checkValidity()).toBeTruthy()

    await submit().simulate('submit')

    expect(onPatch).toHaveBeenCalled()
    expect(onPatch).toHaveBeenCalledWith({ id: 12 }, { text: 'bar' })

    expect(onCreate).not.toHaveBeenCalled()
    expect(onValid).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
    expect(onFail).not.toHaveBeenCalled()

    await forCondition(
      () => wrapper.find('.Formol_Field__error-text').length,
      wrapper
    )

    expect(wrapper.find('.Formol_Field__error-text').text()).toEqual(
      'Unrest server error'
    )
  }, 30000)
  it('reports server errors', async () => {
    const onCreate = jest.fn()
    const onPatch = jest.fn(() => ({
      metadata: {
        code: 404,
        error: 'Not found',
      },
    }))
    const onValid = jest.fn()
    const onError = jest.fn()
    const onFail = jest.fn()

    const wrapper = mount(
      <Formol
        onSubmit={unrest({
          pk: item => ({
            id: item.id,
          }),
          onCreate,
          onPatch,
          onValid,
          onError,
          onFail,
        })}
        item={{ id: 12, text: 'foo' }}
      >
        <Field type="text">Text</Field>
      </Formol>
    )
    const input = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()
    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().type).toEqual('text')
    expect(input().props().value).toEqual('foo')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'bar' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('bar')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(wrapper.find('.Formol_Field__error-text').length).toEqual(0)

    expect(wrapper.getDOMNode().checkValidity()).toBeTruthy()

    await submit().simulate('submit')

    expect(onPatch).toHaveBeenCalled()
    expect(onPatch).toHaveBeenCalledWith({ id: 12 }, { text: 'bar' })

    await forCondition(() => onError.mock.calls.length, wrapper)
    expect(onError).toHaveBeenCalled()
    expect(onError).toHaveBeenCalledWith(
      {
        metadata: {
          code: 404,
          error: 'Not found',
        },
      },
      'patch'
    )

    expect(onCreate).not.toHaveBeenCalled()
    expect(onValid).not.toHaveBeenCalled()
    expect(onFail).not.toHaveBeenCalled()
  }, 30000)
  it('fails on errors', async () => {
    const error = new Error('I am broken')
    const onCreate = jest.fn()
    const onPatch = jest.fn(() => {
      throw error
    })
    const onValid = jest.fn()
    const onError = jest.fn()
    const onFail = jest.fn()

    const wrapper = mount(
      <Formol
        onSubmit={unrest({
          pk: item => ({
            id: item.id,
          }),
          onCreate,
          onPatch,
          onValid,
          onError,
          onFail,
        })}
        item={{ id: 12, text: 'foo' }}
      >
        <Field type="text">Text</Field>
      </Formol>
    )
    const input = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()
    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().type).toEqual('text')
    expect(input().props().value).toEqual('foo')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'bar' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('bar')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(wrapper.find('.Formol_Field__error-text').length).toEqual(0)

    expect(wrapper.getDOMNode().checkValidity()).toBeTruthy()

    await submit().simulate('submit')

    expect(onPatch).toHaveBeenCalled()
    expect(onPatch).toHaveBeenCalledWith({ id: 12 }, { text: 'bar' })

    await forCondition(() => onFail.mock.calls.length, wrapper)
    expect(onFail).toHaveBeenCalled()
    expect(onFail).toHaveBeenCalledWith(error, 'patch')

    expect(onCreate).not.toHaveBeenCalled()
    expect(onValid).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  }, 30000)
  it(
    'allows return without request ' +
      '(without report because a request wasn’t needed for example)',
    async () => {
      const aborter = new NoRequestNeeded('I am broken')
      const onCreate = jest.fn()
      const onPatch = jest.fn(() => {
        throw aborter
      })
      const onValid = jest.fn()
      const onError = jest.fn()
      const onFail = jest.fn()

      const wrapper = mount(
        <Formol
          onSubmit={unrest({
            pk: item => ({
              id: item.id,
            }),
            onCreate,
            onPatch,
            onValid,
            onError,
            onFail,
          })}
          item={{ id: 12, text: 'foo' }}
        >
          <Field type="text">Text</Field>
        </Formol>
      )
      const input = () =>
        wrapper
          .find('Field')
          .find('input')
          .first()
      const submit = () => wrapper.find('.Formol_Formol__submit')
      const cancel = () => wrapper.find('.Formol_Formol__cancel')

      expect(submit().props().disabled).toBeTruthy()
      expect(cancel().props().disabled).toBeTruthy()
      expect(input().props().type).toEqual('text')
      expect(input().props().value).toEqual('foo')

      await input().simulate('focus')
      await input().simulate('change', { target: { value: 'bar' } })
      await input().simulate('blur')

      expect(input().props().value).toEqual('bar')
      expect(submit().props().disabled).toBeFalsy()
      expect(cancel().props().disabled).toBeFalsy()

      expect(wrapper.find('.Formol_Field__error-text').length).toEqual(0)

      expect(wrapper.getDOMNode().checkValidity()).toBeTruthy()

      await submit().simulate('submit')

      expect(onPatch).toHaveBeenCalled()
      expect(onPatch).toHaveBeenCalledWith({ id: 12 }, { text: 'bar' })

      expect(onCreate).not.toHaveBeenCalled()
      expect(onValid).not.toHaveBeenCalled()
      expect(onError).not.toHaveBeenCalled()
      expect(onFail).not.toHaveBeenCalled()
    },
    30000
  )
})
