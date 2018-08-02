import { mount } from 'enzyme'
import React from 'react'

import Formol, { Field, Conditional } from '../../src'

describe('Conditional field', () => {
  it('hides fields dependending on other value', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ ok: false }}>
        <Field name="ok" type="switch" />
        <Conditional show={({ ok }) => ok}>
          <Field name="why" />
        </Conditional>
        <Conditional show={({ ok }) => !ok}>
          <Field name="whynot" />
        </Conditional>
      </Formol>
    )

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    const fields = () => wrapper.find('Field')
    expect(fields()).toHaveLength(2)

    expect(
      fields()
        .at(0)
        .props().name
    ).toEqual('ok')
    expect(
      fields()
        .at(1)
        .props().name
    ).toEqual('whynot')

    const input = () =>
      fields()
        .at(1)
        .find('input')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'foo' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('foo')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith(
      { ok: false, whynot: 'foo' },
      { ok: false },
      ['ok', 'whynot']
    )
    expect(input().props().value).toEqual('foo')

    const ok = () =>
      fields()
        .at(0)
        .find('input')

    await ok().simulate('focus')
    await ok().simulate('change', { target: { checked: true } })
    await ok().simulate('blur')

    expect(
      fields()
        .at(0)
        .props().name
    ).toEqual('ok')
    expect(
      fields()
        .at(1)
        .props().name
    ).toEqual('why')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'bar' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('bar')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith(
      { ok: true, why: 'bar' },
      { ok: false },
      ['ok', 'why']
    )
    expect(input().props().value).toEqual('bar')
  })
  it('disables fields dependending on other value', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ ok: true }}>
        <Field name="ok" type="switch" />
        <Conditional disabled={({ ok }) => ok}>
          <Field name="why" />
        </Conditional>
        <Conditional disabled={({ ok }) => !ok}>
          <Field name="whynot" />
        </Conditional>
      </Formol>
    )

    const fields = () => wrapper.find('Field')
    expect(fields()).toHaveLength(3)

    expect(
      fields()
        .at(0)
        .props().name
    ).toEqual('ok')
    expect(
      fields()
        .at(1)
        .props().name
    ).toEqual('why')
    expect(
      fields()
        .at(2)
        .props().name
    ).toEqual('whynot')
    expect(
      fields()
        .at(1)
        .find('input')
        .props().disabled
    ).toBeTruthy()
    expect(
      fields()
        .at(2)
        .find('input')
        .props().disabled
    ).toBeFalsy()

    const ok = () =>
      fields()
        .at(0)
        .find('input')

    await ok().simulate('focus')
    await ok().simulate('change', { target: { checked: false } })
    await ok().simulate('blur')

    expect(
      fields()
        .at(1)
        .find('input')
        .props().disabled
    ).toBeFalsy()
    expect(
      fields()
        .at(2)
        .find('input')
        .props().disabled
    ).toBeTruthy()
  })
})
