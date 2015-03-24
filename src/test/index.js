import test from "./test"
import * as Immutable from "immutable"
import {reduce, transduce, map, filter, remove, cat,
        mapcat, partition, take, takeWhile,
        drop, dropWhile, dropRepeats} from "../../"

// utility
const inc = x => x + 1
const upperCase = char => char.toUpperCase()
const lowerCase = char => char.toLowerCase()
const add = x => y => x + y
const multiply = x => y => x * y
const stringify = json => JSON.stringify(json)
const isEven = x => !(x % 2)
const isLowerCase = char => char.toLowerCase() === char
const lessThan = x => y => y < x
const constant = x => _ => x
const identity = x => x

const True = constant(true)
const False = constant(false)

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

  assert.deepEqual(map(identity)([[1, 2], [3, 4]]),
                   [[1, 2], [3, 4]],
                   "map does not expands")
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

  assert.deepEqual(filter(True)(null), null,
                   "null remains null regardless of operation")

  assert.deepEqual(filter(False)(void(0)), void(0),
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



test("remove", assert => {
  const odds = remove(isEven)
  const upperCaseChars = remove(isLowerCase)

  assert.deepEqual(odds([1, 2, 3, 4]),
                   [1, 3],
                   "evens were removed")

  assert.deepEqual(remove(True)(null),
                   null,
                   "transducing null return null")

  assert.deepEqual(remove(False)(null),
                   null,
                   "transducing null return null")

  assert.deepEqual(remove(True)(void(0)),
                   void(0),
                   "transducing void return void")

  assert.deepEqual(remove(False)(void(0)),
                   void(0),
                   "transducing void return void")

  assert.deepEqual(remove(x => x > 0)(7),
                   0,
                   "removing matching number returns 0")

  assert.deepEqual(remove(x => x < 0)(7),
                   7,
                   "removing unmatched number returns number")

  assert.deepEqual(upperCaseChars("Hello World"),
                   "HW",
                   "removes lower case chars")

  assert.deepEqual(upperCaseChars("what?"),
                   "",
                   "removes all chars")

  const iterator = Immutable.Iterable({x: 1, Y: 2, z: 3})

  assert.deepEqual([...odds(iterator.values())],
                   [1, 3],
                   "removes from iterator")
})

test("drop", assert => {
  assert.deepEqual(drop(2)([1, 2, 3, 4, 5]),
                   [3, 4, 5],
                   "dropped two items")

  assert.deepEqual(drop(9)([1, 2, 3, 4]),
                   [],
                   "dropes all items")

  assert.deepEqual(drop(7)([]),
                   [],
                   "nothing to drop")

  assert.deepEqual(drop(0)([1, 2, 3, 4]),
                   [1, 2, 3, 4],
                   "no need to drop")

  assert.deepEqual(drop(-7)([1, 2, 3]),
                   [1, 2, 3],
                   "no need to drop")

  assert.deepEqual(drop(0)(1),
                   1,
                   "number was not dropped")
  assert.deepEqual(drop(5)(8),
                   0,
                   "number was reset to 0")

  assert.deepEqual(drop(3)("hello"),
                   "lo",
                   "three characters were dropped")

  assert.deepEqual(drop(9)("hello"),
                   "",
                   "dropped all chars")

  assert.deepEqual(drop(8)(""),
                   "",
                   "nothing to drop")

  assert.deepEqual(drop(9)(null),
                   null)

  assert.deepEqual(drop(0)(null),
                   null)

  assert.deepEqual(drop(8)(void(0)),
                   void(0))

  assert.deepEqual(drop(0)(void(0)),
                   void(0))


  const iterator = Immutable.Iterable({x: 1, y: 2})

  assert.deepEqual([...drop(0)(iterator.values())],
                   [1, 2],
                   "0 drops")

  assert.deepEqual([...drop(1)(iterator.values())],
                   [2],
                   "dropped first")

  assert.deepEqual([...drop(8)(iterator.values())],
                   [],
                   "dropped all")
})

test("dropWhile", assert => {
  assert.deepEqual(dropWhile(lessThan(9))([1, 8, 12, 9, 45]),
                   [12, 9, 45])

  assert.deepEqual(dropWhile(lessThan(9))([10, 9, 8, 7]),
                   [10, 9, 8, 7])

  assert.deepEqual(dropWhile(lessThan(9))([1, 2, 3]),
                   [])

  assert.deepEqual(dropWhile(lessThan(9))([]),
                   [])

  assert.deepEqual(dropWhile(False)(5), 5)
  assert.deepEqual(dropWhile(True)(5), 0)


  assert.deepEqual(dropWhile(True)(null), null)
  assert.deepEqual(dropWhile(False)(null), null)


  assert.deepEqual(dropWhile(True)(void(0)), void(0))
  assert.deepEqual(takeWhile(False)(void(0)), void(0))

  assert.deepEqual(dropWhile(isLowerCase)("never mind You"),
                   "You")
  assert.deepEqual(dropWhile(isLowerCase)("Hi there"),
                   "Hi there")
  assert.deepEqual(dropWhile(True)(""), "")
  assert.deepEqual(dropWhile(False)(""), "")

  const iterator = Immutable.Iterable({x: 0, y: 5, z: 10})

  assert.deepEqual([...dropWhile(lessThan(7))(iterator.values())],
                   [10])

  assert.deepEqual([...dropWhile(lessThan(0))(iterator.values())],
                   [0, 5, 10])

  assert.deepEqual([...dropWhile(lessThan(99))(iterator.values())],
                   [])
})

test("dropRepeats", assert => {
  assert.deepEqual(dropRepeats([1, 2, 3, 3, 4, 3]),
                   [1, 2, 3, 4, 3],
                   "removed repeated elements")

  assert.deepEqual(dropRepeats([1, 1, 1, 1, 1]),
                   [1],
                   "keeps just one")

  assert.deepEqual(dropRepeats(1),
                   1,
                   "number has no repeats")

  assert.deepEqual(dropRepeats(null),
                   null,
                   "null transfromed is null")

  assert.deepEqual(dropRepeats(void(0)),
                   void(0),
                   "void transfromed is void")

  assert.deepEqual(dropRepeats("what"),
                   "what",
                   "nothing to drop")

  assert.deepEqual(dropRepeats("hello"),
                   "helo",
                   "dropes repeated chars")

  const iterator = Immutable.Iterable({x: 1, Y: 2, z: 2})

  assert.deepEqual([...dropRepeats(iterator.values())],
                   [1, 2],
                   "removes repeats form iterator")
})

test("take", assert => {
  assert.deepEqual(take(2)([1, 2, 3, 4, 5]),
                   [1, 2],
                   "took two")

  assert.deepEqual(take(9)([1, 2, 3, 4]),
                   [1, 2, 3, 4],
                   "took all")

  assert.deepEqual(take(7)([]),
                   [],
                   "nothing to take")

  assert.deepEqual(take(0)([1, 2, 3, 4]),
                   [],
                   "took 0")

  assert.deepEqual(take(-7)([1, 2, 3]),
                   [],
                   "took none")

  assert.deepEqual(take(0)(1), 0)
  assert.deepEqual(take(5)(8), 8)

  assert.deepEqual(take(3)("hello"), "hel")

  assert.deepEqual(take(9)("hello"), "hello")

  assert.deepEqual(take(8)(""), "")

  assert.deepEqual(take(9)(null), null)

  assert.deepEqual(take(0)(null), null)

  assert.deepEqual(take(8)(void(0)), void(0))

  assert.deepEqual(drop(0)(void(0)), void(0))


  const iterator = Immutable.Iterable({x: 1, y: 2})

  assert.deepEqual([...take(9)(iterator.values())],
                   [1, 2])

  assert.deepEqual([...take(1)(iterator.values())],
                   [1],
                   "took first")

  assert.deepEqual([...take(0)(iterator.values())],
                   [],
                   "took none")
})

test("takeWhile", assert => {
  const digits = takeWhile(lessThan(10))

  assert.deepEqual(digits([1, 8, 12, 9, 45]),
                   [1, 8],
                   "takes only digits")

  assert.deepEqual(digits([10, 9, 8, 7]),
                   [],
                   "takes none")

  assert.deepEqual(digits(5),
                   5,
                   "take matching number")

  assert.deepEqual(digits(97),
                   0,
                   "returns 0 on unmatched number")

  assert.deepEqual(takeWhile(True)(null),
                   null,
                   "return null")

  assert.deepEqual(takeWhile(False)(null),
                   null,
                   "returns null")


  assert.deepEqual(takeWhile(True)(void(0)),
                   void(0),
                   "return void")

  assert.deepEqual(takeWhile(False)(void(0)),
                   void(0),
                   "return void")

  assert.deepEqual(takeWhile(isLowerCase)("never mind You"),
                   "never mind ",
                   "takes until upper case")

  assert.deepEqual(takeWhile(isLowerCase)("Hi there"),
                   "",
                   "blank string")

  const iterator = Immutable.Iterable({x: 0, y: 5, z: 10})

  assert.deepEqual([...takeWhile(lessThan(7))(iterator.values())],
                   [0, 5],
                   "removes repeats form iterator")
})

test("partition", assert => {
  assert.deepEqual(partition(2)([1, 2, 3, 4, 5, 6, 7, 8]),
                   [[1, 2], [3, 4], [5, 6], [7, 8]])

  assert.deepEqual(partition(3)([1, 2, 3, 4, 5, 6, 7, 8]),
                   [[1, 2, 3], [4, 5, 6], [7, 8]])

  assert.deepEqual(partition(4)([1, 2]),[[1, 2]])

  assert.deepEqual(partition(3)([]), [])

  assert.deepEqual(partition(3)(9), 9)
  assert.deepEqual(partition(2)("hello"), "hello")

  assert.deepEqual(partition(2)(null), null)
  assert.deepEqual(partition(2)(void(0)), void(0))

  const iterator = Immutable.Iterable({x: 0, y: 5, z: 10})

  assert.deepEqual([...partition(2)(iterator.values())],
                   [[0, 5], [10]])
})

// TODO:!
test("partitionBy", assert => {
})

test("cat", assert => {
  assert.deepEqual(cat([[1, 2], [3], [4, 5]]),
                   [1, 2, 3, 4, 5])

  assert.deepEqual(cat([]), [])
  assert.deepEqual(cat([1, 2, 3]), [1, 2, 3])
  assert.deepEqual(cat(null), null)
  assert.deepEqual(cat(void(0)), void(0))
  assert.deepEqual(cat(4), 4)
  assert.deepEqual(cat("hello"), "hello")

  const valueIter = Immutable.Iterable([0, 5, 10]).values()

  assert.deepEqual([...cat(valueIter)],
                   [0, 5, 10])

  const arrayIter = Immutable.Iterable([[1, 2], [3], [4, 5, 6]]).values()
  assert.deepEqual([...cat(arrayIter)],
                   [1, 2, 3, 4, 5, 6])
})

test("mapcat", assert => {
  assert.deepEqual((map(x => x.split("/")))
                   (cat)
                   (["path/to", "dir/file"]),
                   ["path", "to", "dir", "file"])
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

  assert.deepEqual((filter(isEven))
                   (map(inc))
                   ([1, 4, 9, 10]),
                   [5, 11])
})


test("trasduce", assert => {
  const evens = filter(isEven)
  assert.equal(transduce(evens,
                         (x, y) => y === void(0) ? x : x + y,
                         2,
                         [1, 2, 3, 4]),
               8,
               "transduced array with custom reducer")

  assert.equal(transduce(evens,
                         (x, y) => x === void(0) ? 0 :
                                   y === void(0) ? x :
                                   x + y,
                         [1, 2, 3, 4]),
               6,
               "transduced without initial value")


  const iterator = Immutable.Iterable({x: 1, Y: 2, z: 3, w: 4})
  assert.equal(transduce(evens,
                         (x, y) => y === void(0) ? x : x + y,
                         5,
                         iterator.values()),
               11,
              "transduce iterator with custom reducer")
})
