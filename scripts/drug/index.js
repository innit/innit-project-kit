define('drug/routes',[], function() {
  
  function routes($urlRouterProvider, $stateProvider) {
    
    $urlRouterProvider.when('/drugs', '/drugs/list');
    return $stateProvider.state('drugs', {
      abstract: true,
      url: '/drugs',
      templateUrl: 'views/drugs/drugs.html'
    }).state('drugs.list', {
      url: '/list',
      resolve: {drugs: ['DrugService', '$stateParams', function(DrugService, $stateParams) {
          return DrugService.listDrugs();
        }]},
      views: {
        '@drugs': {controller: function($scope, drugs) {
            console.log('in drugs.list controller');
            $scope.searchCollapsed = true;
            $scope.metadata = drugs.metadata;
          }},
        'filters@drugs.list': {
          templateUrl: 'views/drugs/drugs.search.html',
          controller: 'DrugSearchController as dsc'
        },
        'results@drugs.list': {
          templateUrl: 'views/drugs/drugs.results.html',
          controller: 'DrugResultsController as drc'
        }
      }
    }).state('drugs.search', {
      url: '/search',
      resolve: {drugs: ['DrugService', function(DrugService) {
          return DrugService.searchDrugs();
        }]},
      views: {
        '@drugs': {controller: function($scope, drugs) {
            console.log('in drugs.search controller');
            $scope.metadata = drugs.metadata;
          }},
        'filters@drugs.search': {
          templateUrl: 'views/drugs/drugs.search.html',
          controller: 'DrugSearchController as dsc'
        },
        'results@drugs.search': {
          templateUrl: 'views/drugs/drugs.results.html',
          controller: 'DrugResultsController as drc'
        }
      }
    }).state('drugs.list.detail', {
      url: '/:drugId',
      resolve: {drug: ['DrugService', '$stateParams', function(DrugService, $stateParams) {
          return DrugService.getDrug($stateParams.drugId);
        }]},
      views: {'details@drugs.list': {
          templateUrl: 'views/drugs/drugs.detail.html',
          controller: 'DrugDetailController'
        }}
    }).state('drugs.search.detail', {
      url: '/:drugId',
      resolve: {drug: ['DrugService', '$stateParams', function(DrugService, $stateParams) {
          return DrugService.getDrug($stateParams.drugId);
        }]},
      views: {'details@drugs.search': {
          templateUrl: 'views/drugs/drugs.detail.html',
          controller: 'DrugDetailController'
        }}
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

//# sourceMappingURL=../drug/routes.js.map;
define('drug/services/DrugService',[], function() {
  
  var DRUG_SEARCH_CONFIG = {BASE_API_URL: 'http://localhost:8080/<YourBaaS>/DrugSearchAPI'};
  function DrugRestangular(Restangular) {
    
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl(DRUG_SEARCH_CONFIG.BASE_API_URL);
      RestangularConfigurer.setDefaultHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      });
      RestangularConfigurer.setDefaultRequestParams({format: 'json'});
      RestangularConfigurer.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
        var extractedData;
        if (operation === 'getList' && data.hasOwnProperty('metadata')) {
          extractedData = data.records;
          extractedData.metadata = data.metadata;
        } else {
          extractedData = data;
        }
        return extractedData;
      });
    });
  }
  var DRUG_LIST_PARAMS = {
    max: 100,
    offset: 0,
    sort: 'ndc',
    order: 'asc',
    fields: 'ndc,id,recordTypeA,recordTypeE,recordTypeG,recordTypeJ,recordTypeL'
  };
  var DRUG_SEARCH_PARAMS = {
    max: 100,
    offset: 0,
    sort: 'ndc',
    order: 'asc',
    fields: 'ndc,id,recordTypeA,recordTypeE,recordTypeG,recordTypeJ,recordTypeL',
    ndc: '',
    labelerName: '',
    productName: ''
  };
  var _drugCache = Symbol('drugs', true);
  var DrugService = function DrugService($q, DrugRestangular, DSCacheFactory) {
    console.info('in DrugService....');
    this.$q = $q;
    this.DrugRestangular = DrugRestangular;
    $traceurRuntime.setProperty(this, _drugCache, new DSCacheFactory('drugCache', {
      maxAge: 600000,
      deleteOnExpire: 'passive',
      onExpire: function(key, value) {
        console.log(("cache expired for drug key: " + key + ", value: " + value));
      }
    }));
  };
  ($traceurRuntime.createClass)(DrugService, {
    listDrugs: function() {
      var listParams = arguments[0] !== (void 0) ? arguments[0] : DRUG_LIST_PARAMS;
      return this.DrugRestangular.all('drugs').getList(listParams);
    },
    searchDrugs: function() {
      var searchParams = arguments[0] !== (void 0) ? arguments[0] : DRUG_SEARCH_PARAMS;
      return this.DrugRestangular.all('drugs').all('search').getList(searchParams);
    },
    getDrug: function(drugId) {
      var $__0 = this;
      var promise = new Promise((function(resolve, reject) {
        var cachedDrug = $__0[$traceurRuntime.toProperty(_drugCache)].get(drugId);
        if (cachedDrug) {
          resolve(cachedDrug);
        } else {
          $__0.DrugRestangular.one('drugs', drugId).get().then((function(drug) {
            $__0[$traceurRuntime.toProperty(_drugCache)].put(drugId, drug);
            resolve(drug);
          })).catch((function(err) {
            console.error(err);
            reject(err);
          }));
        }
      }));
      return this.$q.when(promise);
    }
  }, {});
  return {
    get DRUG_SEARCH_CONFIG() {
      return DRUG_SEARCH_CONFIG;
    },
    get DrugRestangular() {
      return DrugRestangular;
    },
    get DRUG_LIST_PARAMS() {
      return DRUG_LIST_PARAMS;
    },
    get DRUG_SEARCH_PARAMS() {
      return DRUG_SEARCH_PARAMS;
    },
    get DrugService() {
      return DrugService;
    },
    __esModule: true
  };
});

