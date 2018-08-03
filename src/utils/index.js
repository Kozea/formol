import { blockMaker } from 'bemboo'

export const readAsBase64 = file =>
  new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file was given'))
    }
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.readAsDataURL(file)
  })

export const fileSize = size => {
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return `${(size / Math.pow(1024, i)).toFixed(2) * 1} ${
    ['o', 'ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'][i]
  }`
}
export const nameExt = name => name.match(/(.+?)(?:\.([^.]+))?$/).slice(1, 3)

export const block = blockMaker({ namespace: 'Formol_' })
