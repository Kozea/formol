import deepEqual from 'deep-equal'

export const nullishToEmptyString = v => (v === null || v === void 0 ? '' : v)

export const emptyStringToNull = v => (v === '' ? null : v)

// Return true if object has no keys
export const isEmpty = m => !Object.keys(m).length

// Return true if the argument is a mapping (object)
export const isMapping = m =>
  m && typeof m === 'object' && !(m instanceof Array)

// Add missing keys to object
export const withKeys = (o, keys) =>
  keys.reduce((p, k) => ({ ...p, [k]: void 0 }), o)

// Make an object from a list of key value pairs
export const entriesToObj = entries =>
  entries.reduce((o, [k, v]) => ({ ...o, [k]: v }), {})

// Recursively call map on all object entries and subentries
export const mapValuesRec = (o, map) =>
  entriesToObj(
    Object.entries(o).map(([k, v]) => [
      k,
      isMapping(v) ? mapValuesRec(v, map) : map(v),
    ])
  )

// Recursively set all undefined values to null
export const nullVoidValuesRec = o =>
  mapValuesRec(o, v => (v === void 0 ? null : v))

// Add all missing keys to o that are in source
export const alignKeysRec = (o, source) =>
  entriesToObj(
    Object.keys({ ...o, ...source }).map(k => [
      k,
      isMapping(source[k]) ? alignKeysRec(o[k] || {}, source[k]) : o[k],
    ])
  )

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

// Clone recursively object with json
export const clone = o => o && JSON.parse(JSON.stringify(o))

// If path points to key remove path point otherwise remove
const popKey = (paths, key) =>
  paths
    .map(path => {
      if (!path && !path.includes('.')) {
        return null
      }
      const parts = path.split('.')
      if (parts[0] !== key) {
        return null
      }
      return parts.slice(1).join('.')
    })
    .filter(path => path)

// Return the diff between objects in two arrays
const diffArray = (mew, old, noRecursiveKeys) =>
  mew.map(
    (v, i) =>
      isMapping(v)
        ? diffObject(
            v,
            isMapping(old[i]) ? old[i] : {},
            popKey(noRecursiveKeys, i.toString())
          )
        : v
  )

// Return the diff between two objects (useful to generate PATCH)
export const diffObject = (mew, old, noRecursiveKeys = []) =>
  Object.keys(mew).reduce((diff, key) => {
    if (!deepEqual(mew[key], old[key])) {
      if (noRecursiveKeys && noRecursiveKeys.includes(key)) {
        diff[key] = mew[key]
      } else if (isMapping(mew[key]) && isMapping(old[key])) {
        diff[key] = diffObject(mew[key], old[key], popKey(noRecursiveKeys, key))
      } else if (mew[key] instanceof Array && old[key] instanceof Array) {
        diff[key] = diffArray(mew[key], old[key], popKey(noRecursiveKeys, key))
      } else {
        diff[key] = mew[key]
      }
    }
    return diff
  }, {})
