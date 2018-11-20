import { mount } from 'enzyme'
import React from 'react'

import Formol, { Field } from '../../../src'

describe('Calendar field', () => {
  it('handles changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ calendar: '2018-07-24' }}>
        <Field type="calendar">Calendar</Field>
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
    expect(input().props().value).toEqual('07/24/2018')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: '12/11/2010' } })
    await input().simulate('blur')
    expect(input().props().value).toEqual('12/11/2010')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith(
      { calendar: '2010-12-11' },
      { calendar: '2018-07-24' },
      ['calendar'],
      true
    )
    expect(input().props().value).toEqual('12/11/2010')
  })
  it('cancels changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ calendar: '07/24/2018' }}>
        <Field type="calendar">Calendar</Field>
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
    expect(input().props().value).toEqual('07/24/2018')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: '12/11/2010' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('12/11/2010')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await cancel().simulate('click')

    expect(input().props().value).toEqual('07/24/2018')
  })
  it('prevents submission of bad dates', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ calendar: '2018-07-24' }}>
        <Field type="calendar">Calendar</Field>
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
    const error = () => wrapper.find('.Formol_Field__error-text').text()

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().value).toEqual('07/24/2018')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: '25/35/1802' } })
    await input().simulate('blur')
    expect(error()).toEqual('Constraints not satisfied')

    // Bad values are cleared here
    expect(input().props().value).toEqual('25/35/1802')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()
  })
  it('does not break on bad dates values', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ calendar: 'no data' }}>
        <Field type="calendar">Calendar</Field>
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
    expect(input().props().value).toEqual('no data')
  })
  it('does not break on bad dates values when readOnly', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ calendar: 'no data' }}>
        <Field type="calendar" readOnly>
          Calendar
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
    expect(input().props().value).toEqual('no data')
  })
  it('displays a clickable calendar', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ calendar: '2018-07-24' }}>
        <Field type="calendar">Calendar</Field>
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
    const calendar = () =>
      wrapper.find('.Formol_CalendarField__overlay-wrapper')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().value).toEqual('07/24/2018')

    expect(calendar()).toHaveLength(0)
    await input().simulate('focus')
    expect(calendar()).toHaveLength(1)
    expect(
      calendar()
        .find('.DayPicker-Caption')
        .text()
    ).toEqual('July 2018')
    await calendar()
      .find('.DayPicker-Day')
      .forEach(async day => {
        if (day.text() === '2') {
          await day.simulate('click')
          return false
        }
      })
    await input().simulate('blur')
    expect(input().props().value).toEqual('07/02/2018')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith(
      { calendar: '2018-07-02' },
      { calendar: '2018-07-24' },
      ['calendar'],
      true
    )
    expect(input().props().value).toEqual('07/02/2018')
    expect(wrapper.unmount()).toBeTruthy()
  })
  it('renders as a simple field when readOnly', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ calendar: '2018-07-24' }}>
        <Field type="calendar" readOnly>
          Calendar
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
    const calendar = () =>
      wrapper.find('.Formol_CalendarField__overlay-wrapper')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().type).toEqual('text')
    expect(input().props().value).toEqual('07/24/2018')

    expect(calendar()).toHaveLength(0)
    await input().simulate('focus')
    expect(calendar()).toHaveLength(0)
  })
  it('works as well with another locale', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol i18n="fr" onSubmit={onSubmit} item={{ calendar: '2018-07-24' }}>
        <Field type="calendar">Calendar</Field>
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
    const calendar = () =>
      wrapper.find('.Formol_CalendarField__overlay-wrapper')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().value).toEqual('24/07/2018')

    expect(calendar()).toHaveLength(0)
    await input().simulate('focus')
    expect(calendar()).toHaveLength(1)
    expect(
      calendar()
        .find('.DayPicker-Caption')
        .text()
    ).toEqual('juillet 2018')
    await calendar()
      .find('.DayPicker-Day')
      .forEach(async day => {
        if (day.text() === '2') {
          await day.simulate('click')
          return false
        }
      })

    await input().simulate('blur')
    expect(input().props().value).toEqual('02/07/2018')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await submit().simulate('click')

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith(
      { calendar: '2018-07-02' },
      { calendar: '2018-07-24' },
      ['calendar'],
      true
    )
    expect(input().props().value).toEqual('02/07/2018')
    expect(wrapper.unmount()).toBeTruthy()
  })
})
