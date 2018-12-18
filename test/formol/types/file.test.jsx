import React from 'react'
import { mount } from 'enzyme'

import { forCondition } from '../../helpers'
import Formol, { Field } from '../../../src'
import molecule from '../../samples/molecule.svg.base64'
import pdf from '../../samples/blank.pdf.base64'
import pixel from '../../samples/pixel.png.base64'

describe('File field', () => {
  it('handles changes in simple', async () => {
    window.URL.createObjectURL = () => ''
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol
        onSubmit={onSubmit}
        item={{
          file: {
            data: pixel,
            ext: 'png',
            name: 'pixel',
            size: 67,
            type: 'image/png',
          },
        }}
      >
        <Field type="file">File</Field>
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
        .at(1)

    const fileInput = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    const preview = sub =>
      wrapper.find(`.Formol_FileField__preview${sub ? `-${sub}` : ''}`)

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(wrapper.find('.Formol_FileField__dropzone')).not.toHaveLength(0)

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(preview()).toHaveLength(1)
    expect(preview('name').text()).toEqual('pixel.png')
    expect(preview('size').text()).toEqual('67 o')
    expect(preview('type').text()).toEqual('image/png')
    expect(input().props().value).toEqual('pixel.png')

    await fileInput().simulate('focus')

    const blob = new File([Buffer.from(molecule, 'base64')], 'molecule.svg', {
      type: 'image/svg+xml',
    })
    await fileInput().simulate('change', { target: { files: [blob] } })

    await fileInput().simulate('blur')

    // Wait for upload to finish
    await forCondition(() => !submit().props().disabled, wrapper)

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(input().props().value).toEqual('molecule.svg')

    expect(wrapper.getDOMNode().checkValidity()).toBeTruthy()

    await submit().simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith(
      {
        file: {
          data: molecule,
          ext: 'svg',
          name: 'molecule',
          size: 1086,
          type: 'image/svg+xml',
        },
      },
      {
        file: {
          data: pixel,
          ext: 'png',
          name: 'pixel',
          size: 67,
          type: 'image/png',
        },
      },
      ['file'],
      true
    )
    expect(input().props().value).toEqual('molecule.svg')

    wrapper.unmount()
  }, 30000)
  it('cancels changes', async () => {
    window.URL.createObjectURL = () => ''
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol
        onSubmit={onSubmit}
        item={{
          file: {
            data: pixel,
            ext: 'png',
            name: 'pixel',
            size: 67,
            type: 'image/png',
          },
        }}
      >
        <Field type="file">File</Field>
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
        .at(1)

    const fileInput = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    const preview = sub =>
      wrapper.find(`.Formol_FileField__preview${sub ? `-${sub}` : ''}`)

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(preview()).toHaveLength(1)
    expect(preview('name').text()).toEqual('pixel.png')
    expect(preview('size').text()).toEqual('67 o')
    expect(preview('type').text()).toEqual('image/png')
    expect(input().props().value).toEqual('pixel.png')

    await fileInput().simulate('focus')

    const blob = new File([Buffer.from(molecule, 'base64')], 'molecule.svg', {
      type: 'image/svg+xml',
    })
    await fileInput().simulate('change', { target: { files: [blob] } })

    await fileInput().simulate('blur')

    // Wait for upload to finish
    await forCondition(() => !submit().props().disabled, wrapper)

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(input().props().value).toEqual('molecule.svg')

    await cancel().simulate('click')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(input().props().value).toEqual('pixel.png')
  }, 30000)
  it('handles changes with multiple values', async () => {
    window.URL.createObjectURL = () => ''
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol
        onSubmit={onSubmit}
        item={{
          file: [
            {
              data: pixel,
              ext: 'png',
              name: 'pixel',
              size: 67,
              type: 'image/png',
            },
          ],
        }}
      >
        <Field type="file" multiple>
          File
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
        .at(1)

    const fileInput = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    const preview = sub =>
      wrapper.find(`.Formol_FileField__preview${sub ? `-${sub}` : ''}`)

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(preview()).toHaveLength(1)
    expect(preview('name').text()).toEqual('pixel.png')
    expect(preview('size').text()).toEqual('67 o')
    expect(preview('type').text()).toEqual('image/png')
    expect(input().props().value).toEqual('pixel.png')

    await fileInput().simulate('focus')

    const blob = new File([Buffer.from(molecule, 'base64')], 'molecule.svg', {
      type: 'image/svg+xml',
    })
    await fileInput().simulate('change', { target: { files: [blob] } })

    await fileInput().simulate('blur')

    // Wait for upload to finish
    await forCondition(() => !submit().props().disabled, wrapper)

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(input().props().value).toEqual('molecule.svg,pixel.png')

    await submit().simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith(
      {
        file: [
          {
            data: molecule,
            ext: 'svg',
            name: 'molecule',
            size: 1086,
            type: 'image/svg+xml',
          },
          {
            data: pixel,
            ext: 'png',
            name: 'pixel',
            size: 67,
            type: 'image/png',
          },
        ],
      },
      {
        file: [
          {
            data: pixel,
            ext: 'png',
            name: 'pixel',
            size: 67,
            type: 'image/png',
          },
        ],
      },
      ['file'],
      true
    )
    expect(input().props().value).toEqual('molecule.svg,pixel.png')

    wrapper.unmount()
  }, 30000)
  it('cancels changes in multiple', async () => {
    window.URL.createObjectURL = () => ''
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol
        onSubmit={onSubmit}
        item={{
          file: [
            {
              data: pixel,
              ext: 'png',
              name: 'pixel',
              size: 67,
              type: 'image/png',
            },
          ],
        }}
      >
        <Field type="file" multiple>
          File
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
        .at(1)

    const fileInput = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    const preview = sub =>
      wrapper.find(`.Formol_FileField__preview${sub ? `-${sub}` : ''}`)

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(preview()).toHaveLength(1)
    expect(preview('name').text()).toEqual('pixel.png')
    expect(preview('size').text()).toEqual('67 o')
    expect(preview('type').text()).toEqual('image/png')
    expect(input().props().value).toEqual('pixel.png')

    await fileInput().simulate('focus')

    const blob = new File([Buffer.from(molecule, 'base64')], 'molecule.svg', {
      type: 'image/svg+xml',
    })
    await fileInput().simulate('change', { target: { files: [blob] } })

    await fileInput().simulate('blur')

    // Wait for upload to finish
    await forCondition(() => !submit().props().disabled, wrapper)

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(input().props().value).toEqual('molecule.svg,pixel.png')

    await cancel().simulate('click')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(input().props().value).toEqual('pixel.png')
  }, 30000)
  it('handles same file upload', async () => {
    window.URL.createObjectURL = () => ''
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol
        onSubmit={onSubmit}
        item={{
          file: [
            {
              data: pixel,
              ext: 'png',
              name: 'pixel',
              size: 67,
              type: 'image/png',
            },
          ],
        }}
      >
        <Field type="file" multiple>
          File
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
        .at(1)

    const fileInput = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    const preview = sub =>
      wrapper.find(`.Formol_FileField__preview${sub ? `-${sub}` : ''}`)

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(preview()).toHaveLength(1)
    expect(preview('name').text()).toEqual('pixel.png')
    expect(preview('size').text()).toEqual('67 o')
    expect(preview('type').text()).toEqual('image/png')
    expect(input().props().value).toEqual('pixel.png')

    await fileInput().simulate('focus')

    const blob = new File([Buffer.from(pixel, 'base64')], 'pixel.png', {
      type: 'image/png',
    })
    await fileInput().simulate('change', { target: { files: [blob] } })

    await fileInput().simulate('blur')

    // Wait for upload to finish
    await forCondition(() => !submit().props().disabled, wrapper)

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(input().props().value).toEqual('pixel--1.png,pixel.png')

    await submit().simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith(
      {
        file: [
          {
            data: pixel,
            ext: 'png',
            name: 'pixel--1',
            size: 68,
            type: 'image/png',
          },
          {
            data: pixel,
            ext: 'png',
            name: 'pixel',
            size: 67,
            type: 'image/png',
          },
        ],
      },
      {
        file: [
          {
            data: pixel,
            ext: 'png',
            name: 'pixel',
            size: 67,
            type: 'image/png',
          },
        ],
      },
      ['file'],
      true
    )
    expect(input().props().value).toEqual('pixel--1.png,pixel.png')

    wrapper.unmount()
  }, 30000)
  it('handles uploaded file deletion', async () => {
    window.URL.createObjectURL = () => ''
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol
        onSubmit={onSubmit}
        item={{
          file: [
            {
              data: pixel,
              ext: 'png',
              name: 'pixel',
              size: 67,
              type: 'image/png',
            },
          ],
        }}
      >
        <Field type="file">File</Field>
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
        .at(1)

    const fileInput = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    const preview = sub =>
      wrapper.find(`.Formol_FileField__preview${sub ? `-${sub}` : ''}`)

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')
    const close = () => wrapper.find('.Formol_FileField__close')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(preview()).toHaveLength(1)
    expect(
      preview('name')
        .at(0)
        .text()
    ).toEqual('pixel.png')
    expect(
      preview('size')
        .at(0)
        .text()
    ).toEqual('67 o')
    expect(
      preview('type')
        .at(0)
        .text()
    ).toEqual('image/png')

    expect(input().props().value).toEqual('pixel.png')

    expect(close()).toHaveLength(1)

    await fileInput().simulate('focus')
    await close().simulate('click')
    await fileInput().simulate('blur')

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(input().props().value).toEqual('')

    await submit().simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith(
      {
        file: null,
      },
      {
        file: [
          {
            data: pixel,
            ext: 'png',
            name: 'pixel',
            size: 67,
            type: 'image/png',
          },
        ],
      },
      ['file'],
      true
    )
    expect(input().props().value).toEqual('')

    wrapper.unmount()
  })
  it('handles uploaded file deletion on multiple', async () => {
    window.URL.createObjectURL = () => ''
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol
        onSubmit={onSubmit}
        item={{
          file: [
            {
              data: pixel,
              ext: 'png',
              name: 'pixel',
              size: 67,
              type: 'image/png',
            },
            {
              data: molecule,
              ext: 'svg',
              name: 'molecule',
              size: 1086,
              type: 'image/svg+xml',
            },
          ],
        }}
      >
        <Field type="file" multiple>
          File
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
        .at(1)

    const fileInput = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    const preview = sub =>
      wrapper.find(`.Formol_FileField__preview${sub ? `-${sub}` : ''}`)

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')
    const close = () => wrapper.find('.Formol_FileField__close')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(preview()).toHaveLength(2)
    expect(
      preview('name')
        .at(0)
        .text()
    ).toEqual('pixel.png')
    expect(
      preview('size')
        .at(0)
        .text()
    ).toEqual('67 o')
    expect(
      preview('type')
        .at(0)
        .text()
    ).toEqual('image/png')
    expect(
      preview('name')
        .at(1)
        .text()
    ).toEqual('molecule.svg')
    expect(
      preview('size')
        .at(1)
        .text()
    ).toEqual('1.06 ko')
    expect(
      preview('type')
        .at(1)
        .text()
    ).toEqual('image/svg+xml')
    expect(input().props().value).toEqual('pixel.png,molecule.svg')

    expect(close()).toHaveLength(2)

    await fileInput().simulate('focus')
    await close()
      .at(0)
      .simulate('click')
    await fileInput().simulate('blur')

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(input().props().value).toEqual('molecule.svg')

    await submit().simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith(
      {
        file: [
          {
            data: molecule,
            ext: 'svg',
            name: 'molecule',
            size: 1086,
            type: 'image/svg+xml',
          },
        ],
      },
      {
        file: [
          {
            data: pixel,
            ext: 'png',
            name: 'pixel',
            size: 67,
            type: 'image/png',
          },
          {
            data: molecule,
            ext: 'svg',
            name: 'molecule',
            size: 1086,
            type: 'image/svg+xml',
          },
        ],
      },
      ['file'],
      true
    )
    expect(input().props().value).toEqual('molecule.svg')

    wrapper.unmount()
  })
  it('respects default type accept parameter', async () => {
    window.URL.createObjectURL = () => ''
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol
        onSubmit={onSubmit}
        item={{
          file: [
            {
              data: pixel,
              ext: 'png',
              name: 'pixel',
              size: 67,
              type: 'image/png',
            },
          ],
        }}
      >
        <Field type="file">File</Field>
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
        .at(1)

    const fileInput = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    const preview = sub =>
      wrapper.find(`.Formol_FileField__preview${sub ? `-${sub}` : ''}`)

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(preview()).toHaveLength(1)
    expect(preview('name').text()).toEqual('pixel.png')
    expect(preview('size').text()).toEqual('67 o')
    expect(preview('type').text()).toEqual('image/png')
    expect(input().props().value).toEqual('pixel.png')

    await fileInput().simulate('focus')

    const blob = new File([Buffer.from(pdf, 'base64')], 'blank.pdf', {
      type: 'application/pdf',
    })
    await fileInput().simulate('change', { target: { files: [blob] } })

    await fileInput().simulate('blur')

    // Wait for upload to finish
    await forCondition(() => !submit().props().disabled, wrapper)

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(input().props().value).toEqual('blank.pdf')

    expect(wrapper.find('.Formol_Field__error-text').text()).toEqual(
      'Please select a valid file.'
    )

    expect(wrapper.getDOMNode().checkValidity()).toBeFalsy()

    expect(input().props().value).toEqual('blank.pdf')

    const close = () => wrapper.find('.Formol_FileField__close')
    await close().simulate('click')

    expect(wrapper.find('.Formol_Field__error-text')).toHaveLength(0)
    expect(input().props().value).toEqual('')

    wrapper.unmount()
  }, 30000)
  it('respects default type accept parameter', async () => {
    window.URL.createObjectURL = () => ''
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol
        onSubmit={onSubmit}
        item={{
          file: [
            {
              data: pixel,
              ext: 'png',
              name: 'pixel',
              size: 67,
              type: 'image/png',
            },
          ],
        }}
      >
        <Field type="file">File</Field>
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
        .at(1)

    const fileInput = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    const preview = sub =>
      wrapper.find(`.Formol_FileField__preview${sub ? `-${sub}` : ''}`)

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(preview()).toHaveLength(1)
    expect(preview('name').text()).toEqual('pixel.png')
    expect(preview('size').text()).toEqual('67 o')
    expect(preview('type').text()).toEqual('image/png')
    expect(input().props().value).toEqual('pixel.png')

    await fileInput().simulate('focus')

    const blob = new File([Buffer.from(pdf, 'base64')], 'blank.pdf', {
      type: 'application/pdf',
    })
    await fileInput().simulate('change', { target: { files: [blob] } })

    await fileInput().simulate('blur')

    // Wait for upload to finish
    await forCondition(() => !submit().props().disabled, wrapper)

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(input().props().value).toEqual('blank.pdf')

    expect(wrapper.find('.Formol_Field__error-text').text()).toEqual(
      'Please select a valid file.'
    )

    await cancel().simulate('click')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(input().props().value).toEqual('pixel.png')

    expect(wrapper.find('.Formol_Field__error-text')).toHaveLength(0)

    wrapper.unmount()
  }, 30000)
  it('cancels rejected files', async () => {
    window.URL.createObjectURL = () => ''
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol
        onSubmit={onSubmit}
        item={{
          file: [
            {
              data: pixel,
              ext: 'png',
              name: 'pixel',
              size: 67,
              type: 'image/png',
            },
          ],
        }}
      >
        <Field type="file" multiple>
          File
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
        .at(1)

    const fileInput = () =>
      wrapper
        .find('Field')
        .find('input')
        .first()

    const preview = sub =>
      wrapper.find(`.Formol_FileField__preview${sub ? `-${sub}` : ''}`)

    const submit = () => wrapper.find('.Formol_Formol__submit')
    const cancel = () => wrapper.find('.Formol_Formol__cancel')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(preview()).toHaveLength(1)
    expect(preview('name').text()).toEqual('pixel.png')
    expect(preview('size').text()).toEqual('67 o')
    expect(preview('type').text()).toEqual('image/png')
    expect(input().props().value).toEqual('pixel.png')

    await fileInput().simulate('focus')

    const blob = new File([Buffer.from(pdf, 'base64')], 'blank.pdf', {
      type: 'application/pdf',
    })
    await fileInput().simulate('change', { target: { files: [blob] } })

    await fileInput().simulate('blur')

    // Wait for upload to finish
    await forCondition(() => !submit().props().disabled, wrapper)

    expect(submit().props().disabled).toBeFalsy()
    expect(cancel().props().disabled).toBeFalsy()

    expect(input().props().value).toEqual('blank.pdf,pixel.png')

    expect(wrapper.find('.Formol_Field__error-text').text()).toEqual(
      'Some of your files are invalid. (blank.pdf)'
    )

    expect(wrapper.getDOMNode().checkValidity()).toBeFalsy()

    expect(input().props().value).toEqual('blank.pdf,pixel.png')

    await cancel().simulate('click')

    expect(submit().props().disabled).toBeTruthy()
    expect(cancel().props().disabled).toBeTruthy()

    expect(input().props().value).toEqual('pixel.png')

    expect(wrapper.find('.Formol_Field__error-text')).toHaveLength(0)

    wrapper.unmount()
  }, 30000)
  it('respects readOnly parameter', async () => {
    window.URL.createObjectURL = () => ''
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol
        onSubmit={onSubmit}
        item={{
          file: [
            {
              data: pixel,
              ext: 'png',
              name: 'pixel',
              size: 67,
              type: 'image/png',
            },
          ],
        }}
      >
        <Field type="file" readOnly>
          File
        </Field>
      </Formol>
    )
    const asyncWrapper = () => wrapper.find('AsyncWrapper')
    expect(asyncWrapper().text()).toEqual('Loading')
    await asyncWrapper().instance()._promise
    wrapper.update()
    expect(asyncWrapper().text()).not.toEqual('Loading')

    expect(wrapper.find('.Formol_FileField__dropzone')).toHaveLength(0)

    wrapper.unmount()
  })
  it('respects readOnly parameter when empty', async () => {
    window.URL.createObjectURL = () => ''
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Formol onSubmit={onSubmit} item={{}}>
        <Field type="file" readOnly>
          File
        </Field>
      </Formol>
    )
    const asyncWrapper = () => wrapper.find('AsyncWrapper')
    expect(asyncWrapper().text()).toEqual('Loading')
    await asyncWrapper().instance()._promise
    wrapper.update()
    expect(asyncWrapper().text()).not.toEqual('Loading')

    expect(wrapper.find('.Formol_FileField__dropzone')).toHaveLength(0)

    wrapper.unmount()
  })
})
