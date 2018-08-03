import React from 'react'

import { block } from './'

const b = block('Preview')

export default function Preview({ data, ext, mime }) {
  if (mime === 'image/svg+xml') {
    ext = 'svg'
  } else {
    ;[, ext] = mime.split('/')
  }
  data = `data:${mime};base64,${data}`
  const type = ext.toLowerCase()
  if (['pdf', 'svg'].includes(type)) {
    return <object data={data} className={b.m({ type: 'pdf' })} />
  }
  if (['jpg', 'jpeg', 'png', 'gif', 'tiff'].includes(type)) {
    return <img src={data} className={b.m({ type: 'image' })} alt={ext} />
  }
  return null
}
