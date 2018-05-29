import { get, set } from '../src/utils/object'

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
