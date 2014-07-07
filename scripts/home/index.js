define('home/routes',[], function() {
  
  var $__default = function routes($urlRouterProvider, $stateProvider) {
    
    $urlRouterProvider.otherwise('/home');
    return $stateProvider.state('home', {
      url: '/home',
      access: {allowAnonymous: true},
      templateUrl: 'views/home/home.html',
      controller: 'HomeController'
    });
  };
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('home/controllers/HomeController',[], function() {
  
  var $__default = (function() {
    var HomeController = function HomeController($scope) {
      $scope.awesomeThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma'];
    };
    return ($traceurRuntime.createClass)(HomeController, {}, {});
  }());
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('home/index',['./routes', './controllers/HomeController'], function($__0,$__1) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  var routes = $traceurRuntime.assertObject($__0).default;
  var HomeController = $traceurRuntime.assertObject($__1).default;
  var moduleName = 'spaApp.home';
  var homeModule = angular.module(moduleName, []);
  homeModule.controller('HomeController', HomeController);
  homeModule.config(routes);
  var $__default = moduleName;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

