const isSymbolDefined = typeof(Symbol) !== 'undefined';
const symbol = (isSymbolDefined && Symbol.for) || hint => `@@${hint}`

const $iterator = isSymbolDefined && Symbol.iterator || symbol('iterator')



export const methodOf = (target, id) => {
  let method = target && target[id]
  if (!method) {
    const type = typeof(target)
    method = target === null ? NullType.prototype[id] :
    target === void(0) ? UndefinedType.prototype[id] :
    type === 'string' ? StringType.prototype[id] :
    type === 'number' ? NumberType.prototype[id] :
    type === 'boolean' ? BooleanType.prototype[id] :
    type === 'symbol' ? SymbolType.prototype[id] :
    isArray(target) ? ArrayType.prototype[id] :
    isIterator(target) ? IteratorType.prototype[id] :
    isRegExp(target) ? RegExpType.prototype[id] :
    type === 'function' ? FunctionType.prototype[id] :
    type === 'object' ? ObjectType.prototype[id] :
    DefaultType.prototype[id]
  }
  return method
}

const dispatcher = (name, index=0) => {
  const id = symbol(name)
  const dispatch = (a, b, c, d, e) => {
    const target = index === 0 ? a :
                   index === 1 ? b :
                   index === 2 ? c :
                   index === 3 ? d :
                   e;
    const method = methodOf(target, id)

    if (!method) {
      throw TypeError(`target does not implements ${id} method`)
    }

    return method.call(target, a, b, c, d, e)
  }
  dispatch.symbol = id
  return dispatch
}

export const init = dispatcher("transducer/init")
const $init = init.symbol

export const result = dispatcher("transducer/result")
const $result = result.symbol

export const step = dispatcher("transducer/step")
const $step = step.symbol

export const reduce = dispatcher("transducer/reduce", 2)
const $reduce = reduce.symbol

export const reduced = value => new Reduced(value)
const $reduced = reduced.symbol = symbol("transducer/reduced")

export const value = reduced => reduced[$value]
const $value = value.symbol = symbol("transducer/value")

export const transformer = transform => {
  transform[$transformer] = true
  return transformer
}
const $transformer = transformer.symbol = symbol("transducer/transformer")

// Functional composition compose(f, g) => f(g())
const compose = (f, g) => (...args) => f(g(...args))


const prototype = Object.prototype

// Returns `true` if given `x` is a JS array.
export const isArray = Array.isArray ||
  x => prototype.toString.call(x) === '[object Array]'

// Returns `true` if given `x` is a regular expression.
export const isRegExp = x =>
  prototype.toString.call(x) === '[object RegExp]'

// Returns `true` if given `x` is a JS iterator.
export const isIterator = x =>
  x && (x[$iterator] || typeof(x.next) === 'function')

// Returns true if `x` is boxed value & signifies that
// reduction is complete.
export const isReduced = x =>
  x instanceof Reduced || (x && x[$reduced])

export const isReducible = x =>
  x && methodOf(x, $reduce)

export const isReducer = x =>
  x instanceof Reducer || methodOf(x, $step)

export const isTransformer = x =>
  x && x[$transformer]

// Class is used to box result of reduction step in order
// to signal chained transducer that reduction has completed.
export class Reduced {
  constructor(value) {
    this[$reduced] = true
    this[$value] = value

    // Compatibility with other libs:
    // https://github.com/cognitect-labs/transducers-js
    // https://github.com/jlongster/transducers.js
    this.__transducers_reduced__ = true
    this.value = value
  }
}
Reduced.symbol = $reduced


export class Reducer {
  constructor({init, step, result}) {
    this[$init] = init || this[$init]
    this[$step] = step || this[$step]
    this[$result] = result || this[$result]
  }
  [$init]() {
    throw TypeError('Reducer must implement [Symbol.for("transducer/init")]')
  }
  [$step](result, input) {
    throw TypeError('Reducer must implement [Symbol.for("transducer/step")]')
  }
  [$result](result) {
    throw TypeError('Reducer must implement [Symbol.for("transducer/result")]')
  }
}

export class Producer extends Reducer {
  constructor(source) {
    this[$init] = methodOf(source, $init)
    this[$step] = methodOf(source, $step)
    this[$result] = methodOf(source, $result)
  }
}

export class Stepper extends Reducer {
  constructor(f) {
    this[$step] = f
  }
  [$init]() {
    return this[$step]()
  }
  [$result](result) {
    return this[$step](result)
  }
}

export class Transducer extends Reducer {
  constructor(reducer, ...params) {
    this.reducer = reducer
    this.setup(...params)
  }
  setup() {
  }
  [$init]() {
    return this.reducer[$init]()
  }
  [$step](result, input) {
    this.advance(result, input)
  }
  advance(result, input) {
    return this.reducer[$step](result, input)
  }
  [$result](result) {
    return this.reducer[$result](result)
  }
}


