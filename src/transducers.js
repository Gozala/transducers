if (typeof(Symbol) === 'undefined') {
  var Symbol = name => `${name}@transducer`
  Symbol.iterator = '@@iterator'
}

const compose = (f, g) => (...args) => f(g(...args));

const prototype = Object.prototype

const isArray = Array.isArray ||
      x => prototype.toString.call(x) === '[object Array]'

const isIterator = x =>
      x && (x[Symbol.iterator] || typeof(x.next) === 'function')

const isRegExp = x =>
  prototype.toString.call(x) === '[object RegExp]'

export class Reduced {
  constructor(value) {
    this.value = value
    this[Reduced.symbol] = true
  }
}
Reduced.symbol = Symbol('reduced')


export const isReduced = x =>
  x instanceof Reduced ||
  (x && x[Reduced.symbol])

export class Reducer {
  constructor({empty, step, result}) {
    this.empty = empty || this.empty
    this.step = step || this.step
    this.result = result || this.result
  }
  empty() {
    throw TypeError('Reducer must implement .empty method')
  }
  step(result, input) {
    throw TypeError('Reducer must implement .step method')
  }
  result(value) {
    throw TypeError('Reducer must implement .result method')
  }
}


export class Transducer extends Reducer {
  constructor(reducer, ...params) {
    this.reducer = reducer
    this.setup(...params)
  }
  setup() {
  }
  empty() {
    return this.reducer.empty()
  }
  step(state, input) {
    this.advance(state, input)
  }
  advance(state, input) {
    return this.reducer.step(state, input)
  }
  result(state) {
    return this.reducer.result(state)
  }
}

export const Transform = (TransducerType, ...params) => {
  const transform = source => {
    if (source instanceof Reducer) {
      return new TransducerType(source, ...params)
    } else if (source && source[Transform.symbol]) {
      return compose(source, transform)
    } else {
      return transduce(source, transform, reducer(source))
    }
  }
  transform[Transform.symbol] = true
  transform.Transducer = TransducerType
  transform.params = params
  return transform
}
Transform.symbol = Symbol('transform')

export const Transformer = TransducerType => (...params) =>
  Transform(TransducerType, ...params)


class Map extends Transducer {
  setup(f) {
    this.f = f
  }
  step(state, input) {
    return this.advance(state, this.f(input))
  }
}

export const map = Transformer(Map)


class Filter extends Transducer {
  setup(p) {
    this.p = p
  }
  step(state, input) {
    if (this.p(input)) {
      return this.advance(state, input)
    }
    return state
  }
}

export const filter = Transformer(Filter)
export const remove = p => filter(x => !p(x))

