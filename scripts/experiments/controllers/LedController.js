define([], function() {
  
  var LedController = function LedController($scope) {
    $scope.scout1 = {};
    $scope.scout1.isOffline = false;
    $scope.scout1.torch = [0, 255, 0];
    $scope.scout1.led = [0, 0, 0];
    $scope.scout2 = {};
    $scope.scout2.isOffline = false;
    $scope.scout2.torch = [0, 255, 0];
    $scope.scout2.led = [0, 0, 0];
    $scope.setLed = (function(rgb) {
      $scope.scout1.led = $scope.scout2.isOffline ? [0, 0, 0] : [255, 0, 0];
    });
    $scope.toggle = (function() {
      $scope.scout2.isOffline = !$scope.scout2.isOffline;
    });
  };
  ($traceurRuntime.createClass)(LedController, {}, {});
  var $__default = LedController;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});
