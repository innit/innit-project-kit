define([], function() {
  
  var MockReporter = function MockReporter() {
    this.logs = [];
  };
  ($traceurRuntime.createClass)(MockReporter, {receive: function(log) {
      var $__1 = $traceurRuntime.assertObject(log),
          level = $__1.level,
          message = $__1.message,
          group = $__1.group;
      this.logs.push(("[" + level + "|" + group + "] " + message));
    }}, {});
  return {
    get MockReporter() {
      return MockReporter;
    },
    __esModule: true
  };
});