class DropRepeats extends Transducer {
  step(state, input) {
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
  step(state, input) {
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
  step(state, input) {
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
  step(state, input) {
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
  step(state, input) {
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
  result(state) {
    if (this.i > 0) {
      state = this.advance(state, this.part.slice(0, this.i))
      state = isReduced(state) ? state.value : state
    }
    return super.result(state)
  }
  step(state, input) {
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
  step(state, input) {
    const result = this.advance(state, input)
    return isReduced(result) ? result.value : result
  }
}

class Cat extends Transducer {
  setup() {
    this.forwarder = new Forwarder(this.reducer)
  }
  step(state, input) {
    return reduce(input, this.forwarder, state)
  }
}

export const cat = Transform(Cat)
export const mapcat = f => compose(cat, map(f))


export const transduce = (source, transformer, reducer, initial) => {
  if (!reducer) throw TypeError('transduce must be passed a reducer')
  const transducer = transformer(reducer)
  const result = reduce(source, transducer,
                            initial !== void(0) ? initial : transducer.empty())
  return transducer.result(result)
}


const Types = {
  Array: {},
  Iterator: {},
  String: {},
  Number: {},
  Boolean: {},
  Null: {},
  Void: {},
  RegExp: {},
  Symbol: {},
  Default: {}
}

const methodsOf = target =>
  target === null ? Types.Null :
  target === void(0) ? Types.Void :
  isArray(target) ? Types.Array :
  isIterator(target) ? Types.Iterator :
  typeof(target) === 'object' ? target :
  typeof(target) === 'function' ? Types.Function :
  typeof(target) === 'string' ? Types.String :
  typeof(target) === 'number' ? Types.Number :
  typeof(target) === 'boolean' ? Types.Boolean :
  isRegExp(target) ? Types.RegExp :
  typeof(target) === 'symbol' ? Types.Symbol :
  Types.Default;



export const reduce = (source, transducer, initial) =>
  methodsOf(source)[reduce.symbol](source, transducer, initial);
reduce.symbol = Symbol('reduce')

Types.Array[reduce.symbol] = (array, transducer, state) => {
  let index = -1
  const count = array.length
  while(++index < count) {
    state = transducer.step(state, array[index])
    if (isReduced(state)) {
      state = state.value
      break
    }
  }
  return state
}
Types.String[reduce.symbol] = Types.Array[reduce.symbol]
Types.Iterator[reduce.symbol] = (iterator, transducer, state) => {
  // If iterator without custom `transcieve` operation is being
  // transduced we don't need to walk the iterator now we can transform
  // it lazily there for we create `Iteratornsformation` and pass
  // it source iterator and a transciever so it could perform these steps
  // lazily.
  if (state === IteratorLazyTransformation.Empty) {
    return new IteratorLazyTransformation(iterator, transducer)
  }

  // Otherwise we forward individual values.
  let {done, value} = iterator.next()
  while(!done) {
    state = transducer.step(state, value)
    if (isReduced(state)) {
      state = state.value
      break;
    }
    ({done, value}) = iterator.next()
  }
  return state
}

const reduceSingular = (unit, reducer, state) => {
  const result = reducer.step(state, unit)
  return isReduced(result) ? result.value : result
}

Types.Null[reduce.symbol] = reduceSingular
Types.Void[reduce.symbol] = reduceSingular
Types.Number[reduce.symbol] = reduceSingular

export const reducer = source => methodsOf(source)[reducer.symbol]
reducer.symbol = Symbol('reducer')

Types.Array[reducer.symbol] = new Reducer({
  empty() {
    return []
  },
  result(array) {
    return array
  },
  step(array, input) {
    array.push(input)
    return array
  }
})

Types.Number[reducer.symbol] = new Reducer({
  empty() {
    return 0
  },
  result(number) {
    return number
  },
  step(number, input) {
    return isArray(input) ? input.reduce(this.step, number) :
           number + input
  }
})

Types.String[reducer.symbol] = new Reducer({
  empty() {
    return ""
  },
  result(string) {
    return string
  },
  step(string, input) {
    return isArray(input) ? string.concat(...input) :
           string + input
  }
})

Types.Null[reducer.symbol] = new Reducer({
  empty() {
    return null
  },
  result(value) {
    return value
  },
  step(_, input) {
    return null
  }
})

Types.Void[reducer.symbol] = new Reducer({
  empty() {
    return void(0)
  },
  result(value) {
    return value
  },
  step(_, input) {
    return void(0)
  }
})

const nil = {}
Types.Iterator[reducer.symbol] = new Reducer({
  empty() {
    return IteratorLazyTransformation.Empty
  },
  step(target, value) {
    target.buffer.push(value)
    return target
  },
  result(target) {
    return target
  }
})

class IteratorLazyTransformation {
  constructor(source, transducer) {
    this.source = source
    this.transducer = transducer
    this.buffer = []
    this.isDrained = false
    this.done = false
  }
  [Symbol.iterator]() {
    return this
  }
  next() {
    // Pull from the source until something ends up in a buffer
    // or until source is drained. Note that transducer maybe
    // filtering so it may take multiple steps until something
    // is being pushed to buffer. It also maybe that transducer
    // is accumulating until result is called.
    while (this.buffer.length === 0 && !this.isDrained) {
      const {done, value} = this.source.next()
      if (done) {
        this.transducer.result(this)
        this.isDrained = done
      } else {
        const result = this.transducer.step(this, value)
        this.isDrained = isReduced(result)
      }
    }

    // At this poin we either managed to get something pushed
    // to a buffer or source was exhausted or both. If something
    // was pushed to a buffer we do not end until buffer is empty,
    // so we start with that.
    if (this.buffer.length > 0) {
      this.value = this.buffer.shift()
    } else {
      this.done = this.isDrained
    }

    return this
  }
}
IteratorLazyTransformation.Empty = new String("IteratorLazyTransformation.Empty")
IteratorLazyTransformation.Nil = new String("IteratorLazyTransformation.Nil")
/*

class ChannelInputReducer {
  empty() {
    return new Channel()
  }
  result(channel) {
    return channel.input
  }
  step(channel, chunk) {
    return channel.output.put(chunk)
  }
}

const reduceChannelInput = (source, transducer, channel) => {
  spawn(function*() {
    let chunk = void(0)
    let state = void(0)
    while (chunk = yield channel.input.take()) {
      state = yield transducer.recieve(channel, chunk);
      if (isReduced(state)) {
        state = state.value
        break;
      }
    }
    channel.output.close()
    return state
  })
  return transducer.result(channel)
}
*/



const inc = x => x + 1
const isEven = x => !(x % 2)
const upperCase = string => string.toUpperCase()

