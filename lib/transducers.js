(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  }
})(function (exports) {
  "use strict";

  var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

  var _applyConstructor = function (Constructor, args) { var instance = Object.create(Constructor.prototype); var result = Constructor.apply(instance, args); return result != null && (typeof result == "object" || typeof result == "function") ? result : instance; };

  var _createComputedClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var prop = props[i]; prop.configurable = true; if (prop.value) prop.writable = true; Object.defineProperty(target, prop.key, prop); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  if (typeof Symbol === "undefined") {
    var Symbol = function (name) {
      return "" + name + "@transducer";
    };
    Symbol.iterator = "@@iterator";
  }

  var compose = function (f, g) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return f(g.apply(undefined, args));
    };
  };

  var prototype = Object.prototype;

  var isArray = Array.isArray || function (x) {
    return prototype.toString.call(x) === "[object Array]";
  };

  var isIterator = function (x) {
    return x && (x[Symbol.iterator] || typeof x.next === "function");
  };

  var isRegExp = function (x) {
    return prototype.toString.call(x) === "[object RegExp]";
  };

  var Reduced = exports.Reduced = function Reduced(value) {
    _classCallCheck(this, Reduced);

    this.value = value;
    this[Reduced.symbol] = true;
  };

  Reduced.symbol = Symbol("reduced");

  var isReduced = function (x) {
    return x instanceof Reduced || x && x[Reduced.symbol];
  };

  exports.isReduced = isReduced;

  var Reducer = exports.Reducer = (function () {
    function Reducer(_ref) {
      var empty = _ref.empty;
      var step = _ref.step;
      var result = _ref.result;

      _classCallCheck(this, Reducer);

      this.empty = empty || this.empty;
      this.step = step || this.step;
      this.result = result || this.result;
    }

    _createClass(Reducer, {
      empty: {
        value: function empty() {
          throw TypeError("Reducer must implement .empty method");
        }
      },
      step: {
        value: function step(result, input) {
          throw TypeError("Reducer must implement .step method");
        }
      },
      result: {
        value: function result(value) {
          throw TypeError("Reducer must implement .result method");
        }
      }
    });

    return Reducer;
  })();

  var Transducer = exports.Transducer = (function (_Reducer) {
    function Transducer(reducer) {
      for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }

      _classCallCheck(this, Transducer);

      this.reducer = reducer;
      this.setup.apply(this, params);
    }

    _inherits(Transducer, _Reducer);

    _createClass(Transducer, {
      setup: {
        value: function setup() {}
      },
      empty: {
        value: function empty() {
          return this.reducer.empty();
        }
      },
      step: {
        value: function step(state, input) {
          this.advance(state, input);
        }
      },
      advance: {
        value: function advance(state, input) {
          return this.reducer.step(state, input);
        }
      },
      result: {
        value: function result(state) {
          return this.reducer.result(state);
        }
      }
    });

    return Transducer;
  })(Reducer);

  var Transform = function (TransducerType) {
    for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    var transform = function (source) {
      if (source instanceof Reducer) {
        return _applyConstructor(TransducerType, [source].concat(params));
      } else if (source && source[Transform.symbol]) {
        return compose(source, transform);
      } else {
        return transduce(source, transform, reducer(source));
      }
    };
    transform[Transform.symbol] = true;
    transform.Transducer = TransducerType;
    transform.params = params;
    return transform;
  };
  exports.Transform = Transform;
  Transform.symbol = Symbol("transform");

  var Transformer = function (TransducerType) {
    return function () {
      for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      return Transform.apply(undefined, [TransducerType].concat(params));
    };
  };

  exports.Transformer = Transformer;

  var Map = (function (_Transducer) {
    function Map() {
      _classCallCheck(this, Map);

      if (_Transducer != null) {
        _Transducer.apply(this, arguments);
      }
    }

    _inherits(Map, _Transducer);

    _createClass(Map, {
      setup: {
        value: function setup(f) {
          this.f = f;
        }
      },
      step: {
        value: function step(state, input) {
          return this.advance(state, this.f(input));
        }
      }
    });

    return Map;
  })(Transducer);

  var map = Transformer(Map);

  exports.map = map;

  var Filter = (function (_Transducer2) {
    function Filter() {
      _classCallCheck(this, Filter);

      if (_Transducer2 != null) {
        _Transducer2.apply(this, arguments);
      }
    }

    _inherits(Filter, _Transducer2);

    _createClass(Filter, {
      setup: {
        value: function setup(p) {
          this.p = p;
        }
      },
      step: {
        value: function step(state, input) {
          if (this.p(input)) {
            return this.advance(state, input);
          }
          return state;
        }
      }
    });

    return Filter;
  })(Transducer);

  var filter = Transformer(Filter);
  exports.filter = filter;
  var remove = function (p) {
    return filter(function (x) {
      return !p(x);
    });
  };

  exports.remove = remove;

  var DropRepeats = (function (_Transducer3) {
    function DropRepeats() {
      _classCallCheck(this, DropRepeats);

      if (_Transducer3 != null) {
        _Transducer3.apply(this, arguments);
      }
    }

    _inherits(DropRepeats, _Transducer3);

    _createClass(DropRepeats, {
      step: {
        value: function step(state, input) {
          if (input !== this.last) {
            this.last = input;
            return this.advance(state, input);
          }
          return state;
        }
      }
    });

    return DropRepeats;
  })(Transducer);

  var dropRepeats = Transform(DropRepeats);

  exports.dropRepeats = dropRepeats;

  var TakeWhile = (function (_Transducer4) {
    function TakeWhile() {
      _classCallCheck(this, TakeWhile);

      if (_Transducer4 != null) {
        _Transducer4.apply(this, arguments);
      }
    }

    _inherits(TakeWhile, _Transducer4);

    _createClass(TakeWhile, {
      setup: {
        value: function setup(p) {
          this.p = p;
        }
      },
      step: {
        value: function step(state, input) {
          if (this.p(input)) {
            return this.advance(state, input);
          }
          return new Reduced(state);
        }
      }
    });

    return TakeWhile;
  })(Transducer);

  var takeWhile = Transformer(TakeWhile);

  exports.takeWhile = takeWhile;

  var Take = (function (_Transducer5) {
    function Take() {
      _classCallCheck(this, Take);

      if (_Transducer5 != null) {
        _Transducer5.apply(this, arguments);
      }
    }

    _inherits(Take, _Transducer5);

    _createClass(Take, {
      setup: {
        value: function setup(n) {
          this.n = n;
        }
      },
      step: {
        value: function step(state, input) {
          if (this.n > 0) {
            this.n = this.n - 1;
            state = this.advance(state, input);
            if (this.n === 0 && !isReduced(state)) {
              state = new Reduced(state);
            }
          }
          return state;
        }
      }
    });

    return Take;
  })(Transducer);

  var take = Transformer(Take);

  exports.take = take;

  var Drop = (function (_Transducer6) {
    function Drop() {
      _classCallCheck(this, Drop);

      if (_Transducer6 != null) {
        _Transducer6.apply(this, arguments);
      }
    }

    _inherits(Drop, _Transducer6);

    _createClass(Drop, {
      setup: {
        value: function setup(n) {
          this.n = n;
        }
      },
      step: {
        value: function step(state, input) {
          this.n = this.n - 1;
          return this.n >= 0 ? state : this.advance(state, input);
        }
      }
    });

    return Drop;
  })(Transducer);

  var drop = Transformer(Drop);

  exports.drop = drop;

  var DropWhile = (function (_Transducer7) {
    function DropWhile() {
      _classCallCheck(this, DropWhile);

      if (_Transducer7 != null) {
        _Transducer7.apply(this, arguments);
      }
    }

    _inherits(DropWhile, _Transducer7);

    _createClass(DropWhile, {
      setup: {
        value: function setup(p) {
          this.p = p;
          this.dropping = true;
        }
      },
      step: {
        value: function step(state, input) {
          this.dropping = this.dropping && this.p(input);
          return this.dropping ? state : this.advance(state, input);
        }
      }
    });

    return DropWhile;
  })(Transducer);

  var dropWhile = Transformer(DropWhile);

  exports.dropWhile = dropWhile;

  var Partition = (function (_Transducer8) {
    function Partition() {
      _classCallCheck(this, Partition);

      if (_Transducer8 != null) {
        _Transducer8.apply(this, arguments);
      }
    }

    _inherits(Partition, _Transducer8);

    _createClass(Partition, {
      setup: {
        value: function setup(n) {
          this.n = n;
          this.i = 0;
          this.part = new Array(n);
        }
      },
      result: {
        value: function result(state) {
          if (this.i > 0) {
            state = this.advance(state, this.part.slice(0, this.i));
            state = isReduced(state) ? state.value : state;
          }
          return _get(Object.getPrototypeOf(Partition.prototype), "result", this).call(this, state);
        }
      },
      step: {
        value: function step(state, input) {
          this.part[this.i] = input;
          this.i = this.i + 1;
          if (this.i == this.n) {
            this.i = 0;
            return this.advance(state, this.part.slice(0));
          }
          return state;
        }
      }
    });

    return Partition;
  })(Transducer);

  var partition = Transformer(Partition);

  exports.partition = partition;

  var Forwarder = (function (_Transducer9) {
    function Forwarder() {
      _classCallCheck(this, Forwarder);

      if (_Transducer9 != null) {
        _Transducer9.apply(this, arguments);
      }
    }

    _inherits(Forwarder, _Transducer9);

    _createClass(Forwarder, {
      step: {
        value: function step(state, input) {
          var result = this.advance(state, input);
          return isReduced(result) ? result.value : result;
        }
      }
    });

    return Forwarder;
  })(Transducer);

  var Cat = (function (_Transducer10) {
    function Cat() {
      _classCallCheck(this, Cat);

      if (_Transducer10 != null) {
        _Transducer10.apply(this, arguments);
      }
    }

    _inherits(Cat, _Transducer10);

    _createClass(Cat, {
      setup: {
        value: function setup() {
          this.forwarder = new Forwarder(this.reducer);
        }
      },
      step: {
        value: function step(state, input) {
          return reduce(input, this.forwarder, state);
        }
      }
    });

    return Cat;
  })(Transducer);

  var cat = Transform(Cat);
  exports.cat = cat;
  var mapcat = function (f) {
    return compose(cat, map(f));
  };

  exports.mapcat = mapcat;
  var transduce = function (source, transformer, reducer, initial) {
    if (!reducer) throw TypeError("transduce must be passed a reducer");
    var transducer = transformer(reducer);
    var result = reduce(source, transducer, initial !== void 0 ? initial : transducer.empty());
    return transducer.result(result);
  };

  exports.transduce = transduce;
  var Types = {
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
  };

  var methodsOf = function (target) {
    return target === null ? Types.Null : target === void 0 ? Types.Void : isArray(target) ? Types.Array : isIterator(target) ? Types.Iterator : typeof target === "object" ? target : typeof target === "function" ? Types.Function : typeof target === "string" ? Types.String : typeof target === "number" ? Types.Number : typeof target === "boolean" ? Types.Boolean : isRegExp(target) ? Types.RegExp : typeof target === "symbol" ? Types.Symbol : Types.Default;
  };

  var reduce = function (source, transducer, initial) {
    return methodsOf(source)[reduce.symbol](source, transducer, initial);
  };
  exports.reduce = reduce;
  reduce.symbol = Symbol("reduce");

  Types.Array[reduce.symbol] = function (array, transducer, state) {
    var index = -1;
    var count = array.length;
    while (++index < count) {
      state = transducer.step(state, array[index]);
      if (isReduced(state)) {
        state = state.value;
        break;
      }
    }
    return state;
  };
  Types.String[reduce.symbol] = Types.Array[reduce.symbol];
  Types.Iterator[reduce.symbol] = function (iterator, transducer, state) {
    // If iterator without custom `transcieve` operation is being
    // transduced we don't need to walk the iterator now we can transform
    // it lazily there for we create `Iteratornsformation` and pass
    // it source iterator and a transciever so it could perform these steps
    // lazily.
    if (state === IteratorLazyTransformation.Empty) {
      return new IteratorLazyTransformation(iterator, transducer);
    }

    // Otherwise we forward individual values.

    var _iterator$next = iterator.next();

    var done = _iterator$next.done;
    var value = _iterator$next.value;

    while (!done) {
      state = transducer.step(state, value);
      if (isReduced(state)) {
        state = state.value;
        break;
      }

      var _ref = iterator.next();

      done = _ref.done;
      value = _ref.value;
    }
    return state;
  };

  var reduceSingular = function (unit, reducer, state) {
    var result = reducer.step(state, unit);
    return isReduced(result) ? result.value : result;
  };

  Types.Null[reduce.symbol] = reduceSingular;
  Types.Void[reduce.symbol] = reduceSingular;
  Types.Number[reduce.symbol] = reduceSingular;

  var reducer = function (source) {
    return methodsOf(source)[reducer.symbol];
  };
  exports.reducer = reducer;
  reducer.symbol = Symbol("reducer");

  Types.Array[reducer.symbol] = new Reducer({
    empty: function empty() {
      return [];
    },
    result: function result(array) {
      return array;
    },
    step: function step(array, input) {
      array.push(input);
      return array;
    }
  });

  Types.Number[reducer.symbol] = new Reducer({
    empty: function empty() {
      return 0;
    },
    result: function result(number) {
      return number;
    },
    step: function step(number, input) {
      return isArray(input) ? input.reduce(this.step, number) : number + input;
    }
  });

  Types.String[reducer.symbol] = new Reducer({
    empty: function empty() {
      return "";
    },
    result: function result(string) {
      return string;
    },
    step: function step(string, input) {
      return isArray(input) ? string.concat.apply(string, _toConsumableArray(input)) : string + input;
    }
  });

  Types.Null[reducer.symbol] = new Reducer({
    empty: function empty() {
      return null;
    },
    result: function result(value) {
      return value;
    },
    step: function step(_, input) {
      return null;
    }
  });

  Types.Void[reducer.symbol] = new Reducer({
    empty: function empty() {
      return void 0;
    },
    result: function result(value) {
      return value;
    },
    step: function step(_, input) {
      return void 0;
    }
  });

  var nil = {};
  Types.Iterator[reducer.symbol] = new Reducer({
    empty: function empty() {
      return IteratorLazyTransformation.Empty;
    },
    step: function step(target, value) {
      target.buffer.push(value);
      return target;
    },
    result: function result(target) {
      return target;
    }
  });

  var IteratorLazyTransformation = (function () {
    function IteratorLazyTransformation(source, transducer) {
      _classCallCheck(this, IteratorLazyTransformation);

      this.source = source;
      this.transducer = transducer;
      this.buffer = [];
      this.isDrained = false;
      this.done = false;
    }

    _createComputedClass(IteratorLazyTransformation, [{
      key: Symbol.iterator,
      value: function () {
        return this;
      }
    }, {
      key: "next",
      value: function next() {
        // Pull from the source until something ends up in a buffer
        // or until source is drained. Note that transducer maybe
        // filtering so it may take multiple steps until something
        // is being pushed to buffer. It also maybe that transducer
        // is accumulating until result is called.
        while (this.buffer.length === 0 && !this.isDrained) {
          var _source$next = this.source.next();

          var done = _source$next.done;
          var value = _source$next.value;

          if (done) {
            this.transducer.result(this);
            this.isDrained = done;
          } else {
            var result = this.transducer.step(this, value);
            this.isDrained = isReduced(result);
          }
        }

        // At this poin we either managed to get something pushed
        // to a buffer or source was exhausted or both. If something
        // was pushed to a buffer we do not end until buffer is empty,
        // so we start with that.
        if (this.buffer.length > 0) {
          this.value = this.buffer.shift();
        } else {
          this.done = this.isDrained;
        }

        return this;
      }
    }]);

    return IteratorLazyTransformation;
  })();

  IteratorLazyTransformation.Empty = new String("IteratorLazyTransformation.Empty");
  IteratorLazyTransformation.Nil = new String("IteratorLazyTransformation.Nil");
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

  var inc = function (x) {
    return x + 1;
  };
  var isEven = function (x) {
    return !(x % 2);
  };
  var upperCase = function (string) {
    return string.toUpperCase();
  };
});
//# sourceMappingURL=data:application/json;base64,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RyxDQUFDLEVBQUU7QUFDMUIsY0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFBO1NBQ2pDLE1BQU07QUFDTCxjQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUE7U0FDM0I7O0FBRUQsZUFBTyxJQUFJLENBQUE7T0FDWjs7O1dBdkNHLDBCQUEwQjs7O0FBeUNoQyw0QkFBMEIsQ0FBQyxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsa0NBQWtDLENBQUMsQ0FBQTtBQUNqRiw0QkFBMEIsQ0FBQyxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsZ0NBQWdDLENBQUMsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUM3RSxNQUFNLEdBQUcsR0FBRyxVQUFBLENBQUM7V0FBSSxDQUFDLEdBQUcsQ0FBQztHQUFBLENBQUE7QUFDdEIsTUFBTSxNQUFNLEdBQUcsVUFBQSxDQUFDO1dBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUM7R0FBQSxDQUFBO0FBQzVCLE1BQU0sU0FBUyxHQUFHLFVBQUEsTUFBTTtXQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUU7R0FBQSxDQUFBIiwiZmlsZSI6InNyYy90cmFuc2R1Y2Vycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImlmICh0eXBlb2YoU3ltYm9sKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgdmFyIFN5bWJvbCA9IG5hbWUgPT4gYCR7bmFtZX1AdHJhbnNkdWNlcmBcbiAgU3ltYm9sLml0ZXJhdG9yID0gJ0BAaXRlcmF0b3InXG59XG5cbmNvbnN0IGNvbXBvc2UgPSAoZiwgZykgPT4gKC4uLmFyZ3MpID0+IGYoZyguLi5hcmdzKSk7XG5cbmNvbnN0IHByb3RvdHlwZSA9IE9iamVjdC5wcm90b3R5cGVcblxuY29uc3QgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHxcbiAgICAgIHggPT4gcHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeCkgPT09ICdbb2JqZWN0IEFycmF5XSdcblxuY29uc3QgaXNJdGVyYXRvciA9IHggPT5cbiAgICAgIHggJiYgKHhbU3ltYm9sLml0ZXJhdG9yXSB8fCB0eXBlb2YoeC5uZXh0KSA9PT0gJ2Z1bmN0aW9uJylcblxuY29uc3QgaXNSZWdFeHAgPSB4ID0+XG4gIHByb3RvdHlwZS50b1N0cmluZy5jYWxsKHgpID09PSAnW29iamVjdCBSZWdFeHBdJ1xuXG5leHBvcnQgY2xhc3MgUmVkdWNlZCB7XG4gIGNvbnN0cnVjdG9yKHZhbHVlKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlXG4gICAgdGhpc1tSZWR1Y2VkLnN5bWJvbF0gPSB0cnVlXG4gIH1cbn1cblJlZHVjZWQuc3ltYm9sID0gU3ltYm9sKCdyZWR1Y2VkJylcblxuXG5leHBvcnQgY29uc3QgaXNSZWR1Y2VkID0geCA9PlxuICB4IGluc3RhbmNlb2YgUmVkdWNlZCB8fFxuICAoeCAmJiB4W1JlZHVjZWQuc3ltYm9sXSlcblxuZXhwb3J0IGNsYXNzIFJlZHVjZXIge1xuICBjb25zdHJ1Y3Rvcih7ZW1wdHksIHN0ZXAsIHJlc3VsdH0pIHtcbiAgICB0aGlzLmVtcHR5ID0gZW1wdHkgfHwgdGhpcy5lbXB0eVxuICAgIHRoaXMuc3RlcCA9IHN0ZXAgfHwgdGhpcy5zdGVwXG4gICAgdGhpcy5yZXN1bHQgPSByZXN1bHQgfHwgdGhpcy5yZXN1bHRcbiAgfVxuICBlbXB0eSgpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ1JlZHVjZXIgbXVzdCBpbXBsZW1lbnQgLmVtcHR5IG1ldGhvZCcpXG4gIH1cbiAgc3RlcChyZXN1bHQsIGlucHV0KSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdSZWR1Y2VyIG11c3QgaW1wbGVtZW50IC5zdGVwIG1ldGhvZCcpXG4gIH1cbiAgcmVzdWx0KHZhbHVlKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdSZWR1Y2VyIG11c3QgaW1wbGVtZW50IC5yZXN1bHQgbWV0aG9kJylcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBUcmFuc2R1Y2VyIGV4dGVuZHMgUmVkdWNlciB7XG4gIGNvbnN0cnVjdG9yKHJlZHVjZXIsIC4uLnBhcmFtcykge1xuICAgIHRoaXMucmVkdWNlciA9IHJlZHVjZXJcbiAgICB0aGlzLnNldHVwKC4uLnBhcmFtcylcbiAgfVxuICBzZXR1cCgpIHtcbiAgfVxuICBlbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWR1Y2VyLmVtcHR5KClcbiAgfVxuICBzdGVwKHN0YXRlLCBpbnB1dCkge1xuICAgIHRoaXMuYWR2YW5jZShzdGF0ZSwgaW5wdXQpXG4gIH1cbiAgYWR2YW5jZShzdGF0ZSwgaW5wdXQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWR1Y2VyLnN0ZXAoc3RhdGUsIGlucHV0KVxuICB9XG4gIHJlc3VsdChzdGF0ZSkge1xuICAgIHJldHVybiB0aGlzLnJlZHVjZXIucmVzdWx0KHN0YXRlKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBUcmFuc2Zvcm0gPSAoVHJhbnNkdWNlclR5cGUsIC4uLnBhcmFtcykgPT4ge1xuICBjb25zdCB0cmFuc2Zvcm0gPSBzb3VyY2UgPT4ge1xuICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBSZWR1Y2VyKSB7XG4gICAgICByZXR1cm4gbmV3IFRyYW5zZHVjZXJUeXBlKHNvdXJjZSwgLi4ucGFyYW1zKVxuICAgIH0gZWxzZSBpZiAoc291cmNlICYmIHNvdXJjZVtUcmFuc2Zvcm0uc3ltYm9sXSkge1xuICAgICAgcmV0dXJuIGNvbXBvc2Uoc291cmNlLCB0cmFuc2Zvcm0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cmFuc2R1Y2Uoc291cmNlLCB0cmFuc2Zvcm0sIHJlZHVjZXIoc291cmNlKSlcbiAgICB9XG4gIH1cbiAgdHJhbnNmb3JtW1RyYW5zZm9ybS5zeW1ib2xdID0gdHJ1ZVxuICB0cmFuc2Zvcm0uVHJhbnNkdWNlciA9IFRyYW5zZHVjZXJUeXBlXG4gIHRyYW5zZm9ybS5wYXJhbXMgPSBwYXJhbXNcbiAgcmV0dXJuIHRyYW5zZm9ybVxufVxuVHJhbnNmb3JtLnN5bWJvbCA9IFN5bWJvbCgndHJhbnNmb3JtJylcblxuZXhwb3J0IGNvbnN0IFRyYW5zZm9ybWVyID0gVHJhbnNkdWNlclR5cGUgPT4gKC4uLnBhcmFtcykgPT5cbiAgVHJhbnNmb3JtKFRyYW5zZHVjZXJUeXBlLCAuLi5wYXJhbXMpXG5cblxuY2xhc3MgTWFwIGV4dGVuZHMgVHJhbnNkdWNlciB7XG4gIHNldHVwKGYpIHtcbiAgICB0aGlzLmYgPSBmXG4gIH1cbiAgc3RlcChzdGF0ZSwgaW5wdXQpIHtcbiAgICByZXR1cm4gdGhpcy5hZHZhbmNlKHN0YXRlLCB0aGlzLmYoaW5wdXQpKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBtYXAgPSBUcmFuc2Zvcm1lcihNYXApXG5cblxuY2xhc3MgRmlsdGVyIGV4dGVuZHMgVHJhbnNkdWNlciB7XG4gIHNldHVwKHApIHtcbiAgICB0aGlzLnAgPSBwXG4gIH1cbiAgc3RlcChzdGF0ZSwgaW5wdXQpIHtcbiAgICBpZiAodGhpcy5wKGlucHV0KSkge1xuICAgICAgcmV0dXJuIHRoaXMuYWR2YW5jZShzdGF0ZSwgaW5wdXQpXG4gICAgfVxuICAgIHJldHVybiBzdGF0ZVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBmaWx0ZXIgPSBUcmFuc2Zvcm1lcihGaWx0ZXIpXG5leHBvcnQgY29uc3QgcmVtb3ZlID0gcCA9PiBmaWx0ZXIoeCA9PiAhcCh4KSlcblxuY2xhc3MgRHJvcFJlcGVhdHMgZXh0ZW5kcyBUcmFuc2R1Y2VyIHtcbiAgc3RlcChzdGF0ZSwgaW5wdXQpIHtcbiAgICBpZiAoaW5wdXQgIT09IHRoaXMubGFzdCkge1xuICAgICAgdGhpcy5sYXN0ID0gaW5wdXRcbiAgICAgIHJldHVybiB0aGlzLmFkdmFuY2Uoc3RhdGUsIGlucHV0KVxuICAgIH1cbiAgICByZXR1cm4gc3RhdGVcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZHJvcFJlcGVhdHMgPSBUcmFuc2Zvcm0oRHJvcFJlcGVhdHMpXG5cblxuY2xhc3MgVGFrZVdoaWxlIGV4dGVuZHMgVHJhbnNkdWNlciB7XG4gIHNldHVwKHApIHtcbiAgICB0aGlzLnAgPSBwXG4gIH1cbiAgc3RlcChzdGF0ZSwgaW5wdXQpIHtcbiAgICBpZiAodGhpcy5wKGlucHV0KSkge1xuICAgICAgcmV0dXJuIHRoaXMuYWR2YW5jZShzdGF0ZSwgaW5wdXQpXG4gICAgfVxuICAgIHJldHVybiBuZXcgUmVkdWNlZChzdGF0ZSlcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgdGFrZVdoaWxlID0gVHJhbnNmb3JtZXIoVGFrZVdoaWxlKVxuXG5jbGFzcyBUYWtlIGV4dGVuZHMgVHJhbnNkdWNlciB7XG4gIHNldHVwKG4pIHtcbiAgICB0aGlzLm4gPSBuXG4gIH1cbiAgc3RlcChzdGF0ZSwgaW5wdXQpIHtcbiAgICBpZiAodGhpcy5uID4gMCkge1xuICAgICAgdGhpcy5uID0gdGhpcy5uIC0gMVxuICAgICAgc3RhdGUgPSB0aGlzLmFkdmFuY2Uoc3RhdGUsIGlucHV0KVxuICAgICAgaWYgKHRoaXMubiA9PT0gMCAmJiAhaXNSZWR1Y2VkKHN0YXRlKSkge1xuICAgICAgICBzdGF0ZSA9IG5ldyBSZWR1Y2VkKHN0YXRlKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RhdGVcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgdGFrZSA9IFRyYW5zZm9ybWVyKFRha2UpXG5cbmNsYXNzIERyb3AgZXh0ZW5kcyBUcmFuc2R1Y2VyIHtcbiAgc2V0dXAobikge1xuICAgIHRoaXMubiA9IG5cbiAgfVxuICBzdGVwKHN0YXRlLCBpbnB1dCkge1xuICAgIHRoaXMubiA9IHRoaXMubiAtIDE7XG4gICAgcmV0dXJuIHRoaXMubiA+PSAwID8gc3RhdGUgOiB0aGlzLmFkdmFuY2Uoc3RhdGUsIGlucHV0KVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBkcm9wID0gVHJhbnNmb3JtZXIoRHJvcClcblxuY2xhc3MgRHJvcFdoaWxlIGV4dGVuZHMgVHJhbnNkdWNlciB7XG4gIHNldHVwKHApIHtcbiAgICB0aGlzLnAgPSBwXG4gICAgdGhpcy5kcm9wcGluZyA9IHRydWVcbiAgfVxuICBzdGVwKHN0YXRlLCBpbnB1dCkge1xuICAgIHRoaXMuZHJvcHBpbmcgPSB0aGlzLmRyb3BwaW5nICYmIHRoaXMucChpbnB1dClcbiAgICByZXR1cm4gdGhpcy5kcm9wcGluZyA/IHN0YXRlIDogdGhpcy5hZHZhbmNlKHN0YXRlLCBpbnB1dClcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZHJvcFdoaWxlID0gVHJhbnNmb3JtZXIoRHJvcFdoaWxlKVxuXG5jbGFzcyBQYXJ0aXRpb24gZXh0ZW5kcyBUcmFuc2R1Y2VyIHtcbiAgc2V0dXAobikge1xuICAgIHRoaXMubiA9IG5cbiAgICB0aGlzLmkgPSAwXG4gICAgdGhpcy5wYXJ0ID0gbmV3IEFycmF5KG4pXG4gIH1cbiAgcmVzdWx0KHN0YXRlKSB7XG4gICAgaWYgKHRoaXMuaSA+IDApIHtcbiAgICAgIHN0YXRlID0gdGhpcy5hZHZhbmNlKHN0YXRlLCB0aGlzLnBhcnQuc2xpY2UoMCwgdGhpcy5pKSlcbiAgICAgIHN0YXRlID0gaXNSZWR1Y2VkKHN0YXRlKSA/IHN0YXRlLnZhbHVlIDogc3RhdGVcbiAgICB9XG4gICAgcmV0dXJuIHN1cGVyLnJlc3VsdChzdGF0ZSlcbiAgfVxuICBzdGVwKHN0YXRlLCBpbnB1dCkge1xuICAgIHRoaXMucGFydFt0aGlzLmldID0gaW5wdXRcbiAgICB0aGlzLmkgPSB0aGlzLmkgKyAxXG4gICAgaWYgKHRoaXMuaSA9PSB0aGlzLm4pIHtcbiAgICAgIHRoaXMuaSA9IDBcbiAgICAgIHJldHVybiB0aGlzLmFkdmFuY2Uoc3RhdGUsIHRoaXMucGFydC5zbGljZSgwKSlcbiAgICB9XG4gICAgcmV0dXJuIHN0YXRlXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHBhcnRpdGlvbiA9IFRyYW5zZm9ybWVyKFBhcnRpdGlvbilcblxuY2xhc3MgRm9yd2FyZGVyIGV4dGVuZHMgVHJhbnNkdWNlciB7XG4gIHN0ZXAoc3RhdGUsIGlucHV0KSB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5hZHZhbmNlKHN0YXRlLCBpbnB1dClcbiAgICByZXR1cm4gaXNSZWR1Y2VkKHJlc3VsdCkgPyByZXN1bHQudmFsdWUgOiByZXN1bHRcbiAgfVxufVxuXG5jbGFzcyBDYXQgZXh0ZW5kcyBUcmFuc2R1Y2VyIHtcbiAgc2V0dXAoKSB7XG4gICAgdGhpcy5mb3J3YXJkZXIgPSBuZXcgRm9yd2FyZGVyKHRoaXMucmVkdWNlcilcbiAgfVxuICBzdGVwKHN0YXRlLCBpbnB1dCkge1xuICAgIHJldHVybiByZWR1Y2UoaW5wdXQsIHRoaXMuZm9yd2FyZGVyLCBzdGF0ZSlcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgY2F0ID0gVHJhbnNmb3JtKENhdClcbmV4cG9ydCBjb25zdCBtYXBjYXQgPSBmID0+IGNvbXBvc2UoY2F0LCBtYXAoZikpXG5cblxuZXhwb3J0IGNvbnN0IHRyYW5zZHVjZSA9IChzb3VyY2UsIHRyYW5zZm9ybWVyLCByZWR1Y2VyLCBpbml0aWFsKSA9PiB7XG4gIGlmICghcmVkdWNlcikgdGhyb3cgVHlwZUVycm9yKCd0cmFuc2R1Y2UgbXVzdCBiZSBwYXNzZWQgYSByZWR1Y2VyJylcbiAgY29uc3QgdHJhbnNkdWNlciA9IHRyYW5zZm9ybWVyKHJlZHVjZXIpXG4gIGNvbnN0IHJlc3VsdCA9IHJlZHVjZShzb3VyY2UsIHRyYW5zZHVjZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbCAhPT0gdm9pZCgwKSA/IGluaXRpYWwgOiB0cmFuc2R1Y2VyLmVtcHR5KCkpXG4gIHJldHVybiB0cmFuc2R1Y2VyLnJlc3VsdChyZXN1bHQpXG59XG5cblxuY29uc3QgVHlwZXMgPSB7XG4gIEFycmF5OiB7fSxcbiAgSXRlcmF0b3I6IHt9LFxuICBTdHJpbmc6IHt9LFxuICBOdW1iZXI6IHt9LFxuICBCb29sZWFuOiB7fSxcbiAgTnVsbDoge30sXG4gIFZvaWQ6IHt9LFxuICBSZWdFeHA6IHt9LFxuICBTeW1ib2w6IHt9LFxuICBEZWZhdWx0OiB7fVxufVxuXG5jb25zdCBtZXRob2RzT2YgPSB0YXJnZXQgPT5cbiAgdGFyZ2V0ID09PSBudWxsID8gVHlwZXMuTnVsbCA6XG4gIHRhcmdldCA9PT0gdm9pZCgwKSA/IFR5cGVzLlZvaWQgOlxuICBpc0FycmF5KHRhcmdldCkgPyBUeXBlcy5BcnJheSA6XG4gIGlzSXRlcmF0b3IodGFyZ2V0KSA/IFR5cGVzLkl0ZXJhdG9yIDpcbiAgdHlwZW9mKHRhcmdldCkgPT09ICdvYmplY3QnID8gdGFyZ2V0IDpcbiAgdHlwZW9mKHRhcmdldCkgPT09ICdmdW5jdGlvbicgPyBUeXBlcy5GdW5jdGlvbiA6XG4gIHR5cGVvZih0YXJnZXQpID09PSAnc3RyaW5nJyA/IFR5cGVzLlN0cmluZyA6XG4gIHR5cGVvZih0YXJnZXQpID09PSAnbnVtYmVyJyA/IFR5cGVzLk51bWJlciA6XG4gIHR5cGVvZih0YXJnZXQpID09PSAnYm9vbGVhbicgPyBUeXBlcy5Cb29sZWFuIDpcbiAgaXNSZWdFeHAodGFyZ2V0KSA/IFR5cGVzLlJlZ0V4cCA6XG4gIHR5cGVvZih0YXJnZXQpID09PSAnc3ltYm9sJyA/IFR5cGVzLlN5bWJvbCA6XG4gIFR5cGVzLkRlZmF1bHQ7XG5cblxuXG5leHBvcnQgY29uc3QgcmVkdWNlID0gKHNvdXJjZSwgdHJhbnNkdWNlciwgaW5pdGlhbCkgPT5cbiAgbWV0aG9kc09mKHNvdXJjZSlbcmVkdWNlLnN5bWJvbF0oc291cmNlLCB0cmFuc2R1Y2VyLCBpbml0aWFsKTtcbnJlZHVjZS5zeW1ib2wgPSBTeW1ib2woJ3JlZHVjZScpXG5cblR5cGVzLkFycmF5W3JlZHVjZS5zeW1ib2xdID0gKGFycmF5LCB0cmFuc2R1Y2VyLCBzdGF0ZSkgPT4ge1xuICBsZXQgaW5kZXggPSAtMVxuICBjb25zdCBjb3VudCA9IGFycmF5Lmxlbmd0aFxuICB3aGlsZSgrK2luZGV4IDwgY291bnQpIHtcbiAgICBzdGF0ZSA9IHRyYW5zZHVjZXIuc3RlcChzdGF0ZSwgYXJyYXlbaW5kZXhdKVxuICAgIGlmIChpc1JlZHVjZWQoc3RhdGUpKSB7XG4gICAgICBzdGF0ZSA9IHN0YXRlLnZhbHVlXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RhdGVcbn1cblR5cGVzLlN0cmluZ1tyZWR1Y2Uuc3ltYm9sXSA9IFR5cGVzLkFycmF5W3JlZHVjZS5zeW1ib2xdXG5UeXBlcy5JdGVyYXRvcltyZWR1Y2Uuc3ltYm9sXSA9IChpdGVyYXRvciwgdHJhbnNkdWNlciwgc3RhdGUpID0+IHtcbiAgLy8gSWYgaXRlcmF0b3Igd2l0aG91dCBjdXN0b20gYHRyYW5zY2lldmVgIG9wZXJhdGlvbiBpcyBiZWluZ1xuICAvLyB0cmFuc2R1Y2VkIHdlIGRvbid0IG5lZWQgdG8gd2FsayB0aGUgaXRlcmF0b3Igbm93IHdlIGNhbiB0cmFuc2Zvcm1cbiAgLy8gaXQgbGF6aWx5IHRoZXJlIGZvciB3ZSBjcmVhdGUgYEl0ZXJhdG9ybnNmb3JtYXRpb25gIGFuZCBwYXNzXG4gIC8vIGl0IHNvdXJjZSBpdGVyYXRvciBhbmQgYSB0cmFuc2NpZXZlciBzbyBpdCBjb3VsZCBwZXJmb3JtIHRoZXNlIHN0ZXBzXG4gIC8vIGxhemlseS5cbiAgaWYgKHN0YXRlID09PSBJdGVyYXRvckxhenlUcmFuc2Zvcm1hdGlvbi5FbXB0eSkge1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3JMYXp5VHJhbnNmb3JtYXRpb24oaXRlcmF0b3IsIHRyYW5zZHVjZXIpXG4gIH1cblxuICAvLyBPdGhlcndpc2Ugd2UgZm9yd2FyZCBpbmRpdmlkdWFsIHZhbHVlcy5cbiAgbGV0IHtkb25lLCB2YWx1ZX0gPSBpdGVyYXRvci5uZXh0KClcbiAgd2hpbGUoIWRvbmUpIHtcbiAgICBzdGF0ZSA9IHRyYW5zZHVjZXIuc3RlcChzdGF0ZSwgdmFsdWUpXG4gICAgaWYgKGlzUmVkdWNlZChzdGF0ZSkpIHtcbiAgICAgIHN0YXRlID0gc3RhdGUudmFsdWVcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICAoe2RvbmUsIHZhbHVlfSkgPSBpdGVyYXRvci5uZXh0KClcbiAgfVxuICByZXR1cm4gc3RhdGVcbn1cblxuY29uc3QgcmVkdWNlU2luZ3VsYXIgPSAodW5pdCwgcmVkdWNlciwgc3RhdGUpID0+IHtcbiAgY29uc3QgcmVzdWx0ID0gcmVkdWNlci5zdGVwKHN0YXRlLCB1bml0KVxuICByZXR1cm4gaXNSZWR1Y2VkKHJlc3VsdCkgPyByZXN1bHQudmFsdWUgOiByZXN1bHRcbn1cblxuVHlwZXMuTnVsbFtyZWR1Y2Uuc3ltYm9sXSA9IHJlZHVjZVNpbmd1bGFyXG5UeXBlcy5Wb2lkW3JlZHVjZS5zeW1ib2xdID0gcmVkdWNlU2luZ3VsYXJcblR5cGVzLk51bWJlcltyZWR1Y2Uuc3ltYm9sXSA9IHJlZHVjZVNpbmd1bGFyXG5cbmV4cG9ydCBjb25zdCByZWR1Y2VyID0gc291cmNlID0+IG1ldGhvZHNPZihzb3VyY2UpW3JlZHVjZXIuc3ltYm9sXVxucmVkdWNlci5zeW1ib2wgPSBTeW1ib2woJ3JlZHVjZXInKVxuXG5UeXBlcy5BcnJheVtyZWR1Y2VyLnN5bWJvbF0gPSBuZXcgUmVkdWNlcih7XG4gIGVtcHR5KCkge1xuICAgIHJldHVybiBbXVxuICB9LFxuICByZXN1bHQoYXJyYXkpIHtcbiAgICByZXR1cm4gYXJyYXlcbiAgfSxcbiAgc3RlcChhcnJheSwgaW5wdXQpIHtcbiAgICBhcnJheS5wdXNoKGlucHV0KVxuICAgIHJldHVybiBhcnJheVxuICB9XG59KVxuXG5UeXBlcy5OdW1iZXJbcmVkdWNlci5zeW1ib2xdID0gbmV3IFJlZHVjZXIoe1xuICBlbXB0eSgpIHtcbiAgICByZXR1cm4gMFxuICB9LFxuICByZXN1bHQobnVtYmVyKSB7XG4gICAgcmV0dXJuIG51bWJlclxuICB9LFxuICBzdGVwKG51bWJlciwgaW5wdXQpIHtcbiAgICByZXR1cm4gaXNBcnJheShpbnB1dCkgPyBpbnB1dC5yZWR1Y2UodGhpcy5zdGVwLCBudW1iZXIpIDpcbiAgICAgICAgICAgbnVtYmVyICsgaW5wdXRcbiAgfVxufSlcblxuVHlwZXMuU3RyaW5nW3JlZHVjZXIuc3ltYm9sXSA9IG5ldyBSZWR1Y2VyKHtcbiAgZW1wdHkoKSB7XG4gICAgcmV0dXJuIFwiXCJcbiAgfSxcbiAgcmVzdWx0KHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmdcbiAgfSxcbiAgc3RlcChzdHJpbmcsIGlucHV0KSB7XG4gICAgcmV0dXJuIGlzQXJyYXkoaW5wdXQpID8gc3RyaW5nLmNvbmNhdCguLi5pbnB1dCkgOlxuICAgICAgICAgICBzdHJpbmcgKyBpbnB1dFxuICB9XG59KVxuXG5UeXBlcy5OdWxsW3JlZHVjZXIuc3ltYm9sXSA9IG5ldyBSZWR1Y2VyKHtcbiAgZW1wdHkoKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfSxcbiAgcmVzdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlXG4gIH0sXG4gIHN0ZXAoXywgaW5wdXQpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG59KVxuXG5UeXBlcy5Wb2lkW3JlZHVjZXIuc3ltYm9sXSA9IG5ldyBSZWR1Y2VyKHtcbiAgZW1wdHkoKSB7XG4gICAgcmV0dXJuIHZvaWQoMClcbiAgfSxcbiAgcmVzdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlXG4gIH0sXG4gIHN0ZXAoXywgaW5wdXQpIHtcbiAgICByZXR1cm4gdm9pZCgwKVxuICB9XG59KVxuXG5jb25zdCBuaWwgPSB7fVxuVHlwZXMuSXRlcmF0b3JbcmVkdWNlci5zeW1ib2xdID0gbmV3IFJlZHVjZXIoe1xuICBlbXB0eSgpIHtcbiAgICByZXR1cm4gSXRlcmF0b3JMYXp5VHJhbnNmb3JtYXRpb24uRW1wdHlcbiAgfSxcbiAgc3RlcCh0YXJnZXQsIHZhbHVlKSB7XG4gICAgdGFyZ2V0LmJ1ZmZlci5wdXNoKHZhbHVlKVxuICAgIHJldHVybiB0YXJnZXRcbiAgfSxcbiAgcmVzdWx0KHRhcmdldCkge1xuICAgIHJldHVybiB0YXJnZXRcbiAgfVxufSlcblxuY2xhc3MgSXRlcmF0b3JMYXp5VHJhbnNmb3JtYXRpb24ge1xuICBjb25zdHJ1Y3Rvcihzb3VyY2UsIHRyYW5zZHVjZXIpIHtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZVxuICAgIHRoaXMudHJhbnNkdWNlciA9IHRyYW5zZHVjZXJcbiAgICB0aGlzLmJ1ZmZlciA9IFtdXG4gICAgdGhpcy5pc0RyYWluZWQgPSBmYWxzZVxuICAgIHRoaXMuZG9uZSA9IGZhbHNlXG4gIH1cbiAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBuZXh0KCkge1xuICAgIC8vIFB1bGwgZnJvbSB0aGUgc291cmNlIHVudGlsIHNvbWV0aGluZyBlbmRzIHVwIGluIGEgYnVmZmVyXG4gICAgLy8gb3IgdW50aWwgc291cmNlIGlzIGRyYWluZWQuIE5vdGUgdGhhdCB0cmFuc2R1Y2VyIG1heWJlXG4gICAgLy8gZmlsdGVyaW5nIHNvIGl0IG1heSB0YWtlIG11bHRpcGxlIHN0ZXBzIHVudGlsIHNvbWV0aGluZ1xuICAgIC8vIGlzIGJlaW5nIHB1c2hlZCB0byBidWZmZXIuIEl0IGFsc28gbWF5YmUgdGhhdCB0cmFuc2R1Y2VyXG4gICAgLy8gaXMgYWNjdW11bGF0aW5nIHVudGlsIHJlc3VsdCBpcyBjYWxsZWQuXG4gICAgd2hpbGUgKHRoaXMuYnVmZmVyLmxlbmd0aCA9PT0gMCAmJiAhdGhpcy5pc0RyYWluZWQpIHtcbiAgICAgIGNvbnN0IHtkb25lLCB2YWx1ZX0gPSB0aGlzLnNvdXJjZS5uZXh0KClcbiAgICAgIGlmIChkb25lKSB7XG4gICAgICAgIHRoaXMudHJhbnNkdWNlci5yZXN1bHQodGhpcylcbiAgICAgICAgdGhpcy5pc0RyYWluZWQgPSBkb25lXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnRyYW5zZHVjZXIuc3RlcCh0aGlzLCB2YWx1ZSlcbiAgICAgICAgdGhpcy5pc0RyYWluZWQgPSBpc1JlZHVjZWQocmVzdWx0KVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEF0IHRoaXMgcG9pbiB3ZSBlaXRoZXIgbWFuYWdlZCB0byBnZXQgc29tZXRoaW5nIHB1c2hlZFxuICAgIC8vIHRvIGEgYnVmZmVyIG9yIHNvdXJjZSB3YXMgZXhoYXVzdGVkIG9yIGJvdGguIElmIHNvbWV0aGluZ1xuICAgIC8vIHdhcyBwdXNoZWQgdG8gYSBidWZmZXIgd2UgZG8gbm90IGVuZCB1bnRpbCBidWZmZXIgaXMgZW1wdHksXG4gICAgLy8gc28gd2Ugc3RhcnQgd2l0aCB0aGF0LlxuICAgIGlmICh0aGlzLmJ1ZmZlci5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5idWZmZXIuc2hpZnQoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRvbmUgPSB0aGlzLmlzRHJhaW5lZFxuICAgIH1cblxuICAgIHJldHVybiB0aGlzXG4gIH1cbn1cbkl0ZXJhdG9yTGF6eVRyYW5zZm9ybWF0aW9uLkVtcHR5ID0gbmV3IFN0cmluZyhcIkl0ZXJhdG9yTGF6eVRyYW5zZm9ybWF0aW9uLkVtcHR5XCIpXG5JdGVyYXRvckxhenlUcmFuc2Zvcm1hdGlvbi5OaWwgPSBuZXcgU3RyaW5nKFwiSXRlcmF0b3JMYXp5VHJhbnNmb3JtYXRpb24uTmlsXCIpXG4vKlxuXG5jbGFzcyBDaGFubmVsSW5wdXRSZWR1Y2VyIHtcbiAgZW1wdHkoKSB7XG4gICAgcmV0dXJuIG5ldyBDaGFubmVsKClcbiAgfVxuICByZXN1bHQoY2hhbm5lbCkge1xuICAgIHJldHVybiBjaGFubmVsLmlucHV0XG4gIH1cbiAgc3RlcChjaGFubmVsLCBjaHVuaykge1xuICAgIHJldHVybiBjaGFubmVsLm91dHB1dC5wdXQoY2h1bmspXG4gIH1cbn1cblxuY29uc3QgcmVkdWNlQ2hhbm5lbElucHV0ID0gKHNvdXJjZSwgdHJhbnNkdWNlciwgY2hhbm5lbCkgPT4ge1xuICBzcGF3bihmdW5jdGlvbiooKSB7XG4gICAgbGV0IGNodW5rID0gdm9pZCgwKVxuICAgIGxldCBzdGF0ZSA9IHZvaWQoMClcbiAgICB3aGlsZSAoY2h1bmsgPSB5aWVsZCBjaGFubmVsLmlucHV0LnRha2UoKSkge1xuICAgICAgc3RhdGUgPSB5aWVsZCB0cmFuc2R1Y2VyLnJlY2lldmUoY2hhbm5lbCwgY2h1bmspO1xuICAgICAgaWYgKGlzUmVkdWNlZChzdGF0ZSkpIHtcbiAgICAgICAgc3RhdGUgPSBzdGF0ZS52YWx1ZVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgY2hhbm5lbC5vdXRwdXQuY2xvc2UoKVxuICAgIHJldHVybiBzdGF0ZVxuICB9KVxuICByZXR1cm4gdHJhbnNkdWNlci5yZXN1bHQoY2hhbm5lbClcbn1cbiovXG5cblxuXG5jb25zdCBpbmMgPSB4ID0+IHggKyAxXG5jb25zdCBpc0V2ZW4gPSB4ID0+ICEoeCAlIDIpXG5jb25zdCB1cHBlckNhc2UgPSBzdHJpbmcgPT4gc3RyaW5nLnRvVXBwZXJDYXNlKClcblxuIl19