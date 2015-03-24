(function (factory) {
                 if (typeof define === "function" && define.amd) {
                                  define(["exports", "./test", "immutable", "../../"], factory);
                 } else if (typeof exports !== "undefined") {
                                  factory(exports, require("./test"), require("immutable"), require("../../"));
                 }
})(function (exports, _test, _immutable, _) {
                 "use strict";

                 var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

                 var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

                 var test = _test["default"];
                 var Immutable = _immutable;
                 var reduce = _.reduce;
                 var transduce = _.transduce;
                 var map = _.map;
                 var filter = _.filter;
                 var remove = _.remove;
                 var cat = _.cat;
                 var mapcat = _.mapcat;
                 var partition = _.partition;
                 var take = _.take;
                 var takeWhile = _.takeWhile;
                 var drop = _.drop;
                 var dropWhile = _.dropWhile;
                 var dropRepeats = _.dropRepeats;
                 var init = _.init;
                 var step = _.step;
                 var result = _.result;

                 // utility
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
                                  assert.deepEqual(map(function (x) {
                                                   return x.split("/");
                                  })(cat)(["path/to", "dir/file"]), ["path", "to", "dir", "file"]);
                 });

                 test("composition", function (assert) {
                                  var incer = map(inc);
                                  var add2 = incer(incer);

                                  assert.equal(typeof add2, "function", "passing transducer to transducer composes a new one");

                                  assert.deepEqual(add2([1, 2, 3, 4]), [3, 4, 5, 6], "array elements get mapped");

                                  assert.deepEqual(add2(0), 2, "function is applied to number");

                                  assert.deepEqual(add2(null), null, "map over null is no op");

                                  assert.deepEqual(add2(void 0), void 0, "map over void is void");

                                  assert.deepEqual(filter(isEven)(map(inc))([1, 4, 9, 10]), [5, 11]);
                 });

                 test("trasduce", function (assert) {
                                  var evens = filter(isEven);
                                  assert.equal(transduce(evens, function (x, y) {
                                                   return y === void 0 ? x : x + y;
                                  }, 2, [1, 2, 3, 4]), 8, "transduced array with custom reducer");

                                  assert.equal(transduce(evens, function (x, y) {
                                                   return x === void 0 ? 0 : y === void 0 ? x : x + y;
                                  }, [1, 2, 3, 4]), 6, "transduced without initial value");

                                  var iterator = Immutable.Iterable({ x: 1, Y: 2, z: 3, w: 4 });
                                  assert.equal(transduce(evens, function (x, y) {
                                                   return y === void 0 ? x : x + y;
                                  }, 5, iterator.values()), 11, "transduce iterator with custom reducer");
                 });

                 test("immutable list", function (assert) {
                                  var incer = map(inc);
                                  var list = Immutable.List.of(1, 2, 3, 4);
                                  var t1 = incer(list);

                                  assert.notOk(t1 instanceof Immutable.List, "result is not a list");

                                  assert.deepEqual([].concat(_toConsumableArray(t1)), [2, 3, 4, 5], "result is an iterator");

                                  Immutable.List.prototype[init.symbol] = function () {
                                                   return Immutable.List().asMutable();
                                  };

                                  Immutable.List.prototype[result.symbol] = function (list) {
                                                   return list.asImmutable();
                                  };

                                  Immutable.List.prototype[step.symbol] = function (list, item) {
                                                   return list.push(item);
                                  };

                                  var t2 = incer(list);

                                  assert.ok(t2 instanceof Immutable.List, "result is a list");

                                  assert.ok(t2.equals(Immutable.List.of(2, 3, 4, 5)), "transformed list was returned");

                                  var t3 = filter(isEven)(incer)(incer)(incer)(list);

                                  assert.ok(t3.equals(Immutable.List.of(5, 7)), "composed transform works fine");
                 });

                 test("immutable map", function (assert) {
                                  var f = map(function (_ref) {
                                                   var _ref2 = _slicedToArray(_ref, 2);

                                                   var key = _ref2[0];
                                                   var value = _ref2[1];
                                                   return [key.toUpperCase(), value * value];
                                  });

                                  var m1 = Immutable.Map({ x: 1, y: 2 });

                                  var t1 = f(m1);

                                  assert.notOk(t1 instanceof Immutable.Map, "result is not a map");

                                  assert.deepEqual([].concat(_toConsumableArray(t1)), [["X", 1], ["Y", 4]], "result is transformed iterator");

                                  Immutable.Map.prototype[init.symbol] = function () {
                                                   return Immutable.Map().asMutable();
                                  };

                                  Immutable.Map.prototype[result.symbol] = function (map) {
                                                   return map.asImmutable();
                                  };

                                  Immutable.Map.prototype[step.symbol] = function (map, _ref) {
                                                   var _ref2 = _slicedToArray(_ref, 2);

                                                   var key = _ref2[0];
                                                   var value = _ref2[1];
                                                   return map.set(key, value);
                                  };

                                  var t2 = f(m1);

                                  assert.ok(t2 instanceof Immutable.Map, "result is instanceof Map");

                                  assert.ok(t2.equals(Immutable.Map({ X: 1, Y: 4 })), "map was transformed");
                 });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7cUJBQU8sSUFBSTtxQkFDQyxTQUFTO3FCQUNiLE1BQU0sS0FBTixNQUFNO3FCQUFFLFNBQVMsS0FBVCxTQUFTO3FCQUFFLEdBQUcsS0FBSCxHQUFHO3FCQUFFLE1BQU0sS0FBTixNQUFNO3FCQUFFLE1BQU0sS0FBTixNQUFNO3FCQUFFLEdBQUcsS0FBSCxHQUFHO3FCQUMzQyxNQUFNLEtBQU4sTUFBTTtxQkFBRSxTQUFTLEtBQVQsU0FBUztxQkFBRSxJQUFJLEtBQUosSUFBSTtxQkFBRSxTQUFTLEtBQVQsU0FBUztxQkFDbEMsSUFBSSxLQUFKLElBQUk7cUJBQUUsU0FBUyxLQUFULFNBQVM7cUJBQUUsV0FBVyxLQUFYLFdBQVc7cUJBRTVCLElBQUksS0FBSixJQUFJO3FCQUFFLElBQUksS0FBSixJQUFJO3FCQUFFLE1BQU0sS0FBTixNQUFNOzs7QUFHMUIscUJBQU0sR0FBRyxHQUFHLFVBQUEsQ0FBQzt5Q0FBSSxDQUFDLEdBQUcsQ0FBQztrQkFBQSxDQUFBO0FBQ3RCLHFCQUFNLFNBQVMsR0FBRyxVQUFBLElBQUk7eUNBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtrQkFBQSxDQUFBO0FBQzVDLHFCQUFNLFNBQVMsR0FBRyxVQUFBLElBQUk7eUNBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtrQkFBQSxDQUFBO0FBQzVDLHFCQUFNLEdBQUcsR0FBRyxVQUFBLENBQUM7eUNBQUksVUFBQSxDQUFDOzBEQUFJLENBQUMsR0FBRyxDQUFDO21DQUFBO2tCQUFBLENBQUE7QUFDM0IscUJBQU0sUUFBUSxHQUFHLFVBQUEsQ0FBQzt5Q0FBSSxVQUFBLENBQUM7MERBQUksQ0FBQyxHQUFHLENBQUM7bUNBQUE7a0JBQUEsQ0FBQTtBQUNoQyxxQkFBTSxTQUFTLEdBQUcsVUFBQSxJQUFJO3lDQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO2tCQUFBLENB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LENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBOztBQUUxQyxzQ0FBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQTs7QUFFeEQsd0NBQU0sQ0FBQyxTQUFTLDhCQUFLLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsSUFDN0MsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBOztBQUV0Qix3Q0FBTSxDQUFDLFNBQVMsOEJBQUssU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUM3QyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTs7QUFFNUIsd0NBQU0sQ0FBQyxTQUFTLDhCQUFLLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsSUFDOUMsRUFBRSxDQUFDLENBQUE7a0JBQ3JCLENBQUMsQ0FBQTs7QUFFRixxQkFBSSxDQUFDLGFBQWEsRUFBRSxVQUFBLE1BQU0sRUFBSTtBQUM1Qix3Q0FBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQy9CLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUNmLDJCQUEyQixDQUFDLENBQUE7O0FBRTdDLHdDQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFD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QUUzQyx3Q0FBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7O0FBRWpDLHdDQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTs7QUFFckMsd0NBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBOztBQUVyQyx3Q0FBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEFBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxBQUFDLENBQUMsQ0FBQTs7QUFFM0Msd0NBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxBQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQUFBQyxDQUFDLENBQUE7O0FBRzNDLHNDQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQTs7QUFFakQsd0NBQU0sQ0FBQyxTQUFTLDhCQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsSUFDOUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFeEIsd0NBQU0sQ0FBQyxTQUFTLDhCQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsSUFDOUIsQ0FBQyxDQUFDLENBQUMsRUFDSCxZQUFZLENBQUMsQ0FBQTs7QUFFOUIsd0NBQU0sQ0FBQyxTQUFTLDhCQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsSUFDOUIsRUFBRSxFQUNGLFdBQVcsQ0FBQyxDQUFB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Q0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUN0QyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBOztBQUVoRCx3Q0FBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFL0Msd0NBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBOztBQUV0Qyx3Q0FBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDcEMsd0NBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFBOztBQUVoRCx3Q0FBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDMUMsd0NBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxBQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQUFBQyxDQUFDLENBQUE7O0FBRWhELHNDQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFBOztBQUV4RCx3Q0FBTSxDQUFDLFNBQVMsOEJBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUNuQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO2tCQUNqQyxDQUFDLENBQUE7OztBQUdGLHFCQUFJLENBQUMsYUFBYSxFQUFFLFVBQUEsTUFBTSxFQUFJLEVBQzdCLENBQUMsQ0FBQTs7QUFFRixxQkFBSSxDQUFDLEtBQUssRUFBRSxVQUFBLE1BQU0sRUFBSTtBQUNwQix3Q0FBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDMUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFakMsd0NBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQzdCLHdDQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUMzQyx3Q0FBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDakMsd0NBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxBQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQUFBQyxDQUFDLENBQUE7QUFDdkMsd0NBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FB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Q0FBQyxNQUFNLENBQUMsR0FBRzswREFDckMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLFNBQVMsRUFBRTttQ0FBQSxDQUFBOztBQUU3QiwyQ0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFVBQUMsR0FBRzswREFDM0MsR0FBRyxDQUFDLFdBQVcsRUFBRTttQ0FBQSxDQUFBOztBQUVuQiwyQ0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFVBQUMsR0FBRzs7O3VEQUFHLEdBQUc7dURBQUUsS0FBSzswREFDdEQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDO21DQUFBLENBQUE7O0FBR3JCLHNDQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUE7O0FBR2hCLHdDQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxTQUFTLENBQUMsR0FBRyxFQUMzQiwwQkFBMEIsQ0FBQyxDQUFBOztBQUdyQyx3Q0FBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQ3RDLHFCQUFxQixDQUFDLENBQUE7a0JBQ2pDLENBQUMsQ0FBQSIsImZpbGUiOiJzcmMvdGVzdC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0ZXN0IGZyb20gXCIuL3Rlc3RcIlxuaW1wb3J0ICogYXMgSW1tdXRhYmxlIGZyb20gXCJpbW11dGFibGVcIlxuaW1wb3J0IHtyZWR1Y2UsIHRyYW5zZHVjZSwgbWFwLCBmaWx0ZXIsIHJlbW92ZSwgY2F0LFxuICAgICAgICBtYXBjYXQsIHBhcnRpdGlvbiwgdGFrZSwgdGFrZVdoaWxlLFxuICAgICAgICBkcm9wLCBkcm9wV2hpbGUsIGRyb3BSZXBlYXRzLFxuXG4gICAgICAgIGluaXQsIHN0ZXAsIHJlc3VsdH0gZnJvbSBcIi4uLy4uL1wiXG5cbi8vIHV0aWxpdHlcbmNvbnN0IGluYyA9IHggPT4geCArIDFcbmNvbnN0IHVwcGVyQ2FzZSA9IGNoYXIgPT4gY2hhci50b1VwcGVyQ2FzZSgpXG5jb25zdCBsb3dlckNhc2UgPSBjaGFyID0+IGNoYXIudG9Mb3dlckNhc2UoKVxuY29uc3QgYWRkID0geCA9PiB5ID0+IHggKyB5XG5jb25zdCBtdWx0aXBseSA9IHggPT4geSA9PiB4ICogeVxuY29uc3Qgc3RyaW5naWZ5ID0ganNvbiA9PiBKU09OLnN0cmluZ2lmeShqc29uKVxuY29uc3QgaXNFdmVuID0geCA9PiAhKHggJSAyKVxuY29uc3QgaXNMb3dlckNhc2UgPSBjaGFyID0+IGNoYXIudG9Mb3dlckNhc2UoKSA9PT0gY2hhclxuY29uc3QgbGVzc1RoYW4gPSB4ID0+IHkgPT4geSA8IHhcbmNvbnN0IGNvbnN0YW50ID0geCA9PiBfID0+IHhcbmNvbnN0IGlkZW50aXR5ID0geCA9PiB4XG5cbmNvbnN0IFRydWUgPSBjb25zdGFudCh0cnVlKVxuY29uc3QgRmFsc2UgPSBjb25zdGFudChmYWxzZSlcblxuaWYgKCFBcnJheS5mcm9tKSB7XG4gIEFycmF5LmZyb20gPSBpdGVyYXRvciA9PiB7XG4gICAgY29uc3QgYXJyYXkgPSBbXVxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBjb25zdCB7dmFsdWUsIGRvbmV9ID0gaXRlcmF0b3IubmV4dCgpXG4gICAgICBpZiAoZG9uZSkge1xuICAgICAgICByZXR1cm4gYXJyYXlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFycmF5LnB1c2godmFsdWUpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbnRlc3QoXCJtYXBcIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3QgaW5jZXIgPSBtYXAoaW5jKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoaW5jZXIoWzEsIDIsIDMsIDRdKSxcbiAgICAgICAgICAgICAgICAgICBbMiwgMywgNCwgNV0sXG4gICAgICAgICAgICAgICAgICAgXCJhcnJheSBlbGVtZW50cyBnZXQgbWFwcGVkXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChpbmNlcigwKSwgMSxcbiAgICAgICAgICAgICAgICAgICBcImZ1bmN0aW9uIGlzIGFwcGxpZWQgdG8gbnVtYmVyXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChpbmNlcihudWxsKSwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICBcIm1hcCBvdmVyIG51bGwgaXMgbm8gb3BcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKGluY2VyKHZvaWQoMCkpLCB2b2lkKDApLFxuICAgICAgICAgICAgICAgICAgIFwibWFwIG92ZXIgdm9pZCBpcyB2b2lkXCIpXG5cbiAgYXNzZXJ0LmVxdWFsKG1hcCh1cHBlckNhc2UpKFwiSGVsbG9cIiksXG4gICAgICAgICAgICAgICBcIkhFTExPXCIsXG4gICAgICAgICAgICAgICBcInN0cmluZ3MgY2FuIGJlIG1hcHBlZCBvdmVyXCIpXG5cbiAgY29uc3QgaXRlcmF0b3IgPSBJbW11dGFibGUuSXRlcmFibGUoe3g6IDEsIHk6IDJ9KVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoWy4uLmluY2VyKGl0ZXJhdG9yLnZhbHVlcygpKV0sXG4gICAgICAgICAgICAgICAgICAgWzIsIDNdLFxuICAgICAgICAgICAgICAgICAgIFwiaXRlcmFibGUgbWFrZXMgbGF6eSB0cmFuc2Zvcm1hdGlvblwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoWy4uLm1hcCh1cHBlckNhc2UpKGl0ZXJhdG9yLmtleXMoKSldLFxuICAgICAgICAgICAgICAgICAgIFtcIlhcIiwgXCJZXCJdLFxuICAgICAgICAgICAgICAgICAgIFwiaXRlcmFibGUgbWFrZXMgbGF6eSB0cmFuc2Zvcm1hdGlvblwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwobWFwKGlkZW50aXR5KShbWzEsIDJdLCBbMywgNF1dKSxcbiAgICAgICAgICAgICAgICAgICBbWzEsIDJdLCBbMywgNF1dLFxuICAgICAgICAgICAgICAgICAgIFwibWFwIGRvZXMgbm90IGV4cGFuZHNcIilcbn0pXG5cbnRlc3QoXCJmaWx0ZXJcIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3QgZXZlbnMgPSBmaWx0ZXIoaXNFdmVuKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZXZlbnMoWzEsIDIsIDMsIDRdKSwgWzIsIDRdLFxuICAgICAgICAgICAgICAgICAgIFwiYXJyYXkgZWxlbWVudHMgZ290IGZpbHRlcmVkXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChldmVucyhbMSwgMywgNSwgN10pLCBbXSxcbiAgICAgICAgICAgICAgICAgICBcImZpbHRlcmVkIG91dCBhbGwgZWxlbWVudHNcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKGV2ZW5zKDcpLCAwLFxuICAgICAgICAgICAgICAgICAgIFwiZmlsdGVyZWQgb3V0IG9kZCBudW1iZXIgdG8gZW1wdHkgbnVtYmVyXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChldmVucyg2KSwgNixcbiAgICAgICAgICAgICAgICAgICBcIm51bWJlciB3YXMga2VwdCBhcyBpdCB3YXMgZXZlblwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZmlsdGVyKFRydWUpKG51bGwpLCBudWxsLFxuICAgICAgICAgICAgICAgICAgIFwibnVsbCByZW1haW5zIG51bGwgcmVnYXJkbGVzcyBvZiBvcGVyYXRpb25cIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKGZpbHRlcihGYWxzZSkodm9pZCgwKSksIHZvaWQoMCksXG4gICAgICAgICAgICAgICAgICAgXCJ2b2lkIHJlbWFpbnMgdm9pZCByZWdhcmRsZXNzIG9mIG9wZXJhdGlvblwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZmlsdGVyKGlzTG93ZXJDYXNlKShcIkhlbGxvIFdvcmxkXCIpLCBcImVsbG8gb3JsZFwiLFxuICAgICAgICAgICAgICAgICAgIFwiZmlsdGVycyBvdXQgdXBwZXIgY2FzZSBsZXR0ZXJzXCIpXG5cbiAgY29uc3QgaXRlcmF0b3IgPSBJbW11dGFibGUuSXRlcmFibGUoe3g6IDEsIFk6IDIsIHo6IDN9KVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoWy4uLmV2ZW5zKGl0ZXJhdG9yLnZhbHVlcygpKV0sXG4gICAgICAgICAgICAgICAgICAgWzJdLFxuICAgICAgICAgICAgICAgICAgIFwiZmlsdGVyIHZhbHVlIGl0ZXJhdG9yc1wiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoWy4uLmZpbHRlcihpc0xvd2VyQ2FzZSkoaXRlcmF0b3Iua2V5cygpKV0sXG4gICAgICAgICAgICAgICAgICAgW1wieFwiLCBcInpcIl0sXG4gICAgICAgICAgICAgICAgICAgXCJmaWx0ZXIga2V5IGl0ZXJhdG9yc1wiKVxufSlcblxuXG5cbnRlc3QoXCJyZW1vdmVcIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3Qgb2RkcyA9IHJlbW92ZShpc0V2ZW4pXG4gIGNvbnN0IHVwcGVyQ2FzZUNoYXJzID0gcmVtb3ZlKGlzTG93ZXJDYXNlKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwob2RkcyhbMSwgMiwgMywgNF0pLFxuICAgICAgICAgICAgICAgICAgIFsxLCAzXSxcbiAgICAgICAgICAgICAgICAgICBcImV2ZW5zIHdlcmUgcmVtb3ZlZFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwocmVtb3ZlKFRydWUpKG51bGwpLFxuICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgXCJ0cmFuc2R1Y2luZyBudWxsIHJldHVybiBudWxsXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChyZW1vdmUoRmFsc2UpKG51bGwpLFxuICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgXCJ0cmFuc2R1Y2luZyBudWxsIHJldHVybiBudWxsXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChyZW1vdmUoVHJ1ZSkodm9pZCgwKSksXG4gICAgICAgICAgICAgICAgICAgdm9pZCgwKSxcbiAgICAgICAgICAgICAgICAgICBcInRyYW5zZHVjaW5nIHZvaWQgcmV0dXJuIHZvaWRcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHJlbW92ZShGYWxzZSkodm9pZCgwKSksXG4gICAgICAgICAgICAgICAgICAgdm9pZCgwKSxcbiAgICAgICAgICAgICAgICAgICBcInRyYW5zZHVjaW5nIHZvaWQgcmV0dXJuIHZvaWRcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHJlbW92ZSh4ID0+IHggPiAwKSg3KSxcbiAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgIFwicmVtb3ZpbmcgbWF0Y2hpbmcgbnVtYmVyIHJldHVybnMgMFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwocmVtb3ZlKHggPT4geCA8IDApKDcpLFxuICAgICAgICAgICAgICAgICAgIDcsXG4gICAgICAgICAgICAgICAgICAgXCJyZW1vdmluZyB1bm1hdGNoZWQgbnVtYmVyIHJldHVybnMgbnVtYmVyXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbCh1cHBlckNhc2VDaGFycyhcIkhlbGxvIFdvcmxkXCIpLFxuICAgICAgICAgICAgICAgICAgIFwiSFdcIixcbiAgICAgICAgICAgICAgICAgICBcInJlbW92ZXMgbG93ZXIgY2FzZSBjaGFyc1wiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodXBwZXJDYXNlQ2hhcnMoXCJ3aGF0P1wiKSxcbiAgICAgICAgICAgICAgICAgICBcIlwiLFxuICAgICAgICAgICAgICAgICAgIFwicmVtb3ZlcyBhbGwgY2hhcnNcIilcblxuICBjb25zdCBpdGVyYXRvciA9IEltbXV0YWJsZS5JdGVyYWJsZSh7eDogMSwgWTogMiwgejogM30pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChbLi4ub2RkcyhpdGVyYXRvci52YWx1ZXMoKSldLFxuICAgICAgICAgICAgICAgICAgIFsxLCAzXSxcbiAgICAgICAgICAgICAgICAgICBcInJlbW92ZXMgZnJvbSBpdGVyYXRvclwiKVxufSlcblxudGVzdChcImRyb3BcIiwgYXNzZXJ0ID0+IHtcbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wKDIpKFsxLCAyLCAzLCA0LCA1XSksXG4gICAgICAgICAgICAgICAgICAgWzMsIDQsIDVdLFxuICAgICAgICAgICAgICAgICAgIFwiZHJvcHBlZCB0d28gaXRlbXNcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3AoOSkoWzEsIDIsIDMsIDRdKSxcbiAgICAgICAgICAgICAgICAgICBbXSxcbiAgICAgICAgICAgICAgICAgICBcImRyb3BlcyBhbGwgaXRlbXNcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3AoNykoW10pLFxuICAgICAgICAgICAgICAgICAgIFtdLFxuICAgICAgICAgICAgICAgICAgIFwibm90aGluZyB0byBkcm9wXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wKDApKFsxLCAyLCAzLCA0XSksXG4gICAgICAgICAgICAgICAgICAgWzEsIDIsIDMsIDRdLFxuICAgICAgICAgICAgICAgICAgIFwibm8gbmVlZCB0byBkcm9wXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wKC03KShbMSwgMiwgM10pLFxuICAgICAgICAgICAgICAgICAgIFsxLCAyLCAzXSxcbiAgICAgICAgICAgICAgICAgICBcIm5vIG5lZWQgdG8gZHJvcFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcCgwKSgxKSxcbiAgICAgICAgICAgICAgICAgICAxLFxuICAgICAgICAgICAgICAgICAgIFwibnVtYmVyIHdhcyBub3QgZHJvcHBlZFwiKVxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3AoNSkoOCksXG4gICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICBcIm51bWJlciB3YXMgcmVzZXQgdG8gMFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcCgzKShcImhlbGxvXCIpLFxuICAgICAgICAgICAgICAgICAgIFwibG9cIixcbiAgICAgICAgICAgICAgICAgICBcInRocmVlIGNoYXJhY3RlcnMgd2VyZSBkcm9wcGVkXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wKDkpKFwiaGVsbG9cIiksXG4gICAgICAgICAgICAgICAgICAgXCJcIixcbiAgICAgICAgICAgICAgICAgICBcImRyb3BwZWQgYWxsIGNoYXJzXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wKDgpKFwiXCIpLFxuICAgICAgICAgICAgICAgICAgIFwiXCIsXG4gICAgICAgICAgICAgICAgICAgXCJub3RoaW5nIHRvIGRyb3BcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3AoOSkobnVsbCksXG4gICAgICAgICAgICAgICAgICAgbnVsbClcblxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3AoMCkobnVsbCksXG4gICAgICAgICAgICAgICAgICAgbnVsbClcblxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3AoOCkodm9pZCgwKSksXG4gICAgICAgICAgICAgICAgICAgdm9pZCgwKSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3AoMCkodm9pZCgwKSksXG4gICAgICAgICAgICAgICAgICAgdm9pZCgwKSlcblxuXG4gIGNvbnN0IGl0ZXJhdG9yID0gSW1tdXRhYmxlLkl0ZXJhYmxlKHt4OiAxLCB5OiAyfSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKFsuLi5kcm9wKDApKGl0ZXJhdG9yLnZhbHVlcygpKV0sXG4gICAgICAgICAgICAgICAgICAgWzEsIDJdLFxuICAgICAgICAgICAgICAgICAgIFwiMCBkcm9wc1wiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoWy4uLmRyb3AoMSkoaXRlcmF0b3IudmFsdWVzKCkpXSxcbiAgICAgICAgICAgICAgICAgICBbMl0sXG4gICAgICAgICAgICAgICAgICAgXCJkcm9wcGVkIGZpcnN0XCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChbLi4uZHJvcCg4KShpdGVyYXRvci52YWx1ZXMoKSldLFxuICAgICAgICAgICAgICAgICAgIFtdLFxuICAgICAgICAgICAgICAgICAgIFwiZHJvcHBlZCBhbGxcIilcbn0pXG5cbnRlc3QoXCJkcm9wV2hpbGVcIiwgYXNzZXJ0ID0+IHtcbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wV2hpbGUobGVzc1RoYW4oOSkpKFsxLCA4LCAxMiwgOSwgNDVdKSxcbiAgICAgICAgICAgICAgICAgICBbMTIsIDksIDQ1XSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3BXaGlsZShsZXNzVGhhbig5KSkoWzEwLCA5LCA4LCA3XSksXG4gICAgICAgICAgICAgICAgICAgWzEwLCA5LCA4LCA3XSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3BXaGlsZShsZXNzVGhhbig5KSkoWzEsIDIsIDNdKSxcbiAgICAgICAgICAgICAgICAgICBbXSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3BXaGlsZShsZXNzVGhhbig5KSkoW10pLFxuICAgICAgICAgICAgICAgICAgIFtdKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcFdoaWxlKEZhbHNlKSg1KSwgNSlcbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wV2hpbGUoVHJ1ZSkoNSksIDApXG5cblxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3BXaGlsZShUcnVlKShudWxsKSwgbnVsbClcbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wV2hpbGUoRmFsc2UpKG51bGwpLCBudWxsKVxuXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wV2hpbGUoVHJ1ZSkodm9pZCgwKSksIHZvaWQoMCkpXG4gIGFzc2VydC5kZWVwRXF1YWwodGFrZVdoaWxlKEZhbHNlKSh2b2lkKDApKSwgdm9pZCgwKSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3BXaGlsZShpc0xvd2VyQ2FzZSkoXCJuZXZlciBtaW5kIFlvdVwiKSxcbiAgICAgICAgICAgICAgICAgICBcIllvdVwiKVxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3BXaGlsZShpc0xvd2VyQ2FzZSkoXCJIaSB0aGVyZVwiKSxcbiAgICAgICAgICAgICAgICAgICBcIkhpIHRoZXJlXCIpXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcFdoaWxlKFRydWUpKFwiXCIpLCBcIlwiKVxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3BXaGlsZShGYWxzZSkoXCJcIiksIFwiXCIpXG5cbiAgY29uc3QgaXRlcmF0b3IgPSBJbW11dGFibGUuSXRlcmFibGUoe3g6IDAsIHk6IDUsIHo6IDEwfSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKFsuLi5kcm9wV2hpbGUobGVzc1RoYW4oNykpKGl0ZXJhdG9yLnZhbHVlcygpKV0sXG4gICAgICAgICAgICAgICAgICAgWzEwXSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKFsuLi5kcm9wV2hpbGUobGVzc1RoYW4oMCkpKGl0ZXJhdG9yLnZhbHVlcygpKV0sXG4gICAgICAgICAgICAgICAgICAgWzAsIDUsIDEwXSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKFsuLi5kcm9wV2hpbGUobGVzc1RoYW4oOTkpKShpdGVyYXRvci52YWx1ZXMoKSldLFxuICAgICAgICAgICAgICAgICAgIFtdKVxufSlcblxudGVzdChcImRyb3BSZXBlYXRzXCIsIGFzc2VydCA9PiB7XG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcFJlcGVhdHMoWzEsIDIsIDMsIDMsIDQsIDNdKSxcbiAgICAgICAgICAgICAgICAgICBbMSwgMiwgMywgNCwgM10sXG4gICAgICAgICAgICAgICAgICAgXCJyZW1vdmVkIHJlcGVhdGVkIGVsZW1lbnRzXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wUmVwZWF0cyhbMSwgMSwgMSwgMSwgMV0pLFxuICAgICAgICAgICAgICAgICAgIFsxXSxcbiAgICAgICAgICAgICAgICAgICBcImtlZXBzIGp1c3Qgb25lXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wUmVwZWF0cygxKSxcbiAgICAgICAgICAgICAgICAgICAxLFxuICAgICAgICAgICAgICAgICAgIFwibnVtYmVyIGhhcyBubyByZXBlYXRzXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wUmVwZWF0cyhudWxsKSxcbiAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgIFwibnVsbCB0cmFuc2Zyb21lZCBpcyBudWxsXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wUmVwZWF0cyh2b2lkKDApKSxcbiAgICAgICAgICAgICAgICAgICB2b2lkKDApLFxuICAgICAgICAgICAgICAgICAgIFwidm9pZCB0cmFuc2Zyb21lZCBpcyB2b2lkXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wUmVwZWF0cyhcIndoYXRcIiksXG4gICAgICAgICAgICAgICAgICAgXCJ3aGF0XCIsXG4gICAgICAgICAgICAgICAgICAgXCJub3RoaW5nIHRvIGRyb3BcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3BSZXBlYXRzKFwiaGVsbG9cIiksXG4gICAgICAgICAgICAgICAgICAgXCJoZWxvXCIsXG4gICAgICAgICAgICAgICAgICAgXCJkcm9wZXMgcmVwZWF0ZWQgY2hhcnNcIilcblxuICBjb25zdCBpdGVyYXRvciA9IEltbXV0YWJsZS5JdGVyYWJsZSh7eDogMSwgWTogMiwgejogMn0pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChbLi4uZHJvcFJlcGVhdHMoaXRlcmF0b3IudmFsdWVzKCkpXSxcbiAgICAgICAgICAgICAgICAgICBbMSwgMl0sXG4gICAgICAgICAgICAgICAgICAgXCJyZW1vdmVzIHJlcGVhdHMgZm9ybSBpdGVyYXRvclwiKVxufSlcblxudGVzdChcInRha2VcIiwgYXNzZXJ0ID0+IHtcbiAgYXNzZXJ0LmRlZXBFcXVhbCh0YWtlKDIpKFsxLCAyLCAzLCA0LCA1XSksXG4gICAgICAgICAgICAgICAgICAgWzEsIDJdLFxuICAgICAgICAgICAgICAgICAgIFwidG9vayB0d29cIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2UoOSkoWzEsIDIsIDMsIDRdKSxcbiAgICAgICAgICAgICAgICAgICBbMSwgMiwgMywgNF0sXG4gICAgICAgICAgICAgICAgICAgXCJ0b29rIGFsbFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodGFrZSg3KShbXSksXG4gICAgICAgICAgICAgICAgICAgW10sXG4gICAgICAgICAgICAgICAgICAgXCJub3RoaW5nIHRvIHRha2VcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2UoMCkoWzEsIDIsIDMsIDRdKSxcbiAgICAgICAgICAgICAgICAgICBbXSxcbiAgICAgICAgICAgICAgICAgICBcInRvb2sgMFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodGFrZSgtNykoWzEsIDIsIDNdKSxcbiAgICAgICAgICAgICAgICAgICBbXSxcbiAgICAgICAgICAgICAgICAgICBcInRvb2sgbm9uZVwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodGFrZSgwKSgxKSwgMClcbiAgYXNzZXJ0LmRlZXBFcXVhbCh0YWtlKDUpKDgpLCA4KVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodGFrZSgzKShcImhlbGxvXCIpLCBcImhlbFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodGFrZSg5KShcImhlbGxvXCIpLCBcImhlbGxvXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbCh0YWtlKDgpKFwiXCIpLCBcIlwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodGFrZSg5KShudWxsKSwgbnVsbClcblxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2UoMCkobnVsbCksIG51bGwpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbCh0YWtlKDgpKHZvaWQoMCkpLCB2b2lkKDApKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcCgwKSh2b2lkKDApKSwgdm9pZCgwKSlcblxuXG4gIGNvbnN0IGl0ZXJhdG9yID0gSW1tdXRhYmxlLkl0ZXJhYmxlKHt4OiAxLCB5OiAyfSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKFsuLi50YWtlKDkpKGl0ZXJhdG9yLnZhbHVlcygpKV0sXG4gICAgICAgICAgICAgICAgICAgWzEsIDJdKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoWy4uLnRha2UoMSkoaXRlcmF0b3IudmFsdWVzKCkpXSxcbiAgICAgICAgICAgICAgICAgICBbMV0sXG4gICAgICAgICAgICAgICAgICAgXCJ0b29rIGZpcnN0XCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChbLi4udGFrZSgwKShpdGVyYXRvci52YWx1ZXMoKSldLFxuICAgICAgICAgICAgICAgICAgIFtdLFxuICAgICAgICAgICAgICAgICAgIFwidG9vayBub25lXCIpXG59KVxuXG50ZXN0KFwidGFrZVdoaWxlXCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IGRpZ2l0cyA9IHRha2VXaGlsZShsZXNzVGhhbigxMCkpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkaWdpdHMoWzEsIDgsIDEyLCA5LCA0NV0pLFxuICAgICAgICAgICAgICAgICAgIFsxLCA4XSxcbiAgICAgICAgICAgICAgICAgICBcInRha2VzIG9ubHkgZGlnaXRzXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkaWdpdHMoWzEwLCA5LCA4LCA3XSksXG4gICAgICAgICAgICAgICAgICAgW10sXG4gICAgICAgICAgICAgICAgICAgXCJ0YWtlcyBub25lXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkaWdpdHMoNSksXG4gICAgICAgICAgICAgICAgICAgNSxcbiAgICAgICAgICAgICAgICAgICBcInRha2UgbWF0Y2hpbmcgbnVtYmVyXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkaWdpdHMoOTcpLFxuICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgXCJyZXR1cm5zIDAgb24gdW5tYXRjaGVkIG51bWJlclwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodGFrZVdoaWxlKFRydWUpKG51bGwpLFxuICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgXCJyZXR1cm4gbnVsbFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodGFrZVdoaWxlKEZhbHNlKShudWxsKSxcbiAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgIFwicmV0dXJucyBudWxsXCIpXG5cblxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2VXaGlsZShUcnVlKSh2b2lkKDApKSxcbiAgICAgICAgICAgICAgICAgICB2b2lkKDApLFxuICAgICAgICAgICAgICAgICAgIFwicmV0dXJuIHZvaWRcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2VXaGlsZShGYWxzZSkodm9pZCgwKSksXG4gICAgICAgICAgICAgICAgICAgdm9pZCgwKSxcbiAgICAgICAgICAgICAgICAgICBcInJldHVybiB2b2lkXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbCh0YWtlV2hpbGUoaXNMb3dlckNhc2UpKFwibmV2ZXIgbWluZCBZb3VcIiksXG4gICAgICAgICAgICAgICAgICAgXCJuZXZlciBtaW5kIFwiLFxuICAgICAgICAgICAgICAgICAgIFwidGFrZXMgdW50aWwgdXBwZXIgY2FzZVwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodGFrZVdoaWxlKGlzTG93ZXJDYXNlKShcIkhpIHRoZXJlXCIpLFxuICAgICAgICAgICAgICAgICAgIFwiXCIsXG4gICAgICAgICAgICAgICAgICAgXCJibGFuayBzdHJpbmdcIilcblxuICBjb25zdCBpdGVyYXRvciA9IEltbXV0YWJsZS5JdGVyYWJsZSh7eDogMCwgeTogNSwgejogMTB9KVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoWy4uLnRha2VXaGlsZShsZXNzVGhhbig3KSkoaXRlcmF0b3IudmFsdWVzKCkpXSxcbiAgICAgICAgICAgICAgICAgICBbMCwgNV0sXG4gICAgICAgICAgICAgICAgICAgXCJyZW1vdmVzIHJlcGVhdHMgZm9ybSBpdGVyYXRvclwiKVxufSlcblxudGVzdChcInBhcnRpdGlvblwiLCBhc3NlcnQgPT4ge1xuICBhc3NlcnQuZGVlcEVxdWFsKHBhcnRpdGlvbigyKShbMSwgMiwgMywgNCwgNSwgNiwgNywgOF0pLFxuICAgICAgICAgICAgICAgICAgIFtbMSwgMl0sIFszLCA0XSwgWzUsIDZdLCBbNywgOF1dKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwocGFydGl0aW9uKDMpKFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4XSksXG4gICAgICAgICAgICAgICAgICAgW1sxLCAyLCAzXSwgWzQsIDUsIDZdLCBbNywgOF1dKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwocGFydGl0aW9uKDQpKFsxLCAyXSksW1sxLCAyXV0pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChwYXJ0aXRpb24oMykoW10pLCBbXSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKHBhcnRpdGlvbigzKSg5KSwgOSlcbiAgYXNzZXJ0LmRlZXBFcXVhbChwYXJ0aXRpb24oMikoXCJoZWxsb1wiKSwgXCJoZWxsb1wiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwocGFydGl0aW9uKDIpKG51bGwpLCBudWxsKVxuICBhc3NlcnQuZGVlcEVxdWFsKHBhcnRpdGlvbigyKSh2b2lkKDApKSwgdm9pZCgwKSlcblxuICBjb25zdCBpdGVyYXRvciA9IEltbXV0YWJsZS5JdGVyYWJsZSh7eDogMCwgeTogNSwgejogMTB9KVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoWy4uLnBhcnRpdGlvbigyKShpdGVyYXRvci52YWx1ZXMoKSldLFxuICAgICAgICAgICAgICAgICAgIFtbMCwgNV0sIFsxMF1dKVxufSlcblxuLy8gVE9ETzohXG50ZXN0KFwicGFydGl0aW9uQnlcIiwgYXNzZXJ0ID0+IHtcbn0pXG5cbnRlc3QoXCJjYXRcIiwgYXNzZXJ0ID0+IHtcbiAgYXNzZXJ0LmRlZXBFcXVhbChjYXQoW1sxLCAyXSwgWzNdLCBbNCwgNV1dKSxcbiAgICAgICAgICAgICAgICAgICBbMSwgMiwgMywgNCwgNV0pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChjYXQoW10pLCBbXSlcbiAgYXNzZXJ0LmRlZXBFcXVhbChjYXQoWzEsIDIsIDNdKSwgWzEsIDIsIDNdKVxuICBhc3NlcnQuZGVlcEVxdWFsKGNhdChudWxsKSwgbnVsbClcbiAgYXNzZXJ0LmRlZXBFcXVhbChjYXQodm9pZCgwKSksIHZvaWQoMCkpXG4gIGFzc2VydC5kZWVwRXF1YWwoY2F0KDQpLCA0KVxuICBhc3NlcnQuZGVlcEVxdWFsKGNhdChcImhlbGxvXCIpLCBcImhlbGxvXCIpXG5cbiAgY29uc3QgdmFsdWVJdGVyID0gSW1tdXRhYmxlLkl0ZXJhYmxlKFswLCA1LCAxMF0pLnZhbHVlcygpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChbLi4uY2F0KHZhbHVlSXRlcildLFxuICAgICAgICAgICAgICAgICAgIFswLCA1LCAxMF0pXG5cbiAgY29uc3QgYXJyYXlJdGVyID0gSW1tdXRhYmxlLkl0ZXJhYmxlKFtbMSwgMl0sIFszXSwgWzQsIDUsIDZdXSkudmFsdWVzKClcbiAgYXNzZXJ0LmRlZXBFcXVhbChbLi4uY2F0KGFycmF5SXRlcildLFxuICAgICAgICAgICAgICAgICAgIFsxLCAyLCAzLCA0LCA1LCA2XSlcbn0pXG5cbnRlc3QoXCJtYXBjYXRcIiwgYXNzZXJ0ID0+IHtcbiAgYXNzZXJ0LmRlZXBFcXVhbCgobWFwKHggPT4geC5zcGxpdChcIi9cIikpKVxuICAgICAgICAgICAgICAgICAgIChjYXQpXG4gICAgICAgICAgICAgICAgICAgKFtcInBhdGgvdG9cIiwgXCJkaXIvZmlsZVwiXSksXG4gICAgICAgICAgICAgICAgICAgW1wicGF0aFwiLCBcInRvXCIsIFwiZGlyXCIsIFwiZmlsZVwiXSlcbn0pXG5cbnRlc3QoXCJjb21wb3NpdGlvblwiLCBhc3NlcnQgPT4ge1xuICBjb25zdCBpbmNlciA9IG1hcChpbmMpXG4gIGNvbnN0IGFkZDIgPSBpbmNlcihpbmNlcilcblxuICBhc3NlcnQuZXF1YWwodHlwZW9mKGFkZDIpLCBcImZ1bmN0aW9uXCIsXG4gICAgICAgICAgICAgICBcInBhc3NpbmcgdHJhbnNkdWNlciB0byB0cmFuc2R1Y2VyIGNvbXBvc2VzIGEgbmV3IG9uZVwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoYWRkMihbMSwgMiwgMywgNF0pLFxuICAgICAgICAgICAgICAgICAgIFszLCA0LCA1LCA2XSxcbiAgICAgICAgICAgICAgICAgICBcImFycmF5IGVsZW1lbnRzIGdldCBtYXBwZWRcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKGFkZDIoMCksIDIsXG4gICAgICAgICAgICAgICAgICAgXCJmdW5jdGlvbiBpcyBhcHBsaWVkIHRvIG51bWJlclwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoYWRkMihudWxsKSwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICBcIm1hcCBvdmVyIG51bGwgaXMgbm8gb3BcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKGFkZDIodm9pZCgwKSksIHZvaWQoMCksXG4gICAgICAgICAgICAgICAgICAgXCJtYXAgb3ZlciB2b2lkIGlzIHZvaWRcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKChmaWx0ZXIoaXNFdmVuKSlcbiAgICAgICAgICAgICAgICAgICAobWFwKGluYykpXG4gICAgICAgICAgICAgICAgICAgKFsxLCA0LCA5LCAxMF0pLFxuICAgICAgICAgICAgICAgICAgIFs1LCAxMV0pXG59KVxuXG5cbnRlc3QoXCJ0cmFzZHVjZVwiLCBhc3NlcnQgPT4ge1xuICBjb25zdCBldmVucyA9IGZpbHRlcihpc0V2ZW4pXG4gIGFzc2VydC5lcXVhbCh0cmFuc2R1Y2UoZXZlbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgKHgsIHkpID0+IHkgPT09IHZvaWQoMCkgPyB4IDogeCArIHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgMixcbiAgICAgICAgICAgICAgICAgICAgICAgICBbMSwgMiwgMywgNF0pLFxuICAgICAgICAgICAgICAgOCxcbiAgICAgICAgICAgICAgIFwidHJhbnNkdWNlZCBhcnJheSB3aXRoIGN1c3RvbSByZWR1Y2VyXCIpXG5cbiAgYXNzZXJ0LmVxdWFsKHRyYW5zZHVjZShldmVucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAoeCwgeSkgPT4geCA9PT0gdm9pZCgwKSA/IDAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5ID09PSB2b2lkKDApID8geCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggKyB5LFxuICAgICAgICAgICAgICAgICAgICAgICAgIFsxLCAyLCAzLCA0XSksXG4gICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgXCJ0cmFuc2R1Y2VkIHdpdGhvdXQgaW5pdGlhbCB2YWx1ZVwiKVxuXG5cbiAgY29uc3QgaXRlcmF0b3IgPSBJbW11dGFibGUuSXRlcmFibGUoe3g6IDEsIFk6IDIsIHo6IDMsIHc6IDR9KVxuICBhc3NlcnQuZXF1YWwodHJhbnNkdWNlKGV2ZW5zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICh4LCB5KSA9PiB5ID09PSB2b2lkKDApID8geCA6IHggKyB5LFxuICAgICAgICAgICAgICAgICAgICAgICAgIDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgaXRlcmF0b3IudmFsdWVzKCkpLFxuICAgICAgICAgICAgICAgMTEsXG4gICAgICAgICAgICAgIFwidHJhbnNkdWNlIGl0ZXJhdG9yIHdpdGggY3VzdG9tIHJlZHVjZXJcIilcbn0pXG5cblxudGVzdChcImltbXV0YWJsZSBsaXN0XCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IGluY2VyID0gbWFwKGluYylcbiAgY29uc3QgbGlzdCA9IEltbXV0YWJsZS5MaXN0Lm9mKDEsIDIsIDMsIDQpXG4gIGNvbnN0IHQxID0gaW5jZXIobGlzdClcblxuICBhc3NlcnQubm90T2sodDEgaW5zdGFuY2VvZiBJbW11dGFibGUuTGlzdCxcbiAgICAgICAgICAgICAgIFwicmVzdWx0IGlzIG5vdCBhIGxpc3RcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKFsuLi50MV0sXG4gICAgICAgICAgICAgICAgICAgWzIsIDMsIDQsIDVdLFxuICAgICAgICAgICAgICAgICAgIFwicmVzdWx0IGlzIGFuIGl0ZXJhdG9yXCIpXG5cbiAgSW1tdXRhYmxlLkxpc3QucHJvdG90eXBlW2luaXQuc3ltYm9sXSA9ICgpID0+XG4gICAgSW1tdXRhYmxlLkxpc3QoKS5hc011dGFibGUoKVxuXG4gIEltbXV0YWJsZS5MaXN0LnByb3RvdHlwZVtyZXN1bHQuc3ltYm9sXSA9IChsaXN0KSA9PlxuICAgIGxpc3QuYXNJbW11dGFibGUoKVxuXG4gIEltbXV0YWJsZS5MaXN0LnByb3RvdHlwZVtzdGVwLnN5bWJvbF0gPSAobGlzdCwgaXRlbSkgPT5cbiAgICBsaXN0LnB1c2goaXRlbSlcblxuXG4gIGNvbnN0IHQyID0gaW5jZXIobGlzdClcblxuXG4gIGFzc2VydC5vayh0MiBpbnN0YW5jZW9mIEltbXV0YWJsZS5MaXN0LFxuICAgICAgICAgICAgXCJyZXN1bHQgaXMgYSBsaXN0XCIpXG5cblxuICBhc3NlcnQub2sodDIuZXF1YWxzKEltbXV0YWJsZS5MaXN0Lm9mKDIsIDMsIDQsIDUpKSxcbiAgICAgICAgICAgIFwidHJhbnNmb3JtZWQgbGlzdCB3YXMgcmV0dXJuZWRcIilcblxuICBjb25zdCB0MyA9IChmaWx0ZXIoaXNFdmVuKSlcbiAgICAgICAgICAgICAoaW5jZXIpXG4gICAgICAgICAgICAgKGluY2VyKVxuICAgICAgICAgICAgIChpbmNlcilcbiAgICAgICAgICAgICAobGlzdClcblxuICBhc3NlcnQub2sodDMuZXF1YWxzKEltbXV0YWJsZS5MaXN0Lm9mKDUsIDcpKSxcbiAgICAgICAgICAgIFwiY29tcG9zZWQgdHJhbnNmb3JtIHdvcmtzIGZpbmVcIilcblxufSlcblxuXG5cblxudGVzdChcImltbXV0YWJsZSBtYXBcIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3QgZiA9IG1hcCgoW2tleSwgdmFsdWVdKSA9PiBba2V5LnRvVXBwZXJDYXNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlICogdmFsdWVdKVxuXG4gIGNvbnN0IG0xID0gSW1tdXRhYmxlLk1hcCh7eDogMSwgeTogMn0pXG5cbiAgY29uc3QgdDEgPSBmKG0xKVxuXG4gIGFzc2VydC5ub3RPayh0MSBpbnN0YW5jZW9mIEltbXV0YWJsZS5NYXAsXG4gICAgICAgICAgICAgICBcInJlc3VsdCBpcyBub3QgYSBtYXBcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKFsuLi50MV0sXG4gICAgICAgICAgICAgICAgICAgW1tcIlhcIiwgMV0sIFtcIllcIiwgNF1dLFxuICAgICAgICAgICAgICAgICAgIFwicmVzdWx0IGlzIHRyYW5zZm9ybWVkIGl0ZXJhdG9yXCIpXG5cbiAgSW1tdXRhYmxlLk1hcC5wcm90b3R5cGVbaW5pdC5zeW1ib2xdID0gKCkgPT5cbiAgICBJbW11dGFibGUuTWFwKCkuYXNNdXRhYmxlKClcblxuICBJbW11dGFibGUuTWFwLnByb3RvdHlwZVtyZXN1bHQuc3ltYm9sXSA9IChtYXApID0+XG4gICAgbWFwLmFzSW1tdXRhYmxlKClcblxuICBJbW11dGFibGUuTWFwLnByb3RvdHlwZVtzdGVwLnN5bWJvbF0gPSAobWFwLCBba2V5LCB2YWx1ZV0pID0+XG4gICAgbWFwLnNldChrZXksIHZhbHVlKVxuXG5cbiAgY29uc3QgdDIgPSBmKG0xKVxuXG5cbiAgYXNzZXJ0Lm9rKHQyIGluc3RhbmNlb2YgSW1tdXRhYmxlLk1hcCxcbiAgICAgICAgICAgIFwicmVzdWx0IGlzIGluc3RhbmNlb2YgTWFwXCIpXG5cblxuICBhc3NlcnQub2sodDIuZXF1YWxzKEltbXV0YWJsZS5NYXAoe1g6IDEsIFk6IDR9KSksXG4gICAgICAgICAgICBcIm1hcCB3YXMgdHJhbnNmb3JtZWRcIilcbn0pXG5cblxuIl19