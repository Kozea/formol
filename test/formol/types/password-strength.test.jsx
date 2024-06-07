import { mount } from 'enzyme'
import React from 'react'

import Formol, { Field } from '../../../src'

describe('Password Strength field', () => {
  it('handles changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ password: 'r"/*Nb+4)23' }}>
        <Field type="password-strength">Password</Field>
      </Formol>
    )
    const asyncWrapper = () => wrapper.find('AsyncWrapper')
    expect(asyncWrapper().text()).toEqual('Loading')
    await asyncWrapper().instance()._promise
    wrapper.update()
    expect(asyncWrapper().text()).not.toEqual('Loading')

    const input = () => wrapper.find('Field').find('input').first()
    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().type).toEqual('password')
    expect(input().props().value).toEqual('r"/*Nb+4)23')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'u#@*/p=u58+e' } })
    await input().simulate('blur')
    expect(input().props().value).toEqual('u#@*/p=u58+e')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(wrapper.getDOMNode().checkValidity()).toBeTruthy()

    await submit().simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith(
      { password: 'u#@*/p=u58+e' },
      { password: 'r"/*Nb+4)23' },
      ['password'],
      true
    )
    expect(input().props().value).toEqual('u#@*/p=u58+e')
  })
  it('cancels changes', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ password: 'r"/*Nb+4)23' }}>
        <Field type="password-strength">Password</Field>
      </Formol>
    )
    const asyncWrapper = () => wrapper.find('AsyncWrapper')
    expect(asyncWrapper().text()).toEqual('Loading')
    await asyncWrapper().instance()._promise
    wrapper.update()
    expect(asyncWrapper().text()).not.toEqual('Loading')

    const input = () => wrapper.find('Field').find('input').first()
    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().value).toEqual('r"/*Nb+4)23')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'u#@*/p=u58+e' } })
    await input().simulate('blur')

    expect(input().props().value).toEqual('u#@*/p=u58+e')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    await cancel().simulate('click')

    expect(input().props().value).toEqual('r"/*Nb+4)23')
  })
  it('shows password on eye click', async () => {
    const wrapper = mount(
      <Formol item={{ password: 'r"/*Nb+4)23' }}>
        <Field type="password-strength">Password</Field>
      </Formol>
    )
    const asyncWrapper = () => wrapper.find('AsyncWrapper')
    expect(asyncWrapper().text()).toEqual('Loading')
    await asyncWrapper().instance()._promise
    wrapper.update()
    expect(asyncWrapper().text()).not.toEqual('Loading')

    const input = () => wrapper.find('Field').find('input').first()
    const eye = () => wrapper.find('Field').find('.Formol_PasswordField__eye')

    expect(input().props().value).toEqual('r"/*Nb+4)23')
    expect(input().props().type).toEqual('password')
    await eye().simulate('click')
    expect(input().props().value).toEqual('r"/*Nb+4)23')
    expect(input().props().type).toEqual('text')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'u#@*/p=u58+e' } })
    await input().simulate('blur')
    // bluring the field should restore password type
    expect(input().props().type).toEqual('password')
    expect(input().props().value).toEqual('u#@*/p=u58+e')

    await eye().simulate('click')

    expect(input().props().value).toEqual('u#@*/p=u58+e')
    expect(input().props().type).toEqual('text')

    await eye().simulate('click')

    expect(input().props().value).toEqual('u#@*/p=u58+e')
    expect(input().props().type).toEqual('password')
  })
  it('detects and prevents submission of weak passwords', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{ password: 'r"/*Nb+4)23' }}>
        <Field type="password-strength">Password</Field>
      </Formol>
    )
    const asyncWrapper = () => wrapper.find('AsyncWrapper')
    expect(asyncWrapper().text()).toEqual('Loading')
    await asyncWrapper().instance()._promise
    wrapper.update()
    expect(asyncWrapper().text()).not.toEqual('Loading')

    const input = () => wrapper.find('Field').find('input').first()
    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')
    const strength = () =>
      wrapper.find('.Formol_PasswordStrengthField__description').text()
    const error = () => wrapper.find('.Formol_Field__error-text').text()

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()
    expect(input().props().type).toEqual('password')
    expect(input().props().value).toEqual('r"/*Nb+4)23')
    expect(strength()).toEqual('stronger')

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'passw0rd' } })
    expect(strength()).toEqual('too weak')
    await input().simulate('blur')
    expect(error()).toEqual('Please choose a more secure password.')

    expect(input().props().value).toEqual('passw0rd')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(wrapper.getDOMNode().checkValidity()).toBeFalsy()

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'iamsecret' } })
    expect(strength()).toEqual('weak')
    await input().simulate('blur')
    expect(error()).toEqual('Please choose a more secure password.')

    expect(input().props().value).toEqual('iamsecret')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(wrapper.getDOMNode().checkValidity()).toBeFalsy()

    await input().simulate('focus')
    await input().simulate('change', { target: { value: '2sht' } })
    expect(strength()).toEqual('too short')
    await input().simulate('blur')
    expect(error()).toEqual('Please choose a more secure password.')

    expect(input().props().value).toEqual('2sht')
    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(wrapper.getDOMNode().checkValidity()).toBeFalsy()
  })
  it('has a pristine state', async () => {
    const wrapper = mount(
      <Formol>
        <Field type="password-strength">Password</Field>
      </Formol>
    )

    const asyncWrapper = () => wrapper.find('AsyncWrapper')
    expect(asyncWrapper().text()).toEqual('Loading')
    await asyncWrapper().instance()._promise
    wrapper.update()
    expect(asyncWrapper().text()).not.toEqual('Loading')

    const input = () => wrapper.find('Field').find('input').first()
    const isPristine = () =>
      wrapper.find('.Formol_PasswordStrengthField--pristine').exists()

    expect(isPristine()).toBe(true)

    await input().simulate('focus')
    await input().simulate('change', { target: { value: 'a' } })

    expect(isPristine()).toBe(false)

    await input().simulate('change', { target: { value: '' } })

    expect(isPristine()).toBe(false)
  })

  describe('basic', () => {
    it('only uses 3 levels of strength', async () => {
      const wrapper = mount(
        <Formol item={{ password: '' }}>
          <Field type="password-strength" basic>
            Password
          </Field>
        </Formol>
      )

      const asyncWrapper = () => wrapper.find('AsyncWrapper')
      expect(asyncWrapper().text()).toEqual('Loading')
      await asyncWrapper().instance()._promise
      wrapper.update()
      expect(asyncWrapper().text()).not.toEqual('Loading')

      const input = () => wrapper.find('Field').find('input').first()
      const strength = () =>
        wrapper.find('.Formol_PasswordStrengthField__description').text()
      const error = () => wrapper.find('.Formol_Field__error-text').text()

      await input().simulate('focus')
      await input().simulate('change', { target: { value: 'aa' } })
      expect(strength()).toEqual('too short')

      await input().simulate('change', { target: { value: 'aaaaaa' } })
      expect(strength()).toEqual('weak')

      await input().simulate('blur')
      expect(error()).toEqual('Please choose a more secure password.')

      await input().simulate('focus')
      await input().simulate('change', { target: { value: 'aaaaaaE!1 ;@' } })
      expect(strength()).toEqual('strong')
      expect(wrapper.find('.Formol_Field__error-text')).toHaveLength(0)
    })
  })
})
