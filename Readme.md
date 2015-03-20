# Transducers [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Gitter][gitter-image]][gitter-url]
=========

[![Browser support](https://ci.testling.com/Gozala/transducers.png)](http://ci.testling.com/Gozala/transducers)

Library provides composable algorithmic transformations that are independent
from the context of their input and output sources and specify only the essence
of the transformation. In other words transducers are not coupled with a data
they are operating & there for can operate on built-in JS types like arrays,
strings, numbers, iterators as well as they could on custom types like [Immutable.js][]
data structures, [RxJS][] Observables, [CSP Channels][] or whatever else you
may decide to use them for.


Following resources provide an excelent introduction to Transducers idea that this
this library imlements.

* ["Transducers are coming" announce blog post](http://blog.cognitect.com/blog/2014/8/6/transducers-are-coming)
* [Rich Hickey's Transducers StrangeLoop presentation](https://www.youtube.com/watch?v=6mTbuzafcII)

## API

### transducers

#### map(f)

Applies `f` onto each item of the input data structure.

```js
const {map} = require("transducers")
const inc = map(x => x + 1)

inc([2, 3, 4]) // => [3, 4, 5]
```


#### filter(p)

Keeps only items from input on which `p(item)` returned logical `true`.

```js
const {filter} = require("transducers")
const isEven = x => !(x % 2)

filter(isEven)([1, 2, 3, 4]) // => [2, 4]
```

#### remove(p)

Removes items from input on with `p(item)` returned logical `true`.

```js
const {remove} = require("transducers")
const isEven = x => !(x % 2)

remove(isEven)([1, 2, 3, 4]) // => [1, 3]
```

#### drop(n)

Drops first `n` number of items from the input.

```js
const {drop} = require("transducers")

drop(2)([1, 2, 3, 4]) // => [3, 4]
```

#### dropWhile(p)

Drops items from the input while `p(item)` is logical `true`. Note that once
`p(item)` returns logical `false` `p` is no longer applied to items.

```js
const {dropWhile} = require("transdures")

dropWhile(x => x < 5)([1, 3, 7, 4, 9]) // => [7, 4, 9]
```

#### dropRepeats

Drops duplicate items form the input (equality compared with ===).

```js
const {dropRepeats} = require("transducers")

dropRepeats([1, 2, 2, 2, 3, 3, 4]) // => [1, 2, 3, 4]
```

#### take(n)

Takes first `n` number of items from the input.

```js
const {take} = require("transducers")

take(3)([1, 2, 3, 4, 5]) // => [1, 2, 3]
```

#### takeWhile(p)

Takes items as long as `p(item)` returns logical `true`. Note than once
`p(item)` returns logical `false` `p` is no longer applied to items.

```js
const {takeWhile} = require("transducers")

takeWhile(x => x < 5)([1, 4, 6, 5, 3]) // => [1, 4]
```

#### partition(n)

Collects inputs into arrays of size `n`. In case there are not enough padding
items, last partition will have less than `n` items.

```js
const {partition} = require("transducers")

partition(3)([0, 1, 2, 3, 4, 5]) // => [[0, 1, 2], [3, 4, 5]]
partition(3)([0, 1, 2, 3]) // => [[0, 1, 2], [3]]
```

#### cat

Concatenates items of the input. Assumes that items are collections.

```js
const {cat} = require("transducers")

cat([[1, 2, 3], [4], [5, 6]]) // => [1, 2, 3, 4, 5, 6]
```

### composition

If `map` is passed a transducer produces composed transducer:

```js
(filter(isEven))
(map(inc))
([1, 4, 9, 10]) // => [5, 11]
```

#### mapcat

In fact library does not expose `mapcat` as it's pretty much made obsolete
by a composition API.

```js
map(x => x.split("/"))(cat)(["path/to", "dir/file"]) // => ["path", "to", "dir", "file"]
```

## Different implementation

There are other two known implementations of [Transducers][] in JS:

- [transducers-js]
- [transducers.js]

In fact this library initially started as an attempt to enhance API of
[transducers.js][] and of a general idea, which also lead it to it's own
path.

The core difference from both of the libraries is in the way transducers
are composed or applied to input. In that regard it actually has more in
common with [fab.js][] than transducers.


#### transducer application

In above mentioned libraries transducer application happens through other
functions like [into][], [reduce][] & [transduce][] & expectation is that
data type constructors can take transducer to create transduced version
of it. In contrast this library does not provide [into][] and considers both
[reduce][] and [transduce][] to be to low lever for cases where transformation
of a data type to the same type of data type is desired. Instead in this libray
transducer functions can take input as an argument and return transformed version
of it:

```js
const inc = x => x + 1
map(inc)([1, 2, 3]) // => [2, 3, 4]
map(char => char.toUpperCase())("hello") // => "HELLO"
```

### transducers can be applied to primitives

In this library transdures can also apply to primitives values like numbers
just as well as they can to collections:

```js
map(inc)(5) // => 6
```

Also transductin over nil types values like `null` and `undefined` is no op and
return same output as input:

```js
map(inc)(null) // => null
map(_ => 5)(null) // => null
```

#### transducer composition

Transducers in all of the libraries (including this one) can be composed with
as a plain function composition that you know or at least have seen in [underscore.js][http://underscorejs.org/#compose].
Idea is simple composing `f()` and `g()` functions produces `f(g())`.

```js
_.compose(x => x + 1, x => x * 2)(2) // => 5
```

Although in case of transducers there is a surprising twist related to their implementation
that is illustrated in the example below:

```js
_.compose(map(x => x + 1), map(x => x * 2))([2]) // => [6]

```

Unlike right to left execution in ordinary function composition execution order
in transducers is from left to right. In order to avoid confusion this library
embraced API demonstrated by [fab.js][] while back:


```js
(map(x => x + 1))
(map(x => x * 2))
([2, 3]) // => [6, 8]
```

Execution is from top to bottom & no extra functions are need to compose them.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/transducers
[npm-image]: https://img.shields.io/npm/v/transducers.svg?style=flat

[travis-url]: https://travis-ci.org/Gozala/transducers
[travis-image]: https://img.shields.io/travis/Gozala/transducers.svg?style=flat

[gitter-url]: https://gitter.im/Gozala/transducers?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[gitter-image]: https://badges.gitter.im/Join%20Chat.svg


[clojure transducers]:http://blog.cognitect.com/blog/2014/8/6/transducers-are-coming
[transducers.js]:http://jlongster.com/Transducers.js--A-JavaScript-Library-for-Transformation-of-Data
[Immutable.js]:http://facebook.github.io/immutable-js/docs/#/Record
[CSP Channels]:https://github.com/gozala/channel
[RxJS]:https://github.com/Reactive-Extensions/RxJS
[transducers-js]:https://github.com/cognitect-labs/transducers-js
[transducers.js]:https://github.com/jlongster/transducers.js
[fab.js](https://www.youtube.com/watch?v=ViQ8kiLtDXc)
[into](http://cognitect-labs.github.io/transducers-js/classes/transducers.html#methods_transducers.into)
[reduce](http://cognitect-labs.github.io/transducers-js/classes/transducers.html#methods_transducers.reduce)
[transduce](http://cognitect-labs.github.io/transducers-js/classes/transducers.html#methods_transducers.transduce)
