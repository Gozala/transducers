(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "tape"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("tape"));
  }
})(function (exports, _tape) {
  "use strict";

  var tape = _tape;

  exports["default"] = function (description, unit) {
    return tape.test(description, function (test) {
      var result = unit(test);
      if (result && result.then) {
        result.then(function (_) {
          return test.end();
        }, function (error) {
          return test.end(error || true);
        });
      } else {
        test.end();
      }
    });
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L3Rlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O01BQVksSUFBSTs7dUJBRUQsVUFBQyxXQUFXLEVBQUUsSUFBSTtXQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFVBQUEsSUFBSSxFQUFJO0FBQ25FLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUN6QixVQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFO0FBQ3pCLGNBQU0sQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDO2lCQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7U0FBQSxFQUFFLFVBQUEsS0FBSztpQkFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUM7U0FBQSxDQUFDLENBQUE7T0FDL0QsTUFBTTtBQUNMLFlBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQTtPQUNYO0tBQ0YsQ0FBQztHQUFBIiwiZmlsZSI6InNyYy90ZXN0L3Rlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB0YXBlIGZyb20gXCJ0YXBlXCJcblxuZXhwb3J0IGRlZmF1bHQgKGRlc2NyaXB0aW9uLCB1bml0KSA9PiB0YXBlLnRlc3QoZGVzY3JpcHRpb24sIHRlc3QgPT4ge1xuICBjb25zdCByZXN1bHQgPSB1bml0KHRlc3QpXG4gIGlmIChyZXN1bHQgJiYgcmVzdWx0LnRoZW4pIHtcbiAgICByZXN1bHQudGhlbihfID0+IHRlc3QuZW5kKCksIGVycm9yID0+IHRlc3QuZW5kKGVycm9yIHx8IHRydWUpKVxuICB9IGVsc2Uge1xuICAgIHRlc3QuZW5kKClcbiAgfVxufSlcbiJdfQ==