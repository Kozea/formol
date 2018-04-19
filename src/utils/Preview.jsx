import './Preview.sass'

import React from 'react'

import { block } from './'

const b = block('Preview')

export default function Preview({ src, data, ext, mime }) {
  if (!data && !src) {
    return null
  }
  if (mime) {
    if (mime === 'image/svg+xml') {
      ext = 'svg'
    } else {
      ;[, ext] = mime.split('/')
    }
  }
  if (data && !data.startsWith('blob') && !data.startsWith('data')) {
    if (!mime) {
      if (ext === 'svg') {
        mime = 'image/svg+xml'
      } else if (ext === 'pdf') {
        mime = 'application/pdf'
      } else {
        mime = `image/${ext}`
      }
    }
    data = `data:${mime};base64,${data}`
  }
  if (!data) {
    data = src
  }
  const type = ext.toLowerCase()
  if (['pdf', 'svg'].includes(type)) {
    return <object data={data} className={b.m({ type: 'pdf' })} />
  }
  if (['jpg', 'jpeg', 'png', 'gif', 'tiff'].includes(type)) {
    return <img src={data} className={b.m({ type: 'image' })} alt={ext} />
  }
  return null
}
