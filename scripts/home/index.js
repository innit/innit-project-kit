define('home/routes',[], function() {
  
  function routes($urlRouterProvider, $stateProvider) {
    
    $urlRouterProvider.otherwise('/home');
    return $stateProvider.state('home', {
      url: '/home',
      access: {allowAnonymous: true},
      templateUrl: 'views/home/home.html',
      controller: 'HomeController'
    });
  }
  var $__default = routes;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('home/controllers/HomeController',[], function() {
  
  var HomeController = function HomeController($scope) {
    $scope.awesomeThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma'];
  };
  ($traceurRuntime.createClass)(HomeController, {}, {});
  var $__default = HomeController;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('home/index',['./routes', './controllers/HomeController'], function($__0,$__2) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  var routes = $__0.default;
  var HomeController = $__2.default;
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

