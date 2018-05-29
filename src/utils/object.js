export const nullishToEmptyString = v => (v === null || v === void 0 ? '' : v)

export const emptyStringToNull = v => (v === '' ? null : v)

// Get a sub object value (ie. obj['a.b.0.key'])
export const get = (data, key) =>
  nullishToEmptyString(
    key.split('.').reduce((pointer, part) => pointer && pointer[part], data)
  )

// Set a sub object value (ie. obj['a.b.0.key'] = val)
export const set = (data, key, value) =>
  (key
    .split('.')
    .slice(0, -1)
    .reduce(
      (pointer, part, i) =>
        pointer[part] === void 0
          ? (pointer[part] = isNaN(key.split('.')[i + 1]) ? {} : [])
          : pointer[part],
      data
    )[key.split('.').slice(-1)[0]] = emptyStringToNull(value))

export const copy = (o, elements) =>
  Object.keys(elements).reduce((copied, key) => {
    set(copied, key, get(o, key))
    return copied
  }, {})

export const insert = (transientItem, name, value, elements) => {
  const o = copy(transientItem, elements)
  set(o, name, value)
  return o
}

export const diff = (newItem, oldItem, elements) =>
  Object.keys(elements).reduce((o, key) => {
    if (get(newItem, key) !== get(oldItem, key)) {
      set(o, key, get(newItem, key))
    }
    return o
  }, {})

export const isModified = (newItem, oldItem, elements) =>
  !!Object.keys(diff(newItem, oldItem, elements)).length
