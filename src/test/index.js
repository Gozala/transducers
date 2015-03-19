import test from "./test"
import * as Immutable from "immutable"
import {transduce, map, filter, remove, cat,
        mapcat, keep, take, takeWhile,
        drop, dropWhile, dropRepeats,
        partition, partitionBy, Transducer,
        reduce, Reducer} from "../../"

// utility
const first = xs => xs[0]
const second = xs => xs[1]
const inc = x => x + 1
const upperCase = char => char.toUpperCase()
const lowerCase = char => char.toLowerCase()
const add = x => y => x + y
const multiply = x => y => x * y
const stringify = json => JSON.stringify(json)
const isEven = x => !(x % 2)
const isLowerCase = char => char.toLowerCase() === char

if (!Array.from) {
  Array.from = iterator => {
    const array = []
    while (true) {
      const {value, done} = iterator.next()
      if (done) {
        return array
      } else {
        array.push(value)
      }
    }
  }
}

const reducer = f => new Reducer({
  empty() {
    return f()
  },
  step(result, input) {
    return f(result, input)
  },
  result(result) {
    return f(result)
  }
})

test("map", assert => {
  const incer = map(inc)

  assert.deepEqual(incer([1, 2, 3, 4]),
                   [2, 3, 4, 5],
                   "array elements get mapped")

  assert.deepEqual(incer(0), 1,
                   "function is applied to number")

  assert.deepEqual(incer(null), null,
                   "map over null is no op")

  assert.deepEqual(incer(void(0)), void(0),
                   "map over void is void")

  assert.equal(map(upperCase)("Hello"),
               "HELLO",
               "strings can be mapped over")

  const iterator = Immutable.Iterable({x: 1, y: 2})

  assert.deepEqual([...incer(iterator.values())],
                   [2, 3],
                   "iterable makes lazy transformation")

  assert.deepEqual([...map(upperCase)(iterator.keys())],
                   ["X", "Y"],
                   "iterable makes lazy transformation")
})

test("filter", assert => {
  const evens = filter(isEven)

  assert.deepEqual(evens([1, 2, 3, 4]), [2, 4],
                   "array elements got filtered")

  assert.deepEqual(evens([1, 3, 5, 7]), [],
                   "filtered out all elements")

  assert.deepEqual(evens(7), 0,
                   "filtered out odd number to empty number")

  assert.deepEqual(evens(6), 6,
                   "number was kept as it was even")

  assert.deepEqual(filter(_ => true)(null), null,
                   "null remains null regardless of operation")

  assert.deepEqual(filter(_ => true)(void(0)), void(0),
                   "void remains void regardless of operation")

  assert.deepEqual(filter(isLowerCase)("Hello World"), "ello orld",
                   "filters out upper case letters")

  const iterator = Immutable.Iterable({x: 1, Y: 2, z: 3})

  assert.deepEqual([...evens(iterator.values())],
                   [2],
                   "filter value iterators")

  assert.deepEqual([...filter(isLowerCase)(iterator.keys())],
                   ["x", "z"],
                   "filter key iterators")
})



test("composition", assert => {
  const incer = map(inc)
  const add2 = incer(incer)

  assert.equal(typeof(add2), "function",
               "passing transducer to transducer composes a new one")

  assert.deepEqual(add2([1, 2, 3, 4]),
                   [3, 4, 5, 6],
                   "array elements get mapped")

  assert.deepEqual(add2(0), 2,
                   "function is applied to number")

  assert.deepEqual(add2(null), null,
                   "map over null is no op")

  assert.deepEqual(add2(void(0)), void(0),
                   "map over void is void")
})

test("trasduce", assert => {
  const evens = filter(isEven)
  assert.equal(transduce([1, 2, 3, 4], evens,
                         reducer((x, y) => y === void(0) ? x : x + y),
                         0),
               6,
               "transduced array with custom reducer")

  const iterator = Immutable.Iterable({x: 1, Y: 2, z: 3, w: 4})
  assert.equal(transduce(iterator.values(), evens,
                         reducer((x, y) => y === void(0) ? x : x + y),
                         5),
               11,
              "transduce iterator with custom reducer")
})
