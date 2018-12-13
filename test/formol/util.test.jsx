import React from 'react'
import { mount } from 'enzyme'

import { noOp, readAsBase64 } from '../../src/utils'
import Async from '../../src/utils/Async'
import Preview from '../../src/utils/Preview'

describe('Preview', () => {
  it('returns nothing if type is unknown', () => {
    const wrapper = mount(<Preview data="test" ext="txt" mime="text/plain" />)
    expect(wrapper.children()).toHaveLength(0)
  })
})
describe('Async', () => {
  it('raises an error in case of module load error', async () => {
    // // Prevent console.error from cluttering the output
    jest.spyOn(console, 'error')
    global.console.error.mockImplementation(() => {})

    const BrokenAsync = Async(() => import('./unexisting/file.js'))

    const wrapper = mount(<BrokenAsync />)

    const asyncWrapper = () => wrapper.find('AsyncWrapper')
    expect(asyncWrapper().text()).toEqual('Loading')
    await asyncWrapper().instance()._promise
    wrapper.update()
    expect(asyncWrapper().text()).toEqual('Error')

    global.console.error.mockRestore()
  })
  it('does not crash on error when unmounted', async () => {
    // // Prevent console.error from cluttering the output
    jest.spyOn(console, 'error')
    global.console.error.mockImplementation(() => {})

    const BrokenAsync = Async(() => import('./unexisting/file.js'))

    const wrapper = mount(<BrokenAsync />)

    const asyncWrapper = () => wrapper.find('AsyncWrapper')
    expect(asyncWrapper().text()).toEqual('Loading')
    const promise = asyncWrapper().instance()._promise
    wrapper.unmount()
    await promise

    global.console.error.mockRestore()
  })
})

describe('readAsBase64', () => {
  it('errors on empty file', () =>
    expect(readAsBase64()).rejects.toEqual(new Error('No file was given')))
})

describe('noOp', () => {
  it('does nothing', () => expect(noOp()).toBeUndefined())
})
