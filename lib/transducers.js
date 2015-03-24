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

  var isSymbolDefined = typeof Symbol !== "undefined";
  var symbol = isSymbolDefined && Symbol["for"] || function (hint) {
    return "@@" + hint;
  };

  var $iterator = isSymbolDefined && Symbol.iterator || symbol("iterator");

  var methodOf = function (target, id) {
    var method = target && target[id];
    if (!method) {
      var type = typeof target;
      method = target === null ? NullType.prototype[id] : target === void 0 ? UndefinedType.prototype[id] : type === "string" ? StringType.prototype[id] : type === "number" ? NumberType.prototype[id] : type === "boolean" ? BooleanType.prototype[id] : type === "symbol" ? SymbolType.prototype[id] : isArray(target) ? ArrayType.prototype[id] : isIterator(target) ? IteratorType.prototype[id] : isRegExp(target) ? RegExpType.prototype[id] : type === "function" ? FunctionType.prototype[id] : type === "object" ? ObjectType.prototype[id] : DefaultType.prototype[id];
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
    return x && x[$iterator];
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
        return result;
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
        return this.advance(result, input);
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

  var Composite = exports.Composite = (function (_Transducer) {
    function Composite(source, transformer, TransducerType) {
      for (var _len = arguments.length, params = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        params[_key - 3] = arguments[_key];
      }

      _classCallCheck(this, Composite);

      this.reducer = _applyConstructor(TransducerType, [transformer(source)].concat(params));
    }

    _inherits(Composite, _Transducer);

    return Composite;
  })(Transducer);

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
        return Transform.apply(undefined, [Composite, source, TransducerType].concat(params));
      } else if (isReducer(source)) {
        var transducer = _applyConstructor(TransducerType, [new Producer(source)].concat(params));
        var initial = transducer[$init]();
        var _result = reduce(transducer, initial, source);
        return transducer[$result](_result);
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

  var Map = (function (_Transducer2) {
    function Map() {
      _classCallCheck(this, Map);

      if (_Transducer2 != null) {
        _Transducer2.apply(this, arguments);
      }
    }

    _inherits(Map, _Transducer2);

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

  var Filter = (function (_Transducer3) {
    function Filter() {
      _classCallCheck(this, Filter);

      if (_Transducer3 != null) {
        _Transducer3.apply(this, arguments);
      }
    }

    _inherits(Filter, _Transducer3);

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

  var DropRepeats = (function (_Transducer4) {
    function DropRepeats() {
      _classCallCheck(this, DropRepeats);

      if (_Transducer4 != null) {
        _Transducer4.apply(this, arguments);
      }
    }

    _inherits(DropRepeats, _Transducer4);

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

  var TakeWhile = (function (_Transducer5) {
    function TakeWhile() {
      _classCallCheck(this, TakeWhile);

      if (_Transducer5 != null) {
        _Transducer5.apply(this, arguments);
      }
    }

    _inherits(TakeWhile, _Transducer5);

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

  var Take = (function (_Transducer6) {
    function Take() {
      _classCallCheck(this, Take);

      if (_Transducer6 != null) {
        _Transducer6.apply(this, arguments);
      }
    }

    _inherits(Take, _Transducer6);

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

  var Drop = (function (_Transducer7) {
    function Drop() {
      _classCallCheck(this, Drop);

      if (_Transducer7 != null) {
        _Transducer7.apply(this, arguments);
      }
    }

    _inherits(Drop, _Transducer7);

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

  var DropWhile = (function (_Transducer8) {
    function DropWhile() {
      _classCallCheck(this, DropWhile);

      if (_Transducer8 != null) {
        _Transducer8.apply(this, arguments);
      }
    }

    _inherits(DropWhile, _Transducer8);

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

  var Partition = (function (_Transducer9) {
    function Partition() {
      _classCallCheck(this, Partition);

      if (_Transducer9 != null) {
        _Transducer9.apply(this, arguments);
      }
    }

    _inherits(Partition, _Transducer9);

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

  var Forwarder = (function (_Transducer10) {
    function Forwarder() {
      _classCallCheck(this, Forwarder);

      if (_Transducer10 != null) {
        _Transducer10.apply(this, arguments);
      }
    }

    _inherits(Forwarder, _Transducer10);

    _createComputedClass(Forwarder, [{
      key: $step,
      value: function (state, input) {
        var result = this.advance(state, input);
        return isReduced(result) ? result[$value] : result;
      }
    }]);

    return Forwarder;
  })(Transducer);

  var Cat = (function (_Transducer11) {
    function Cat() {
      _classCallCheck(this, Cat);

      if (_Transducer11 != null) {
        _Transducer11.apply(this, arguments);
      }
    }

    _inherits(Cat, _Transducer11);

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
      value: function (transducer, initial, source) {
        var iterator = source[$iterator]();
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
      this[$buffer] = [];

      this.source = source;
      this.transducer = transducer;
      this.isDrained = false;
      this.done = false;
    }

    _inherits(IteratorLazyTransform, _IteratorType);

    _createComputedClass(IteratorLazyTransform, [{
      key: step.symbol,
      value: function (target, value) {
        target[$buffer].push(value);
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
        while (this[$buffer].length === 0 && !this.isDrained) {
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
        if (this[$buffer].length > 0) {
          this.value = this[$buffer].shift();
        } else {
          this.value = undefined;
          this.done = this.isDrained;
        }

        return this;
      }
    }]);

    return IteratorLazyTransform;
  })(IteratorType);

  var $buffer = symbol("IteratorLazyTransform/buffer");
  IteratorLazyTransform.buffer = $buffer;
});
//# sourceMappingURL=data:application/json;base64,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QVk7O0FBdUR2RCxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsOEJBQThCLENBQUMsQ0FBQTtBQUN0RCx1QkFBcUIsQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFBIiwiZmlsZSI6InNyYy90cmFuc2R1Y2Vycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGlzU3ltYm9sRGVmaW5lZCA9IHR5cGVvZihTeW1ib2wpICE9PSAndW5kZWZpbmVkJztcbmNvbnN0IHN5bWJvbCA9IChpc1N5bWJvbERlZmluZWQgJiYgU3ltYm9sLmZvcikgfHwgaGludCA9PiBgQEAke2hpbnR9YFxuXG5jb25zdCAkaXRlcmF0b3IgPSBpc1N5bWJvbERlZmluZWQgJiYgU3ltYm9sLml0ZXJhdG9yIHx8IHN5bWJvbCgnaXRlcmF0b3InKVxuXG5cblxuZXhwb3J0IGNvbnN0IG1ldGhvZE9mID0gKHRhcmdldCwgaWQpID0+IHtcbiAgbGV0IG1ldGhvZCA9IHRhcmdldCAmJiB0YXJnZXRbaWRdXG4gIGlmICghbWV0aG9kKSB7XG4gICAgY29uc3QgdHlwZSA9IHR5cGVvZih0YXJnZXQpXG4gICAgbWV0aG9kID0gdGFyZ2V0ID09PSBudWxsID8gTnVsbFR5cGUucHJvdG90eXBlW2lkXSA6XG4gICAgdGFyZ2V0ID09PSB2b2lkKDApID8gVW5kZWZpbmVkVHlwZS5wcm90b3R5cGVbaWRdIDpcbiAgICB0eXBlID09PSAnc3RyaW5nJyA/IFN0cmluZ1R5cGUucHJvdG90eXBlW2lkXSA6XG4gICAgdHlwZSA9PT0gJ251bWJlcicgPyBOdW1iZXJUeXBlLnByb3RvdHlwZVtpZF0gOlxuICAgIHR5cGUgPT09ICdib29sZWFuJyA/IEJvb2xlYW5UeXBlLnByb3RvdHlwZVtpZF0gOlxuICAgIHR5cGUgPT09ICdzeW1ib2wnID8gU3ltYm9sVHlwZS5wcm90b3R5cGVbaWRdIDpcbiAgICBpc0FycmF5KHRhcmdldCkgPyBBcnJheVR5cGUucHJvdG90eXBlW2lkXSA6XG4gICAgaXNJdGVyYXRvcih0YXJnZXQpID8gSXRlcmF0b3JUeXBlLnByb3RvdHlwZVtpZF0gOlxuICAgIGlzUmVnRXhwKHRhcmdldCkgPyBSZWdFeHBUeXBlLnByb3RvdHlwZVtpZF0gOlxuICAgIHR5cGUgPT09ICdmdW5jdGlvbicgPyBGdW5jdGlvblR5cGUucHJvdG90eXBlW2lkXSA6XG4gICAgdHlwZSA9PT0gJ29iamVjdCcgPyBPYmplY3RUeXBlLnByb3RvdHlwZVtpZF0gOlxuICAgIERlZmF1bHRUeXBlLnByb3RvdHlwZVtpZF1cbiAgfVxuICByZXR1cm4gbWV0aG9kXG59XG5cbmNvbnN0IGRpc3BhdGNoZXIgPSAobmFtZSwgaW5kZXg9MCkgPT4ge1xuICBjb25zdCBpZCA9IHN5bWJvbChuYW1lKVxuICBjb25zdCBkaXNwYXRjaCA9IChhLCBiLCBjLCBkLCBlKSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0ID0gaW5kZXggPT09IDAgPyBhIDpcbiAgICAgICAgICAgICAgICAgICBpbmRleCA9PT0gMSA/IGIgOlxuICAgICAgICAgICAgICAgICAgIGluZGV4ID09PSAyID8gYyA6XG4gICAgICAgICAgICAgICAgICAgaW5kZXggPT09IDMgPyBkIDpcbiAgICAgICAgICAgICAgICAgICBlO1xuICAgIGNvbnN0IG1ldGhvZCA9IG1ldGhvZE9mKHRhcmdldCwgaWQpXG5cbiAgICBpZiAoIW1ldGhvZCkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKGB0YXJnZXQgZG9lcyBub3QgaW1wbGVtZW50cyAke2lkfSBtZXRob2RgKVxuICAgIH1cblxuICAgIHJldHVybiBtZXRob2QuY2FsbCh0YXJnZXQsIGEsIGIsIGMsIGQsIGUpXG4gIH1cbiAgZGlzcGF0Y2guc3ltYm9sID0gaWRcbiAgcmV0dXJuIGRpc3BhdGNoXG59XG5cbmV4cG9ydCBjb25zdCBpbml0ID0gZGlzcGF0Y2hlcihcInRyYW5zZHVjZXIvaW5pdFwiKVxuY29uc3QgJGluaXQgPSBpbml0LnN5bWJvbFxuXG5leHBvcnQgY29uc3QgcmVzdWx0ID0gZGlzcGF0Y2hlcihcInRyYW5zZHVjZXIvcmVzdWx0XCIpXG5jb25zdCAkcmVzdWx0ID0gcmVzdWx0LnN5bWJvbFxuXG5leHBvcnQgY29uc3Qgc3RlcCA9IGRpc3BhdGNoZXIoXCJ0cmFuc2R1Y2VyL3N0ZXBcIilcbmNvbnN0ICRzdGVwID0gc3RlcC5zeW1ib2xcblxuZXhwb3J0IGNvbnN0IHJlZHVjZSA9IGRpc3BhdGNoZXIoXCJ0cmFuc2R1Y2VyL3JlZHVjZVwiLCAyKVxuY29uc3QgJHJlZHVjZSA9IHJlZHVjZS5zeW1ib2xcblxuZXhwb3J0IGNvbnN0IHJlZHVjZWQgPSB2YWx1ZSA9PiBuZXcgUmVkdWNlZCh2YWx1ZSlcbmNvbnN0ICRyZWR1Y2VkID0gcmVkdWNlZC5zeW1ib2wgPSBzeW1ib2woXCJ0cmFuc2R1Y2VyL3JlZHVjZWRcIilcblxuZXhwb3J0IGNvbnN0IHZhbHVlID0gcmVkdWNlZCA9PiByZWR1Y2VkWyR2YWx1ZV1cbmNvbnN0ICR2YWx1ZSA9IHZhbHVlLnN5bWJvbCA9IHN5bWJvbChcInRyYW5zZHVjZXIvdmFsdWVcIilcblxuZXhwb3J0IGNvbnN0IHRyYW5zZm9ybWVyID0gdHJhbnNmb3JtID0+IHtcbiAgdHJhbnNmb3JtWyR0cmFuc2Zvcm1lcl0gPSB0cnVlXG4gIHJldHVybiB0cmFuc2Zvcm1lclxufVxuY29uc3QgJHRyYW5zZm9ybWVyID0gdHJhbnNmb3JtZXIuc3ltYm9sID0gc3ltYm9sKFwidHJhbnNkdWNlci90cmFuc2Zvcm1lclwiKVxuXG5jb25zdCBwcm90b3R5cGUgPSBPYmplY3QucHJvdG90eXBlXG5cbi8vIFJldHVybnMgYHRydWVgIGlmIGdpdmVuIGB4YCBpcyBhIEpTIGFycmF5LlxuZXhwb3J0IGNvbnN0IGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8XG4gIHggPT4gcHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeCkgPT09ICdbb2JqZWN0IEFycmF5XSdcblxuLy8gUmV0dXJucyBgdHJ1ZWAgaWYgZ2l2ZW4gYHhgIGlzIGEgcmVndWxhciBleHByZXNzaW9uLlxuZXhwb3J0IGNvbnN0IGlzUmVnRXhwID0geCA9PlxuICBwcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4KSA9PT0gJ1tvYmplY3QgUmVnRXhwXSdcblxuLy8gUmV0dXJucyBgdHJ1ZWAgaWYgZ2l2ZW4gYHhgIGlzIGEgSlMgaXRlcmF0b3IuXG5leHBvcnQgY29uc3QgaXNJdGVyYXRvciA9IHggPT5cbiAgeCAmJiB4WyRpdGVyYXRvcl1cblxuLy8gUmV0dXJucyB0cnVlIGlmIGB4YCBpcyBib3hlZCB2YWx1ZSAmIHNpZ25pZmllcyB0aGF0XG4vLyByZWR1Y3Rpb24gaXMgY29tcGxldGUuXG5leHBvcnQgY29uc3QgaXNSZWR1Y2VkID0geCA9PlxuICB4IGluc3RhbmNlb2YgUmVkdWNlZCB8fCAoeCAmJiB4WyRyZWR1Y2VkXSlcblxuZXhwb3J0IGNvbnN0IGlzUmVkdWNpYmxlID0geCA9PlxuICB4ICYmIG1ldGhvZE9mKHgsICRyZWR1Y2UpXG5cbmV4cG9ydCBjb25zdCBpc1JlZHVjZXIgPSB4ID0+XG4gIHggaW5zdGFuY2VvZiBSZWR1Y2VyIHx8IG1ldGhvZE9mKHgsICRzdGVwKVxuXG5leHBvcnQgY29uc3QgaXNUcmFuc2Zvcm1lciA9IHggPT5cbiAgeCAmJiB4WyR0cmFuc2Zvcm1lcl1cblxuLy8gQ2xhc3MgaXMgdXNlZCB0byBib3ggcmVzdWx0IG9mIHJlZHVjdGlvbiBzdGVwIGluIG9yZGVyXG4vLyB0byBzaWduYWwgY2hhaW5lZCB0cmFuc2R1Y2VyIHRoYXQgcmVkdWN0aW9uIGhhcyBjb21wbGV0ZWQuXG5leHBvcnQgY2xhc3MgUmVkdWNlZCB7XG4gIGNvbnN0cnVjdG9yKHZhbHVlKSB7XG4gICAgdGhpc1skcmVkdWNlZF0gPSB0cnVlXG4gICAgdGhpc1skdmFsdWVdID0gdmFsdWVcblxuICAgIC8vIENvbXBhdGliaWxpdHkgd2l0aCBvdGhlciBsaWJzOlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9jb2duaXRlY3QtbGFicy90cmFuc2R1Y2Vycy1qc1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9qbG9uZ3N0ZXIvdHJhbnNkdWNlcnMuanNcbiAgICB0aGlzLl9fdHJhbnNkdWNlcnNfcmVkdWNlZF9fID0gdHJ1ZVxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZVxuICB9XG59XG5SZWR1Y2VkLnN5bWJvbCA9ICRyZWR1Y2VkXG5cblxuZXhwb3J0IGNsYXNzIFJlZHVjZXIge1xuICBjb25zdHJ1Y3Rvcih7aW5pdCwgc3RlcCwgcmVzdWx0fSkge1xuICAgIHRoaXNbJGluaXRdID0gaW5pdCB8fCB0aGlzWyRpbml0XVxuICAgIHRoaXNbJHN0ZXBdID0gc3RlcCB8fCB0aGlzWyRzdGVwXVxuICAgIHRoaXNbJHJlc3VsdF0gPSByZXN1bHQgfHwgdGhpc1skcmVzdWx0XVxuICB9XG4gIFskaW5pdF0oKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdSZWR1Y2VyIG11c3QgaW1wbGVtZW50IFtTeW1ib2wuZm9yKFwidHJhbnNkdWNlci9pbml0XCIpXScpXG4gIH1cbiAgWyRzdGVwXShyZXN1bHQsIGlucHV0KSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdSZWR1Y2VyIG11c3QgaW1wbGVtZW50IFtTeW1ib2wuZm9yKFwidHJhbnNkdWNlci9zdGVwXCIpXScpXG4gIH1cbiAgWyRyZXN1bHRdKHJlc3VsdCkge1xuICAgIHRocm93IFR5cGVFcnJvcignUmVkdWNlciBtdXN0IGltcGxlbWVudCBbU3ltYm9sLmZvcihcInRyYW5zZHVjZXIvcmVzdWx0XCIpXScpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFByb2R1Y2VyIGV4dGVuZHMgUmVkdWNlciB7XG4gIGNvbnN0cnVjdG9yKHNvdXJjZSkge1xuICAgIHRoaXNbJGluaXRdID0gbWV0aG9kT2Yoc291cmNlLCAkaW5pdClcbiAgICB0aGlzWyRzdGVwXSA9IG1ldGhvZE9mKHNvdXJjZSwgJHN0ZXApXG4gICAgdGhpc1skcmVzdWx0XSA9IG1ldGhvZE9mKHNvdXJjZSwgJHJlc3VsdClcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3RlcHBlciBleHRlbmRzIFJlZHVjZXIge1xuICBjb25zdHJ1Y3RvcihmKSB7XG4gICAgdGhpc1skc3RlcF0gPSBmXG4gIH1cbiAgWyRpbml0XSgpIHtcbiAgICByZXR1cm4gdGhpc1skc3RlcF0oKVxuICB9XG4gIFskcmVzdWx0XShyZXN1bHQpIHtcbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRyYW5zZHVjZXIgZXh0ZW5kcyBSZWR1Y2VyIHtcbiAgY29uc3RydWN0b3IocmVkdWNlciwgLi4ucGFyYW1zKSB7XG4gICAgdGhpcy5yZWR1Y2VyID0gcmVkdWNlclxuICAgIHRoaXMuc2V0dXAoLi4ucGFyYW1zKVxuICB9XG4gIHNldHVwKCkge1xuICB9XG4gIFskaW5pdF0oKSB7XG4gICAgcmV0dXJuIHRoaXMucmVkdWNlclskaW5pdF0oKVxuICB9XG4gIFskc3RlcF0ocmVzdWx0LCBpbnB1dCkge1xuICAgIHJldHVybiB0aGlzLmFkdmFuY2UocmVzdWx0LCBpbnB1dClcbiAgfVxuICBhZHZhbmNlKHJlc3VsdCwgaW5wdXQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWR1Y2VyWyRzdGVwXShyZXN1bHQsIGlucHV0KVxuICB9XG4gIFskcmVzdWx0XShyZXN1bHQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWR1Y2VyWyRyZXN1bHRdKHJlc3VsdClcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29tcG9zaXRlIGV4dGVuZHMgVHJhbnNkdWNlciB7XG4gIGNvbnN0cnVjdG9yKHNvdXJjZSwgdHJhbnNmb3JtZXIsIFRyYW5zZHVjZXJUeXBlLCAuLi5wYXJhbXMpIHtcbiAgICB0aGlzLnJlZHVjZXIgPSBuZXcgVHJhbnNkdWNlclR5cGUodHJhbnNmb3JtZXIoc291cmNlKSwgLi4ucGFyYW1zKVxuICB9XG59XG5cbi8vIENyZWF0ZXMgYSB0cmFuc2Zvcm1lciBmdW5jdGlvbiB0aGF0IGlzIGEgdGh1bmsgZm9yIGBUcmFuc2R1Y2VyVHlwZWAgYW5kIGl0J3MgcGFyYW1ldGVycy5cbi8vIE9uY2UgcmV0dXJuZWQgdHJhbnNmb3JtZXIgaXMgaW5vdmtlZCBpdCdzIGdvaW5nIHRvIGRvIG9uZSBvZiB0aGUgZm9sbG93aW5nIHRoaW5nczpcbi8vIC0gSWYgYXJndW1lbnQgaXMgYW4gaW5zdGFuY2Ugb2YgYSBgUmVkdWNlcmAgaXQncyBnb2luZyB0byBjcmVhdGUgYW4gaW5zdGFuY2Ugb2YgVHJhbnNkdWNlclxuLy8gICB3aXRoIGEgZ2l2ZW4gYXJndW1lbnQgYXQgdGhlIGJvdHRvbSBvZiB0aGUgY2hhaW4uXG4vLyAtIElmIGFyZ3VtZW50IGlzIGFub3RoZXIgdHJhbnNmb3JtZXIgaXQncyBnb2luZyB0byByZXR1cm4gY29tcG9zZWQgdHJhbnNmb3JtZXIuXG4vLyAtIElmIGFyZ3VtZW50IGlzIGEgcmVkdWNpYmxlIGRhdGEgc3RydWN0dXJlIHdpdGggZGVmaW5lZCByZWR1Y2VyIGl0J3MgZ29pbmcgdG8gcmV0dXJuXG4vLyAgIHRyYW5zZHVjZXIgYXBwbGljYXRpb24gb3ZlciBpdC5cbmV4cG9ydCBjb25zdCBUcmFuc2Zvcm0gPSAoVHJhbnNkdWNlclR5cGUsIC4uLnBhcmFtcykgPT4ge1xuICBjb25zdCB0cmFuc2Zvcm0gPSBzb3VyY2UgPT4ge1xuICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBSZWR1Y2VyKSB7XG4gICAgICByZXR1cm4gbmV3IFRyYW5zZHVjZXJUeXBlKHNvdXJjZSwgLi4ucGFyYW1zKVxuICAgIH0gZWxzZSBpZiAoc291cmNlICYmIHNvdXJjZVskdHJhbnNmb3JtZXJdKSB7XG4gICAgICByZXR1cm4gVHJhbnNmb3JtKENvbXBvc2l0ZSwgc291cmNlLCBUcmFuc2R1Y2VyVHlwZSwgLi4ucGFyYW1zKVxuICAgIH0gZWxzZSBpZiAoaXNSZWR1Y2VyKHNvdXJjZSkpIHtcbiAgICAgIGNvbnN0IHRyYW5zZHVjZXIgPSBuZXcgVHJhbnNkdWNlclR5cGUobmV3IFByb2R1Y2VyKHNvdXJjZSksIC4uLnBhcmFtcylcbiAgICAgIGNvbnN0IGluaXRpYWwgPSB0cmFuc2R1Y2VyWyRpbml0XSgpXG4gICAgICBjb25zdCByZXN1bHQgPSByZWR1Y2UodHJhbnNkdWNlciwgaW5pdGlhbCwgc291cmNlKVxuICAgICAgcmV0dXJuIHRyYW5zZHVjZXJbJHJlc3VsdF0ocmVzdWx0KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoXCJVbnN1cHBvcnRlZCBhcmd1bWVudCB0eXBlIHdhcyBwYXNzZWQgdG8gYSB0cmFuc2Zvcm1lclwiKVxuICAgIH1cbiAgfVxuICAvLyBTaG91bGQgdXNlIGB0cmFuc2Zvcm1lcmAgaW5zdGVhZCBidXQgZm9yIGRlYnVnZ2luZyBpdCdzIGtpbmRcbiAgLy8gb2YgaGFuZHkgdG8gYXR0YWNoIGBUcmFuc2R1Y2VyVHlwZWAgYW5kIGl0IGBwYXJhbXNgIHNvIHdlIGtlZXBcbiAgLy8gdGhpcyBmb3Igbm93LlxuICB0cmFuc2Zvcm1bJHRyYW5zZm9ybWVyXSA9IHRydWVcbiAgdHJhbnNmb3JtLlRyYW5zZHVjZXIgPSBUcmFuc2R1Y2VyVHlwZVxuICB0cmFuc2Zvcm0ucGFyYW1zID0gcGFyYW1zXG4gIHJldHVybiB0cmFuc2Zvcm1cbn1cblRyYW5zZm9ybS5zeW1ib2wgPSAkdHJhbnNmb3JtZXJcblxuLy8gTGlrZSBgVHJhbnNmb3JtYCBidXQgYWxsb3dzIHBhc3NpbmcgcGFyYW1ldGVycyBpbiB0aGUgc2VwYXJhdGUgY2FsbC5cbmV4cG9ydCBjb25zdCBUcmFuc2Zvcm1lciA9IFRyYW5zZHVjZXJUeXBlID0+ICguLi5wYXJhbXMpID0+XG4gIFRyYW5zZm9ybShUcmFuc2R1Y2VyVHlwZSwgLi4ucGFyYW1zKVxuXG4vLyBUcmFuc2R1Y2Vycy5cblxuY2xhc3MgTWFwIGV4dGVuZHMgVHJhbnNkdWNlciB7XG4gIHNldHVwKGYpIHtcbiAgICB0aGlzLmYgPSBmXG4gIH1cbiAgWyRzdGVwXShzdGF0ZSwgaW5wdXQpIHtcbiAgICByZXR1cm4gdGhpcy5hZHZhbmNlKHN0YXRlLCB0aGlzLmYoaW5wdXQpKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBtYXAgPSBUcmFuc2Zvcm1lcihNYXApXG5cblxuY2xhc3MgRmlsdGVyIGV4dGVuZHMgVHJhbnNkdWNlciB7XG4gIHNldHVwKHApIHtcbiAgICB0aGlzLnAgPSBwXG4gIH1cbiAgWyRzdGVwXShzdGF0ZSwgaW5wdXQpIHtcbiAgICBpZiAodGhpcy5wKGlucHV0KSkge1xuICAgICAgcmV0dXJuIHRoaXMuYWR2YW5jZShzdGF0ZSwgaW5wdXQpXG4gICAgfVxuICAgIHJldHVybiBzdGF0ZVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBmaWx0ZXIgPSBUcmFuc2Zvcm1lcihGaWx0ZXIpXG5leHBvcnQgY29uc3QgcmVtb3ZlID0gcCA9PiBmaWx0ZXIoeCA9PiAhcCh4KSlcblxuY2xhc3MgRHJvcFJlcGVhdHMgZXh0ZW5kcyBUcmFuc2R1Y2VyIHtcbiAgWyRzdGVwXShzdGF0ZSwgaW5wdXQpIHtcbiAgICBpZiAoaW5wdXQgIT09IHRoaXMubGFzdCkge1xuICAgICAgdGhpcy5sYXN0ID0gaW5wdXRcbiAgICAgIHJldHVybiB0aGlzLmFkdmFuY2Uoc3RhdGUsIGlucHV0KVxuICAgIH1cbiAgICByZXR1cm4gc3RhdGVcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZHJvcFJlcGVhdHMgPSBUcmFuc2Zvcm0oRHJvcFJlcGVhdHMpXG5cblxuY2xhc3MgVGFrZVdoaWxlIGV4dGVuZHMgVHJhbnNkdWNlciB7XG4gIHNldHVwKHApIHtcbiAgICB0aGlzLnAgPSBwXG4gIH1cbiAgWyRzdGVwXShzdGF0ZSwgaW5wdXQpIHtcbiAgICBpZiAodGhpcy5wKGlucHV0KSkge1xuICAgICAgcmV0dXJuIHRoaXMuYWR2YW5jZShzdGF0ZSwgaW5wdXQpXG4gICAgfVxuICAgIHJldHVybiBuZXcgUmVkdWNlZChzdGF0ZSlcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgdGFrZVdoaWxlID0gVHJhbnNmb3JtZXIoVGFrZVdoaWxlKVxuXG5jbGFzcyBUYWtlIGV4dGVuZHMgVHJhbnNkdWNlciB7XG4gIHNldHVwKG4pIHtcbiAgICB0aGlzLm4gPSBuXG4gIH1cbiAgWyRzdGVwXShzdGF0ZSwgaW5wdXQpIHtcbiAgICBpZiAodGhpcy5uID4gMCkge1xuICAgICAgdGhpcy5uID0gdGhpcy5uIC0gMVxuICAgICAgc3RhdGUgPSB0aGlzLmFkdmFuY2Uoc3RhdGUsIGlucHV0KVxuICAgICAgaWYgKHRoaXMubiA9PT0gMCAmJiAhaXNSZWR1Y2VkKHN0YXRlKSkge1xuICAgICAgICBzdGF0ZSA9IG5ldyBSZWR1Y2VkKHN0YXRlKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RhdGVcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgdGFrZSA9IFRyYW5zZm9ybWVyKFRha2UpXG5cbmNsYXNzIERyb3AgZXh0ZW5kcyBUcmFuc2R1Y2VyIHtcbiAgc2V0dXAobikge1xuICAgIHRoaXMubiA9IG5cbiAgfVxuICBbJHN0ZXBdKHN0YXRlLCBpbnB1dCkge1xuICAgIHRoaXMubiA9IHRoaXMubiAtIDE7XG4gICAgcmV0dXJuIHRoaXMubiA+PSAwID8gc3RhdGUgOiB0aGlzLmFkdmFuY2Uoc3RhdGUsIGlucHV0KVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBkcm9wID0gVHJhbnNmb3JtZXIoRHJvcClcblxuY2xhc3MgRHJvcFdoaWxlIGV4dGVuZHMgVHJhbnNkdWNlciB7XG4gIHNldHVwKHApIHtcbiAgICB0aGlzLnAgPSBwXG4gICAgdGhpcy5kcm9wcGluZyA9IHRydWVcbiAgfVxuICBbJHN0ZXBdKHN0YXRlLCBpbnB1dCkge1xuICAgIHRoaXMuZHJvcHBpbmcgPSB0aGlzLmRyb3BwaW5nICYmIHRoaXMucChpbnB1dClcbiAgICByZXR1cm4gdGhpcy5kcm9wcGluZyA/IHN0YXRlIDogdGhpcy5hZHZhbmNlKHN0YXRlLCBpbnB1dClcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZHJvcFdoaWxlID0gVHJhbnNmb3JtZXIoRHJvcFdoaWxlKVxuXG5jbGFzcyBQYXJ0aXRpb24gZXh0ZW5kcyBUcmFuc2R1Y2VyIHtcbiAgc2V0dXAobikge1xuICAgIHRoaXMubiA9IG5cbiAgICB0aGlzLmkgPSAwXG4gICAgdGhpcy5wYXJ0ID0gbmV3IEFycmF5KG4pXG4gIH1cbiAgWyRyZXN1bHRdKHN0YXRlKSB7XG4gICAgaWYgKHRoaXMuaSA+IDApIHtcbiAgICAgIHN0YXRlID0gdGhpcy5hZHZhbmNlKHN0YXRlLCB0aGlzLnBhcnQuc2xpY2UoMCwgdGhpcy5pKSlcbiAgICAgIHN0YXRlID0gaXNSZWR1Y2VkKHN0YXRlKSA/IHN0YXRlWyR2YWx1ZV0gOiBzdGF0ZVxuICAgIH1cbiAgICByZXR1cm4gc3VwZXJbJHJlc3VsdF0oc3RhdGUpXG4gIH1cbiAgWyRzdGVwXShzdGF0ZSwgaW5wdXQpIHtcbiAgICB0aGlzLnBhcnRbdGhpcy5pXSA9IGlucHV0XG4gICAgdGhpcy5pID0gdGhpcy5pICsgMVxuICAgIGlmICh0aGlzLmkgPT0gdGhpcy5uKSB7XG4gICAgICB0aGlzLmkgPSAwXG4gICAgICByZXR1cm4gdGhpcy5hZHZhbmNlKHN0YXRlLCB0aGlzLnBhcnQuc2xpY2UoMCkpXG4gICAgfVxuICAgIHJldHVybiBzdGF0ZVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBwYXJ0aXRpb24gPSBUcmFuc2Zvcm1lcihQYXJ0aXRpb24pXG5cbmNsYXNzIEZvcndhcmRlciBleHRlbmRzIFRyYW5zZHVjZXIge1xuICBbJHN0ZXBdKHN0YXRlLCBpbnB1dCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuYWR2YW5jZShzdGF0ZSwgaW5wdXQpXG4gICAgcmV0dXJuIGlzUmVkdWNlZChyZXN1bHQpID8gcmVzdWx0WyR2YWx1ZV0gOiByZXN1bHRcbiAgfVxufVxuXG5jbGFzcyBDYXQgZXh0ZW5kcyBUcmFuc2R1Y2VyIHtcbiAgc2V0dXAoKSB7XG4gICAgdGhpcy5mb3J3YXJkZXIgPSBuZXcgRm9yd2FyZGVyKHRoaXMucmVkdWNlcilcbiAgfVxuICBbJHN0ZXBdKHN0YXRlLCBpbnB1dCkge1xuICAgIHJldHVybiByZWR1Y2UodGhpcy5mb3J3YXJkZXIsIHN0YXRlLCBpbnB1dClcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgY2F0ID0gVHJhbnNmb3JtKENhdClcblxuZXhwb3J0IGNvbnN0IHRyYW5zZHVjZSA9ICh0cmFuc2Zvcm1lciwgcmVkdWNlciwgaW5pdGlhbCwgc291cmNlKSA9PiB7XG4gIHJlZHVjZXIgPSByZWR1Y2VyIGluc3RhbmNlb2YgUmVkdWNlciA/IHJlZHVjZXIgOlxuICAgICAgICAgICAgaXNSZWR1Y2VyKHJlZHVjZXIpID8gbmV3IFByb2R1Y2VyKHJlZHVjZXIpIDpcbiAgICAgICAgICAgIHR5cGVvZihyZWR1Y2VyKSA9PT0gXCJmdW5jdGlvblwiID8gbmV3IFN0ZXBwZXIocmVkdWNlcikgOlxuICAgICAgICAgICAgbnVsbFxuXG4gIGlmICghcmVkdWNlcikge1xuICAgIHRocm93IFR5cGVFcnJvcihgSW52YWxpZCByZWR1Y2VyIHdhcyBwYXNzZWRgKVxuICB9XG5cbiAgY29uc3QgdHJhbnNkdWNlciA9IHRyYW5zZm9ybWVyKHJlZHVjZXIpXG5cbiAgaWYgKHNvdXJjZSA9PT0gdm9pZCgwKSAmJiBpbml0aWFsICE9PSB2b2lkKDApKSB7XG4gICAgW3NvdXJjZSwgaW5pdGlhbF0gPSBbaW5pdGlhbCwgdHJhbnNkdWNlclskaW5pdF0oKV1cbiAgfVxuXG4gIGNvbnN0IHJlc3VsdCA9IHJlZHVjZSh0cmFuc2R1Y2VyLCBpbml0aWFsLCBzb3VyY2UpXG4gIHJldHVybiB0cmFuc2R1Y2VyWyRyZXN1bHRdKHJlc3VsdClcbn1cblxuLy8gSW50ZXJmYWNlIGltcGxlbWVudGF0aW9ucyBmb3IgYnVpbHQtaW4gdHlwZXMgc28gd2UgZG9uJ3QgaGF2ZVxuLy8gdG8gcGF0Y2ggYnVpbHQtaW5zLlxuXG4vLyBEZWZhbHR1IHR5cGUgaXMgdGhlIGJvdHRvbSB0eXBlIGFsbCB0eXBlcyBpbmNsdWRpbmcgbnVsbCB1bmRlZmluZWRcbi8vIGFuZCBvYmplY3QgYXJlIGdvaW5nIHRvIGluaGVyaXQgZnJvbSBpdC5cbmV4cG9ydCBjbGFzcyBEZWZhdWx0VHlwZSB7XG4gIFtpbml0LnN5bWJvbF0oKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKClcbiAgfVxuICBbcmVzdWx0LnN5bWJvbF0ocmVzdWx0KSB7XG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG59XG5cblxuLy8gV2UgZG9uIG5vdCBtYWtlIG9iamVjdHMgdHJhbnNkdWNpYmxlLlxuZXhwb3J0IGNsYXNzIE9iamVjdFR5cGUgZXh0ZW5kcyBEZWZhdWx0VHlwZSB7fVxuXG4vLyBXZSBkbyBub3QgbWFrZSBmdW5jdGlvbnMgdHJhbnNkdWNpYmxlLlxuZXhwb3J0IGNsYXNzIEZ1bmN0aW9uVHlwZSBleHRlbmRzIERlZmF1bHRUeXBlIHt9XG5cblxuLy8gQWxsIHByaW1pdGl2ZXMgZ29uaWcgdG8gaW5oZXJpdCBmcm9tIEF0b21pdFR5cGUgd2hpY2hcbi8vIHByb3ZpZGVzIGByZWR1Y2VgIGltcGxlbWVudGF0aW9uIHRoYXQncyBnb25pZyB0byBpbnZva2Vcbi8vIHJlZHVjZXIganVzdCBvbmNlIHdpdGggYSB2YWx1ZSBvZiB0aGUgZGF0YSB0eXBlIGl0c2VsZi5cbmV4cG9ydCBjbGFzcyBBdG9taWNUeXBlIGV4dGVuZHMgRGVmYXVsdFR5cGUge1xuICBbcmVkdWNlLnN5bWJvbF0ocmVkdWNlciwgaW5pdGlhbCwgdmFsdWUpIHtcbiAgICBjb25zdCByZXN1bHQgPSByZWR1Y2VyWyRzdGVwXShpbml0aWFsLCB2YWx1ZSlcbiAgICByZXR1cm4gaXNSZWR1Y2VkKHJlc3VsdCkgPyByZXN1bHRbJHZhbHVlXSA6IHJlc3VsdFxuICB9XG59XG5cbi8vIEFueSB0cmFuc2Zvcm0gb3ZlciBgbnVsbGAgaXMganVzdCBgbnVsbGAuXG5leHBvcnQgY2xhc3MgTnVsbFR5cGUgZXh0ZW5kcyBBdG9taWNUeXBlIHtcbiAgW2luaXQuc3ltYm9sXSgpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG4gIFtzdGVwLnN5bWJvbF0ocmVzdWx0LCBpbnB1dCkge1xuICAgIHJldHVybiBudWxsXG4gIH1cbn1cblxuXG4vLyBBbnkgdHJhbnNmb3JtIG92ZXIgYHVuZGVmaW5lZGAgaXMganVzdCBgdW5kZWZpbmVkYFxuZXhwb3J0IGNsYXNzIFVuZGVmaW5lZFR5cGUgZXh0ZW5kcyBBdG9taWNUeXBlIHtcbiAgW2luaXQuc3ltYm9sXSgpIHtcbiAgICByZXR1cm4gdm9pZCgwKVxuICB9XG4gIFtzdGVwLnN5bWJvbF0ocmVzdWx0LCBpbnB1dCkge1xuICAgIHJldHVybiB2b2lkKDApXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE51bWJlclR5cGUgZXh0ZW5kcyBBdG9taWNUeXBlIHtcbiAgc3RhdGljIGFkZCh4LCB5KSB7XG4gICAgcmV0dXJuIHggKyB5XG4gIH1cbiAgLy8gQmFzZSBudW1iZXIgaXMgYDBgLlxuICBbaW5pdC5zeW1ib2xdKCkge1xuICAgIHJldHVybiAwXG4gIH1cbiAgW3N0ZXAuc3ltYm9sXShudW1iZXIsIGlucHV0KSB7XG4gICAgLy8gSWYgaW5wdXQgaXMgYW4gYXJyYXkgb2YgbnVtYmVycyBhZGQgZWFjaCBvbmUsIG90aGVyd2lzZVxuICAgIC8vIGp1c3QgYWRkIG51bWJlcnMuXG4gICAgcmV0dXJuIGlzQXJyYXkoaW5wdXQpID8gaW5wdXQucmVkdWNlKE51bWJlclR5cGUuYWRkLCBudW1iZXIpIDpcbiAgICBudW1iZXIgKyBpbnB1dFxuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIEJvb2xlYW5UeXBlIGV4dGVuZHMgQXRvbWljVHlwZSB7fVxuXG5leHBvcnQgY2xhc3MgU3ltYm9sVHlwZSBleHRlbmRzIEF0b21pY1R5cGUge31cblxuXG4vLyBHZW5lcmljIHR5cGUgdG8gc2hhcmUgYHJlZHVjZWAgaW1wbGVtZW50YXRpb24gYmV0d2VlblxuLy8gYXJyYXkgc3RyaW5nIG9yIGFueXRoaW5nIHRoYXQgaGF2ZSBgbGVuZ3RoYCBhbmQgYWNjZXNzIGJ5XG4vLyBpbmRleC5cbmV4cG9ydCBjbGFzcyBJbmRleGVkVHlwZSBleHRlbmRzIERlZmF1bHRUeXBlIHtcbiAgW3JlZHVjZS5zeW1ib2xdKHJlZHVjZXIsIGluaXRpYWwsIGluZGV4ZWQpIHtcbiAgICBsZXQgaW5kZXggPSAwXG4gICAgbGV0IHN0YXRlID0gaW5pdGlhbFxuICAgIGNvbnN0IGNvdW50ID0gaW5kZXhlZC5sZW5ndGhcbiAgICB3aGlsZSAoaW5kZXggPCBjb3VudCkge1xuICAgICAgc3RhdGUgPSByZWR1Y2VyWyRzdGVwXShzdGF0ZSwgaW5kZXhlZFtpbmRleF0pXG4gICAgICBpZiAoaXNSZWR1Y2VkKHN0YXRlKSkge1xuICAgICAgICByZXR1cm4gc3RhdGVbJHZhbHVlXVxuICAgICAgfVxuICAgICAgaW5kZXggPSBpbmRleCArIDFcbiAgICB9XG4gICAgcmV0dXJuIHN0YXRlXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFN0cmluZ1R5cGUgZXh0ZW5kcyBJbmRleGVkVHlwZSB7XG4gIC8vIEJhc2Ugc3RyaW5nIGlzIGVtcHR5IHN0cmluZy5cbiAgW2luaXQuc3ltYm9sXSgpIHtcbiAgICByZXR1cm4gXCJcIlxuICB9XG4gIC8vIElmIGlucHV0IGlzIGFuIGFycmF5IGNvbmNhdCB0aGVtIG9udG8gcmVzdWx0IG90aGVyd2lzZSBqdXN0XG4gIC8vIGNvbmNhdCB0byBzdHJpbmdzLlxuICBbc3RlcC5zeW1ib2xdKHJlc3VsdCwgaW5wdXQpIHtcbiAgICByZXR1cm4gaXNBcnJheShpbnB1dCkgPyByZXN1bHQuY29uY2F0KC4uLmlucHV0KSA6IHJlc3VsdCArIGlucHV0XG4gIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgQXJyYXlUeXBlIGV4dGVuZHMgSW5kZXhlZFR5cGUge1xuICBbaW5pdC5zeW1ib2xdKCkge1xuICAgIHJldHVybiBbXVxuICB9XG4gIFtzdGVwLnN5bWJvbF0oYXJyYXksIHZhbHVlKSB7XG4gICAgYXJyYXkucHVzaCh2YWx1ZSlcbiAgICByZXR1cm4gYXJyYXlcbiAgfVxufVxuXG5cbi8vIEl0ZXJhY3RvcnMgYXJlIGtpbmQgb2Ygc3BlY2lhbCBpbiBhIHNlbmNlIHRoYXQgdGhleSBwcm9kdWNlXG5leHBvcnQgY2xhc3MgSXRlcmF0b3JUeXBlIGV4dGVuZHMgT2JqZWN0VHlwZSB7XG4gIFtpbml0LnN5bWJvbF0oKSB7XG4gICAgcmV0dXJuIEl0ZXJhdG9yTGF6eVRyYW5zZm9ybVxuICB9XG4gIFtzdGVwLnN5bWJvbF0ocmVzdWx0LCBpbnB1dCkge1xuICAgIHJldHVybiByZXN1bHRbc3RlcC5zeW1ib2xdKHJlc3VsdCwgaW5wdXQpXG4gIH1cbiAgW3JlZHVjZS5zeW1ib2xdKHRyYW5zZHVjZXIsIGluaXRpYWwsIHNvdXJjZSkge1xuICAgIGNvbnN0IGl0ZXJhdG9yID0gc291cmNlWyRpdGVyYXRvcl0oKVxuICAgIC8vIElmIGl0IGlzIHRyYW5zZm9ybWF0aW9uIGZyb20gaXRlcmF0b3IgdG8gaXRlcmF0b3IsIHRoZW4gaW5pdGlhbCB2YWx1ZSBpc1xuICAgIC8vIGdvaW5nIHRvIGJlIGBJdGVyYXRvckxhenlUcmFuc2Zvcm1gIGFzIChyZXR1cm5lZCBieSBbaW5pdC5zeW1ib2xdIG1ldGhvZCBhYm92ZSlcbiAgICAvLyBJbiBzdWNoIGNhc2Ugd2UganVzdCBjcmVhdGUgYW4gaW5zdGFuY2Ugb2YgYEl0ZXJhdG9yTGF6eVRyYW5zZm9ybWAgYW5kIHJldHVybiBpdFxuICAgIC8vIGJhY2tlIGFjdHVhbCB0cmFuc2Zvcm1hdGlvbiB3aWxsIGhhcHBlbiBvbiBkZW1hbmQgYnkgYEl0ZXJhdG9yTGF6eVRyYW5zZm9ybWAuXG4gICAgaWYgKGluaXRpYWwgPT09IEl0ZXJhdG9yTGF6eVRyYW5zZm9ybSkge1xuICAgICAgcmV0dXJuIG5ldyBJdGVyYXRvckxhenlUcmFuc2Zvcm0oaXRlcmF0b3IsIHRyYW5zZHVjZXIpXG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlIGVhY2ggdmFsdWUgd2lsbCBiZSBmb3J3cmFkZWQgdG8gdGhlIHRyYW5zZHVjZXIgdW50aWwgZG9uZVxuICAgIC8vIGl0ZXJhdGlvbiBvciB1bnRpbCByZWR1Y2VkIHJlc3VsdCBpcyByZXR1cm5lZC5cbiAgICBsZXQgcmVzdWx0ID0gaW5pdGlhbFxuICAgIHdoaWxlKHRydWUpIHtcbiAgICAgIGNvbnN0IHtkb25lLCB2YWx1ZX0gPSBpdGVyYXRvci5uZXh0KClcbiAgICAgIGlmIChkb25lKSB7XG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH1cblxuICAgICAgcmVzdWx0ID0gdHJhbnNkdWNlclskc3RlcF0ocmVzdWx0LCB2YWx1ZSlcblxuICAgICAgaWYgKGlzUmVkdWNlZChyZXN1bHQpKSB7XG4gICAgICAgIHJldHVybiByZXN1bHRbJHZhbHVlXVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSXRlcmF0b3JMYXp5VHJhbnNmb3JtIGV4dGVuZHMgSXRlcmF0b3JUeXBlIHtcbiAgY29uc3RydWN0b3Ioc291cmNlLCB0cmFuc2R1Y2VyKSB7XG4gICAgLy8gRWFjaCB0cmFuc2Zvcm1hdGlvbiBzdGVwIGB0aGlzLnRyYW5zZHVjZXIuc3RlcGAgbWF5IHByb2R1Y2UgMCwgMSBvciBtb3JlXG4gICAgLy8gc3RlcHMgaW4gcmV0dXJuLiBJbiBvcmRlciB0byBhY2NvbW9kYXRlIGV4dHJhIHZhbHVlcyBpbnRlcm5hbCBidWZmZXIgaXNcbiAgICAvLyBnb2luZyB0byBiZSB1c2VkLlxuICAgIHRoaXNbJGJ1ZmZlcl0gPSBbXVxuXG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2VcbiAgICB0aGlzLnRyYW5zZHVjZXIgPSB0cmFuc2R1Y2VyXG4gICAgdGhpcy5pc0RyYWluZWQgPSBmYWxzZVxuICAgIHRoaXMuZG9uZSA9IGZhbHNlXG4gIH1cbiAgW3N0ZXAuc3ltYm9sXSh0YXJnZXQsIHZhbHVlKSB7XG4gICAgdGFyZ2V0WyRidWZmZXJdLnB1c2godmFsdWUpXG4gICAgcmV0dXJuIHRhcmdldFxuICB9XG4gIFskaXRlcmF0b3JdKCkge1xuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgbmV4dCgpIHtcbiAgICAvLyBQdWxsIGZyb20gdGhlIHNvdXJjZSB1bnRpbCBzb21ldGhpbmcgaXMgcHVzaGVkIGludG8gYSBidWZmZXIgb3JcbiAgICAvLyBvciB1bnRpbCBzb3VyY2UgaXMgZHJhaW5lZC4gYHRoaXMudHJhbnNkdWNlcmAgbWF5YmUgZmlsdGVyaW5nIHNvXG4gICAgLy8gc3RlcCBtYXkgbm90IHB1c2ggYW55dGhpbmcgdG8gYSBidWZmZXIsIG9yIGl0IGNvdWxkIGJlIG1hcGNhdHRpbmdcbiAgICAvLyBpbiB3aGljaCBjYXNlIHNldmVyYWwgdmFsdWVzIHdpbGwgYmUgcHVzaGVkLiBJdCBhbHNvIG1heWJlIHRoYXRcbiAgICAvLyB0cmFuc2R1Y2VyIGlzIGFjY3VtdWxhdGluZyBvbmQgb24gcmVzdWx0IG1vcmUgdmFsdWVzIHdpbGwgYmUgcHVzaGVkXG4gICAgLy8gKGxpa2UgcGFydGl0aW9uKS5cbiAgICB3aGlsZSAodGhpc1skYnVmZmVyXS5sZW5ndGggPT09IDAgJiYgIXRoaXMuaXNEcmFpbmVkKSB7XG4gICAgICBjb25zdCB7ZG9uZSwgdmFsdWV9ID0gdGhpcy5zb3VyY2UubmV4dCgpXG4gICAgICAvLyBJZiBzb3VyY2UgaXRlcmF0b3IgaXMgZHJhaW5lZCBpbnZva2UgcmVzdWx0IG9uIHRyYW5zZHVjZXIgdG8gbGV0XG4gICAgICAvLyBpdCBjbGVhbnVwIG9yIHB1c2ggd2hhdGV2ZXIgaXQgYWdncmVnYXRlZC5cbiAgICAgIGlmIChkb25lKSB7XG4gICAgICAgIHRoaXMudHJhbnNkdWNlclskcmVzdWx0XSh0aGlzKVxuICAgICAgICB0aGlzLmlzRHJhaW5lZCA9IGRvbmVcbiAgICAgIH1cbiAgICAgIC8vIE90aGVyd2lzZSBrZWVwIGNhbGxpbmcgc3RlcCwgaWYgcmVzdWx0IGlzIHJlZHVjZWQgdGhlbiBtYXJrIHRoaXNcbiAgICAgIC8vIGl0ZXJhdG9yIGRyYWluZWQgdG8gc3RvcCBwdWxsaW5nLlxuICAgICAgZWxzZSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMudHJhbnNkdWNlclskc3RlcF0odGhpcywgdmFsdWUpXG4gICAgICAgIHRoaXMuaXNEcmFpbmVkID0gaXNSZWR1Y2VkKHJlc3VsdClcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBdCB0aGlzIHBvaW4gd2UgZWl0aGVyIGdldCBzb21ldGhpbmcgaW4gYSBidWZmZXIgb3Igc291cmNlIHdhcyBleGhhdXN0ZWRcbiAgICAvLyBvciBib3RoLiBJZiBzb21ldGhpbmcgaXMgaW4gYSBidWZmZXIganVzdCByZXR1cm4gZnJvbSBpdC4gSWYgYnVmZmVyIGlzXG4gICAgLy8gZW1wdHkgdGhlbiBzb3VyY2UgaXMgZHJhaW5lZCBhcyB3ZWxsIHNvIHdlIG1hcmsgdGhpcyBkb25lIGFuZCBmaW5pc2guXG4gICAgaWYgKHRoaXNbJGJ1ZmZlcl0ubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXNbJGJ1ZmZlcl0uc2hpZnQoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnZhbHVlID0gdW5kZWZpbmVkXG4gICAgICB0aGlzLmRvbmUgPSB0aGlzLmlzRHJhaW5lZFxuICAgIH1cblxuICAgIHJldHVybiB0aGlzXG4gIH1cbn1cbmNvbnN0ICRidWZmZXIgPSBzeW1ib2woXCJJdGVyYXRvckxhenlUcmFuc2Zvcm0vYnVmZmVyXCIpXG5JdGVyYXRvckxhenlUcmFuc2Zvcm0uYnVmZmVyID0gJGJ1ZmZlclxuIl19