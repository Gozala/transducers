(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  }
})(function (exports) {
  "use strict";

  var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

  var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

  var _applyConstructor = function (Constructor, args) { var instance = Object.create(Constructor.prototype); var result = Constructor.apply(instance, args); return result != null && (typeof result == "object" || typeof result == "function") ? result : instance; };

  var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _createComputedClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var prop = props[i]; prop.configurable = true; if (prop.value) prop.writable = true; Object.defineProperty(target, prop.key, prop); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var isSymbolDefined = typeof Symbol === "undefined";
  var symbol = isSymbolDefined && Symbol["for"] || function (hint) {
    return "@@" + hint;
  };

  var $iterator = isSymbolDefined && Symbol.iterator || symbol("iterator");

  var methodOf = function (target, id) {
    var method = target && target[id];
    if (!method) {
      var type = typeof target;
      method = target === null ? NullType.prototype[id] : target === void 0 ? UndefinedType.prototype[id] : isArray(target) ? ArrayType.prototype[id] : isIterator(target) ? IteratorType.prototype[id] : type === "function" ? FunctionType.prototype[id] : type === "string" ? StringType.prototype[id] : type === "number" ? NumberType.prototype[id] : type === "boolean" ? BooleanType.prototype[id] : isRegExp(target) ? RegExpType.prototype[id] : type === "symbol" ? SymbolType.prototype[id] : type === "object" ? ObjectType.prototype[id] : DefaultType.prototype[id];
    }
    return method;
  };

  exports.methodOf = methodOf;
  var dispatcher = function (name) {
    var index = arguments[1] === undefined ? 0 : arguments[1];

    var id = symbol(name);
    var dispatch = function (a, b, c, d, e) {
      var target = index === 0 ? a : index === 1 ? b : index === 2 ? c : index === 3 ? d : e;
      var method = methodOf(target, id);

      if (!method) {
        throw TypeError("target does not implements " + id + " method");
      }

      return method.call(target, a, b, c, d, e);
    };
    dispatch.symbol = id;
    return dispatch;
  };

  var init = dispatcher("transducer/init");
  exports.init = init;
  var $init = init.symbol;

  var result = dispatcher("transducer/result");
  exports.result = result;
  var $result = result.symbol;

  var step = dispatcher("transducer/step");
  exports.step = step;
  var $step = step.symbol;

  var reduce = dispatcher("transducer/reduce", 2);
  exports.reduce = reduce;
  var $reduce = reduce.symbol;

  var reduced = function (value) {
    return new Reduced(value);
  };
  exports.reduced = reduced;
  var $reduced = reduced.symbol = symbol("transducer/reduced");

  var value = function (reduced) {
    return reduced[$value];
  };
  exports.value = value;
  var $value = value.symbol = symbol("transducer/value");

  var transformer = function (transform) {
    transform[$transformer] = true;
    return transformer;
  };
  exports.transformer = transformer;
  var $transformer = transformer.symbol = symbol("transducer/transformer");

  // Functional composition compose(f, g) => f(g())
  var compose = function (f, g) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return f(g.apply(undefined, args));
    };
  };

  var prototype = Object.prototype;

  // Returns `true` if given `x` is a JS array.
  var isArray = Array.isArray || function (x) {
    return prototype.toString.call(x) === "[object Array]";
  };

  exports.isArray = isArray;
  // Returns `true` if given `x` is a regular expression.
  var isRegExp = function (x) {
    return prototype.toString.call(x) === "[object RegExp]";
  };

  exports.isRegExp = isRegExp;
  // Returns `true` if given `x` is a JS iterator.
  var isIterator = function (x) {
    return x && (x[$iterator] || typeof x.next === "function");
  };

  exports.isIterator = isIterator;
  // Returns true if `x` is boxed value & signifies that
  // reduction is complete.
  var isReduced = function (x) {
    return x instanceof Reduced || x && x[$reduced];
  };

  exports.isReduced = isReduced;
  var isReducible = function (x) {
    return x && methodOf(x, $reduce);
  };

  exports.isReducible = isReducible;
  var isReducer = function (x) {
    return x instanceof Reducer || methodOf(x, $step);
  };

  exports.isReducer = isReducer;
  var isTransformer = function (x) {
    return x && x[$transformer];
  };

  exports.isTransformer = isTransformer;
  // Class is used to box result of reduction step in order
  // to signal chained transducer that reduction has completed.

  var Reduced = exports.Reduced = function Reduced(value) {
    _classCallCheck(this, Reduced);

    this[$reduced] = true;
    this[$value] = value;

    // Compatibility with other libs:
    // https://github.com/cognitect-labs/transducers-js
    // https://github.com/jlongster/transducers.js
    this.__transducers_reduced__ = true;
    this.value = value;
  };

  Reduced.symbol = $reduced;

  var Reducer = exports.Reducer = (function () {
    function Reducer(_ref) {
      var init = _ref.init;
      var step = _ref.step;
      var result = _ref.result;

      _classCallCheck(this, Reducer);

      this[$init] = init || this[$init];
      this[$step] = step || this[$step];
      this[$result] = result || this[$result];
    }

    _createComputedClass(Reducer, [{
      key: $init,
      value: function () {
        throw TypeError("Reducer must implement [Symbol.for(\"transducer/init\")]");
      }
    }, {
      key: $step,
      value: function (result, input) {
        throw TypeError("Reducer must implement [Symbol.for(\"transducer/step\")]");
      }
    }, {
      key: $result,
      value: function (result) {
        throw TypeError("Reducer must implement [Symbol.for(\"transducer/result\")]");
      }
    }]);

    return Reducer;
  })();

  var Producer = exports.Producer = (function (_Reducer) {
    function Producer(source) {
      _classCallCheck(this, Producer);

      this[$init] = methodOf(source, $init);
      this[$step] = methodOf(source, $step);
      this[$result] = methodOf(source, $result);
    }

    _inherits(Producer, _Reducer);

    return Producer;
  })(Reducer);

  var Stepper = exports.Stepper = (function (_Reducer2) {
    function Stepper(f) {
      _classCallCheck(this, Stepper);

      this[$step] = f;
    }

    _inherits(Stepper, _Reducer2);

    _createComputedClass(Stepper, [{
      key: $init,
      value: function () {
        return this[$step]();
      }
    }, {
      key: $result,
      value: function (result) {
        return this[$step](result);
      }
    }]);

    return Stepper;
  })(Reducer);

  var Transducer = exports.Transducer = (function (_Reducer3) {
    function Transducer(reducer) {
      for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }

      _classCallCheck(this, Transducer);

      this.reducer = reducer;
      this.setup.apply(this, params);
    }

    _inherits(Transducer, _Reducer3);

    _createComputedClass(Transducer, [{
      key: "setup",
      value: function setup() {}
    }, {
      key: $init,
      value: function () {
        return this.reducer[$init]();
      }
    }, {
      key: $step,
      value: function (result, input) {
        this.advance(result, input);
      }
    }, {
      key: "advance",
      value: function advance(result, input) {
        return this.reducer[$step](result, input);
      }
    }, {
      key: $result,
      value: function (result) {
        return this.reducer[$result](result);
      }
    }]);

    return Transducer;
  })(Reducer);

  // Creates a transformer function that is a thunk for `TransducerType` and it's parameters.
  // Once returned transformer is inovked it's going to do one of the following things:
  // - If argument is an instance of a `Reducer` it's going to create an instance of Transducer
  //   with a given argument at the bottom of the chain.
  // - If argument is another transformer it's going to return composed transformer.
  // - If argument is a reducible data structure with defined reducer it's going to return
  //   transducer application over it.
  var Transform = function (TransducerType) {
    for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    var transform = function (source) {
      if (source instanceof Reducer) {
        return _applyConstructor(TransducerType, [source].concat(params));
      } else if (source && source[$transformer]) {
        return compose(source, transform);
      } else if (isReducer(source)) {
        return transduce(transform, new Producer(source), source);
      } else {
        throw TypeError("Unsupported argument type was passed to a transformer");
      }
    };
    // Should use `transformer` instead but for debugging it's kind
    // of handy to attach `TransducerType` and it `params` so we keep
    // this for now.
    transform[$transformer] = true;
    transform.Transducer = TransducerType;
    transform.params = params;
    return transform;
  };
  exports.Transform = Transform;
  Transform.symbol = $transformer;

  // Like `Transform` but allows passing parameters in the separate call.
  var Transformer = function (TransducerType) {
    return function () {
      for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      return Transform.apply(undefined, [TransducerType].concat(params));
    };
  };

  exports.Transformer = Transformer;
  // Transducers.

  var Map = (function (_Transducer) {
    function Map() {
      _classCallCheck(this, Map);

      if (_Transducer != null) {
        _Transducer.apply(this, arguments);
      }
    }

    _inherits(Map, _Transducer);

    _createComputedClass(Map, [{
      key: "setup",
      value: function setup(f) {
        this.f = f;
      }
    }, {
      key: $step,
      value: function (state, input) {
        return this.advance(state, this.f(input));
      }
    }]);

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

    _createComputedClass(Filter, [{
      key: "setup",
      value: function setup(p) {
        this.p = p;
      }
    }, {
      key: $step,
      value: function (state, input) {
        if (this.p(input)) {
          return this.advance(state, input);
        }
        return state;
      }
    }]);

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

    _createComputedClass(DropRepeats, [{
      key: $step,
      value: function (state, input) {
        if (input !== this.last) {
          this.last = input;
          return this.advance(state, input);
        }
        return state;
      }
    }]);

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

    _createComputedClass(TakeWhile, [{
      key: "setup",
      value: function setup(p) {
        this.p = p;
      }
    }, {
      key: $step,
      value: function (state, input) {
        if (this.p(input)) {
          return this.advance(state, input);
        }
        return new Reduced(state);
      }
    }]);

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

    _createComputedClass(Take, [{
      key: "setup",
      value: function setup(n) {
        this.n = n;
      }
    }, {
      key: $step,
      value: function (state, input) {
        if (this.n > 0) {
          this.n = this.n - 1;
          state = this.advance(state, input);
          if (this.n === 0 && !isReduced(state)) {
            state = new Reduced(state);
          }
        }
        return state;
      }
    }]);

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

    _createComputedClass(Drop, [{
      key: "setup",
      value: function setup(n) {
        this.n = n;
      }
    }, {
      key: $step,
      value: function (state, input) {
        this.n = this.n - 1;
        return this.n >= 0 ? state : this.advance(state, input);
      }
    }]);

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

    _createComputedClass(DropWhile, [{
      key: "setup",
      value: function setup(p) {
        this.p = p;
        this.dropping = true;
      }
    }, {
      key: $step,
      value: function (state, input) {
        this.dropping = this.dropping && this.p(input);
        return this.dropping ? state : this.advance(state, input);
      }
    }]);

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

    _createComputedClass(Partition, [{
      key: "setup",
      value: function setup(n) {
        this.n = n;
        this.i = 0;
        this.part = new Array(n);
      }
    }, {
      key: $result,
      value: function (state) {
        if (this.i > 0) {
          state = this.advance(state, this.part.slice(0, this.i));
          state = isReduced(state) ? state[$value] : state;
        }
        return _get(Object.getPrototypeOf(Partition.prototype), $result, this).call(this, state);
      }
    }, {
      key: $step,
      value: function (state, input) {
        this.part[this.i] = input;
        this.i = this.i + 1;
        if (this.i == this.n) {
          this.i = 0;
          return this.advance(state, this.part.slice(0));
        }
        return state;
      }
    }]);

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

    _createComputedClass(Forwarder, [{
      key: $step,
      value: function (state, input) {
        var result = this.advance(state, input);
        return isReduced(result) ? result[$value] : result;
      }
    }]);

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

    _createComputedClass(Cat, [{
      key: "setup",
      value: function setup() {
        this.forwarder = new Forwarder(this.reducer);
      }
    }, {
      key: $step,
      value: function (state, input) {
        return reduce(this.forwarder, state, input);
      }
    }]);

    return Cat;
  })(Transducer);

  var cat = Transform(Cat);
  exports.cat = cat;
  var mapcat = function (f) {
    return compose(cat, map(f));
  };

  exports.mapcat = mapcat;
  var transduce = function (transformer, reducer, initial, source) {
    reducer = reducer instanceof Reducer ? reducer : isReducer(reducer) ? new Producer(reducer) : typeof reducer === "function" ? new Stepper(reducer) : null;

    if (!reducer) {
      throw TypeError("Invalid reducer was passed");
    }

    var transducer = transformer(reducer);

    if (source === void 0 && initial !== void 0) {
      var _ref = [initial, transducer[$init]()];

      var _ref2 = _slicedToArray(_ref, 2);

      source = _ref2[0];
      initial = _ref2[1];
    }

    var result = reduce(transducer, initial, source);
    return transducer[$result](result);
  };

  exports.transduce = transduce;
  // Interface implementations for built-in types so we don't have
  // to patch built-ins.

  // Defaltu type is the bottom type all types including null undefined
  // and object are going to inherit from it.

  var DefaultType = exports.DefaultType = (function () {
    function DefaultType() {
      _classCallCheck(this, DefaultType);
    }

    _createComputedClass(DefaultType, [{
      key: init.symbol,
      value: function () {
        return new this.constructor();
      }
    }, {
      key: result.symbol,
      value: function (result) {
        return result;
      }
    }]);

    return DefaultType;
  })();

  // We don not make objects transducible.

  var ObjectType = exports.ObjectType = (function (_DefaultType) {
    function ObjectType() {
      _classCallCheck(this, ObjectType);

      if (_DefaultType != null) {
        _DefaultType.apply(this, arguments);
      }
    }

    _inherits(ObjectType, _DefaultType);

    return ObjectType;
  })(DefaultType);

  // We do not make functions transducible.

  var FunctionType = exports.FunctionType = (function (_DefaultType2) {
    function FunctionType() {
      _classCallCheck(this, FunctionType);

      if (_DefaultType2 != null) {
        _DefaultType2.apply(this, arguments);
      }
    }

    _inherits(FunctionType, _DefaultType2);

    return FunctionType;
  })(DefaultType);

  // All primitives gonig to inherit from AtomitType which
  // provides `reduce` implementation that's gonig to invoke
  // reducer just once with a value of the data type itself.

  var AtomicType = exports.AtomicType = (function (_DefaultType3) {
    function AtomicType() {
      _classCallCheck(this, AtomicType);

      if (_DefaultType3 != null) {
        _DefaultType3.apply(this, arguments);
      }
    }

    _inherits(AtomicType, _DefaultType3);

    _createComputedClass(AtomicType, [{
      key: reduce.symbol,
      value: function (reducer, initial, value) {
        var result = reducer[$step](initial, value);
        return isReduced(result) ? result[$value] : result;
      }
    }]);

    return AtomicType;
  })(DefaultType);

  // Any transform over `null` is just `null`.

  var NullType = exports.NullType = (function (_AtomicType) {
    function NullType() {
      _classCallCheck(this, NullType);

      if (_AtomicType != null) {
        _AtomicType.apply(this, arguments);
      }
    }

    _inherits(NullType, _AtomicType);

    _createComputedClass(NullType, [{
      key: init.symbol,
      value: function () {
        return null;
      }
    }, {
      key: step.symbol,
      value: function (result, input) {
        return null;
      }
    }]);

    return NullType;
  })(AtomicType);

  // Any transform over `undefined` is just `undefined`

  var UndefinedType = exports.UndefinedType = (function (_AtomicType2) {
    function UndefinedType() {
      _classCallCheck(this, UndefinedType);

      if (_AtomicType2 != null) {
        _AtomicType2.apply(this, arguments);
      }
    }

    _inherits(UndefinedType, _AtomicType2);

    _createComputedClass(UndefinedType, [{
      key: init.symbol,
      value: function () {
        return void 0;
      }
    }, {
      key: step.symbol,
      value: function (result, input) {
        return void 0;
      }
    }]);

    return UndefinedType;
  })(AtomicType);

  var NumberType = exports.NumberType = (function (_AtomicType3) {
    function NumberType() {
      _classCallCheck(this, NumberType);

      if (_AtomicType3 != null) {
        _AtomicType3.apply(this, arguments);
      }
    }

    _inherits(NumberType, _AtomicType3);

    _createComputedClass(NumberType, [{
      key: init.symbol,

      // Base number is `0`.
      value: function () {
        return 0;
      }
    }, {
      key: step.symbol,
      value: function (number, input) {
        // If input is an array of numbers add each one, otherwise
        // just add numbers.
        return isArray(input) ? input.reduce(NumberType.add, number) : number + input;
      }
    }], [{
      key: "add",
      value: function add(x, y) {
        return x + y;
      }
    }]);

    return NumberType;
  })(AtomicType);

  var BooleanType = exports.BooleanType = (function (_AtomicType4) {
    function BooleanType() {
      _classCallCheck(this, BooleanType);

      if (_AtomicType4 != null) {
        _AtomicType4.apply(this, arguments);
      }
    }

    _inherits(BooleanType, _AtomicType4);

    return BooleanType;
  })(AtomicType);

  var SymbolType = exports.SymbolType = (function (_AtomicType5) {
    function SymbolType() {
      _classCallCheck(this, SymbolType);

      if (_AtomicType5 != null) {
        _AtomicType5.apply(this, arguments);
      }
    }

    _inherits(SymbolType, _AtomicType5);

    return SymbolType;
  })(AtomicType);

  // Generic type to share `reduce` implementation between
  // array string or anything that have `length` and access by
  // index.

  var IndexedType = exports.IndexedType = (function (_DefaultType4) {
    function IndexedType() {
      _classCallCheck(this, IndexedType);

      if (_DefaultType4 != null) {
        _DefaultType4.apply(this, arguments);
      }
    }

    _inherits(IndexedType, _DefaultType4);

    _createComputedClass(IndexedType, [{
      key: reduce.symbol,
      value: function (reducer, initial, indexed) {
        var index = 0;
        var state = initial;
        var count = indexed.length;
        while (index < count) {
          state = reducer[$step](state, indexed[index]);
          if (isReduced(state)) {
            return state[$value];
          }
          index = index + 1;
        }
        return state;
      }
    }]);

    return IndexedType;
  })(DefaultType);

  var StringType = exports.StringType = (function (_IndexedType) {
    function StringType() {
      _classCallCheck(this, StringType);

      if (_IndexedType != null) {
        _IndexedType.apply(this, arguments);
      }
    }

    _inherits(StringType, _IndexedType);

    _createComputedClass(StringType, [{
      key: init.symbol,

      // Base string is empty string.
      value: function () {
        return "";
      }
    }, {
      key: step.symbol,

      // If input is an array concat them onto result otherwise just
      // concat to strings.
      value: function (result, input) {
        return isArray(input) ? result.concat.apply(result, _toConsumableArray(input)) : result + input;
      }
    }]);

    return StringType;
  })(IndexedType);

  var ArrayType = exports.ArrayType = (function (_IndexedType2) {
    function ArrayType() {
      _classCallCheck(this, ArrayType);

      if (_IndexedType2 != null) {
        _IndexedType2.apply(this, arguments);
      }
    }

    _inherits(ArrayType, _IndexedType2);

    _createComputedClass(ArrayType, [{
      key: init.symbol,
      value: function () {
        return [];
      }
    }, {
      key: step.symbol,
      value: function (array, value) {
        array.push(value);
        return array;
      }
    }]);

    return ArrayType;
  })(IndexedType);

  // Iteractors are kind of special in a sence that they produce

  var IteratorType = exports.IteratorType = (function (_ObjectType) {
    function IteratorType() {
      _classCallCheck(this, IteratorType);

      if (_ObjectType != null) {
        _ObjectType.apply(this, arguments);
      }
    }

    _inherits(IteratorType, _ObjectType);

    _createComputedClass(IteratorType, [{
      key: init.symbol,
      value: function () {
        return IteratorLazyTransform;
      }
    }, {
      key: step.symbol,
      value: function (result, input) {
        return result[step.symbol](result, input);
      }
    }, {
      key: reduce.symbol,
      value: function (transducer, initial, iterator) {
        // If it is transformation from iterator to iterator, then initial value is
        // going to be `IteratorLazyTransform` as (returned by [init.symbol] method above)
        // In such case we just create an instance of `IteratorLazyTransform` and return it
        // backe actual transformation will happen on demand by `IteratorLazyTransform`.
        if (initial === IteratorLazyTransform) {
          return new IteratorLazyTransform(iterator, transducer);
        }

        // Otherwise each value will be forwraded to the transducer until done
        // iteration or until reduced result is returned.
        var result = initial;
        while (true) {
          var _iterator$next = iterator.next();

          var done = _iterator$next.done;
          var _value = _iterator$next.value;

          if (done) {
            return result;
          }

          result = transducer[$step](result, _value);

          if (isReduced(result)) {
            return result[$value];
          }
        }
      }
    }]);

    return IteratorType;
  })(ObjectType);

  var IteratorLazyTransform = exports.IteratorLazyTransform = (function (_IteratorType) {
    function IteratorLazyTransform(source, transducer) {
      _classCallCheck(this, IteratorLazyTransform);

      // Each transformation step `this.transducer.step` may produce 0, 1 or more
      // steps in return. In order to accomodate extra values internal buffer is
      // going to be used.
      this.buffer = [];

      this.source = source;
      this.transducer = transducer;
      this.isDrained = false;
      this.done = false;
    }

    _inherits(IteratorLazyTransform, _IteratorType);

    _createComputedClass(IteratorLazyTransform, [{
      key: step.symbol,
      value: function (target, value) {
        target.buffer.push(value);
        return target;
      }
    }, {
      key: $iterator,
      value: function () {
        return this;
      }
    }, {
      key: "next",
      value: function next() {
        // Pull from the source until something is pushed into a buffer or
        // or until source is drained. `this.transducer` maybe filtering so
        // step may not push anything to a buffer, or it could be mapcatting
        // in which case several values will be pushed. It also maybe that
        // transducer is accumulating ond on result more values will be pushed
        // (like partition).
        while (this.buffer.length === 0 && !this.isDrained) {
          var _source$next = this.source.next();

          var done = _source$next.done;
          var _value = _source$next.value;

          // If source iterator is drained invoke result on transducer to let
          // it cleanup or push whatever it aggregated.
          if (done) {
            this.transducer[$result](this);
            this.isDrained = done;
          }
          // Otherwise keep calling step, if result is reduced then mark this
          // iterator drained to stop pulling.
          else {
            var _result = this.transducer[$step](this, _value);
            this.isDrained = isReduced(_result);
          }
        }

        // At this poin we either get something in a buffer or source was exhausted
        // or both. If something is in a buffer just return from it. If buffer is
        // empty then source is drained as well so we mark this done and finish.
        if (this.buffer.length > 0) {
          this.value = this.buffer.shift();
        } else {
          this.value = undefined;
          this.done = this.isDrained;
        }

        return this;
      }
    }]);

    return IteratorLazyTransform;
  })(IteratorType);
});
//# sourceMappingURL=data:application/json;base64,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LElBQUksQ0FBQTtPQUNaOzs7YUFDRyxnQkFBRzs7Ozs7OztBQU9MLGVBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTs2QkFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7O2NBQWpDLElBQUksZ0JBQUosSUFBSTtjQUFFLE1BQUssZ0JBQUwsS0FBSzs7OztBQUdsQixjQUFJLElBQUksRUFBRTtBQUNSLGdCQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzlCLGdCQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQTtXQUN0Qjs7O2VBR0k7QUFDSCxnQkFBTSxPQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBSyxDQUFDLENBQUE7QUFDbEQsZ0JBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLE9BQU0sQ0FBQyxDQUFBO1dBQ25DO1NBQ0Y7Ozs7O0FBS0QsWUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDMUIsY0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFBO1NBQ2pDLE1BQU07QUFDTCxjQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQTtBQUN0QixjQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUE7U0FDM0I7O0FBRUQsZUFBTyxJQUFJLENBQUE7T0FDWjs7O1dBckRVLHFCQUFxQjtLQUFTLFlBQVkiLCJmaWxlIjoic3JjL3RyYW5zZHVjZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgaXNTeW1ib2xEZWZpbmVkID0gdHlwZW9mKFN5bWJvbCkgPT09ICd1bmRlZmluZWQnO1xuY29uc3Qgc3ltYm9sID0gKGlzU3ltYm9sRGVmaW5lZCAmJiBTeW1ib2wuZm9yKSB8fCBoaW50ID0+IGBAQCR7aGludH1gXG5cbmNvbnN0ICRpdGVyYXRvciA9IGlzU3ltYm9sRGVmaW5lZCAmJiBTeW1ib2wuaXRlcmF0b3IgfHwgc3ltYm9sKCdpdGVyYXRvcicpXG5cblxuXG5leHBvcnQgY29uc3QgbWV0aG9kT2YgPSAodGFyZ2V0LCBpZCkgPT4ge1xuICBsZXQgbWV0aG9kID0gdGFyZ2V0ICYmIHRhcmdldFtpZF1cbiAgaWYgKCFtZXRob2QpIHtcbiAgICBjb25zdCB0eXBlID0gdHlwZW9mKHRhcmdldClcbiAgICBtZXRob2QgPSB0YXJnZXQgPT09IG51bGwgPyBOdWxsVHlwZS5wcm90b3R5cGVbaWRdIDpcbiAgICB0YXJnZXQgPT09IHZvaWQoMCkgPyBVbmRlZmluZWRUeXBlLnByb3RvdHlwZVtpZF0gOlxuICAgIGlzQXJyYXkodGFyZ2V0KSA/IEFycmF5VHlwZS5wcm90b3R5cGVbaWRdIDpcbiAgICBpc0l0ZXJhdG9yKHRhcmdldCkgPyBJdGVyYXRvclR5cGUucHJvdG90eXBlW2lkXSA6XG4gICAgdHlwZSA9PT0gJ2Z1bmN0aW9uJyA/IEZ1bmN0aW9uVHlwZS5wcm90b3R5cGVbaWRdIDpcbiAgICB0eXBlID09PSAnc3RyaW5nJyA/IFN0cmluZ1R5cGUucHJvdG90eXBlW2lkXSA6XG4gICAgdHlwZSA9PT0gJ251bWJlcicgPyBOdW1iZXJUeXBlLnByb3RvdHlwZVtpZF0gOlxuICAgIHR5cGUgPT09ICdib29sZWFuJyA/IEJvb2xlYW5UeXBlLnByb3RvdHlwZVtpZF0gOlxuICAgIGlzUmVnRXhwKHRhcmdldCkgPyBSZWdFeHBUeXBlLnByb3RvdHlwZVtpZF0gOlxuICAgIHR5cGUgPT09ICdzeW1ib2wnID8gU3ltYm9sVHlwZS5wcm90b3R5cGVbaWRdIDpcbiAgICB0eXBlID09PSAnb2JqZWN0JyA/IE9iamVjdFR5cGUucHJvdG90eXBlW2lkXSA6XG4gICAgRGVmYXVsdFR5cGUucHJvdG90eXBlW2lkXVxuICB9XG4gIHJldHVybiBtZXRob2Rcbn1cblxuY29uc3QgZGlzcGF0Y2hlciA9IChuYW1lLCBpbmRleD0wKSA9PiB7XG4gIGNvbnN0IGlkID0gc3ltYm9sKG5hbWUpXG4gIGNvbnN0IGRpc3BhdGNoID0gKGEsIGIsIGMsIGQsIGUpID0+IHtcbiAgICBjb25zdCB0YXJnZXQgPSBpbmRleCA9PT0gMCA/IGEgOlxuICAgICAgICAgICAgICAgICAgIGluZGV4ID09PSAxID8gYiA6XG4gICAgICAgICAgICAgICAgICAgaW5kZXggPT09IDIgPyBjIDpcbiAgICAgICAgICAgICAgICAgICBpbmRleCA9PT0gMyA/IGQgOlxuICAgICAgICAgICAgICAgICAgIGU7XG4gICAgY29uc3QgbWV0aG9kID0gbWV0aG9kT2YodGFyZ2V0LCBpZClcblxuICAgIGlmICghbWV0aG9kKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoYHRhcmdldCBkb2VzIG5vdCBpbXBsZW1lbnRzICR7aWR9IG1ldGhvZGApXG4gICAgfVxuXG4gICAgcmV0dXJuIG1ldGhvZC5jYWxsKHRhcmdldCwgYSwgYiwgYywgZCwgZSlcbiAgfVxuICBkaXNwYXRjaC5zeW1ib2wgPSBpZFxuICByZXR1cm4gZGlzcGF0Y2hcbn1cblxuZXhwb3J0IGNvbnN0IGluaXQgPSBkaXNwYXRjaGVyKFwidHJhbnNkdWNlci9pbml0XCIpXG5jb25zdCAkaW5pdCA9IGluaXQuc3ltYm9sXG5cbmV4cG9ydCBjb25zdCByZXN1bHQgPSBkaXNwYXRjaGVyKFwidHJhbnNkdWNlci9yZXN1bHRcIilcbmNvbnN0ICRyZXN1bHQgPSByZXN1bHQuc3ltYm9sXG5cbmV4cG9ydCBjb25zdCBzdGVwID0gZGlzcGF0Y2hlcihcInRyYW5zZHVjZXIvc3RlcFwiKVxuY29uc3QgJHN0ZXAgPSBzdGVwLnN5bWJvbFxuXG5leHBvcnQgY29uc3QgcmVkdWNlID0gZGlzcGF0Y2hlcihcInRyYW5zZHVjZXIvcmVkdWNlXCIsIDIpXG5jb25zdCAkcmVkdWNlID0gcmVkdWNlLnN5bWJvbFxuXG5leHBvcnQgY29uc3QgcmVkdWNlZCA9IHZhbHVlID0+IG5ldyBSZWR1Y2VkKHZhbHVlKVxuY29uc3QgJHJlZHVjZWQgPSByZWR1Y2VkLnN5bWJvbCA9IHN5bWJvbChcInRyYW5zZHVjZXIvcmVkdWNlZFwiKVxuXG5leHBvcnQgY29uc3QgdmFsdWUgPSByZWR1Y2VkID0+IHJlZHVjZWRbJHZhbHVlXVxuY29uc3QgJHZhbHVlID0gdmFsdWUuc3ltYm9sID0gc3ltYm9sKFwidHJhbnNkdWNlci92YWx1ZVwiKVxuXG5leHBvcnQgY29uc3QgdHJhbnNmb3JtZXIgPSB0cmFuc2Zvcm0gPT4ge1xuICB0cmFuc2Zvcm1bJHRyYW5zZm9ybWVyXSA9IHRydWVcbiAgcmV0dXJuIHRyYW5zZm9ybWVyXG59XG5jb25zdCAkdHJhbnNmb3JtZXIgPSB0cmFuc2Zvcm1lci5zeW1ib2wgPSBzeW1ib2woXCJ0cmFuc2R1Y2VyL3RyYW5zZm9ybWVyXCIpXG5cbi8vIEZ1bmN0aW9uYWwgY29tcG9zaXRpb24gY29tcG9zZShmLCBnKSA9PiBmKGcoKSlcbmNvbnN0IGNvbXBvc2UgPSAoZiwgZykgPT4gKC4uLmFyZ3MpID0+IGYoZyguLi5hcmdzKSlcblxuXG5jb25zdCBwcm90b3R5cGUgPSBPYmplY3QucHJvdG90eXBlXG5cbi8vIFJldHVybnMgYHRydWVgIGlmIGdpdmVuIGB4YCBpcyBhIEpTIGFycmF5LlxuZXhwb3J0IGNvbnN0IGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8XG4gIHggPT4gcHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeCkgPT09ICdbb2JqZWN0IEFycmF5XSdcblxuLy8gUmV0dXJucyBgdHJ1ZWAgaWYgZ2l2ZW4gYHhgIGlzIGEgcmVndWxhciBleHByZXNzaW9uLlxuZXhwb3J0IGNvbnN0IGlzUmVnRXhwID0geCA9PlxuICBwcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4KSA9PT0gJ1tvYmplY3QgUmVnRXhwXSdcblxuLy8gUmV0dXJucyBgdHJ1ZWAgaWYgZ2l2ZW4gYHhgIGlzIGEgSlMgaXRlcmF0b3IuXG5leHBvcnQgY29uc3QgaXNJdGVyYXRvciA9IHggPT5cbiAgeCAmJiAoeFskaXRlcmF0b3JdIHx8IHR5cGVvZih4Lm5leHQpID09PSAnZnVuY3Rpb24nKVxuXG4vLyBSZXR1cm5zIHRydWUgaWYgYHhgIGlzIGJveGVkIHZhbHVlICYgc2lnbmlmaWVzIHRoYXRcbi8vIHJlZHVjdGlvbiBpcyBjb21wbGV0ZS5cbmV4cG9ydCBjb25zdCBpc1JlZHVjZWQgPSB4ID0+XG4gIHggaW5zdGFuY2VvZiBSZWR1Y2VkIHx8ICh4ICYmIHhbJHJlZHVjZWRdKVxuXG5leHBvcnQgY29uc3QgaXNSZWR1Y2libGUgPSB4ID0+XG4gIHggJiYgbWV0aG9kT2YoeCwgJHJlZHVjZSlcblxuZXhwb3J0IGNvbnN0IGlzUmVkdWNlciA9IHggPT5cbiAgeCBpbnN0YW5jZW9mIFJlZHVjZXIgfHwgbWV0aG9kT2YoeCwgJHN0ZXApXG5cbmV4cG9ydCBjb25zdCBpc1RyYW5zZm9ybWVyID0geCA9PlxuICB4ICYmIHhbJHRyYW5zZm9ybWVyXVxuXG4vLyBDbGFzcyBpcyB1c2VkIHRvIGJveCByZXN1bHQgb2YgcmVkdWN0aW9uIHN0ZXAgaW4gb3JkZXJcbi8vIHRvIHNpZ25hbCBjaGFpbmVkIHRyYW5zZHVjZXIgdGhhdCByZWR1Y3Rpb24gaGFzIGNvbXBsZXRlZC5cbmV4cG9ydCBjbGFzcyBSZWR1Y2VkIHtcbiAgY29uc3RydWN0b3IodmFsdWUpIHtcbiAgICB0aGlzWyRyZWR1Y2VkXSA9IHRydWVcbiAgICB0aGlzWyR2YWx1ZV0gPSB2YWx1ZVxuXG4gICAgLy8gQ29tcGF0aWJpbGl0eSB3aXRoIG90aGVyIGxpYnM6XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2NvZ25pdGVjdC1sYWJzL3RyYW5zZHVjZXJzLWpzXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2psb25nc3Rlci90cmFuc2R1Y2Vycy5qc1xuICAgIHRoaXMuX190cmFuc2R1Y2Vyc19yZWR1Y2VkX18gPSB0cnVlXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlXG4gIH1cbn1cblJlZHVjZWQuc3ltYm9sID0gJHJlZHVjZWRcblxuXG5leHBvcnQgY2xhc3MgUmVkdWNlciB7XG4gIGNvbnN0cnVjdG9yKHtpbml0LCBzdGVwLCByZXN1bHR9KSB7XG4gICAgdGhpc1skaW5pdF0gPSBpbml0IHx8IHRoaXNbJGluaXRdXG4gICAgdGhpc1skc3RlcF0gPSBzdGVwIHx8IHRoaXNbJHN0ZXBdXG4gICAgdGhpc1skcmVzdWx0XSA9IHJlc3VsdCB8fCB0aGlzWyRyZXN1bHRdXG4gIH1cbiAgWyRpbml0XSgpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ1JlZHVjZXIgbXVzdCBpbXBsZW1lbnQgW1N5bWJvbC5mb3IoXCJ0cmFuc2R1Y2VyL2luaXRcIildJylcbiAgfVxuICBbJHN0ZXBdKHJlc3VsdCwgaW5wdXQpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ1JlZHVjZXIgbXVzdCBpbXBsZW1lbnQgW1N5bWJvbC5mb3IoXCJ0cmFuc2R1Y2VyL3N0ZXBcIildJylcbiAgfVxuICBbJHJlc3VsdF0ocmVzdWx0KSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdSZWR1Y2VyIG11c3QgaW1wbGVtZW50IFtTeW1ib2wuZm9yKFwidHJhbnNkdWNlci9yZXN1bHRcIildJylcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUHJvZHVjZXIgZXh0ZW5kcyBSZWR1Y2VyIHtcbiAgY29uc3RydWN0b3Ioc291cmNlKSB7XG4gICAgdGhpc1skaW5pdF0gPSBtZXRob2RPZihzb3VyY2UsICRpbml0KVxuICAgIHRoaXNbJHN0ZXBdID0gbWV0aG9kT2Yoc291cmNlLCAkc3RlcClcbiAgICB0aGlzWyRyZXN1bHRdID0gbWV0aG9kT2Yoc291cmNlLCAkcmVzdWx0KVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTdGVwcGVyIGV4dGVuZHMgUmVkdWNlciB7XG4gIGNvbnN0cnVjdG9yKGYpIHtcbiAgICB0aGlzWyRzdGVwXSA9IGZcbiAgfVxuICBbJGluaXRdKCkge1xuICAgIHJldHVybiB0aGlzWyRzdGVwXSgpXG4gIH1cbiAgWyRyZXN1bHRdKHJlc3VsdCkge1xuICAgIHJldHVybiB0aGlzWyRzdGVwXShyZXN1bHQpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRyYW5zZHVjZXIgZXh0ZW5kcyBSZWR1Y2VyIHtcbiAgY29uc3RydWN0b3IocmVkdWNlciwgLi4ucGFyYW1zKSB7XG4gICAgdGhpcy5yZWR1Y2VyID0gcmVkdWNlclxuICAgIHRoaXMuc2V0dXAoLi4ucGFyYW1zKVxuICB9XG4gIHNldHVwKCkge1xuICB9XG4gIFskaW5pdF0oKSB7XG4gICAgcmV0dXJuIHRoaXMucmVkdWNlclskaW5pdF0oKVxuICB9XG4gIFskc3RlcF0ocmVzdWx0LCBpbnB1dCkge1xuICAgIHRoaXMuYWR2YW5jZShyZXN1bHQsIGlucHV0KVxuICB9XG4gIGFkdmFuY2UocmVzdWx0LCBpbnB1dCkge1xuICAgIHJldHVybiB0aGlzLnJlZHVjZXJbJHN0ZXBdKHJlc3VsdCwgaW5wdXQpXG4gIH1cbiAgWyRyZXN1bHRdKHJlc3VsdCkge1xuICAgIHJldHVybiB0aGlzLnJlZHVjZXJbJHJlc3VsdF0ocmVzdWx0KVxuICB9XG59XG5cblxuLy8gQ3JlYXRlcyBhIHRyYW5zZm9ybWVyIGZ1bmN0aW9uIHRoYXQgaXMgYSB0aHVuayBmb3IgYFRyYW5zZHVjZXJUeXBlYCBhbmQgaXQncyBwYXJhbWV0ZXJzLlxuLy8gT25jZSByZXR1cm5lZCB0cmFuc2Zvcm1lciBpcyBpbm92a2VkIGl0J3MgZ29pbmcgdG8gZG8gb25lIG9mIHRoZSBmb2xsb3dpbmcgdGhpbmdzOlxuLy8gLSBJZiBhcmd1bWVudCBpcyBhbiBpbnN0YW5jZSBvZiBhIGBSZWR1Y2VyYCBpdCdzIGdvaW5nIHRvIGNyZWF0ZSBhbiBpbnN0YW5jZSBvZiBUcmFuc2R1Y2VyXG4vLyAgIHdpdGggYSBnaXZlbiBhcmd1bWVudCBhdCB0aGUgYm90dG9tIG9mIHRoZSBjaGFpbi5cbi8vIC0gSWYgYXJndW1lbnQgaXMgYW5vdGhlciB0cmFuc2Zvcm1lciBpdCdzIGdvaW5nIHRvIHJldHVybiBjb21wb3NlZCB0cmFuc2Zvcm1lci5cbi8vIC0gSWYgYXJndW1lbnQgaXMgYSByZWR1Y2libGUgZGF0YSBzdHJ1Y3R1cmUgd2l0aCBkZWZpbmVkIHJlZHVjZXIgaXQncyBnb2luZyB0byByZXR1cm5cbi8vICAgdHJhbnNkdWNlciBhcHBsaWNhdGlvbiBvdmVyIGl0LlxuZXhwb3J0IGNvbnN0IFRyYW5zZm9ybSA9IChUcmFuc2R1Y2VyVHlwZSwgLi4ucGFyYW1zKSA9PiB7XG4gIGNvbnN0IHRyYW5zZm9ybSA9IHNvdXJjZSA9PiB7XG4gICAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIFJlZHVjZXIpIHtcbiAgICAgIHJldHVybiBuZXcgVHJhbnNkdWNlclR5cGUoc291cmNlLCAuLi5wYXJhbXMpXG4gICAgfSBlbHNlIGlmIChzb3VyY2UgJiYgc291cmNlWyR0cmFuc2Zvcm1lcl0pIHtcbiAgICAgIHJldHVybiBjb21wb3NlKHNvdXJjZSwgdHJhbnNmb3JtKVxuICAgIH0gZWxzZSBpZiAoaXNSZWR1Y2VyKHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB0cmFuc2R1Y2UodHJhbnNmb3JtLCBuZXcgUHJvZHVjZXIoc291cmNlKSwgc291cmNlKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoXCJVbnN1cHBvcnRlZCBhcmd1bWVudCB0eXBlIHdhcyBwYXNzZWQgdG8gYSB0cmFuc2Zvcm1lclwiKVxuICAgIH1cbiAgfVxuICAvLyBTaG91bGQgdXNlIGB0cmFuc2Zvcm1lcmAgaW5zdGVhZCBidXQgZm9yIGRlYnVnZ2luZyBpdCdzIGtpbmRcbiAgLy8gb2YgaGFuZHkgdG8gYXR0YWNoIGBUcmFuc2R1Y2VyVHlwZWAgYW5kIGl0IGBwYXJhbXNgIHNvIHdlIGtlZXBcbiAgLy8gdGhpcyBmb3Igbm93LlxuICB0cmFuc2Zvcm1bJHRyYW5zZm9ybWVyXSA9IHRydWVcbiAgdHJhbnNmb3JtLlRyYW5zZHVjZXIgPSBUcmFuc2R1Y2VyVHlwZVxuICB0cmFuc2Zvcm0ucGFyYW1zID0gcGFyYW1zXG4gIHJldHVybiB0cmFuc2Zvcm1cbn1cblRyYW5zZm9ybS5zeW1ib2wgPSAkdHJhbnNmb3JtZXJcblxuLy8gTGlrZSBgVHJhbnNmb3JtYCBidXQgYWxsb3dzIHBhc3NpbmcgcGFyYW1ldGVycyBpbiB0aGUgc2VwYXJhdGUgY2FsbC5cbmV4cG9ydCBjb25zdCBUcmFuc2Zvcm1lciA9IFRyYW5zZHVjZXJUeXBlID0+ICguLi5wYXJhbXMpID0+XG4gIFRyYW5zZm9ybShUcmFuc2R1Y2VyVHlwZSwgLi4ucGFyYW1zKVxuXG4vLyBUcmFuc2R1Y2Vycy5cblxuY2xhc3MgTWFwIGV4dGVuZHMgVHJhbnNkdWNlciB7XG4gIHNldHVwKGYpIHtcbiAgICB0aGlzLmYgPSBmXG4gIH1cbiAgWyRzdGVwXShzdGF0ZSwgaW5wdXQpIHtcbiAgICByZXR1cm4gdGhpcy5hZHZhbmNlKHN0YXRlLCB0aGlzLmYoaW5wdXQpKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBtYXAgPSBUcmFuc2Zvcm1lcihNYXApXG5cblxuY2xhc3MgRmlsdGVyIGV4dGVuZHMgVHJhbnNkdWNlciB7XG4gIHNldHVwKHApIHtcbiAgICB0aGlzLnAgPSBwXG4gIH1cbiAgWyRzdGVwXShzdGF0ZSwgaW5wdXQpIHtcbiAgICBpZiAodGhpcy5wKGlucHV0KSkge1xuICAgICAgcmV0dXJuIHRoaXMuYWR2YW5jZShzdGF0ZSwgaW5wdXQpXG4gICAgfVxuICAgIHJldHVybiBzdGF0ZVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBmaWx0ZXIgPSBUcmFuc2Zvcm1lcihGaWx0ZXIpXG5leHBvcnQgY29uc3QgcmVtb3ZlID0gcCA9PiBmaWx0ZXIoeCA9PiAhcCh4KSlcblxuY2xhc3MgRHJvcFJlcGVhdHMgZXh0ZW5kcyBUcmFuc2R1Y2VyIHtcbiAgWyRzdGVwXShzdGF0ZSwgaW5wdXQpIHtcbiAgICBpZiAoaW5wdXQgIT09IHRoaXMubGFzdCkge1xuICAgICAgdGhpcy5sYXN0ID0gaW5wdXRcbiAgICAgIHJldHVybiB0aGlzLmFkdmFuY2Uoc3RhdGUsIGlucHV0KVxuICAgIH1cbiAgICByZXR1cm4gc3RhdGVcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZHJvcFJlcGVhdHMgPSBUcmFuc2Zvcm0oRHJvcFJlcGVhdHMpXG5cblxuY2xhc3MgVGFrZVdoaWxlIGV4dGVuZHMgVHJhbnNkdWNlciB7XG4gIHNldHVwKHApIHtcbiAgICB0aGlzLnAgPSBwXG4gIH1cbiAgWyRzdGVwXShzdGF0ZSwgaW5wdXQpIHtcbiAgICBpZiAodGhpcy5wKGlucHV0KSkge1xuICAgICAgcmV0dXJuIHRoaXMuYWR2YW5jZShzdGF0ZSwgaW5wdXQpXG4gICAgfVxuICAgIHJldHVybiBuZXcgUmVkdWNlZChzdGF0ZSlcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgdGFrZVdoaWxlID0gVHJhbnNmb3JtZXIoVGFrZVdoaWxlKVxuXG5jbGFzcyBUYWtlIGV4dGVuZHMgVHJhbnNkdWNlciB7XG4gIHNldHVwKG4pIHtcbiAgICB0aGlzLm4gPSBuXG4gIH1cbiAgWyRzdGVwXShzdGF0ZSwgaW5wdXQpIHtcbiAgICBpZiAodGhpcy5uID4gMCkge1xuICAgICAgdGhpcy5uID0gdGhpcy5uIC0gMVxuICAgICAgc3RhdGUgPSB0aGlzLmFkdmFuY2Uoc3RhdGUsIGlucHV0KVxuICAgICAgaWYgKHRoaXMubiA9PT0gMCAmJiAhaXNSZWR1Y2VkKHN0YXRlKSkge1xuICAgICAgICBzdGF0ZSA9IG5ldyBSZWR1Y2VkKHN0YXRlKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RhdGVcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgdGFrZSA9IFRyYW5zZm9ybWVyKFRha2UpXG5cbmNsYXNzIERyb3AgZXh0ZW5kcyBUcmFuc2R1Y2VyIHtcbiAgc2V0dXAobikge1xuICAgIHRoaXMubiA9IG5cbiAgfVxuICBbJHN0ZXBdKHN0YXRlLCBpbnB1dCkge1xuICAgIHRoaXMubiA9IHRoaXMubiAtIDE7XG4gICAgcmV0dXJuIHRoaXMubiA+PSAwID8gc3RhdGUgOiB0aGlzLmFkdmFuY2Uoc3RhdGUsIGlucHV0KVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBkcm9wID0gVHJhbnNmb3JtZXIoRHJvcClcblxuY2xhc3MgRHJvcFdoaWxlIGV4dGVuZHMgVHJhbnNkdWNlciB7XG4gIHNldHVwKHApIHtcbiAgICB0aGlzLnAgPSBwXG4gICAgdGhpcy5kcm9wcGluZyA9IHRydWVcbiAgfVxuICBbJHN0ZXBdKHN0YXRlLCBpbnB1dCkge1xuICAgIHRoaXMuZHJvcHBpbmcgPSB0aGlzLmRyb3BwaW5nICYmIHRoaXMucChpbnB1dClcbiAgICByZXR1cm4gdGhpcy5kcm9wcGluZyA/IHN0YXRlIDogdGhpcy5hZHZhbmNlKHN0YXRlLCBpbnB1dClcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZHJvcFdoaWxlID0gVHJhbnNmb3JtZXIoRHJvcFdoaWxlKVxuXG5jbGFzcyBQYXJ0aXRpb24gZXh0ZW5kcyBUcmFuc2R1Y2VyIHtcbiAgc2V0dXAobikge1xuICAgIHRoaXMubiA9IG5cbiAgICB0aGlzLmkgPSAwXG4gICAgdGhpcy5wYXJ0ID0gbmV3IEFycmF5KG4pXG4gIH1cbiAgWyRyZXN1bHRdKHN0YXRlKSB7XG4gICAgaWYgKHRoaXMuaSA+IDApIHtcbiAgICAgIHN0YXRlID0gdGhpcy5hZHZhbmNlKHN0YXRlLCB0aGlzLnBhcnQuc2xpY2UoMCwgdGhpcy5pKSlcbiAgICAgIHN0YXRlID0gaXNSZWR1Y2VkKHN0YXRlKSA/IHN0YXRlWyR2YWx1ZV0gOiBzdGF0ZVxuICAgIH1cbiAgICByZXR1cm4gc3VwZXJbJHJlc3VsdF0oc3RhdGUpXG4gIH1cbiAgWyRzdGVwXShzdGF0ZSwgaW5wdXQpIHtcbiAgICB0aGlzLnBhcnRbdGhpcy5pXSA9IGlucHV0XG4gICAgdGhpcy5pID0gdGhpcy5pICsgMVxuICAgIGlmICh0aGlzLmkgPT0gdGhpcy5uKSB7XG4gICAgICB0aGlzLmkgPSAwXG4gICAgICByZXR1cm4gdGhpcy5hZHZhbmNlKHN0YXRlLCB0aGlzLnBhcnQuc2xpY2UoMCkpXG4gICAgfVxuICAgIHJldHVybiBzdGF0ZVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBwYXJ0aXRpb24gPSBUcmFuc2Zvcm1lcihQYXJ0aXRpb24pXG5cbmNsYXNzIEZvcndhcmRlciBleHRlbmRzIFRyYW5zZHVjZXIge1xuICBbJHN0ZXBdKHN0YXRlLCBpbnB1dCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuYWR2YW5jZShzdGF0ZSwgaW5wdXQpXG4gICAgcmV0dXJuIGlzUmVkdWNlZChyZXN1bHQpID8gcmVzdWx0WyR2YWx1ZV0gOiByZXN1bHRcbiAgfVxufVxuXG5jbGFzcyBDYXQgZXh0ZW5kcyBUcmFuc2R1Y2VyIHtcbiAgc2V0dXAoKSB7XG4gICAgdGhpcy5mb3J3YXJkZXIgPSBuZXcgRm9yd2FyZGVyKHRoaXMucmVkdWNlcilcbiAgfVxuICBbJHN0ZXBdKHN0YXRlLCBpbnB1dCkge1xuICAgIHJldHVybiByZWR1Y2UodGhpcy5mb3J3YXJkZXIsIHN0YXRlLCBpbnB1dClcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgY2F0ID0gVHJhbnNmb3JtKENhdClcbmV4cG9ydCBjb25zdCBtYXBjYXQgPSBmID0+IGNvbXBvc2UoY2F0LCBtYXAoZikpXG5cbmV4cG9ydCBjb25zdCB0cmFuc2R1Y2UgPSAodHJhbnNmb3JtZXIsIHJlZHVjZXIsIGluaXRpYWwsIHNvdXJjZSkgPT4ge1xuICByZWR1Y2VyID0gcmVkdWNlciBpbnN0YW5jZW9mIFJlZHVjZXIgPyByZWR1Y2VyIDpcbiAgICAgICAgICAgIGlzUmVkdWNlcihyZWR1Y2VyKSA/IG5ldyBQcm9kdWNlcihyZWR1Y2VyKSA6XG4gICAgICAgICAgICB0eXBlb2YocmVkdWNlcikgPT09IFwiZnVuY3Rpb25cIiA/IG5ldyBTdGVwcGVyKHJlZHVjZXIpIDpcbiAgICAgICAgICAgIG51bGxcblxuICBpZiAoIXJlZHVjZXIpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoYEludmFsaWQgcmVkdWNlciB3YXMgcGFzc2VkYClcbiAgfVxuXG4gIGNvbnN0IHRyYW5zZHVjZXIgPSB0cmFuc2Zvcm1lcihyZWR1Y2VyKVxuXG4gIGlmIChzb3VyY2UgPT09IHZvaWQoMCkgJiYgaW5pdGlhbCAhPT0gdm9pZCgwKSkge1xuICAgIFtzb3VyY2UsIGluaXRpYWxdID0gW2luaXRpYWwsIHRyYW5zZHVjZXJbJGluaXRdKCldXG4gIH1cblxuICBjb25zdCByZXN1bHQgPSByZWR1Y2UodHJhbnNkdWNlciwgaW5pdGlhbCwgc291cmNlKVxuICByZXR1cm4gdHJhbnNkdWNlclskcmVzdWx0XShyZXN1bHQpXG59XG5cbi8vIEludGVyZmFjZSBpbXBsZW1lbnRhdGlvbnMgZm9yIGJ1aWx0LWluIHR5cGVzIHNvIHdlIGRvbid0IGhhdmVcbi8vIHRvIHBhdGNoIGJ1aWx0LWlucy5cblxuLy8gRGVmYWx0dSB0eXBlIGlzIHRoZSBib3R0b20gdHlwZSBhbGwgdHlwZXMgaW5jbHVkaW5nIG51bGwgdW5kZWZpbmVkXG4vLyBhbmQgb2JqZWN0IGFyZSBnb2luZyB0byBpbmhlcml0IGZyb20gaXQuXG5leHBvcnQgY2xhc3MgRGVmYXVsdFR5cGUge1xuICBbaW5pdC5zeW1ib2xdKCkge1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcigpXG4gIH1cbiAgW3Jlc3VsdC5zeW1ib2xdKHJlc3VsdCkge1xuICAgIHJldHVybiByZXN1bHRcbiAgfVxufVxuXG5cbi8vIFdlIGRvbiBub3QgbWFrZSBvYmplY3RzIHRyYW5zZHVjaWJsZS5cbmV4cG9ydCBjbGFzcyBPYmplY3RUeXBlIGV4dGVuZHMgRGVmYXVsdFR5cGUge31cblxuLy8gV2UgZG8gbm90IG1ha2UgZnVuY3Rpb25zIHRyYW5zZHVjaWJsZS5cbmV4cG9ydCBjbGFzcyBGdW5jdGlvblR5cGUgZXh0ZW5kcyBEZWZhdWx0VHlwZSB7fVxuXG5cbi8vIEFsbCBwcmltaXRpdmVzIGdvbmlnIHRvIGluaGVyaXQgZnJvbSBBdG9taXRUeXBlIHdoaWNoXG4vLyBwcm92aWRlcyBgcmVkdWNlYCBpbXBsZW1lbnRhdGlvbiB0aGF0J3MgZ29uaWcgdG8gaW52b2tlXG4vLyByZWR1Y2VyIGp1c3Qgb25jZSB3aXRoIGEgdmFsdWUgb2YgdGhlIGRhdGEgdHlwZSBpdHNlbGYuXG5leHBvcnQgY2xhc3MgQXRvbWljVHlwZSBleHRlbmRzIERlZmF1bHRUeXBlIHtcbiAgW3JlZHVjZS5zeW1ib2xdKHJlZHVjZXIsIGluaXRpYWwsIHZhbHVlKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gcmVkdWNlclskc3RlcF0oaW5pdGlhbCwgdmFsdWUpXG4gICAgcmV0dXJuIGlzUmVkdWNlZChyZXN1bHQpID8gcmVzdWx0WyR2YWx1ZV0gOiByZXN1bHRcbiAgfVxufVxuXG4vLyBBbnkgdHJhbnNmb3JtIG92ZXIgYG51bGxgIGlzIGp1c3QgYG51bGxgLlxuZXhwb3J0IGNsYXNzIE51bGxUeXBlIGV4dGVuZHMgQXRvbWljVHlwZSB7XG4gIFtpbml0LnN5bWJvbF0oKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICBbc3RlcC5zeW1ib2xdKHJlc3VsdCwgaW5wdXQpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG59XG5cblxuLy8gQW55IHRyYW5zZm9ybSBvdmVyIGB1bmRlZmluZWRgIGlzIGp1c3QgYHVuZGVmaW5lZGBcbmV4cG9ydCBjbGFzcyBVbmRlZmluZWRUeXBlIGV4dGVuZHMgQXRvbWljVHlwZSB7XG4gIFtpbml0LnN5bWJvbF0oKSB7XG4gICAgcmV0dXJuIHZvaWQoMClcbiAgfVxuICBbc3RlcC5zeW1ib2xdKHJlc3VsdCwgaW5wdXQpIHtcbiAgICByZXR1cm4gdm9pZCgwKVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOdW1iZXJUeXBlIGV4dGVuZHMgQXRvbWljVHlwZSB7XG4gIHN0YXRpYyBhZGQoeCwgeSkge1xuICAgIHJldHVybiB4ICsgeVxuICB9XG4gIC8vIEJhc2UgbnVtYmVyIGlzIGAwYC5cbiAgW2luaXQuc3ltYm9sXSgpIHtcbiAgICByZXR1cm4gMFxuICB9XG4gIFtzdGVwLnN5bWJvbF0obnVtYmVyLCBpbnB1dCkge1xuICAgIC8vIElmIGlucHV0IGlzIGFuIGFycmF5IG9mIG51bWJlcnMgYWRkIGVhY2ggb25lLCBvdGhlcndpc2VcbiAgICAvLyBqdXN0IGFkZCBudW1iZXJzLlxuICAgIHJldHVybiBpc0FycmF5KGlucHV0KSA/IGlucHV0LnJlZHVjZShOdW1iZXJUeXBlLmFkZCwgbnVtYmVyKSA6XG4gICAgbnVtYmVyICsgaW5wdXRcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBCb29sZWFuVHlwZSBleHRlbmRzIEF0b21pY1R5cGUge31cblxuZXhwb3J0IGNsYXNzIFN5bWJvbFR5cGUgZXh0ZW5kcyBBdG9taWNUeXBlIHt9XG5cblxuLy8gR2VuZXJpYyB0eXBlIHRvIHNoYXJlIGByZWR1Y2VgIGltcGxlbWVudGF0aW9uIGJldHdlZW5cbi8vIGFycmF5IHN0cmluZyBvciBhbnl0aGluZyB0aGF0IGhhdmUgYGxlbmd0aGAgYW5kIGFjY2VzcyBieVxuLy8gaW5kZXguXG5leHBvcnQgY2xhc3MgSW5kZXhlZFR5cGUgZXh0ZW5kcyBEZWZhdWx0VHlwZSB7XG4gIFtyZWR1Y2Uuc3ltYm9sXShyZWR1Y2VyLCBpbml0aWFsLCBpbmRleGVkKSB7XG4gICAgbGV0IGluZGV4ID0gMFxuICAgIGxldCBzdGF0ZSA9IGluaXRpYWxcbiAgICBjb25zdCBjb3VudCA9IGluZGV4ZWQubGVuZ3RoXG4gICAgd2hpbGUgKGluZGV4IDwgY291bnQpIHtcbiAgICAgIHN0YXRlID0gcmVkdWNlclskc3RlcF0oc3RhdGUsIGluZGV4ZWRbaW5kZXhdKVxuICAgICAgaWYgKGlzUmVkdWNlZChzdGF0ZSkpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlWyR2YWx1ZV1cbiAgICAgIH1cbiAgICAgIGluZGV4ID0gaW5kZXggKyAxXG4gICAgfVxuICAgIHJldHVybiBzdGF0ZVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTdHJpbmdUeXBlIGV4dGVuZHMgSW5kZXhlZFR5cGUge1xuICAvLyBCYXNlIHN0cmluZyBpcyBlbXB0eSBzdHJpbmcuXG4gIFtpbml0LnN5bWJvbF0oKSB7XG4gICAgcmV0dXJuIFwiXCJcbiAgfVxuICAvLyBJZiBpbnB1dCBpcyBhbiBhcnJheSBjb25jYXQgdGhlbSBvbnRvIHJlc3VsdCBvdGhlcndpc2UganVzdFxuICAvLyBjb25jYXQgdG8gc3RyaW5ncy5cbiAgW3N0ZXAuc3ltYm9sXShyZXN1bHQsIGlucHV0KSB7XG4gICAgcmV0dXJuIGlzQXJyYXkoaW5wdXQpID8gcmVzdWx0LmNvbmNhdCguLi5pbnB1dCkgOiByZXN1bHQgKyBpbnB1dFxuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIEFycmF5VHlwZSBleHRlbmRzIEluZGV4ZWRUeXBlIHtcbiAgW2luaXQuc3ltYm9sXSgpIHtcbiAgICByZXR1cm4gW11cbiAgfVxuICBbc3RlcC5zeW1ib2xdKGFycmF5LCB2YWx1ZSkge1xuICAgIGFycmF5LnB1c2godmFsdWUpXG4gICAgcmV0dXJuIGFycmF5XG4gIH1cbn1cblxuXG4vLyBJdGVyYWN0b3JzIGFyZSBraW5kIG9mIHNwZWNpYWwgaW4gYSBzZW5jZSB0aGF0IHRoZXkgcHJvZHVjZVxuZXhwb3J0IGNsYXNzIEl0ZXJhdG9yVHlwZSBleHRlbmRzIE9iamVjdFR5cGUge1xuICBbaW5pdC5zeW1ib2xdKCkge1xuICAgIHJldHVybiBJdGVyYXRvckxhenlUcmFuc2Zvcm1cbiAgfVxuICBbc3RlcC5zeW1ib2xdKHJlc3VsdCwgaW5wdXQpIHtcbiAgICByZXR1cm4gcmVzdWx0W3N0ZXAuc3ltYm9sXShyZXN1bHQsIGlucHV0KVxuICB9XG4gIFtyZWR1Y2Uuc3ltYm9sXSh0cmFuc2R1Y2VyLCBpbml0aWFsLCBpdGVyYXRvcikge1xuICAgIC8vIElmIGl0IGlzIHRyYW5zZm9ybWF0aW9uIGZyb20gaXRlcmF0b3IgdG8gaXRlcmF0b3IsIHRoZW4gaW5pdGlhbCB2YWx1ZSBpc1xuICAgIC8vIGdvaW5nIHRvIGJlIGBJdGVyYXRvckxhenlUcmFuc2Zvcm1gIGFzIChyZXR1cm5lZCBieSBbaW5pdC5zeW1ib2xdIG1ldGhvZCBhYm92ZSlcbiAgICAvLyBJbiBzdWNoIGNhc2Ugd2UganVzdCBjcmVhdGUgYW4gaW5zdGFuY2Ugb2YgYEl0ZXJhdG9yTGF6eVRyYW5zZm9ybWAgYW5kIHJldHVybiBpdFxuICAgIC8vIGJhY2tlIGFjdHVhbCB0cmFuc2Zvcm1hdGlvbiB3aWxsIGhhcHBlbiBvbiBkZW1hbmQgYnkgYEl0ZXJhdG9yTGF6eVRyYW5zZm9ybWAuXG4gICAgaWYgKGluaXRpYWwgPT09IEl0ZXJhdG9yTGF6eVRyYW5zZm9ybSkge1xuICAgICAgcmV0dXJuIG5ldyBJdGVyYXRvckxhenlUcmFuc2Zvcm0oaXRlcmF0b3IsIHRyYW5zZHVjZXIpXG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlIGVhY2ggdmFsdWUgd2lsbCBiZSBmb3J3cmFkZWQgdG8gdGhlIHRyYW5zZHVjZXIgdW50aWwgZG9uZVxuICAgIC8vIGl0ZXJhdGlvbiBvciB1bnRpbCByZWR1Y2VkIHJlc3VsdCBpcyByZXR1cm5lZC5cbiAgICBsZXQgcmVzdWx0ID0gaW5pdGlhbFxuICAgIHdoaWxlKHRydWUpIHtcbiAgICAgIGNvbnN0IHtkb25lLCB2YWx1ZX0gPSBpdGVyYXRvci5uZXh0KClcbiAgICAgIGlmIChkb25lKSB7XG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH1cblxuICAgICAgcmVzdWx0ID0gdHJhbnNkdWNlclskc3RlcF0ocmVzdWx0LCB2YWx1ZSlcblxuICAgICAgaWYgKGlzUmVkdWNlZChyZXN1bHQpKSB7XG4gICAgICAgIHJldHVybiByZXN1bHRbJHZhbHVlXVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSXRlcmF0b3JMYXp5VHJhbnNmb3JtIGV4dGVuZHMgSXRlcmF0b3JUeXBlIHtcbiAgY29uc3RydWN0b3Ioc291cmNlLCB0cmFuc2R1Y2VyKSB7XG4gICAgLy8gRWFjaCB0cmFuc2Zvcm1hdGlvbiBzdGVwIGB0aGlzLnRyYW5zZHVjZXIuc3RlcGAgbWF5IHByb2R1Y2UgMCwgMSBvciBtb3JlXG4gICAgLy8gc3RlcHMgaW4gcmV0dXJuLiBJbiBvcmRlciB0byBhY2NvbW9kYXRlIGV4dHJhIHZhbHVlcyBpbnRlcm5hbCBidWZmZXIgaXNcbiAgICAvLyBnb2luZyB0byBiZSB1c2VkLlxuICAgIHRoaXMuYnVmZmVyID0gW11cblxuICAgIHRoaXMuc291cmNlID0gc291cmNlXG4gICAgdGhpcy50cmFuc2R1Y2VyID0gdHJhbnNkdWNlclxuICAgIHRoaXMuaXNEcmFpbmVkID0gZmFsc2VcbiAgICB0aGlzLmRvbmUgPSBmYWxzZVxuICB9XG4gIFtzdGVwLnN5bWJvbF0odGFyZ2V0LCB2YWx1ZSkge1xuICAgIHRhcmdldC5idWZmZXIucHVzaCh2YWx1ZSlcbiAgICByZXR1cm4gdGFyZ2V0XG4gIH1cbiAgWyRpdGVyYXRvcl0oKSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBuZXh0KCkge1xuICAgIC8vIFB1bGwgZnJvbSB0aGUgc291cmNlIHVudGlsIHNvbWV0aGluZyBpcyBwdXNoZWQgaW50byBhIGJ1ZmZlciBvclxuICAgIC8vIG9yIHVudGlsIHNvdXJjZSBpcyBkcmFpbmVkLiBgdGhpcy50cmFuc2R1Y2VyYCBtYXliZSBmaWx0ZXJpbmcgc29cbiAgICAvLyBzdGVwIG1heSBub3QgcHVzaCBhbnl0aGluZyB0byBhIGJ1ZmZlciwgb3IgaXQgY291bGQgYmUgbWFwY2F0dGluZ1xuICAgIC8vIGluIHdoaWNoIGNhc2Ugc2V2ZXJhbCB2YWx1ZXMgd2lsbCBiZSBwdXNoZWQuIEl0IGFsc28gbWF5YmUgdGhhdFxuICAgIC8vIHRyYW5zZHVjZXIgaXMgYWNjdW11bGF0aW5nIG9uZCBvbiByZXN1bHQgbW9yZSB2YWx1ZXMgd2lsbCBiZSBwdXNoZWRcbiAgICAvLyAobGlrZSBwYXJ0aXRpb24pLlxuICAgIHdoaWxlICh0aGlzLmJ1ZmZlci5sZW5ndGggPT09IDAgJiYgIXRoaXMuaXNEcmFpbmVkKSB7XG4gICAgICBjb25zdCB7ZG9uZSwgdmFsdWV9ID0gdGhpcy5zb3VyY2UubmV4dCgpXG4gICAgICAvLyBJZiBzb3VyY2UgaXRlcmF0b3IgaXMgZHJhaW5lZCBpbnZva2UgcmVzdWx0IG9uIHRyYW5zZHVjZXIgdG8gbGV0XG4gICAgICAvLyBpdCBjbGVhbnVwIG9yIHB1c2ggd2hhdGV2ZXIgaXQgYWdncmVnYXRlZC5cbiAgICAgIGlmIChkb25lKSB7XG4gICAgICAgIHRoaXMudHJhbnNkdWNlclskcmVzdWx0XSh0aGlzKVxuICAgICAgICB0aGlzLmlzRHJhaW5lZCA9IGRvbmVcbiAgICAgIH1cbiAgICAgIC8vIE90aGVyd2lzZSBrZWVwIGNhbGxpbmcgc3RlcCwgaWYgcmVzdWx0IGlzIHJlZHVjZWQgdGhlbiBtYXJrIHRoaXNcbiAgICAgIC8vIGl0ZXJhdG9yIGRyYWluZWQgdG8gc3RvcCBwdWxsaW5nLlxuICAgICAgZWxzZSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMudHJhbnNkdWNlclskc3RlcF0odGhpcywgdmFsdWUpXG4gICAgICAgIHRoaXMuaXNEcmFpbmVkID0gaXNSZWR1Y2VkKHJlc3VsdClcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBdCB0aGlzIHBvaW4gd2UgZWl0aGVyIGdldCBzb21ldGhpbmcgaW4gYSBidWZmZXIgb3Igc291cmNlIHdhcyBleGhhdXN0ZWRcbiAgICAvLyBvciBib3RoLiBJZiBzb21ldGhpbmcgaXMgaW4gYSBidWZmZXIganVzdCByZXR1cm4gZnJvbSBpdC4gSWYgYnVmZmVyIGlzXG4gICAgLy8gZW1wdHkgdGhlbiBzb3VyY2UgaXMgZHJhaW5lZCBhcyB3ZWxsIHNvIHdlIG1hcmsgdGhpcyBkb25lIGFuZCBmaW5pc2guXG4gICAgaWYgKHRoaXMuYnVmZmVyLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLmJ1ZmZlci5zaGlmdCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmFsdWUgPSB1bmRlZmluZWRcbiAgICAgIHRoaXMuZG9uZSA9IHRoaXMuaXNEcmFpbmVkXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuIl19