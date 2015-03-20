(function (factory) {
                 if (typeof define === "function" && define.amd) {
                                  define(["exports", "./test", "immutable", "../../"], factory);
                 } else if (typeof exports !== "undefined") {
                                  factory(exports, require("./test"), require("immutable"), require("../../"));
                 }
})(function (exports, _test, _immutable, _) {
                 "use strict";

                 var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

                 var test = _test["default"];
                 var Immutable = _immutable;
                 var transduce = _.transduce;
                 var map = _.map;
                 var filter = _.filter;
                 var remove = _.remove;
                 var cat = _.cat;
                 var mapcat = _.mapcat;
                 var keep = _.keep;
                 var take = _.take;
                 var takeWhile = _.takeWhile;
                 var drop = _.drop;
                 var dropWhile = _.dropWhile;
                 var dropRepeats = _.dropRepeats;
                 var partition = _.partition;
                 var partitionBy = _.partitionBy;
                 var Transducer = _.Transducer;
                 var reduce = _.reduce;
                 var Reducer = _.Reducer;

                 // utility
                 var first = function (xs) {
                                  return xs[0];
                 };
                 var second = function (xs) {
                                  return xs[1];
                 };
                 var inc = function (x) {
                                  return x + 1;
                 };
                 var upperCase = function (char) {
                                  return char.toUpperCase();
                 };
                 var lowerCase = function (char) {
                                  return char.toLowerCase();
                 };
                 var add = function (x) {
                                  return function (y) {
                                                   return x + y;
                                  };
                 };
                 var multiply = function (x) {
                                  return function (y) {
                                                   return x * y;
                                  };
                 };
                 var stringify = function (json) {
                                  return JSON.stringify(json);
                 };
                 var isEven = function (x) {
                                  return !(x % 2);
                 };
                 var isLowerCase = function (char) {
                                  return char.toLowerCase() === char;
                 };
                 var lessThan = function (x) {
                                  return function (y) {
                                                   return y < x;
                                  };
                 };
                 var constant = function (x) {
                                  return function (_) {
                                                   return x;
                                  };
                 };
                 var identity = function (x) {
                                  return x;
                 };

                 var True = constant(true);
                 var False = constant(false);

                 if (!Array.from) {
                                  Array.from = function (iterator) {
                                                   var array = [];
                                                   while (true) {
                                                                    var _iterator$next = iterator.next();

                                                                    var value = _iterator$next.value;
                                                                    var done = _iterator$next.done;

                                                                    if (done) {
                                                                                     return array;
                                                                    } else {
                                                                                     array.push(value);
                                                                    }
                                                   }
                                  };
                 }

                 var reducer = function (f) {
                                  return new Reducer({
                                                   empty: function empty() {
                                                                    return f();
                                                   },
                                                   step: function step(result, input) {
                                                                    return f(result, input);
                                                   },
                                                   result: (function (_result) {
                                                                    var _resultWrapper = function result(_x) {
                                                                                     return _result.apply(this, arguments);
                                                                    };

                                                                    _resultWrapper.toString = function () {
                                                                                     return _result.toString();
                                                                    };

                                                                    return _resultWrapper;
                                                   })(function (result) {
                                                                    return f(result);
                                                   })
                                  });
                 };

                 test("map", function (assert) {
                                  var incer = map(inc);

                                  assert.deepEqual(incer([1, 2, 3, 4]), [2, 3, 4, 5], "array elements get mapped");

                                  assert.deepEqual(incer(0), 1, "function is applied to number");

                                  assert.deepEqual(incer(null), null, "map over null is no op");

                                  assert.deepEqual(incer(void 0), void 0, "map over void is void");

                                  assert.equal(map(upperCase)("Hello"), "HELLO", "strings can be mapped over");

                                  var iterator = Immutable.Iterable({ x: 1, y: 2 });

                                  assert.deepEqual([].concat(_toConsumableArray(incer(iterator.values()))), [2, 3], "iterable makes lazy transformation");

                                  assert.deepEqual([].concat(_toConsumableArray(map(upperCase)(iterator.keys()))), ["X", "Y"], "iterable makes lazy transformation");

                                  assert.deepEqual(map(identity)([[1, 2], [3, 4]]), [[1, 2], [3, 4]], "map does not expands");
                 });

                 test("filter", function (assert) {
                                  var evens = filter(isEven);

                                  assert.deepEqual(evens([1, 2, 3, 4]), [2, 4], "array elements got filtered");

                                  assert.deepEqual(evens([1, 3, 5, 7]), [], "filtered out all elements");

                                  assert.deepEqual(evens(7), 0, "filtered out odd number to empty number");

                                  assert.deepEqual(evens(6), 6, "number was kept as it was even");

                                  assert.deepEqual(filter(True)(null), null, "null remains null regardless of operation");

                                  assert.deepEqual(filter(False)(void 0), void 0, "void remains void regardless of operation");

                                  assert.deepEqual(filter(isLowerCase)("Hello World"), "ello orld", "filters out upper case letters");

                                  var iterator = Immutable.Iterable({ x: 1, Y: 2, z: 3 });

                                  assert.deepEqual([].concat(_toConsumableArray(evens(iterator.values()))), [2], "filter value iterators");

                                  assert.deepEqual([].concat(_toConsumableArray(filter(isLowerCase)(iterator.keys()))), ["x", "z"], "filter key iterators");
                 });

                 test("remove", function (assert) {
                                  var odds = remove(isEven);
                                  var upperCaseChars = remove(isLowerCase);

                                  assert.deepEqual(odds([1, 2, 3, 4]), [1, 3], "evens were removed");

                                  assert.deepEqual(remove(True)(null), null, "transducing null return null");

                                  assert.deepEqual(remove(False)(null), null, "transducing null return null");

                                  assert.deepEqual(remove(True)(void 0), void 0, "transducing void return void");

                                  assert.deepEqual(remove(False)(void 0), void 0, "transducing void return void");

                                  assert.deepEqual(remove(function (x) {
                                                   return x > 0;
                                  })(7), 0, "removing matching number returns 0");

                                  assert.deepEqual(remove(function (x) {
                                                   return x < 0;
                                  })(7), 7, "removing unmatched number returns number");

                                  assert.deepEqual(upperCaseChars("Hello World"), "HW", "removes lower case chars");

                                  assert.deepEqual(upperCaseChars("what?"), "", "removes all chars");

                                  var iterator = Immutable.Iterable({ x: 1, Y: 2, z: 3 });

                                  assert.deepEqual([].concat(_toConsumableArray(odds(iterator.values()))), [1, 3], "removes from iterator");
                 });

                 test("drop", function (assert) {
                                  assert.deepEqual(drop(2)([1, 2, 3, 4, 5]), [3, 4, 5], "dropped two items");

                                  assert.deepEqual(drop(9)([1, 2, 3, 4]), [], "dropes all items");

                                  assert.deepEqual(drop(7)([]), [], "nothing to drop");

                                  assert.deepEqual(drop(0)([1, 2, 3, 4]), [1, 2, 3, 4], "no need to drop");

                                  assert.deepEqual(drop(-7)([1, 2, 3]), [1, 2, 3], "no need to drop");

                                  assert.deepEqual(drop(0)(1), 1, "number was not dropped");
                                  assert.deepEqual(drop(5)(8), 0, "number was reset to 0");

                                  assert.deepEqual(drop(3)("hello"), "lo", "three characters were dropped");

                                  assert.deepEqual(drop(9)("hello"), "", "dropped all chars");

                                  assert.deepEqual(drop(8)(""), "", "nothing to drop");

                                  assert.deepEqual(drop(9)(null), null);

                                  assert.deepEqual(drop(0)(null), null);

                                  assert.deepEqual(drop(8)(void 0), void 0);

                                  assert.deepEqual(drop(0)(void 0), void 0);

                                  var iterator = Immutable.Iterable({ x: 1, y: 2 });

                                  assert.deepEqual([].concat(_toConsumableArray(drop(0)(iterator.values()))), [1, 2], "0 drops");

                                  assert.deepEqual([].concat(_toConsumableArray(drop(1)(iterator.values()))), [2], "dropped first");

                                  assert.deepEqual([].concat(_toConsumableArray(drop(8)(iterator.values()))), [], "dropped all");
                 });

                 test("dropWhile", function (assert) {
                                  assert.deepEqual(dropWhile(lessThan(9))([1, 8, 12, 9, 45]), [12, 9, 45]);

                                  assert.deepEqual(dropWhile(lessThan(9))([10, 9, 8, 7]), [10, 9, 8, 7]);

                                  assert.deepEqual(dropWhile(lessThan(9))([1, 2, 3]), []);

                                  assert.deepEqual(dropWhile(lessThan(9))([]), []);

                                  assert.deepEqual(dropWhile(False)(5), 5);
                                  assert.deepEqual(dropWhile(True)(5), 0);

                                  assert.deepEqual(dropWhile(True)(null), null);
                                  assert.deepEqual(dropWhile(False)(null), null);

                                  assert.deepEqual(dropWhile(True)(void 0), void 0);
                                  assert.deepEqual(takeWhile(False)(void 0), void 0);

                                  assert.deepEqual(dropWhile(isLowerCase)("never mind You"), "You");
                                  assert.deepEqual(dropWhile(isLowerCase)("Hi there"), "Hi there");
                                  assert.deepEqual(dropWhile(True)(""), "");
                                  assert.deepEqual(dropWhile(False)(""), "");

                                  var iterator = Immutable.Iterable({ x: 0, y: 5, z: 10 });

                                  assert.deepEqual([].concat(_toConsumableArray(dropWhile(lessThan(7))(iterator.values()))), [10]);

                                  assert.deepEqual([].concat(_toConsumableArray(dropWhile(lessThan(0))(iterator.values()))), [0, 5, 10]);

                                  assert.deepEqual([].concat(_toConsumableArray(dropWhile(lessThan(99))(iterator.values()))), []);
                 });

                 test("dropRepeats", function (assert) {
                                  assert.deepEqual(dropRepeats([1, 2, 3, 3, 4, 3]), [1, 2, 3, 4, 3], "removed repeated elements");

                                  assert.deepEqual(dropRepeats([1, 1, 1, 1, 1]), [1], "keeps just one");

                                  assert.deepEqual(dropRepeats(1), 1, "number has no repeats");

                                  assert.deepEqual(dropRepeats(null), null, "null transfromed is null");

                                  assert.deepEqual(dropRepeats(void 0), void 0, "void transfromed is void");

                                  assert.deepEqual(dropRepeats("what"), "what", "nothing to drop");

                                  assert.deepEqual(dropRepeats("hello"), "helo", "dropes repeated chars");

                                  var iterator = Immutable.Iterable({ x: 1, Y: 2, z: 2 });

                                  assert.deepEqual([].concat(_toConsumableArray(dropRepeats(iterator.values()))), [1, 2], "removes repeats form iterator");
                 });

                 test("take", function (assert) {
                                  assert.deepEqual(take(2)([1, 2, 3, 4, 5]), [1, 2], "took two");

                                  assert.deepEqual(take(9)([1, 2, 3, 4]), [1, 2, 3, 4], "took all");

                                  assert.deepEqual(take(7)([]), [], "nothing to take");

                                  assert.deepEqual(take(0)([1, 2, 3, 4]), [], "took 0");

                                  assert.deepEqual(take(-7)([1, 2, 3]), [], "took none");

                                  assert.deepEqual(take(0)(1), 0);
                                  assert.deepEqual(take(5)(8), 8);

                                  assert.deepEqual(take(3)("hello"), "hel");

                                  assert.deepEqual(take(9)("hello"), "hello");

                                  assert.deepEqual(take(8)(""), "");

                                  assert.deepEqual(take(9)(null), null);

                                  assert.deepEqual(take(0)(null), null);

                                  assert.deepEqual(take(8)(void 0), void 0);

                                  assert.deepEqual(drop(0)(void 0), void 0);

                                  var iterator = Immutable.Iterable({ x: 1, y: 2 });

                                  assert.deepEqual([].concat(_toConsumableArray(take(9)(iterator.values()))), [1, 2]);

                                  assert.deepEqual([].concat(_toConsumableArray(take(1)(iterator.values()))), [1], "took first");

                                  assert.deepEqual([].concat(_toConsumableArray(take(0)(iterator.values()))), [], "took none");
                 });

                 test("takeWhile", function (assert) {
                                  var digits = takeWhile(lessThan(10));

                                  assert.deepEqual(digits([1, 8, 12, 9, 45]), [1, 8], "takes only digits");

                                  assert.deepEqual(digits([10, 9, 8, 7]), [], "takes none");

                                  assert.deepEqual(digits(5), 5, "take matching number");

                                  assert.deepEqual(digits(97), 0, "returns 0 on unmatched number");

                                  assert.deepEqual(takeWhile(True)(null), null, "return null");

                                  assert.deepEqual(takeWhile(False)(null), null, "returns null");

                                  assert.deepEqual(takeWhile(True)(void 0), void 0, "return void");

                                  assert.deepEqual(takeWhile(False)(void 0), void 0, "return void");

                                  assert.deepEqual(takeWhile(isLowerCase)("never mind You"), "never mind ", "takes until upper case");

                                  assert.deepEqual(takeWhile(isLowerCase)("Hi there"), "", "blank string");

                                  var iterator = Immutable.Iterable({ x: 0, y: 5, z: 10 });

                                  assert.deepEqual([].concat(_toConsumableArray(takeWhile(lessThan(7))(iterator.values()))), [0, 5], "removes repeats form iterator");
                 });

                 test("partition", function (assert) {
                                  assert.deepEqual(partition(2)([1, 2, 3, 4, 5, 6, 7, 8]), [[1, 2], [3, 4], [5, 6], [7, 8]]);

                                  assert.deepEqual(partition(3)([1, 2, 3, 4, 5, 6, 7, 8]), [[1, 2, 3], [4, 5, 6], [7, 8]]);

                                  assert.deepEqual(partition(4)([1, 2]), [[1, 2]]);

                                  assert.deepEqual(partition(3)([]), []);

                                  assert.deepEqual(partition(3)(9), 9);
                                  assert.deepEqual(partition(2)("hello"), "hello");

                                  assert.deepEqual(partition(2)(null), null);
                                  assert.deepEqual(partition(2)(void 0), void 0);

                                  var iterator = Immutable.Iterable({ x: 0, y: 5, z: 10 });

                                  assert.deepEqual([].concat(_toConsumableArray(partition(2)(iterator.values()))), [[0, 5], [10]]);
                 });

                 // TODO:!
                 test("partitionBy", function (assert) {});

                 test("cat", function (assert) {
                                  assert.deepEqual(cat([[1, 2], [3], [4, 5]]), [1, 2, 3, 4, 5]);

                                  assert.deepEqual(cat([]), []);
                                  assert.deepEqual(cat([1, 2, 3]), [1, 2, 3]);
                                  assert.deepEqual(cat(null), null);
                                  assert.deepEqual(cat(void 0), void 0);
                                  assert.deepEqual(cat(4), 4);
                                  assert.deepEqual(cat("hello"), "hello");

                                  var valueIter = Immutable.Iterable([0, 5, 10]).values();

                                  assert.deepEqual([].concat(_toConsumableArray(cat(valueIter))), [0, 5, 10]);

                                  var arrayIter = Immutable.Iterable([[1, 2], [3], [4, 5, 6]]).values();
                                  assert.deepEqual([].concat(_toConsumableArray(cat(arrayIter))), [1, 2, 3, 4, 5, 6]);
                 });

                 test("mapcat", function (assert) {
                                  var mapcat = function (f) {
                                                   return map(f)(cat);
                                  };
                                  var split = function (by) {
                                                   return function (string) {
                                                                    return string.split(by);
                                                   };
                                  };

                                  assert.deepEqual(mapcat(split("/"))(["path/to", "dir/file"]), ["path", "to", "dir", "file"]);
                 });

                 test("composition", function (assert) {
                                  var incer = map(inc);
                                  var add2 = incer(incer);

                                  assert.equal(typeof add2, "function", "passing transducer to transducer composes a new one");

                                  assert.deepEqual(add2([1, 2, 3, 4]), [3, 4, 5, 6], "array elements get mapped");

                                  assert.deepEqual(add2(0), 2, "function is applied to number");

                                  assert.deepEqual(add2(null), null, "map over null is no op");

                                  assert.deepEqual(add2(void 0), void 0, "map over void is void");
                 });

                 test("trasduce", function (assert) {
                                  var evens = filter(isEven);
                                  assert.equal(transduce([1, 2, 3, 4], evens, reducer(function (x, y) {
                                                   return y === void 0 ? x : x + y;
                                  }), 0), 6, "transduced array with custom reducer");

                                  var iterator = Immutable.Iterable({ x: 1, Y: 2, z: 3, w: 4 });
                                  assert.equal(transduce(iterator.values(), evens, reducer(function (x, y) {
                                                   return y === void 0 ? x : x + y;
                                  }), 5), 11, "transduce iterator with custom reducer");
                 });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O3FCQUFPLElBQUk7cUJBQ0MsU0FBUztxQkFDYixTQUFTLEtBQVQsU0FBUztxQkFBRSxHQUFHLEtBQUgsR0FBRztxQkFBRSxNQUFNLEtBQU4sTUFBTTtxQkFBRSxNQUFNLEtBQU4sTUFBTTtxQkFBRSxHQUFHLEtBQUgsR0FBRztxQkFDbkMsTUFBTSxLQUFOLE1BQU07cUJBQUUsSUFBSSxLQUFKLElBQUk7cUJBQUUsSUFBSSxLQUFKLElBQUk7cUJBQUUsU0FBUyxLQUFULFNBQVM7cUJBQzdCLElBQUksS0FBSixJQUFJO3FCQUFFLFNBQVMsS0FBVCxTQUFTO3FCQUFFLFdBQVcsS0FBWCxXQUFXO3FCQUM1QixTQUFTLEtBQVQsU0FBUztxQkFBRSxXQUFXLEtBQVgsV0FBVztxQkFBRSxVQUFVLEtBQVYsVUFBVTtxQkFDbEMsTUFBTSxLQUFOLE1BQU07cUJBQUUsT0FBTyxLQUFQLE9BQU87OztBQUd2QixxQkFBTSxLQUFLLEdBQUcsVUFBQSxFQUFFO3lDQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7a0JBQUEsQ0FBQTtBQUN6QixxQkFBTSxNQUFNLEdBQUcsVUFBQSxFQUFFO3lDQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7a0JBQUEsQ0FBQTtBQUMxQixxQkFBTSxHQUFHLEdBQUcsVUFBQSxDQUFDO3lDQUFJLENBQUMsR0FBRyxDQUFDO2tCQUFBLENBQUE7QUFDdEIscUJBQU0sU0FBUyxHQUFHLFVBQUEsSUFBSTt5Q0FBSSxJQUFJLENBQUMsV0FBVyxFQUFFO2tCQUFBLENBQUE7QUFDNUMscUJBQU0sU0FBUyxHQUFHLFVBQUEsSUFBSTt5Q0FBSSxJQUFJLENBQUMsV0FBVyxFQUFFO2tCQUFBLENBQUE7QUFDNUMscUJBQU0sR0FBRyxHQUFHLFVBQUEsQ0FBQzt5Q0FBSSxVQUFBLENBQUM7MERBQUksQ0FBQyxHQUFHLENBQUM7bUNBQUE7a0JBQUEsQ0FBQTtBQUMz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UyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUN6QyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTs7QUFFN0Isd0NBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFDckMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBOztBQUUvQix3Q0FBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQ2pDLEVBQUUsQ0FBQyxDQUFBOztBQUVwQix3Q0FBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQzFCLEVBQUUsQ0FBQyxDQUFBOztBQUVwQix3Q0FBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDeEMsd0NBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBOztBQUd2Qyx3Q0FBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDN0Msd0NBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBOztBQUc5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Q0FBQyxDQUFBOztBQUUxQix3Q0FBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFDbkIsRUFBRSxFQUNGLFdBQVcsQ0FBQyxDQUFBOztBQUU3Qix3Q0FBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDL0Isd0NBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBOztBQUUvQix3Q0FBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUE7O0FBRXpDLHdDQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQTs7QUFFM0Msd0NBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBOztBQUVqQyx3Q0FBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUE7O0FBRXJDLHdDQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTs7QUFFckMsd0NBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxBQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQUFBQyxDQUFDLENBQUE7O0FBRTNDLHdDQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQUFBQyxDQUFDLEVBQUUs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QUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUM3QyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFDTiwrQkFBK0IsQ0FBQyxDQUFBO2tCQUNsRCxDQUFDLENBQUE7O0FBRUYscUJBQUksQ0FBQyxXQUFXLEVBQUUsVUFBQSxNQUFNLEVBQUk7QUFDMUIsd0NBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQ3RDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBOztBQUVsRCx3Q0FBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFDdEMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFaEQsd0NBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRS9DLHdDQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTs7QUFFdEMsd0NBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ3BDLHdDQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQTs7QUFFaEQsd0NBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQzFDLHdDQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQUFBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEFBQUMsQ0FBQyxDQUFBOztBQUVoRCxzQ0FBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQTs7QUFFeEQsd0NBQU0sQ0FBQyxTQUFTLDhCQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsSUFDbkMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtrQkFDakMsQ0FBQyxDQUFBOzs7QUFHRixxQkFBSSxDQUFDLGFBQWEsRUFBRSxVQUFBLE1BQU0sRUFBSSxFQUM3QixDQUFDLENBQUE7O0FBRUYscUJBQUksQ0FBQyxLQUFLLEVBQUUsVUFBQSxNQUFNLEVBQUk7QUFDcEIsd0NBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQzFCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRWpDLHdDQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUM3Qix3Q0FBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDM0Msd0NBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ2pDLHdDQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQUFBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEFBQUMsQ0FBQyxDQUFBO0FBQ3ZDLHdDQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUMzQix3Q0FBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUE7O0FBRXZDLHNDQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFBOztBQUV6RCx3Q0FBTSxDQUFDLFNBQVMsOEJBQUssR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUNsQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTs7QUFFNUIsc0NBQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFB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SyxDQUFDLEtBQUssS0FBSyxDQUFDLEFBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7bUNBQUEsQ0FBQyxFQUM1QyxDQUFDLENBQUMsRUFDWixFQUFFLEVBQ0gsd0NBQXdDLENBQUMsQ0FBQTtrQkFDdEQsQ0FBQyxDQUFBIiwiZmlsZSI6InNyYy90ZXN0L2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRlc3QgZnJvbSBcIi4vdGVzdFwiXG5pbXBvcnQgKiBhcyBJbW11dGFibGUgZnJvbSBcImltbXV0YWJsZVwiXG5pbXBvcnQge3RyYW5zZHVjZSwgbWFwLCBmaWx0ZXIsIHJlbW92ZSwgY2F0LFxuICAgICAgICBtYXBjYXQsIGtlZXAsIHRha2UsIHRha2VXaGlsZSxcbiAgICAgICAgZHJvcCwgZHJvcFdoaWxlLCBkcm9wUmVwZWF0cyxcbiAgICAgICAgcGFydGl0aW9uLCBwYXJ0aXRpb25CeSwgVHJhbnNkdWNlcixcbiAgICAgICAgcmVkdWNlLCBSZWR1Y2VyfSBmcm9tIFwiLi4vLi4vXCJcblxuLy8gdXRpbGl0eVxuY29uc3QgZmlyc3QgPSB4cyA9PiB4c1swXVxuY29uc3Qgc2Vjb25kID0geHMgPT4geHNbMV1cbmNvbnN0IGluYyA9IHggPT4geCArIDFcbmNvbnN0IHVwcGVyQ2FzZSA9IGNoYXIgPT4gY2hhci50b1VwcGVyQ2FzZSgpXG5jb25zdCBsb3dlckNhc2UgPSBjaGFyID0+IGNoYXIudG9Mb3dlckNhc2UoKVxuY29uc3QgYWRkID0geCA9PiB5ID0+IHggKyB5XG5jb25zdCBtdWx0aXBseSA9IHggPT4geSA9PiB4ICogeVxuY29uc3Qgc3RyaW5naWZ5ID0ganNvbiA9PiBKU09OLnN0cmluZ2lmeShqc29uKVxuY29uc3QgaXNFdmVuID0geCA9PiAhKHggJSAyKVxuY29uc3QgaXNMb3dlckNhc2UgPSBjaGFyID0+IGNoYXIudG9Mb3dlckNhc2UoKSA9PT0gY2hhclxuY29uc3QgbGVzc1RoYW4gPSB4ID0+IHkgPT4geSA8IHhcbmNvbnN0IGNvbnN0YW50ID0geCA9PiBfID0+IHhcbmNvbnN0IGlkZW50aXR5ID0geCA9PiB4XG5cbmNvbnN0IFRydWUgPSBjb25zdGFudCh0cnVlKVxuY29uc3QgRmFsc2UgPSBjb25zdGFudChmYWxzZSlcblxuaWYgKCFBcnJheS5mcm9tKSB7XG4gIEFycmF5LmZyb20gPSBpdGVyYXRvciA9PiB7XG4gICAgY29uc3QgYXJyYXkgPSBbXVxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBjb25zdCB7dmFsdWUsIGRvbmV9ID0gaXRlcmF0b3IubmV4dCgpXG4gICAgICBpZiAoZG9uZSkge1xuICAgICAgICByZXR1cm4gYXJyYXlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFycmF5LnB1c2godmFsdWUpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IHJlZHVjZXIgPSBmID0+IG5ldyBSZWR1Y2VyKHtcbiAgZW1wdHkoKSB7XG4gICAgcmV0dXJuIGYoKVxuICB9LFxuICBzdGVwKHJlc3VsdCwgaW5wdXQpIHtcbiAgICByZXR1cm4gZihyZXN1bHQsIGlucHV0KVxuICB9LFxuICByZXN1bHQocmVzdWx0KSB7XG4gICAgcmV0dXJuIGYocmVzdWx0KVxuICB9XG59KVxuXG50ZXN0KFwibWFwXCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IGluY2VyID0gbWFwKGluYylcblxuICBhc3NlcnQuZGVlcEVxdWFsKGluY2VyKFsxLCAyLCAzLCA0XSksXG4gICAgICAgICAgICAgICAgICAgWzIsIDMsIDQsIDVdLFxuICAgICAgICAgICAgICAgICAgIFwiYXJyYXkgZWxlbWVudHMgZ2V0IG1hcHBlZFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoaW5jZXIoMCksIDEsXG4gICAgICAgICAgICAgICAgICAgXCJmdW5jdGlvbiBpcyBhcHBsaWVkIHRvIG51bWJlclwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoaW5jZXIobnVsbCksIG51bGwsXG4gICAgICAgICAgICAgICAgICAgXCJtYXAgb3ZlciBudWxsIGlzIG5vIG9wXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChpbmNlcih2b2lkKDApKSwgdm9pZCgwKSxcbiAgICAgICAgICAgICAgICAgICBcIm1hcCBvdmVyIHZvaWQgaXMgdm9pZFwiKVxuXG4gIGFzc2VydC5lcXVhbChtYXAodXBwZXJDYXNlKShcIkhlbGxvXCIpLFxuICAgICAgICAgICAgICAgXCJIRUxMT1wiLFxuICAgICAgICAgICAgICAgXCJzdHJpbmdzIGNhbiBiZSBtYXBwZWQgb3ZlclwiKVxuXG4gIGNvbnN0IGl0ZXJhdG9yID0gSW1tdXRhYmxlLkl0ZXJhYmxlKHt4OiAxLCB5OiAyfSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKFsuLi5pbmNlcihpdGVyYXRvci52YWx1ZXMoKSldLFxuICAgICAgICAgICAgICAgICAgIFsyLCAzXSxcbiAgICAgICAgICAgICAgICAgICBcIml0ZXJhYmxlIG1ha2VzIGxhenkgdHJhbnNmb3JtYXRpb25cIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKFsuLi5tYXAodXBwZXJDYXNlKShpdGVyYXRvci5rZXlzKCkpXSxcbiAgICAgICAgICAgICAgICAgICBbXCJYXCIsIFwiWVwiXSxcbiAgICAgICAgICAgICAgICAgICBcIml0ZXJhYmxlIG1ha2VzIGxhenkgdHJhbnNmb3JtYXRpb25cIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKG1hcChpZGVudGl0eSkoW1sxLCAyXSwgWzMsIDRdXSksXG4gICAgICAgICAgICAgICAgICAgW1sxLCAyXSwgWzMsIDRdXSxcbiAgICAgICAgICAgICAgICAgICBcIm1hcCBkb2VzIG5vdCBleHBhbmRzXCIpXG59KVxuXG50ZXN0KFwiZmlsdGVyXCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IGV2ZW5zID0gZmlsdGVyKGlzRXZlbilcblxuICBhc3NlcnQuZGVlcEVxdWFsKGV2ZW5zKFsxLCAyLCAzLCA0XSksIFsyLCA0XSxcbiAgICAgICAgICAgICAgICAgICBcImFycmF5IGVsZW1lbnRzIGdvdCBmaWx0ZXJlZFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZXZlbnMoWzEsIDMsIDUsIDddKSwgW10sXG4gICAgICAgICAgICAgICAgICAgXCJmaWx0ZXJlZCBvdXQgYWxsIGVsZW1lbnRzXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChldmVucyg3KSwgMCxcbiAgICAgICAgICAgICAgICAgICBcImZpbHRlcmVkIG91dCBvZGQgbnVtYmVyIHRvIGVtcHR5IG51bWJlclwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZXZlbnMoNiksIDYsXG4gICAgICAgICAgICAgICAgICAgXCJudW1iZXIgd2FzIGtlcHQgYXMgaXQgd2FzIGV2ZW5cIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKGZpbHRlcihUcnVlKShudWxsKSwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICBcIm51bGwgcmVtYWlucyBudWxsIHJlZ2FyZGxlc3Mgb2Ygb3BlcmF0aW9uXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChmaWx0ZXIoRmFsc2UpKHZvaWQoMCkpLCB2b2lkKDApLFxuICAgICAgICAgICAgICAgICAgIFwidm9pZCByZW1haW5zIHZvaWQgcmVnYXJkbGVzcyBvZiBvcGVyYXRpb25cIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKGZpbHRlcihpc0xvd2VyQ2FzZSkoXCJIZWxsbyBXb3JsZFwiKSwgXCJlbGxvIG9ybGRcIixcbiAgICAgICAgICAgICAgICAgICBcImZpbHRlcnMgb3V0IHVwcGVyIGNhc2UgbGV0dGVyc1wiKVxuXG4gIGNvbnN0IGl0ZXJhdG9yID0gSW1tdXRhYmxlLkl0ZXJhYmxlKHt4OiAxLCBZOiAyLCB6OiAzfSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKFsuLi5ldmVucyhpdGVyYXRvci52YWx1ZXMoKSldLFxuICAgICAgICAgICAgICAgICAgIFsyXSxcbiAgICAgICAgICAgICAgICAgICBcImZpbHRlciB2YWx1ZSBpdGVyYXRvcnNcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKFsuLi5maWx0ZXIoaXNMb3dlckNhc2UpKGl0ZXJhdG9yLmtleXMoKSldLFxuICAgICAgICAgICAgICAgICAgIFtcInhcIiwgXCJ6XCJdLFxuICAgICAgICAgICAgICAgICAgIFwiZmlsdGVyIGtleSBpdGVyYXRvcnNcIilcbn0pXG5cblxuXG50ZXN0KFwicmVtb3ZlXCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IG9kZHMgPSByZW1vdmUoaXNFdmVuKVxuICBjb25zdCB1cHBlckNhc2VDaGFycyA9IHJlbW92ZShpc0xvd2VyQ2FzZSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKG9kZHMoWzEsIDIsIDMsIDRdKSxcbiAgICAgICAgICAgICAgICAgICBbMSwgM10sXG4gICAgICAgICAgICAgICAgICAgXCJldmVucyB3ZXJlIHJlbW92ZWRcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHJlbW92ZShUcnVlKShudWxsKSxcbiAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgIFwidHJhbnNkdWNpbmcgbnVsbCByZXR1cm4gbnVsbFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwocmVtb3ZlKEZhbHNlKShudWxsKSxcbiAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgIFwidHJhbnNkdWNpbmcgbnVsbCByZXR1cm4gbnVsbFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwocmVtb3ZlKFRydWUpKHZvaWQoMCkpLFxuICAgICAgICAgICAgICAgICAgIHZvaWQoMCksXG4gICAgICAgICAgICAgICAgICAgXCJ0cmFuc2R1Y2luZyB2b2lkIHJldHVybiB2b2lkXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChyZW1vdmUoRmFsc2UpKHZvaWQoMCkpLFxuICAgICAgICAgICAgICAgICAgIHZvaWQoMCksXG4gICAgICAgICAgICAgICAgICAgXCJ0cmFuc2R1Y2luZyB2b2lkIHJldHVybiB2b2lkXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChyZW1vdmUoeCA9PiB4ID4gMCkoNyksXG4gICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICBcInJlbW92aW5nIG1hdGNoaW5nIG51bWJlciByZXR1cm5zIDBcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHJlbW92ZSh4ID0+IHggPCAwKSg3KSxcbiAgICAgICAgICAgICAgICAgICA3LFxuICAgICAgICAgICAgICAgICAgIFwicmVtb3ZpbmcgdW5tYXRjaGVkIG51bWJlciByZXR1cm5zIG51bWJlclwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodXBwZXJDYXNlQ2hhcnMoXCJIZWxsbyBXb3JsZFwiKSxcbiAgICAgICAgICAgICAgICAgICBcIkhXXCIsXG4gICAgICAgICAgICAgICAgICAgXCJyZW1vdmVzIGxvd2VyIGNhc2UgY2hhcnNcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHVwcGVyQ2FzZUNoYXJzKFwid2hhdD9cIiksXG4gICAgICAgICAgICAgICAgICAgXCJcIixcbiAgICAgICAgICAgICAgICAgICBcInJlbW92ZXMgYWxsIGNoYXJzXCIpXG5cbiAgY29uc3QgaXRlcmF0b3IgPSBJbW11dGFibGUuSXRlcmFibGUoe3g6IDEsIFk6IDIsIHo6IDN9KVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoWy4uLm9kZHMoaXRlcmF0b3IudmFsdWVzKCkpXSxcbiAgICAgICAgICAgICAgICAgICBbMSwgM10sXG4gICAgICAgICAgICAgICAgICAgXCJyZW1vdmVzIGZyb20gaXRlcmF0b3JcIilcbn0pXG5cbnRlc3QoXCJkcm9wXCIsIGFzc2VydCA9PiB7XG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcCgyKShbMSwgMiwgMywgNCwgNV0pLFxuICAgICAgICAgICAgICAgICAgIFszLCA0LCA1XSxcbiAgICAgICAgICAgICAgICAgICBcImRyb3BwZWQgdHdvIGl0ZW1zXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wKDkpKFsxLCAyLCAzLCA0XSksXG4gICAgICAgICAgICAgICAgICAgW10sXG4gICAgICAgICAgICAgICAgICAgXCJkcm9wZXMgYWxsIGl0ZW1zXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wKDcpKFtdKSxcbiAgICAgICAgICAgICAgICAgICBbXSxcbiAgICAgICAgICAgICAgICAgICBcIm5vdGhpbmcgdG8gZHJvcFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcCgwKShbMSwgMiwgMywgNF0pLFxuICAgICAgICAgICAgICAgICAgIFsxLCAyLCAzLCA0XSxcbiAgICAgICAgICAgICAgICAgICBcIm5vIG5lZWQgdG8gZHJvcFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcCgtNykoWzEsIDIsIDNdKSxcbiAgICAgICAgICAgICAgICAgICBbMSwgMiwgM10sXG4gICAgICAgICAgICAgICAgICAgXCJubyBuZWVkIHRvIGRyb3BcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3AoMCkoMSksXG4gICAgICAgICAgICAgICAgICAgMSxcbiAgICAgICAgICAgICAgICAgICBcIm51bWJlciB3YXMgbm90IGRyb3BwZWRcIilcbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wKDUpKDgpLFxuICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgXCJudW1iZXIgd2FzIHJlc2V0IHRvIDBcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3AoMykoXCJoZWxsb1wiKSxcbiAgICAgICAgICAgICAgICAgICBcImxvXCIsXG4gICAgICAgICAgICAgICAgICAgXCJ0aHJlZSBjaGFyYWN0ZXJzIHdlcmUgZHJvcHBlZFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcCg5KShcImhlbGxvXCIpLFxuICAgICAgICAgICAgICAgICAgIFwiXCIsXG4gICAgICAgICAgICAgICAgICAgXCJkcm9wcGVkIGFsbCBjaGFyc1wiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcCg4KShcIlwiKSxcbiAgICAgICAgICAgICAgICAgICBcIlwiLFxuICAgICAgICAgICAgICAgICAgIFwibm90aGluZyB0byBkcm9wXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wKDkpKG51bGwpLFxuICAgICAgICAgICAgICAgICAgIG51bGwpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wKDApKG51bGwpLFxuICAgICAgICAgICAgICAgICAgIG51bGwpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wKDgpKHZvaWQoMCkpLFxuICAgICAgICAgICAgICAgICAgIHZvaWQoMCkpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wKDApKHZvaWQoMCkpLFxuICAgICAgICAgICAgICAgICAgIHZvaWQoMCkpXG5cblxuICBjb25zdCBpdGVyYXRvciA9IEltbXV0YWJsZS5JdGVyYWJsZSh7eDogMSwgeTogMn0pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChbLi4uZHJvcCgwKShpdGVyYXRvci52YWx1ZXMoKSldLFxuICAgICAgICAgICAgICAgICAgIFsxLCAyXSxcbiAgICAgICAgICAgICAgICAgICBcIjAgZHJvcHNcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKFsuLi5kcm9wKDEpKGl0ZXJhdG9yLnZhbHVlcygpKV0sXG4gICAgICAgICAgICAgICAgICAgWzJdLFxuICAgICAgICAgICAgICAgICAgIFwiZHJvcHBlZCBmaXJzdFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoWy4uLmRyb3AoOCkoaXRlcmF0b3IudmFsdWVzKCkpXSxcbiAgICAgICAgICAgICAgICAgICBbXSxcbiAgICAgICAgICAgICAgICAgICBcImRyb3BwZWQgYWxsXCIpXG59KVxuXG50ZXN0KFwiZHJvcFdoaWxlXCIsIGFzc2VydCA9PiB7XG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcFdoaWxlKGxlc3NUaGFuKDkpKShbMSwgOCwgMTIsIDksIDQ1XSksXG4gICAgICAgICAgICAgICAgICAgWzEyLCA5LCA0NV0pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wV2hpbGUobGVzc1RoYW4oOSkpKFsxMCwgOSwgOCwgN10pLFxuICAgICAgICAgICAgICAgICAgIFsxMCwgOSwgOCwgN10pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wV2hpbGUobGVzc1RoYW4oOSkpKFsxLCAyLCAzXSksXG4gICAgICAgICAgICAgICAgICAgW10pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wV2hpbGUobGVzc1RoYW4oOSkpKFtdKSxcbiAgICAgICAgICAgICAgICAgICBbXSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3BXaGlsZShGYWxzZSkoNSksIDUpXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcFdoaWxlKFRydWUpKDUpLCAwKVxuXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wV2hpbGUoVHJ1ZSkobnVsbCksIG51bGwpXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcFdoaWxlKEZhbHNlKShudWxsKSwgbnVsbClcblxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcFdoaWxlKFRydWUpKHZvaWQoMCkpLCB2b2lkKDApKVxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2VXaGlsZShGYWxzZSkodm9pZCgwKSksIHZvaWQoMCkpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wV2hpbGUoaXNMb3dlckNhc2UpKFwibmV2ZXIgbWluZCBZb3VcIiksXG4gICAgICAgICAgICAgICAgICAgXCJZb3VcIilcbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wV2hpbGUoaXNMb3dlckNhc2UpKFwiSGkgdGhlcmVcIiksXG4gICAgICAgICAgICAgICAgICAgXCJIaSB0aGVyZVwiKVxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3BXaGlsZShUcnVlKShcIlwiKSwgXCJcIilcbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wV2hpbGUoRmFsc2UpKFwiXCIpLCBcIlwiKVxuXG4gIGNvbnN0IGl0ZXJhdG9yID0gSW1tdXRhYmxlLkl0ZXJhYmxlKHt4OiAwLCB5OiA1LCB6OiAxMH0pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChbLi4uZHJvcFdoaWxlKGxlc3NUaGFuKDcpKShpdGVyYXRvci52YWx1ZXMoKSldLFxuICAgICAgICAgICAgICAgICAgIFsxMF0pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChbLi4uZHJvcFdoaWxlKGxlc3NUaGFuKDApKShpdGVyYXRvci52YWx1ZXMoKSldLFxuICAgICAgICAgICAgICAgICAgIFswLCA1LCAxMF0pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChbLi4uZHJvcFdoaWxlKGxlc3NUaGFuKDk5KSkoaXRlcmF0b3IudmFsdWVzKCkpXSxcbiAgICAgICAgICAgICAgICAgICBbXSlcbn0pXG5cbnRlc3QoXCJkcm9wUmVwZWF0c1wiLCBhc3NlcnQgPT4ge1xuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3BSZXBlYXRzKFsxLCAyLCAzLCAzLCA0LCAzXSksXG4gICAgICAgICAgICAgICAgICAgWzEsIDIsIDMsIDQsIDNdLFxuICAgICAgICAgICAgICAgICAgIFwicmVtb3ZlZCByZXBlYXRlZCBlbGVtZW50c1wiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcFJlcGVhdHMoWzEsIDEsIDEsIDEsIDFdKSxcbiAgICAgICAgICAgICAgICAgICBbMV0sXG4gICAgICAgICAgICAgICAgICAgXCJrZWVwcyBqdXN0IG9uZVwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcFJlcGVhdHMoMSksXG4gICAgICAgICAgICAgICAgICAgMSxcbiAgICAgICAgICAgICAgICAgICBcIm51bWJlciBoYXMgbm8gcmVwZWF0c1wiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcFJlcGVhdHMobnVsbCksXG4gICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICBcIm51bGwgdHJhbnNmcm9tZWQgaXMgbnVsbFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcFJlcGVhdHModm9pZCgwKSksXG4gICAgICAgICAgICAgICAgICAgdm9pZCgwKSxcbiAgICAgICAgICAgICAgICAgICBcInZvaWQgdHJhbnNmcm9tZWQgaXMgdm9pZFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcFJlcGVhdHMoXCJ3aGF0XCIpLFxuICAgICAgICAgICAgICAgICAgIFwid2hhdFwiLFxuICAgICAgICAgICAgICAgICAgIFwibm90aGluZyB0byBkcm9wXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wUmVwZWF0cyhcImhlbGxvXCIpLFxuICAgICAgICAgICAgICAgICAgIFwiaGVsb1wiLFxuICAgICAgICAgICAgICAgICAgIFwiZHJvcGVzIHJlcGVhdGVkIGNoYXJzXCIpXG5cbiAgY29uc3QgaXRlcmF0b3IgPSBJbW11dGFibGUuSXRlcmFibGUoe3g6IDEsIFk6IDIsIHo6IDJ9KVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoWy4uLmRyb3BSZXBlYXRzKGl0ZXJhdG9yLnZhbHVlcygpKV0sXG4gICAgICAgICAgICAgICAgICAgWzEsIDJdLFxuICAgICAgICAgICAgICAgICAgIFwicmVtb3ZlcyByZXBlYXRzIGZvcm0gaXRlcmF0b3JcIilcbn0pXG5cbnRlc3QoXCJ0YWtlXCIsIGFzc2VydCA9PiB7XG4gIGFzc2VydC5kZWVwRXF1YWwodGFrZSgyKShbMSwgMiwgMywgNCwgNV0pLFxuICAgICAgICAgICAgICAgICAgIFsxLCAyXSxcbiAgICAgICAgICAgICAgICAgICBcInRvb2sgdHdvXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbCh0YWtlKDkpKFsxLCAyLCAzLCA0XSksXG4gICAgICAgICAgICAgICAgICAgWzEsIDIsIDMsIDRdLFxuICAgICAgICAgICAgICAgICAgIFwidG9vayBhbGxcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2UoNykoW10pLFxuICAgICAgICAgICAgICAgICAgIFtdLFxuICAgICAgICAgICAgICAgICAgIFwibm90aGluZyB0byB0YWtlXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbCh0YWtlKDApKFsxLCAyLCAzLCA0XSksXG4gICAgICAgICAgICAgICAgICAgW10sXG4gICAgICAgICAgICAgICAgICAgXCJ0b29rIDBcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2UoLTcpKFsxLCAyLCAzXSksXG4gICAgICAgICAgICAgICAgICAgW10sXG4gICAgICAgICAgICAgICAgICAgXCJ0b29rIG5vbmVcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2UoMCkoMSksIDApXG4gIGFzc2VydC5kZWVwRXF1YWwodGFrZSg1KSg4KSwgOClcblxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2UoMykoXCJoZWxsb1wiKSwgXCJoZWxcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2UoOSkoXCJoZWxsb1wiKSwgXCJoZWxsb1wiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodGFrZSg4KShcIlwiKSwgXCJcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2UoOSkobnVsbCksIG51bGwpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbCh0YWtlKDApKG51bGwpLCBudWxsKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodGFrZSg4KSh2b2lkKDApKSwgdm9pZCgwKSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3AoMCkodm9pZCgwKSksIHZvaWQoMCkpXG5cblxuICBjb25zdCBpdGVyYXRvciA9IEltbXV0YWJsZS5JdGVyYWJsZSh7eDogMSwgeTogMn0pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChbLi4udGFrZSg5KShpdGVyYXRvci52YWx1ZXMoKSldLFxuICAgICAgICAgICAgICAgICAgIFsxLCAyXSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKFsuLi50YWtlKDEpKGl0ZXJhdG9yLnZhbHVlcygpKV0sXG4gICAgICAgICAgICAgICAgICAgWzFdLFxuICAgICAgICAgICAgICAgICAgIFwidG9vayBmaXJzdFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoWy4uLnRha2UoMCkoaXRlcmF0b3IudmFsdWVzKCkpXSxcbiAgICAgICAgICAgICAgICAgICBbXSxcbiAgICAgICAgICAgICAgICAgICBcInRvb2sgbm9uZVwiKVxufSlcblxudGVzdChcInRha2VXaGlsZVwiLCBhc3NlcnQgPT4ge1xuICBjb25zdCBkaWdpdHMgPSB0YWtlV2hpbGUobGVzc1RoYW4oMTApKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZGlnaXRzKFsxLCA4LCAxMiwgOSwgNDVdKSxcbiAgICAgICAgICAgICAgICAgICBbMSwgOF0sXG4gICAgICAgICAgICAgICAgICAgXCJ0YWtlcyBvbmx5IGRpZ2l0c1wiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZGlnaXRzKFsxMCwgOSwgOCwgN10pLFxuICAgICAgICAgICAgICAgICAgIFtdLFxuICAgICAgICAgICAgICAgICAgIFwidGFrZXMgbm9uZVwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZGlnaXRzKDUpLFxuICAgICAgICAgICAgICAgICAgIDUsXG4gICAgICAgICAgICAgICAgICAgXCJ0YWtlIG1hdGNoaW5nIG51bWJlclwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZGlnaXRzKDk3KSxcbiAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgIFwicmV0dXJucyAwIG9uIHVubWF0Y2hlZCBudW1iZXJcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2VXaGlsZShUcnVlKShudWxsKSxcbiAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgIFwicmV0dXJuIG51bGxcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2VXaGlsZShGYWxzZSkobnVsbCksXG4gICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICBcInJldHVybnMgbnVsbFwiKVxuXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbCh0YWtlV2hpbGUoVHJ1ZSkodm9pZCgwKSksXG4gICAgICAgICAgICAgICAgICAgdm9pZCgwKSxcbiAgICAgICAgICAgICAgICAgICBcInJldHVybiB2b2lkXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbCh0YWtlV2hpbGUoRmFsc2UpKHZvaWQoMCkpLFxuICAgICAgICAgICAgICAgICAgIHZvaWQoMCksXG4gICAgICAgICAgICAgICAgICAgXCJyZXR1cm4gdm9pZFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodGFrZVdoaWxlKGlzTG93ZXJDYXNlKShcIm5ldmVyIG1pbmQgWW91XCIpLFxuICAgICAgICAgICAgICAgICAgIFwibmV2ZXIgbWluZCBcIixcbiAgICAgICAgICAgICAgICAgICBcInRha2VzIHVudGlsIHVwcGVyIGNhc2VcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2VXaGlsZShpc0xvd2VyQ2FzZSkoXCJIaSB0aGVyZVwiKSxcbiAgICAgICAgICAgICAgICAgICBcIlwiLFxuICAgICAgICAgICAgICAgICAgIFwiYmxhbmsgc3RyaW5nXCIpXG5cbiAgY29uc3QgaXRlcmF0b3IgPSBJbW11dGFibGUuSXRlcmFibGUoe3g6IDAsIHk6IDUsIHo6IDEwfSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKFsuLi50YWtlV2hpbGUobGVzc1RoYW4oNykpKGl0ZXJhdG9yLnZhbHVlcygpKV0sXG4gICAgICAgICAgICAgICAgICAgWzAsIDVdLFxuICAgICAgICAgICAgICAgICAgIFwicmVtb3ZlcyByZXBlYXRzIGZvcm0gaXRlcmF0b3JcIilcbn0pXG5cbnRlc3QoXCJwYXJ0aXRpb25cIiwgYXNzZXJ0ID0+IHtcbiAgYXNzZXJ0LmRlZXBFcXVhbChwYXJ0aXRpb24oMikoWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDhdKSxcbiAgICAgICAgICAgICAgICAgICBbWzEsIDJdLCBbMywgNF0sIFs1LCA2XSwgWzcsIDhdXSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKHBhcnRpdGlvbigzKShbMSwgMiwgMywgNCwgNSwgNiwgNywgOF0pLFxuICAgICAgICAgICAgICAgICAgIFtbMSwgMiwgM10sIFs0LCA1LCA2XSwgWzcsIDhdXSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKHBhcnRpdGlvbig0KShbMSwgMl0pLFtbMSwgMl1dKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwocGFydGl0aW9uKDMpKFtdKSwgW10pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChwYXJ0aXRpb24oMykoOSksIDkpXG4gIGFzc2VydC5kZWVwRXF1YWwocGFydGl0aW9uKDIpKFwiaGVsbG9cIiksIFwiaGVsbG9cIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHBhcnRpdGlvbigyKShudWxsKSwgbnVsbClcbiAgYXNzZXJ0LmRlZXBFcXVhbChwYXJ0aXRpb24oMikodm9pZCgwKSksIHZvaWQoMCkpXG5cbiAgY29uc3QgaXRlcmF0b3IgPSBJbW11dGFibGUuSXRlcmFibGUoe3g6IDAsIHk6IDUsIHo6IDEwfSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKFsuLi5wYXJ0aXRpb24oMikoaXRlcmF0b3IudmFsdWVzKCkpXSxcbiAgICAgICAgICAgICAgICAgICBbWzAsIDVdLCBbMTBdXSlcbn0pXG5cbi8vIFRPRE86IVxudGVzdChcInBhcnRpdGlvbkJ5XCIsIGFzc2VydCA9PiB7XG59KVxuXG50ZXN0KFwiY2F0XCIsIGFzc2VydCA9PiB7XG4gIGFzc2VydC5kZWVwRXF1YWwoY2F0KFtbMSwgMl0sIFszXSwgWzQsIDVdXSksXG4gICAgICAgICAgICAgICAgICAgWzEsIDIsIDMsIDQsIDVdKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoY2F0KFtdKSwgW10pXG4gIGFzc2VydC5kZWVwRXF1YWwoY2F0KFsxLCAyLCAzXSksIFsxLCAyLCAzXSlcbiAgYXNzZXJ0LmRlZXBFcXVhbChjYXQobnVsbCksIG51bGwpXG4gIGFzc2VydC5kZWVwRXF1YWwoY2F0KHZvaWQoMCkpLCB2b2lkKDApKVxuICBhc3NlcnQuZGVlcEVxdWFsKGNhdCg0KSwgNClcbiAgYXNzZXJ0LmRlZXBFcXVhbChjYXQoXCJoZWxsb1wiKSwgXCJoZWxsb1wiKVxuXG4gIGNvbnN0IHZhbHVlSXRlciA9IEltbXV0YWJsZS5JdGVyYWJsZShbMCwgNSwgMTBdKS52YWx1ZXMoKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoWy4uLmNhdCh2YWx1ZUl0ZXIpXSxcbiAgICAgICAgICAgICAgICAgICBbMCwgNSwgMTBdKVxuXG4gIGNvbnN0IGFycmF5SXRlciA9IEltbXV0YWJsZS5JdGVyYWJsZShbWzEsIDJdLCBbM10sIFs0LCA1LCA2XV0pLnZhbHVlcygpXG4gIGFzc2VydC5kZWVwRXF1YWwoWy4uLmNhdChhcnJheUl0ZXIpXSxcbiAgICAgICAgICAgICAgICAgICBbMSwgMiwgMywgNCwgNSwgNl0pXG59KVxuXG50ZXN0KFwibWFwY2F0XCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IG1hcGNhdCA9IGYgPT4gKG1hcChmKSkoY2F0KVxuICBjb25zdCBzcGxpdCA9IGJ5ID0+IHN0cmluZyA9PiBzdHJpbmcuc3BsaXQoYnkpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChtYXBjYXQoc3BsaXQoXCIvXCIpKShbXCJwYXRoL3RvXCIsIFwiZGlyL2ZpbGVcIl0pLFxuICAgICAgICAgICAgICAgICAgIFtcInBhdGhcIiwgXCJ0b1wiLCBcImRpclwiLCBcImZpbGVcIl0pXG59KVxuXG50ZXN0KFwiY29tcG9zaXRpb25cIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3QgaW5jZXIgPSBtYXAoaW5jKVxuICBjb25zdCBhZGQyID0gaW5jZXIoaW5jZXIpXG5cbiAgYXNzZXJ0LmVxdWFsKHR5cGVvZihhZGQyKSwgXCJmdW5jdGlvblwiLFxuICAgICAgICAgICAgICAgXCJwYXNzaW5nIHRyYW5zZHVjZXIgdG8gdHJhbnNkdWNlciBjb21wb3NlcyBhIG5ldyBvbmVcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKGFkZDIoWzEsIDIsIDMsIDRdKSxcbiAgICAgICAgICAgICAgICAgICBbMywgNCwgNSwgNl0sXG4gICAgICAgICAgICAgICAgICAgXCJhcnJheSBlbGVtZW50cyBnZXQgbWFwcGVkXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChhZGQyKDApLCAyLFxuICAgICAgICAgICAgICAgICAgIFwiZnVuY3Rpb24gaXMgYXBwbGllZCB0byBudW1iZXJcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKGFkZDIobnVsbCksIG51bGwsXG4gICAgICAgICAgICAgICAgICAgXCJtYXAgb3ZlciBudWxsIGlzIG5vIG9wXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChhZGQyKHZvaWQoMCkpLCB2b2lkKDApLFxuICAgICAgICAgICAgICAgICAgIFwibWFwIG92ZXIgdm9pZCBpcyB2b2lkXCIpXG59KVxuXG5cbnRlc3QoXCJ0cmFzZHVjZVwiLCBhc3NlcnQgPT4ge1xuICBjb25zdCBldmVucyA9IGZpbHRlcihpc0V2ZW4pXG4gIGFzc2VydC5lcXVhbCh0cmFuc2R1Y2UoWzEsIDIsIDMsIDRdLCBldmVucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICByZWR1Y2VyKCh4LCB5KSA9PiB5ID09PSB2b2lkKDApID8geCA6IHggKyB5KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAwKSxcbiAgICAgICAgICAgICAgIDYsXG4gICAgICAgICAgICAgICBcInRyYW5zZHVjZWQgYXJyYXkgd2l0aCBjdXN0b20gcmVkdWNlclwiKVxuXG4gIGNvbnN0IGl0ZXJhdG9yID0gSW1tdXRhYmxlLkl0ZXJhYmxlKHt4OiAxLCBZOiAyLCB6OiAzLCB3OiA0fSlcbiAgYXNzZXJ0LmVxdWFsKHRyYW5zZHVjZShpdGVyYXRvci52YWx1ZXMoKSwgZXZlbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgcmVkdWNlcigoeCwgeSkgPT4geSA9PT0gdm9pZCgwKSA/IHggOiB4ICsgeSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgNSksXG4gICAgICAgICAgICAgICAxMSxcbiAgICAgICAgICAgICAgXCJ0cmFuc2R1Y2UgaXRlcmF0b3Igd2l0aCBjdXN0b20gcmVkdWNlclwiKVxufSlcbiJdfQ==