// Creates a transformer function that is a thunk for `TransducerType` and it's parameters.
// Once returned transformer is inovked it's going to do one of the following things:
// - If argument is an instance of a `Reducer` it's going to create an instance of Transducer
//   with a given argument at the bottom of the chain.
// - If argument is another transformer it's going to return composed transformer.
// - If argument is a reducible data structure with defined reducer it's going to return
//   transducer application over it.
export const Transform = (TransducerType, ...params) => {
  const transform = source => {
    if (source instanceof Reducer) {
      return new TransducerType(source, ...params)
    } else if (source && source[$transformer]) {
      return compose(source, transform)
    } else if (isReducer(source)) {
      return transduce(transform, new Producer(source), source)
    } else {
      throw TypeError("Unsupported argument type was passed to a transformer")
    }
  }
  // Should use `transformer` instead but for debugging it's kind
  // of handy to attach `TransducerType` and it `params` so we keep
  // this for now.
  transform[$transformer] = true
  transform.Transducer = TransducerType
  transform.params = params
  return transform
}
Transform.symbol = $transformer

// Like `Transform` but allows passing parameters in the separate call.
export const Transformer = TransducerType => (...params) =>
  Transform(TransducerType, ...params)

// Transducers.

class Map extends Transducer {
  setup(f) {
    this.f = f
  }
  [$step](state, input) {
    return this.advance(state, this.f(input))
  }
}

export const map = Transformer(Map)


class Filter extends Transducer {
  setup(p) {
    this.p = p
  }
  [$step](state, input) {
    if (this.p(input)) {
      return this.advance(state, input)
    }
    return state
  }
}

export const filter = Transformer(Filter)
export const remove = p => filter(x => !p(x))

class DropRepeats extends Transducer {
  [$step](state, input) {
    if (input !== this.last) {
      this.last = input
      return this.advance(state, input)
    }
    return state
  }
}

export const dropRepeats = Transform(DropRepeats)


class TakeWhile extends Transducer {
  setup(p) {
    this.p = p
  }
  [$step](state, input) {
    if (this.p(input)) {
      return this.advance(state, input)
    }
    return new Reduced(state)
  }
}

export const takeWhile = Transformer(TakeWhile)

class Take extends Transducer {
  setup(n) {
    this.n = n
  }
  [$step](state, input) {
    if (this.n > 0) {
      this.n = this.n - 1
      state = this.advance(state, input)
      if (this.n === 0 && !isReduced(state)) {
        state = new Reduced(state)
      }
    }
    return state
  }
}

export const take = Transformer(Take)

class Drop extends Transducer {
  setup(n) {
    this.n = n
  }
  [$step](state, input) {
    this.n = this.n - 1;
    return this.n >= 0 ? state : this.advance(state, input)
  }
}

export const drop = Transformer(Drop)

class DropWhile extends Transducer {
  setup(p) {
    this.p = p
    this.dropping = true
  }
  [$step](state, input) {
    this.dropping = this.dropping && this.p(input)
    return this.dropping ? state : this.advance(state, input)
  }
}

export const dropWhile = Transformer(DropWhile)

class Partition extends Transducer {
  setup(n) {
    this.n = n
    this.i = 0
    this.part = new Array(n)
  }
  [$result](state) {
    if (this.i > 0) {
      state = this.advance(state, this.part.slice(0, this.i))
      state = isReduced(state) ? state[$value] : state
    }
    return super[$result](state)
  }
  [$step](state, input) {
    this.part[this.i] = input
    this.i = this.i + 1
    if (this.i == this.n) {
      this.i = 0
      return this.advance(state, this.part.slice(0))
    }
    return state
  }
}

export const partition = Transformer(Partition)

class Forwarder extends Transducer {
  [$step](state, input) {
    const result = this.advance(state, input)
    return isReduced(result) ? result[$value] : result
  }
}

class Cat extends Transducer {
  setup() {
    this.forwarder = new Forwarder(this.reducer)
  }
  [$step](state, input) {
    return reduce(this.forwarder, state, input)
  }
}

export const cat = Transform(Cat)
export const mapcat = f => compose(cat, map(f))

export const transduce = (transformer, reducer, initial, source) => {
  reducer = reducer instanceof Reducer ? reducer :
            isReducer(reducer) ? new Producer(reducer) :
            typeof(reducer) === "function" ? new Stepper(reducer) :
            null

  if (!reducer) {
    throw TypeError(`Invalid reducer was passed`)
  }

  const transducer = transformer(reducer)

  if (source === void(0) && initial !== void(0)) {
    [source, initial] = [initial, transducer[$init]()]
  }

  const result = reduce(transducer, initial, source)
  return transducer[$result](result)
}

// Interface implementations for built-in types so we don't have
// to patch built-ins.

// Defaltu type is the bottom type all types including null undefined
// and object are going to inherit from it.
export class DefaultType {
  [init.symbol]() {
    return new this.constructor()
  }
  [result.symbol](result) {
    return result
  }
}


