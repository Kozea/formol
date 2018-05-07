import { blockMaker } from 'bemboo'

export const readAsBase64 = file =>
  new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file was given'))
    }
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = e => reject(e)
    reader.readAsDataURL(file)
  })

export const fileSize = size => {
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return `${(size / Math.pow(1024, i)).toFixed(2) * 1} ${
    ['o', 'ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'][i]
  }`
}
export const nameExt = name => name.match(/(.+?)(?:\.([^.]+))?$/).slice(1, 3)

export const staticUrl = (path, hasStatic) =>
  encodeURI(`${hasStatic ? '/' : '/static/'}${path}`)

export const moneyFormat = price =>
  Intl.NumberFormat('fr', { style: 'currency', currency: 'EUR' }).format(
    price / 100
  )

export const block = blockMaker({ namespace: 'Formol_' })

export const normalizeChoices = ({ choices, choiceGetter }) =>
  Object.entries(
    choices && choices.objects && !choices.loading
      ? choices.objects.map(choiceGetter)
      : choices || {}
  )

// eslint-disable-next-line no-unused-vars
export const cleanProps = ({ choices, asyncChoices, ...props }) => props

export const focusNext = (e, name, type, refs, handleSubmit) => {
  // This is not registered on most external fields
  if (e.keyCode === 13 && (e.ctrlKey || type !== 'area')) {
    const fieldRefs = Object.keys(refs)
    const current = fieldRefs.indexOf(name)
    const step = e.shiftKey ? -1 : 1
    const nextName = fieldRefs[current + step % fieldRefs.length]
    if (nextName === 'submit') {
      handleSubmit(e)
      return
    }
    const next = refs[nextName]
    if (next.focus) {
      next.focus()
      e.preventDefault()
      return
    }
    console.error(
      'No focusable/submitable field found for',
      name,
      'next was',
      nextName,
      next
    )
  }
}
