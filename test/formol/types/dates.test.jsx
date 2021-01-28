import { mount } from 'enzyme'
import React from 'react'
import Formol, { Field } from '../../../src'
;[
  {
    type: 'time',
    title: 'Time',
    value1: '11:59',
    value2: '05:12',
  },
  {
    type: 'datetime-local',
    title: 'DateTime Local',
    value1: '2008-02-19T18:14',
    value2: '1902-01-10T04:29',
  },
  {
    type: 'month',
    title: 'Month',
    value1: '2148-02',
    value2: '2000-01',
  },
  {
    type: 'week',
    title: 'Week',
    value1: '1998-W12',
    value2: '2100-W03',
  },
].map(({ type, title, value1, value2 }) =>
  describe(`${title} field`, () => {
    it('handles changes', async () => {
      const onSubmit = jest.fn()
      const wrapper = mount(
        <Formol onSubmit={onSubmit} item={{ [type]: value1 }}>
          <Field name={type} type={type}>
            {title}
          </Field>
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
      expect(input().props().type).toEqual(type)
      expect(input().props().value).toEqual(value1)

      await input().simulate('focus')
      await input().simulate('change', { target: { value: value2 } })
      await input().simulate('blur')

      expect(input().props().value).toEqual(value2)
      expect(submit().props().disabled).toBeFalsy()
      expect(cancel().props().disabled).toBeFalsy()

      // Validity is broken in current jsdom
      // TODO: Uncomment with jsdom 16
      // expect(wrapper.getDOMNode().checkValidity()).toBeTruthy()

      await submit().simulate('submit')

      expect(onSubmit).toHaveBeenCalledWith(
        { [type]: value2 },
        { [type]: value1 },
        [type],
        true
      )
      expect(input().props().value).toEqual(value2)
    })
    it('cancels changes', async () => {
      const onSubmit = jest.fn()
      const wrapper = mount(
        <Formol onSubmit={onSubmit} item={{ [type]: value1 }}>
          <Field name={type} type={type}>
            {title}
          </Field>
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
      expect(input().props().value).toEqual(value1)

      await input().simulate('focus')
      await input().simulate('change', { target: { value: value2 } })
      await input().simulate('blur')

      expect(input().props().value).toEqual(value2)
      expect(submit().props().disabled).toBeFalsy()
      expect(cancel().props().disabled).toBeFalsy()

      await cancel().simulate('click')

      expect(input().props().value).toEqual(value1)
    })
  })
)