// We don not make objects transducible.
export class ObjectType extends DefaultType {}

// We do not make functions transducible.
export class FunctionType extends DefaultType {}


// All primitives gonig to inherit from AtomitType which
// provides `reduce` implementation that's gonig to invoke
// reducer just once with a value of the data type itself.
export class AtomicType extends DefaultType {
  [reduce.symbol](reducer, initial, value) {
    const result = reducer[$step](initial, value)
    return isReduced(result) ? result[$value] : result
  }
}

// Any transform over `null` is just `null`.
export class NullType extends AtomicType {
  [init.symbol]() {
    return null
  }
  [step.symbol](result, input) {
    return null
  }
}


// Any transform over `undefined` is just `undefined`
export class UndefinedType extends AtomicType {
  [init.symbol]() {
    return void(0)
  }
  [step.symbol](result, input) {
    return void(0)
  }
}

export class NumberType extends AtomicType {
  static add(x, y) {
    return x + y
  }
  // Base number is `0`.
  [init.symbol]() {
    return 0
  }
  [step.symbol](number, input) {
    // If input is an array of numbers add each one, otherwise
    // just add numbers.
    return isArray(input) ? input.reduce(NumberType.add, number) :
    number + input
  }
}


export class BooleanType extends AtomicType {}

export class SymbolType extends AtomicType {}


// Generic type to share `reduce` implementation between
// array string or anything that have `length` and access by
// index.
export class IndexedType extends DefaultType {
  [reduce.symbol](reducer, initial, indexed) {
    let index = 0
    let state = initial
    const count = indexed.length
    while (index < count) {
      state = reducer[$step](state, indexed[index])
      if (isReduced(state)) {
        return state[$value]
      }
      index = index + 1
    }
    return state
  }
}

export class StringType extends IndexedType {
  // Base string is empty string.
  [init.symbol]() {
    return ""
  }
  // If input is an array concat them onto result otherwise just
  // concat to strings.
  [step.symbol](result, input) {
    return isArray(input) ? result.concat(...input) : result + input
  }
}


export class ArrayType extends IndexedType {
  [init.symbol]() {
    return []
  }
  [step.symbol](array, value) {
    array.push(value)
    return array
  }
}


// Iteractors are kind of special in a sence that they produce
export class IteratorType extends ObjectType {
  [init.symbol]() {
    return IteratorLazyTransform
  }
  [step.symbol](result, input) {
    return result[step.symbol](result, input)
  }
  [reduce.symbol](transducer, initial, iterator) {
    // If it is transformation from iterator to iterator, then initial value is
    // going to be `IteratorLazyTransform` as (returned by [init.symbol] method above)
    // In such case we just create an instance of `IteratorLazyTransform` and return it
    // backe actual transformation will happen on demand by `IteratorLazyTransform`.
    if (initial === IteratorLazyTransform) {
      return new IteratorLazyTransform(iterator, transducer)
    }

    // Otherwise each value will be forwraded to the transducer until done
    // iteration or until reduced result is returned.
    let result = initial
    while(true) {
      const {done, value} = iterator.next()
      if (done) {
        return result
      }

      result = transducer[$step](result, value)

      if (isReduced(result)) {
        return result[$value]
      }
    }
  }
}

export class IteratorLazyTransform extends IteratorType {
  constructor(source, transducer) {
    // Each transformation step `this.transducer.step` may produce 0, 1 or more
    // steps in return. In order to accomodate extra values internal buffer is
    // going to be used.
    this.buffer = []

    this.source = source
    this.transducer = transducer
    this.isDrained = false
    this.done = false
  }
  [step.symbol](target, value) {
    target.buffer.push(value)
    return target
  }
  [$iterator]() {
    return this
  }
  next() {
    // Pull from the source until something is pushed into a buffer or
    // or until source is drained. `this.transducer` maybe filtering so
    // step may not push anything to a buffer, or it could be mapcatting
    // in which case several values will be pushed. It also maybe that
    // transducer is accumulating ond on result more values will be pushed
    // (like partition).
    while (this.buffer.length === 0 && !this.isDrained) {
      const {done, value} = this.source.next()
      // If source iterator is drained invoke result on transducer to let
      // it cleanup or push whatever it aggregated.
      if (done) {
        this.transducer[$result](this)
        this.isDrained = done
      }
      // Otherwise keep calling step, if result is reduced then mark this
      // iterator drained to stop pulling.
      else {
        const result = this.transducer[$step](this, value)
        this.isDrained = isReduced(result)
      }
    }

    // At this poin we either get something in a buffer or source was exhausted
    // or both. If something is in a buffer just return from it. If buffer is
    // empty then source is drained as well so we mark this done and finish.
    if (this.buffer.length > 0) {
      this.value = this.buffer.shift()
    } else {
      this.value = undefined
      this.done = this.isDrained
    }

    return this
  }
}