//# sourceMappingURL=../../drug/services/DrugService.js.map;
define('drug/controllers/DrugSearchController',['../services/DrugService'], function($__0) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var $__1 = $__0,
      DRUG_LIST_PARAMS = $__1.DRUG_LIST_PARAMS,
      DRUG_SEARCH_PARAMS = $__1.DRUG_SEARCH_PARAMS;
  var state = Symbol('state', true);
  var DrugSearchController = function DrugSearchController($scope, growl, drugs, DrugService, $state) {
    var $__2 = this;
    console.log('in DrugSearchController');
    $traceurRuntime.setProperty(this, state, $state);
    this.drugListParams = DRUG_LIST_PARAMS;
    this.drugSearchParams = DRUG_SEARCH_PARAMS;
    $scope.$parent.dbCursorMove = (function(n) {
      console.log('xxxxx', n);
      if ($__2[$traceurRuntime.toProperty(state)].current.name === 'drugs.search' || $__2[$traceurRuntime.toProperty(state)].current.name === 'drugs.search.detail') {
        $__2.drugSearchParams.offset = $__2.drugSearchParams.offset + n;
      } else if ($__2[$traceurRuntime.toProperty(state)].current.name === 'drugs.list' || $__2[$traceurRuntime.toProperty(state)].current.name === 'drugs.list.detail') {
        $__2.drugListParams.offset = $__2.drugListParams.offset + n;
      }
      $__2[$traceurRuntime.toProperty(state)].transitionTo($__2[$traceurRuntime.toProperty(state)].current, null, {
        reload: true,
        inherit: true,
        notify: true
      });
    });
  };
  ($traceurRuntime.createClass)(DrugSearchController, {onSearch: function() {
      this[$traceurRuntime.toProperty(state)].transitionTo('drugs.search', null, {
        reload: true,
        inherit: true,
        notify: true
      });
    }}, {});
  var $__default = DrugSearchController;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

//# sourceMappingURL=../../drug/controllers/DrugSearchController.js.map;
define('drug/controllers/DrugResultsController',[], function() {
  
  var DrugResultsController = function DrugResultsController($scope, growl, drugs, $filter, ngTableParams) {
    console.log('in DrugResultsController');
    $scope.tableParams = new ngTableParams({
      page: 1,
      count: 3,
      sorting: {ndc: 'asc'}
    }, {
      total: drugs.length,
      getData: function($defer, params) {
        var filteredData = params.filter() ? $filter('filter')(drugs, params.filter()) : drugs;
        var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
        $scope.drugs = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
        params.total(orderedData.length);
        $defer.resolve($scope.drugs);
      }
    });
  };
  ($traceurRuntime.createClass)(DrugResultsController, {}, {});
  var $__default = DrugResultsController;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

//# sourceMappingURL=../../drug/controllers/DrugResultsController.js.map;
define('drug/controllers/DrugDetailController',[], function() {
  
  var DrugDetailController = function DrugDetailController($scope, drug) {
    $scope.selectedDrug = drug;
  };
  ($traceurRuntime.createClass)(DrugDetailController, {}, {});
  var $__default = DrugDetailController;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

//# sourceMappingURL=../../drug/controllers/DrugDetailController.js.map;
define('drug/index',['./routes', './controllers/DrugSearchController', './controllers/DrugResultsController', './controllers/DrugDetailController', './services/DrugService'], function($__0,$__2,$__4,$__6,$__8) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {default: $__4};
  if (!$__6 || !$__6.__esModule)
    $__6 = {default: $__6};
  if (!$__8 || !$__8.__esModule)
    $__8 = {default: $__8};
  var routes = $__0.default;
  var DrugSearchController = $__2.default;
  var DrugResultsController = $__4.default;
  var DrugDetailController = $__6.default;
  var $__9 = $__8,
      DRUG_SEARCH_CONFIG = $__9.DRUG_SEARCH_CONFIG,
      DrugRestangular = $__9.DrugRestangular,
      DrugService = $__9.DrugService;
  var moduleName = 'spaApp.drug';
  var drugModule = angular.module(moduleName, ['restangular', 'ngTable']);
  drugModule.factory('DrugRestangular', DrugRestangular);
  drugModule.service('DrugService', DrugService);
  drugModule.controller('DrugSearchController', DrugSearchController);
  drugModule.controller('DrugResultsController', DrugResultsController);
  drugModule.controller('DrugDetailController', DrugDetailController);
  drugModule.config(routes);
  drugModule.config((function() {
    
    DRUG_SEARCH_CONFIG.BASE_API_URL = 'http://ve7d00000010:8080/apiApp';
  }));
  var $__default = moduleName;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

//# sourceMappingURL=../drug/index.js.map;
