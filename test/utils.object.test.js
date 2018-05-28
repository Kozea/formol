import {
  alignKeysRec,
  diffObject,
  entriesToObj,
  get,
  mapValuesRec,
  set,
} from '../src/utils/object'

it('Converts entries to object', () => {
  expect(entriesToObj([['a', 1], ['b', 2]])).toEqual({ a: 1, b: 2 })
  expect(entriesToObj([])).toEqual({})
})

it('Maps values in object recursively', () => {
  expect(
    mapValuesRec(
      {
        a: 1,
        b: 2,
        c: {
          d: 3,
          e: {
            f: 4,
            g: null,
          },
        },
        h: 5,
        i: void 0,
        j: '',
      },
      v => (typeof v === 'number' ? v * 11 : 'void')
    )
  ).toEqual({
    a: 11,
    b: 22,
    c: {
      d: 33,
      e: {
        f: 44,
        g: 'void',
      },
    },
    h: 55,
    i: 'void',
    j: 'void',
  })
})

it('Aligns keys recursively', () => {
  expect(
    alignKeysRec(
      {
        a: 1,
        g: {
          h: 2,
        },
        i: {
          j: 3,
        },
      },
      {
        a: 2,
        b: 8,
        c: {
          d: void 0,
          e: {
            f: 2,
          },
        },
        i: {
          k: null,
        },
      }
    )
  ).toEqual({
    a: 1,
    b: void 0,
    c: {
      d: void 0,
      e: {
        f: void 0,
      },
    },
    g: {
      h: 2,
    },
    i: {
      j: 3,
      k: void 0,
    },
  })
})

it('Gets it', () => {
  const o = {
    a: 1,
    b: 2,
    c: {
      d: 3,
      e: {
        f: 4,
      },
      g: [{ h: 5 }, { i: { j: 6 }, k: 7 }, 8],
    },
  }
  expect(get(o, 'a')).toEqual(1)
  expect(get(o, 'c.d')).toEqual(3)
  expect(get(o, 'c.e.f')).toEqual(4)
  expect(get(o, 'c.g.0')).toEqual({ h: 5 })
  expect(get(o, 'c.g.0.h')).toEqual(5)
  expect(get(o, 'c.g.1.i.j')).toEqual(6)
  expect(get(o, 'c.g.2')).toEqual(8)
})

it('Sets it when existing', () => {
  const getO = () => ({
    a: 1,
    b: 2,
    c: {
      d: 3,
      e: {
        f: 4,
      },
      g: [{ h: 5 }, { i: { j: 6 }, k: 7 }, 8],
    },
  })
  let o = getO()
  set(o, 'a', 11)
  expect(o).toEqual({
    a: 11,
    b: 2,
    c: {
      d: 3,
      e: {
        f: 4,
      },
      g: [{ h: 5 }, { i: { j: 6 }, k: 7 }, 8],
    },
  })
  o = getO()
  set(o, 'c.d', 33)
  expect(o).toEqual({
    a: 1,
    b: 2,
    c: {
      d: 33,
      e: {
        f: 4,
      },
      g: [{ h: 5 }, { i: { j: 6 }, k: 7 }, 8],
    },
  })
  o = getO()
  set(o, 'c.e.f', 44)
  expect(o).toEqual({
    a: 1,
    b: 2,
    c: {
      d: 3,
      e: {
        f: 44,
      },
      g: [{ h: 5 }, { i: { j: 6 }, k: 7 }, 8],
    },
  })
  o = getO()
  set(o, 'c.g.0.h', 55)
  expect(o).toEqual({
    a: 1,
    b: 2,
    c: {
      d: 3,
      e: {
        f: 4,
      },
      g: [{ h: 55 }, { i: { j: 6 }, k: 7 }, 8],
    },
  })
  o = getO()
  set(o, 'c.g.1.i.j', 66)
  expect(o).toEqual({
    a: 1,
    b: 2,
    c: {
      d: 3,
      e: {
        f: 4,
      },
      g: [{ h: 5 }, { i: { j: 66 }, k: 7 }, 8],
    },
  })
  o = getO()
  set(o, 'c.g.2', 88)
  expect(o).toEqual({
    a: 1,
    b: 2,
    c: {
      d: 3,
      e: {
        f: 4,
      },
      g: [{ h: 5 }, { i: { j: 6 }, k: 7 }, 88],
    },
  })
})

it('Sets it when absent', () => {
  const getO = () => ({})
  let o = getO()
  set(o, 'a', 11)
  expect(o).toEqual({
    a: 11,
  })
  o = getO()
  set(o, 'c.d', 33)
  expect(o).toEqual({
    c: {
      d: 33,
    },
  })
  o = getO()
  set(o, 'c.e.f', 44)
  expect(o).toEqual({
    c: {
      e: {
        f: 44,
      },
    },
  })
  o = getO()
  set(o, 'c.g.0.h', 55)
  expect(o).toEqual({
    c: {
      g: [{ h: 55 }],
    },
  })
  o = getO()
  set(o, 'c.g.1.i.j', 66)
  expect(o).toEqual({
    c: {
      g: [void 0, { i: { j: 66 } }],
    },
  })
  o = getO()
  set(o, 'c.g.2', 88)
  expect(o).toEqual({
    c: {
      g: [void 0, void 0, 88],
    },
  })
})

it('Diff objects', () => {
  expect(
    diffObject(
      {
        a: 1,
        b: 2,
      },
      {
        a: 2,
        b: 2,
        c: 3,
      }
    )
  ).toEqual({ a: 1 })

  expect(
    diffObject(
      {
        a: 2,
        b: 2,
        c: 3,
      },
      {
        a: 1,
        b: 2,
      }
    )
  ).toEqual({ a: 2, c: 3 })

  expect(
    diffObject(
      {
        a: 2,
        b: { c: 3, d: 5 },
      },
      {
        a: 1,
        b: { c: 3, d: 4 },
      }
    )
  ).toEqual({ a: 2, b: { d: 5 } })

  expect(
    diffObject(
      {
        a: 2,
        b: [1, 2],
      },
      {
        a: 1,
        b: [1, 2],
      }
    )
  ).toEqual({ a: 2 })

  expect(
    diffObject(
      {
        a: 2,
        b: [1, 3],
      },
      {
        a: 1,
        b: [1, 2],
      }
    )
  ).toEqual({ a: 2, b: [1, 3] })

  expect(
    diffObject(
      {
        a: 2,
        b: [{ c: 4, d: 5 }],
      },
      {
        a: 1,
        b: [{ c: 3, d: 5 }],
      }
    )
  ).toEqual({ a: 2, b: [{ c: 4 }] })

  expect(
    diffObject(
      {
        a: 2,
        b: [{ c: 4, d: 5 }, 3, { e: 9, f: 3 }, 4],
      },
      {
        a: 1,
        b: [{ c: 3, d: 5 }, 3, { e: 9, f: 8 }],
      }
    )
  ).toEqual({ a: 2, b: [{ c: 4 }, 3, { f: 3 }, 4] })
})
