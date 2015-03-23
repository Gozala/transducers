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
});
//# sourceMappingURL=data:application/json;base64,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QUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUN0QyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBOztBQUVoRCx3Q0FBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFL0Msd0NBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBOztBQUV0Qyx3Q0FBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDcEMsd0NBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFBOztBQUVoRCx3Q0FBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDMUMsd0NBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxBQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQUFBQyxDQUFDLENBQUE7O0FBRWhELHNDQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFBOztBQUV4RCx3Q0FBTSxDQUFDLFNBQVMsOEJBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUNuQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO2tCQUNqQyxDQUFDLENBQUE7OztBQUdGLHFCQUFJLENBQUMsYUFBYSxFQUFFLFVBQUEsTUFBTSxFQUFJLEVBQzdCLENBQUMsQ0FBQTs7QUFFRixxQkFBSSxDQUFDLEtBQUssRUFBRSxVQUFBLE1BQU0sRUFBSTtBQUNwQix3Q0FBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDMUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFakMsd0NBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQzdCLHdDQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUMzQyx3Q0FBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDakMsd0NBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxBQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQUFBQyxDQUFDLENBQUE7QUFDdkMsd0NBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQzNCLHdDQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLENB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QUEsRUFDbkMsQ0FBQyxFQUNELENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFDdkIsQ0FBQyxFQUNELHNDQUFzQyxDQUFDLENBQUE7O0FBRXBELHdDQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQ0wsVUFBQyxDQUFDLEVBQUUsQ0FBQzswREFBSyxDQUFDLEtBQUssS0FBSyxDQUFDLEFBQUMsR0FBRyxDQUFDLEdBQ2pCLENBQUMsS0FBSyxLQUFLLENBQUMsQUFBQyxHQUFHLENBQUMsR0FDakIsQ0FBQyxHQUFHLENBQUM7bUNBQUEsRUFDZixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQ3ZCLENBQUMsRUFDRCxrQ0FBa0MsQ0FBQyxDQUFBOztBQUdoRCxzQ0FBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFBO0FBQzdELHdDQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQ0wsVUFBQyxDQUFDLEVBQUUsQ0FBQzswREFBSyxDQUFDLEtBQUssS0FBSyxDQUFDLEFBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7bUNBQUEsRUFDbkMsQ0FBQyxFQUNELFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUM1QixFQUFFLEVBQ0gsd0NBQXdDLENBQUMsQ0FBQTtrQkFDdEQsQ0FBQyxDQUFBIiwiZmlsZSI6InNyYy90ZXN0L2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRlc3QgZnJvbSBcIi4vdGVzdFwiXG5pbXBvcnQgKiBhcyBJbW11dGFibGUgZnJvbSBcImltbXV0YWJsZVwiXG5pbXBvcnQge3JlZHVjZSwgdHJhbnNkdWNlLCBtYXAsIGZpbHRlciwgcmVtb3ZlLCBjYXQsXG4gICAgICAgIG1hcGNhdCwgcGFydGl0aW9uLCB0YWtlLCB0YWtlV2hpbGUsXG4gICAgICAgIGRyb3AsIGRyb3BXaGlsZSwgZHJvcFJlcGVhdHN9IGZyb20gXCIuLi8uLi9cIlxuXG4vLyB1dGlsaXR5XG5jb25zdCBpbmMgPSB4ID0+IHggKyAxXG5jb25zdCB1cHBlckNhc2UgPSBjaGFyID0+IGNoYXIudG9VcHBlckNhc2UoKVxuY29uc3QgbG93ZXJDYXNlID0gY2hhciA9PiBjaGFyLnRvTG93ZXJDYXNlKClcbmNvbnN0IGFkZCA9IHggPT4geSA9PiB4ICsgeVxuY29uc3QgbXVsdGlwbHkgPSB4ID0+IHkgPT4geCAqIHlcbmNvbnN0IHN0cmluZ2lmeSA9IGpzb24gPT4gSlNPTi5zdHJpbmdpZnkoanNvbilcbmNvbnN0IGlzRXZlbiA9IHggPT4gISh4ICUgMilcbmNvbnN0IGlzTG93ZXJDYXNlID0gY2hhciA9PiBjaGFyLnRvTG93ZXJDYXNlKCkgPT09IGNoYXJcbmNvbnN0IGxlc3NUaGFuID0geCA9PiB5ID0+IHkgPCB4XG5jb25zdCBjb25zdGFudCA9IHggPT4gXyA9PiB4XG5jb25zdCBpZGVudGl0eSA9IHggPT4geFxuXG5jb25zdCBUcnVlID0gY29uc3RhbnQodHJ1ZSlcbmNvbnN0IEZhbHNlID0gY29uc3RhbnQoZmFsc2UpXG5cbmlmICghQXJyYXkuZnJvbSkge1xuICBBcnJheS5mcm9tID0gaXRlcmF0b3IgPT4ge1xuICAgIGNvbnN0IGFycmF5ID0gW11cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgY29uc3Qge3ZhbHVlLCBkb25lfSA9IGl0ZXJhdG9yLm5leHQoKVxuICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgcmV0dXJuIGFycmF5XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcnJheS5wdXNoKHZhbHVlKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG50ZXN0KFwibWFwXCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IGluY2VyID0gbWFwKGluYylcblxuICBhc3NlcnQuZGVlcEVxdWFsKGluY2VyKFsxLCAyLCAzLCA0XSksXG4gICAgICAgICAgICAgICAgICAgWzIsIDMsIDQsIDVdLFxuICAgICAgICAgICAgICAgICAgIFwiYXJyYXkgZWxlbWVudHMgZ2V0IG1hcHBlZFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoaW5jZXIoMCksIDEsXG4gICAgICAgICAgICAgICAgICAgXCJmdW5jdGlvbiBpcyBhcHBsaWVkIHRvIG51bWJlclwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoaW5jZXIobnVsbCksIG51bGwsXG4gICAgICAgICAgICAgICAgICAgXCJtYXAgb3ZlciBudWxsIGlzIG5vIG9wXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChpbmNlcih2b2lkKDApKSwgdm9pZCgwKSxcbiAgICAgICAgICAgICAgICAgICBcIm1hcCBvdmVyIHZvaWQgaXMgdm9pZFwiKVxuXG4gIGFzc2VydC5lcXVhbChtYXAodXBwZXJDYXNlKShcIkhlbGxvXCIpLFxuICAgICAgICAgICAgICAgXCJIRUxMT1wiLFxuICAgICAgICAgICAgICAgXCJzdHJpbmdzIGNhbiBiZSBtYXBwZWQgb3ZlclwiKVxuXG4gIGNvbnN0IGl0ZXJhdG9yID0gSW1tdXRhYmxlLkl0ZXJhYmxlKHt4OiAxLCB5OiAyfSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKFsuLi5pbmNlcihpdGVyYXRvci52YWx1ZXMoKSldLFxuICAgICAgICAgICAgICAgICAgIFsyLCAzXSxcbiAgICAgICAgICAgICAgICAgICBcIml0ZXJhYmxlIG1ha2VzIGxhenkgdHJhbnNmb3JtYXRpb25cIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKFsuLi5tYXAodXBwZXJDYXNlKShpdGVyYXRvci5rZXlzKCkpXSxcbiAgICAgICAgICAgICAgICAgICBbXCJYXCIsIFwiWVwiXSxcbiAgICAgICAgICAgICAgICAgICBcIml0ZXJhYmxlIG1ha2VzIGxhenkgdHJhbnNmb3JtYXRpb25cIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKG1hcChpZGVudGl0eSkoW1sxLCAyXSwgWzMsIDRdXSksXG4gICAgICAgICAgICAgICAgICAgW1sxLCAyXSwgWzMsIDRdXSxcbiAgICAgICAgICAgICAgICAgICBcIm1hcCBkb2VzIG5vdCBleHBhbmRzXCIpXG59KVxuXG50ZXN0KFwiZmlsdGVyXCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IGV2ZW5zID0gZmlsdGVyKGlzRXZlbilcblxuICBhc3NlcnQuZGVlcEVxdWFsKGV2ZW5zKFsxLCAyLCAzLCA0XSksIFsyLCA0XSxcbiAgICAgICAgICAgICAgICAgICBcImFycmF5IGVsZW1lbnRzIGdvdCBmaWx0ZXJlZFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZXZlbnMoWzEsIDMsIDUsIDddKSwgW10sXG4gICAgICAgICAgICAgICAgICAgXCJmaWx0ZXJlZCBvdXQgYWxsIGVsZW1lbnRzXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChldmVucyg3KSwgMCxcbiAgICAgICAgICAgICAgICAgICBcImZpbHRlcmVkIG91dCBvZGQgbnVtYmVyIHRvIGVtcHR5IG51bWJlclwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZXZlbnMoNiksIDYsXG4gICAgICAgICAgICAgICAgICAgXCJudW1iZXIgd2FzIGtlcHQgYXMgaXQgd2FzIGV2ZW5cIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKGZpbHRlcihUcnVlKShudWxsKSwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICBcIm51bGwgcmVtYWlucyBudWxsIHJlZ2FyZGxlc3Mgb2Ygb3BlcmF0aW9uXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChmaWx0ZXIoRmFsc2UpKHZvaWQoMCkpLCB2b2lkKDApLFxuICAgICAgICAgICAgICAgICAgIFwidm9pZCByZW1haW5zIHZvaWQgcmVnYXJkbGVzcyBvZiBvcGVyYXRpb25cIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKGZpbHRlcihpc0xvd2VyQ2FzZSkoXCJIZWxsbyBXb3JsZFwiKSwgXCJlbGxvIG9ybGRcIixcbiAgICAgICAgICAgICAgICAgICBcImZpbHRlcnMgb3V0IHVwcGVyIGNhc2UgbGV0dGVyc1wiKVxuXG4gIGNvbnN0IGl0ZXJhdG9yID0gSW1tdXRhYmxlLkl0ZXJhYmxlKHt4OiAxLCBZOiAyLCB6OiAzfSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKFsuLi5ldmVucyhpdGVyYXRvci52YWx1ZXMoKSldLFxuICAgICAgICAgICAgICAgICAgIFsyXSxcbiAgICAgICAgICAgICAgICAgICBcImZpbHRlciB2YWx1ZSBpdGVyYXRvcnNcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKFsuLi5maWx0ZXIoaXNMb3dlckNhc2UpKGl0ZXJhdG9yLmtleXMoKSldLFxuICAgICAgICAgICAgICAgICAgIFtcInhcIiwgXCJ6XCJdLFxuICAgICAgICAgICAgICAgICAgIFwiZmlsdGVyIGtleSBpdGVyYXRvcnNcIilcbn0pXG5cblxuXG50ZXN0KFwicmVtb3ZlXCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IG9kZHMgPSByZW1vdmUoaXNFdmVuKVxuICBjb25zdCB1cHBlckNhc2VDaGFycyA9IHJlbW92ZShpc0xvd2VyQ2FzZSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKG9kZHMoWzEsIDIsIDMsIDRdKSxcbiAgICAgICAgICAgICAgICAgICBbMSwgM10sXG4gICAgICAgICAgICAgICAgICAgXCJldmVucyB3ZXJlIHJlbW92ZWRcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHJlbW92ZShUcnVlKShudWxsKSxcbiAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgIFwidHJhbnNkdWNpbmcgbnVsbCByZXR1cm4gbnVsbFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwocmVtb3ZlKEZhbHNlKShudWxsKSxcbiAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgIFwidHJhbnNkdWNpbmcgbnVsbCByZXR1cm4gbnVsbFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwocmVtb3ZlKFRydWUpKHZvaWQoMCkpLFxuICAgICAgICAgICAgICAgICAgIHZvaWQoMCksXG4gICAgICAgICAgICAgICAgICAgXCJ0cmFuc2R1Y2luZyB2b2lkIHJldHVybiB2b2lkXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChyZW1vdmUoRmFsc2UpKHZvaWQoMCkpLFxuICAgICAgICAgICAgICAgICAgIHZvaWQoMCksXG4gICAgICAgICAgICAgICAgICAgXCJ0cmFuc2R1Y2luZyB2b2lkIHJldHVybiB2b2lkXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChyZW1vdmUoeCA9PiB4ID4gMCkoNyksXG4gICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICBcInJlbW92aW5nIG1hdGNoaW5nIG51bWJlciByZXR1cm5zIDBcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHJlbW92ZSh4ID0+IHggPCAwKSg3KSxcbiAgICAgICAgICAgICAgICAgICA3LFxuICAgICAgICAgICAgICAgICAgIFwicmVtb3ZpbmcgdW5tYXRjaGVkIG51bWJlciByZXR1cm5zIG51bWJlclwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodXBwZXJDYXNlQ2hhcnMoXCJIZWxsbyBXb3JsZFwiKSxcbiAgICAgICAgICAgICAgICAgICBcIkhXXCIsXG4gICAgICAgICAgICAgICAgICAgXCJyZW1vdmVzIGxvd2VyIGNhc2UgY2hhcnNcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHVwcGVyQ2FzZUNoYXJzKFwid2hhdD9cIiksXG4gICAgICAgICAgICAgICAgICAgXCJcIixcbiAgICAgICAgICAgICAgICAgICBcInJlbW92ZXMgYWxsIGNoYXJzXCIpXG5cbiAgY29uc3QgaXRlcmF0b3IgPSBJbW11dGFibGUuSXRlcmFibGUoe3g6IDEsIFk6IDIsIHo6IDN9KVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoWy4uLm9kZHMoaXRlcmF0b3IudmFsdWVzKCkpXSxcbiAgICAgICAgICAgICAgICAgICBbMSwgM10sXG4gICAgICAgICAgICAgICAgICAgXCJyZW1vdmVzIGZyb20gaXRlcmF0b3JcIilcbn0pXG5cbnRlc3QoXCJkcm9wXCIsIGFzc2VydCA9PiB7XG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcCgyKShbMSwgMiwgMywgNCwgNV0pLFxuICAgICAgICAgICAgICAgICAgIFszLCA0LCA1XSxcbiAgICAgICAgICAgICAgICAgICBcImRyb3BwZWQgdHdvIGl0ZW1zXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wKDkpKFsxLCAyLCAzLCA0XSksXG4gICAgICAgICAgICAgICAgICAgW10sXG4gICAgICAgICAgICAgICAgICAgXCJkcm9wZXMgYWxsIGl0ZW1zXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wKDcpKFtdKSxcbiAgICAgICAgICAgICAgICAgICBbXSxcbiAgICAgICAgICAgICAgICAgICBcIm5vdGhpbmcgdG8gZHJvcFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcCgwKShbMSwgMiwgMywgNF0pLFxuICAgICAgICAgICAgICAgICAgIFsxLCAyLCAzLCA0XSxcbiAgICAgICAgICAgICAgICAgICBcIm5vIG5lZWQgdG8gZHJvcFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcCgtNykoWzEsIDIsIDNdKSxcbiAgICAgICAgICAgICAgICAgICBbMSwgMiwgM10sXG4gICAgICAgICAgICAgICAgICAgXCJubyBuZWVkIHRvIGRyb3BcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3AoMCkoMSksXG4gICAgICAgICAgICAgICAgICAgMSxcbiAgICAgICAgICAgICAgICAgICBcIm51bWJlciB3YXMgbm90IGRyb3BwZWRcIilcbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wKDUpKDgpLFxuICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgXCJudW1iZXIgd2FzIHJlc2V0IHRvIDBcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3AoMykoXCJoZWxsb1wiKSxcbiAgICAgICAgICAgICAgICAgICBcImxvXCIsXG4gICAgICAgICAgICAgICAgICAgXCJ0aHJlZSBjaGFyYWN0ZXJzIHdlcmUgZHJvcHBlZFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcCg5KShcImhlbGxvXCIpLFxuICAgICAgICAgICAgICAgICAgIFwiXCIsXG4gICAgICAgICAgICAgICAgICAgXCJkcm9wcGVkIGFsbCBjaGFyc1wiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcCg4KShcIlwiKSxcbiAgICAgICAgICAgICAgICAgICBcIlwiLFxuICAgICAgICAgICAgICAgICAgIFwibm90aGluZyB0byBkcm9wXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wKDkpKG51bGwpLFxuICAgICAgICAgICAgICAgICAgIG51bGwpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wKDApKG51bGwpLFxuICAgICAgICAgICAgICAgICAgIG51bGwpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wKDgpKHZvaWQoMCkpLFxuICAgICAgICAgICAgICAgICAgIHZvaWQoMCkpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wKDApKHZvaWQoMCkpLFxuICAgICAgICAgICAgICAgICAgIHZvaWQoMCkpXG5cblxuICBjb25zdCBpdGVyYXRvciA9IEltbXV0YWJsZS5JdGVyYWJsZSh7eDogMSwgeTogMn0pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChbLi4uZHJvcCgwKShpdGVyYXRvci52YWx1ZXMoKSldLFxuICAgICAgICAgICAgICAgICAgIFsxLCAyXSxcbiAgICAgICAgICAgICAgICAgICBcIjAgZHJvcHNcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKFsuLi5kcm9wKDEpKGl0ZXJhdG9yLnZhbHVlcygpKV0sXG4gICAgICAgICAgICAgICAgICAgWzJdLFxuICAgICAgICAgICAgICAgICAgIFwiZHJvcHBlZCBmaXJzdFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoWy4uLmRyb3AoOCkoaXRlcmF0b3IudmFsdWVzKCkpXSxcbiAgICAgICAgICAgICAgICAgICBbXSxcbiAgICAgICAgICAgICAgICAgICBcImRyb3BwZWQgYWxsXCIpXG59KVxuXG50ZXN0KFwiZHJvcFdoaWxlXCIsIGFzc2VydCA9PiB7XG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcFdoaWxlKGxlc3NUaGFuKDkpKShbMSwgOCwgMTIsIDksIDQ1XSksXG4gICAgICAgICAgICAgICAgICAgWzEyLCA5LCA0NV0pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wV2hpbGUobGVzc1RoYW4oOSkpKFsxMCwgOSwgOCwgN10pLFxuICAgICAgICAgICAgICAgICAgIFsxMCwgOSwgOCwgN10pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wV2hpbGUobGVzc1RoYW4oOSkpKFsxLCAyLCAzXSksXG4gICAgICAgICAgICAgICAgICAgW10pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wV2hpbGUobGVzc1RoYW4oOSkpKFtdKSxcbiAgICAgICAgICAgICAgICAgICBbXSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3BXaGlsZShGYWxzZSkoNSksIDUpXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcFdoaWxlKFRydWUpKDUpLCAwKVxuXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wV2hpbGUoVHJ1ZSkobnVsbCksIG51bGwpXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcFdoaWxlKEZhbHNlKShudWxsKSwgbnVsbClcblxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcFdoaWxlKFRydWUpKHZvaWQoMCkpLCB2b2lkKDApKVxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2VXaGlsZShGYWxzZSkodm9pZCgwKSksIHZvaWQoMCkpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wV2hpbGUoaXNMb3dlckNhc2UpKFwibmV2ZXIgbWluZCBZb3VcIiksXG4gICAgICAgICAgICAgICAgICAgXCJZb3VcIilcbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wV2hpbGUoaXNMb3dlckNhc2UpKFwiSGkgdGhlcmVcIiksXG4gICAgICAgICAgICAgICAgICAgXCJIaSB0aGVyZVwiKVxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3BXaGlsZShUcnVlKShcIlwiKSwgXCJcIilcbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wV2hpbGUoRmFsc2UpKFwiXCIpLCBcIlwiKVxuXG4gIGNvbnN0IGl0ZXJhdG9yID0gSW1tdXRhYmxlLkl0ZXJhYmxlKHt4OiAwLCB5OiA1LCB6OiAxMH0pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChbLi4uZHJvcFdoaWxlKGxlc3NUaGFuKDcpKShpdGVyYXRvci52YWx1ZXMoKSldLFxuICAgICAgICAgICAgICAgICAgIFsxMF0pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChbLi4uZHJvcFdoaWxlKGxlc3NUaGFuKDApKShpdGVyYXRvci52YWx1ZXMoKSldLFxuICAgICAgICAgICAgICAgICAgIFswLCA1LCAxMF0pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChbLi4uZHJvcFdoaWxlKGxlc3NUaGFuKDk5KSkoaXRlcmF0b3IudmFsdWVzKCkpXSxcbiAgICAgICAgICAgICAgICAgICBbXSlcbn0pXG5cbnRlc3QoXCJkcm9wUmVwZWF0c1wiLCBhc3NlcnQgPT4ge1xuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3BSZXBlYXRzKFsxLCAyLCAzLCAzLCA0LCAzXSksXG4gICAgICAgICAgICAgICAgICAgWzEsIDIsIDMsIDQsIDNdLFxuICAgICAgICAgICAgICAgICAgIFwicmVtb3ZlZCByZXBlYXRlZCBlbGVtZW50c1wiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcFJlcGVhdHMoWzEsIDEsIDEsIDEsIDFdKSxcbiAgICAgICAgICAgICAgICAgICBbMV0sXG4gICAgICAgICAgICAgICAgICAgXCJrZWVwcyBqdXN0IG9uZVwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcFJlcGVhdHMoMSksXG4gICAgICAgICAgICAgICAgICAgMSxcbiAgICAgICAgICAgICAgICAgICBcIm51bWJlciBoYXMgbm8gcmVwZWF0c1wiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcFJlcGVhdHMobnVsbCksXG4gICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICBcIm51bGwgdHJhbnNmcm9tZWQgaXMgbnVsbFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcFJlcGVhdHModm9pZCgwKSksXG4gICAgICAgICAgICAgICAgICAgdm9pZCgwKSxcbiAgICAgICAgICAgICAgICAgICBcInZvaWQgdHJhbnNmcm9tZWQgaXMgdm9pZFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZHJvcFJlcGVhdHMoXCJ3aGF0XCIpLFxuICAgICAgICAgICAgICAgICAgIFwid2hhdFwiLFxuICAgICAgICAgICAgICAgICAgIFwibm90aGluZyB0byBkcm9wXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChkcm9wUmVwZWF0cyhcImhlbGxvXCIpLFxuICAgICAgICAgICAgICAgICAgIFwiaGVsb1wiLFxuICAgICAgICAgICAgICAgICAgIFwiZHJvcGVzIHJlcGVhdGVkIGNoYXJzXCIpXG5cbiAgY29uc3QgaXRlcmF0b3IgPSBJbW11dGFibGUuSXRlcmFibGUoe3g6IDEsIFk6IDIsIHo6IDJ9KVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoWy4uLmRyb3BSZXBlYXRzKGl0ZXJhdG9yLnZhbHVlcygpKV0sXG4gICAgICAgICAgICAgICAgICAgWzEsIDJdLFxuICAgICAgICAgICAgICAgICAgIFwicmVtb3ZlcyByZXBlYXRzIGZvcm0gaXRlcmF0b3JcIilcbn0pXG5cbnRlc3QoXCJ0YWtlXCIsIGFzc2VydCA9PiB7XG4gIGFzc2VydC5kZWVwRXF1YWwodGFrZSgyKShbMSwgMiwgMywgNCwgNV0pLFxuICAgICAgICAgICAgICAgICAgIFsxLCAyXSxcbiAgICAgICAgICAgICAgICAgICBcInRvb2sgdHdvXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbCh0YWtlKDkpKFsxLCAyLCAzLCA0XSksXG4gICAgICAgICAgICAgICAgICAgWzEsIDIsIDMsIDRdLFxuICAgICAgICAgICAgICAgICAgIFwidG9vayBhbGxcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2UoNykoW10pLFxuICAgICAgICAgICAgICAgICAgIFtdLFxuICAgICAgICAgICAgICAgICAgIFwibm90aGluZyB0byB0YWtlXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbCh0YWtlKDApKFsxLCAyLCAzLCA0XSksXG4gICAgICAgICAgICAgICAgICAgW10sXG4gICAgICAgICAgICAgICAgICAgXCJ0b29rIDBcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2UoLTcpKFsxLCAyLCAzXSksXG4gICAgICAgICAgICAgICAgICAgW10sXG4gICAgICAgICAgICAgICAgICAgXCJ0b29rIG5vbmVcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2UoMCkoMSksIDApXG4gIGFzc2VydC5kZWVwRXF1YWwodGFrZSg1KSg4KSwgOClcblxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2UoMykoXCJoZWxsb1wiKSwgXCJoZWxcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2UoOSkoXCJoZWxsb1wiKSwgXCJoZWxsb1wiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodGFrZSg4KShcIlwiKSwgXCJcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2UoOSkobnVsbCksIG51bGwpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbCh0YWtlKDApKG51bGwpLCBudWxsKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodGFrZSg4KSh2b2lkKDApKSwgdm9pZCgwKSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKGRyb3AoMCkodm9pZCgwKSksIHZvaWQoMCkpXG5cblxuICBjb25zdCBpdGVyYXRvciA9IEltbXV0YWJsZS5JdGVyYWJsZSh7eDogMSwgeTogMn0pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChbLi4udGFrZSg5KShpdGVyYXRvci52YWx1ZXMoKSldLFxuICAgICAgICAgICAgICAgICAgIFsxLCAyXSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKFsuLi50YWtlKDEpKGl0ZXJhdG9yLnZhbHVlcygpKV0sXG4gICAgICAgICAgICAgICAgICAgWzFdLFxuICAgICAgICAgICAgICAgICAgIFwidG9vayBmaXJzdFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoWy4uLnRha2UoMCkoaXRlcmF0b3IudmFsdWVzKCkpXSxcbiAgICAgICAgICAgICAgICAgICBbXSxcbiAgICAgICAgICAgICAgICAgICBcInRvb2sgbm9uZVwiKVxufSlcblxudGVzdChcInRha2VXaGlsZVwiLCBhc3NlcnQgPT4ge1xuICBjb25zdCBkaWdpdHMgPSB0YWtlV2hpbGUobGVzc1RoYW4oMTApKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZGlnaXRzKFsxLCA4LCAxMiwgOSwgNDVdKSxcbiAgICAgICAgICAgICAgICAgICBbMSwgOF0sXG4gICAgICAgICAgICAgICAgICAgXCJ0YWtlcyBvbmx5IGRpZ2l0c1wiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZGlnaXRzKFsxMCwgOSwgOCwgN10pLFxuICAgICAgICAgICAgICAgICAgIFtdLFxuICAgICAgICAgICAgICAgICAgIFwidGFrZXMgbm9uZVwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZGlnaXRzKDUpLFxuICAgICAgICAgICAgICAgICAgIDUsXG4gICAgICAgICAgICAgICAgICAgXCJ0YWtlIG1hdGNoaW5nIG51bWJlclwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoZGlnaXRzKDk3KSxcbiAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgIFwicmV0dXJucyAwIG9uIHVubWF0Y2hlZCBudW1iZXJcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2VXaGlsZShUcnVlKShudWxsKSxcbiAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgIFwicmV0dXJuIG51bGxcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2VXaGlsZShGYWxzZSkobnVsbCksXG4gICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICBcInJldHVybnMgbnVsbFwiKVxuXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbCh0YWtlV2hpbGUoVHJ1ZSkodm9pZCgwKSksXG4gICAgICAgICAgICAgICAgICAgdm9pZCgwKSxcbiAgICAgICAgICAgICAgICAgICBcInJldHVybiB2b2lkXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbCh0YWtlV2hpbGUoRmFsc2UpKHZvaWQoMCkpLFxuICAgICAgICAgICAgICAgICAgIHZvaWQoMCksXG4gICAgICAgICAgICAgICAgICAgXCJyZXR1cm4gdm9pZFwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodGFrZVdoaWxlKGlzTG93ZXJDYXNlKShcIm5ldmVyIG1pbmQgWW91XCIpLFxuICAgICAgICAgICAgICAgICAgIFwibmV2ZXIgbWluZCBcIixcbiAgICAgICAgICAgICAgICAgICBcInRha2VzIHVudGlsIHVwcGVyIGNhc2VcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHRha2VXaGlsZShpc0xvd2VyQ2FzZSkoXCJIaSB0aGVyZVwiKSxcbiAgICAgICAgICAgICAgICAgICBcIlwiLFxuICAgICAgICAgICAgICAgICAgIFwiYmxhbmsgc3RyaW5nXCIpXG5cbiAgY29uc3QgaXRlcmF0b3IgPSBJbW11dGFibGUuSXRlcmFibGUoe3g6IDAsIHk6IDUsIHo6IDEwfSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKFsuLi50YWtlV2hpbGUobGVzc1RoYW4oNykpKGl0ZXJhdG9yLnZhbHVlcygpKV0sXG4gICAgICAgICAgICAgICAgICAgWzAsIDVdLFxuICAgICAgICAgICAgICAgICAgIFwicmVtb3ZlcyByZXBlYXRzIGZvcm0gaXRlcmF0b3JcIilcbn0pXG5cbnRlc3QoXCJwYXJ0aXRpb25cIiwgYXNzZXJ0ID0+IHtcbiAgYXNzZXJ0LmRlZXBFcXVhbChwYXJ0aXRpb24oMikoWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDhdKSxcbiAgICAgICAgICAgICAgICAgICBbWzEsIDJdLCBbMywgNF0sIFs1LCA2XSwgWzcsIDhdXSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKHBhcnRpdGlvbigzKShbMSwgMiwgMywgNCwgNSwgNiwgNywgOF0pLFxuICAgICAgICAgICAgICAgICAgIFtbMSwgMiwgM10sIFs0LCA1LCA2XSwgWzcsIDhdXSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKHBhcnRpdGlvbig0KShbMSwgMl0pLFtbMSwgMl1dKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwocGFydGl0aW9uKDMpKFtdKSwgW10pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChwYXJ0aXRpb24oMykoOSksIDkpXG4gIGFzc2VydC5kZWVwRXF1YWwocGFydGl0aW9uKDIpKFwiaGVsbG9cIiksIFwiaGVsbG9cIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKHBhcnRpdGlvbigyKShudWxsKSwgbnVsbClcbiAgYXNzZXJ0LmRlZXBFcXVhbChwYXJ0aXRpb24oMikodm9pZCgwKSksIHZvaWQoMCkpXG5cbiAgY29uc3QgaXRlcmF0b3IgPSBJbW11dGFibGUuSXRlcmFibGUoe3g6IDAsIHk6IDUsIHo6IDEwfSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKFsuLi5wYXJ0aXRpb24oMikoaXRlcmF0b3IudmFsdWVzKCkpXSxcbiAgICAgICAgICAgICAgICAgICBbWzAsIDVdLCBbMTBdXSlcbn0pXG5cbi8vIFRPRE86IVxudGVzdChcInBhcnRpdGlvbkJ5XCIsIGFzc2VydCA9PiB7XG59KVxuXG50ZXN0KFwiY2F0XCIsIGFzc2VydCA9PiB7XG4gIGFzc2VydC5kZWVwRXF1YWwoY2F0KFtbMSwgMl0sIFszXSwgWzQsIDVdXSksXG4gICAgICAgICAgICAgICAgICAgWzEsIDIsIDMsIDQsIDVdKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoY2F0KFtdKSwgW10pXG4gIGFzc2VydC5kZWVwRXF1YWwoY2F0KFsxLCAyLCAzXSksIFsxLCAyLCAzXSlcbiAgYXNzZXJ0LmRlZXBFcXVhbChjYXQobnVsbCksIG51bGwpXG4gIGFzc2VydC5kZWVwRXF1YWwoY2F0KHZvaWQoMCkpLCB2b2lkKDApKVxuICBhc3NlcnQuZGVlcEVxdWFsKGNhdCg0KSwgNClcbiAgYXNzZXJ0LmRlZXBFcXVhbChjYXQoXCJoZWxsb1wiKSwgXCJoZWxsb1wiKVxuXG4gIGNvbnN0IHZhbHVlSXRlciA9IEltbXV0YWJsZS5JdGVyYWJsZShbMCwgNSwgMTBdKS52YWx1ZXMoKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwoWy4uLmNhdCh2YWx1ZUl0ZXIpXSxcbiAgICAgICAgICAgICAgICAgICBbMCwgNSwgMTBdKVxuXG4gIGNvbnN0IGFycmF5SXRlciA9IEltbXV0YWJsZS5JdGVyYWJsZShbWzEsIDJdLCBbM10sIFs0LCA1LCA2XV0pLnZhbHVlcygpXG4gIGFzc2VydC5kZWVwRXF1YWwoWy4uLmNhdChhcnJheUl0ZXIpXSxcbiAgICAgICAgICAgICAgICAgICBbMSwgMiwgMywgNCwgNSwgNl0pXG59KVxuXG50ZXN0KFwibWFwY2F0XCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IG1hcGNhdCA9IGYgPT4gKG1hcChmKSkoY2F0KVxuICBjb25zdCBzcGxpdCA9IGJ5ID0+IHN0cmluZyA9PiBzdHJpbmcuc3BsaXQoYnkpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChtYXBjYXQoc3BsaXQoXCIvXCIpKShbXCJwYXRoL3RvXCIsIFwiZGlyL2ZpbGVcIl0pLFxuICAgICAgICAgICAgICAgICAgIFtcInBhdGhcIiwgXCJ0b1wiLCBcImRpclwiLCBcImZpbGVcIl0pXG59KVxuXG50ZXN0KFwiY29tcG9zaXRpb25cIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3QgaW5jZXIgPSBtYXAoaW5jKVxuICBjb25zdCBhZGQyID0gaW5jZXIoaW5jZXIpXG5cbiAgYXNzZXJ0LmVxdWFsKHR5cGVvZihhZGQyKSwgXCJmdW5jdGlvblwiLFxuICAgICAgICAgICAgICAgXCJwYXNzaW5nIHRyYW5zZHVjZXIgdG8gdHJhbnNkdWNlciBjb21wb3NlcyBhIG5ldyBvbmVcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKGFkZDIoWzEsIDIsIDMsIDRdKSxcbiAgICAgICAgICAgICAgICAgICBbMywgNCwgNSwgNl0sXG4gICAgICAgICAgICAgICAgICAgXCJhcnJheSBlbGVtZW50cyBnZXQgbWFwcGVkXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChhZGQyKDApLCAyLFxuICAgICAgICAgICAgICAgICAgIFwiZnVuY3Rpb24gaXMgYXBwbGllZCB0byBudW1iZXJcIilcblxuICBhc3NlcnQuZGVlcEVxdWFsKGFkZDIobnVsbCksIG51bGwsXG4gICAgICAgICAgICAgICAgICAgXCJtYXAgb3ZlciBudWxsIGlzIG5vIG9wXCIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChhZGQyKHZvaWQoMCkpLCB2b2lkKDApLFxuICAgICAgICAgICAgICAgICAgIFwibWFwIG92ZXIgdm9pZCBpcyB2b2lkXCIpXG59KVxuXG5cbnRlc3QoXCJ0cmFzZHVjZVwiLCBhc3NlcnQgPT4ge1xuICBjb25zdCBldmVucyA9IGZpbHRlcihpc0V2ZW4pXG4gIGFzc2VydC5lcXVhbCh0cmFuc2R1Y2UoZXZlbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgKHgsIHkpID0+IHkgPT09IHZvaWQoMCkgPyB4IDogeCArIHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgMixcbiAgICAgICAgICAgICAgICAgICAgICAgICBbMSwgMiwgMywgNF0pLFxuICAgICAgICAgICAgICAgOCxcbiAgICAgICAgICAgICAgIFwidHJhbnNkdWNlZCBhcnJheSB3aXRoIGN1c3RvbSByZWR1Y2VyXCIpXG5cbiAgYXNzZXJ0LmVxdWFsKHRyYW5zZHVjZShldmVucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAoeCwgeSkgPT4geCA9PT0gdm9pZCgwKSA/IDAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5ID09PSB2b2lkKDApID8geCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggKyB5LFxuICAgICAgICAgICAgICAgICAgICAgICAgIFsxLCAyLCAzLCA0XSksXG4gICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgXCJ0cmFuc2R1Y2VkIHdpdGhvdXQgaW5pdGlhbCB2YWx1ZVwiKVxuXG5cbiAgY29uc3QgaXRlcmF0b3IgPSBJbW11dGFibGUuSXRlcmFibGUoe3g6IDEsIFk6IDIsIHo6IDMsIHc6IDR9KVxuICBhc3NlcnQuZXF1YWwodHJhbnNkdWNlKGV2ZW5zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICh4LCB5KSA9PiB5ID09PSB2b2lkKDApID8geCA6IHggKyB5LFxuICAgICAgICAgICAgICAgICAgICAgICAgIDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgaXRlcmF0b3IudmFsdWVzKCkpLFxuICAgICAgICAgICAgICAgMTEsXG4gICAgICAgICAgICAgIFwidHJhbnNkdWNlIGl0ZXJhdG9yIHdpdGggY3VzdG9tIHJlZHVjZXJcIilcbn0pXG4iXX0=