/** @license
 * RequireJS plugin for async dependency load like JSONP and Google Maps
 * Author: Miller Medeiros
 * Version: 0.1.1 (2011/11/17)
 * Released under the MIT license
 */
define('async',[],function(){

    var DEFAULT_PARAM_NAME = 'callback',
        _uid = 0;

    function injectScript(src){
        var s, t;
        s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = src;
        t = document.getElementsByTagName('script')[0]; t.parentNode.insertBefore(s,t);
    }

    function formatUrl(name, id){
        var paramRegex = /!(.+)/,
            url = name.replace(paramRegex, ''),
            param = (paramRegex.test(name))? name.replace(/.+!/, '') : DEFAULT_PARAM_NAME;
        url += (url.indexOf('?') < 0)? '?' : '&';
        return url + param +'='+ id;
    }

    function uid() {
        _uid += 1;
        return '__async_req_'+ _uid +'__';
    }

    return{
        load : function(name, req, onLoad, config){
            if(config.isBuild){
                onLoad(null); //avoid errors on the optimizer
            }else{
                var id = uid();
                //create a global variable that stores onLoad so callback
                //function can define new module after async load
                window[id] = onLoad;
                injectScript(formatUrl(name, id));
            }
        }
    };
});


define('provider/utils/gMaps',['async!//maps.googleapis.com/maps/api/js?key=AIzaSyCOPhbBgg7Rb8SS_f4iC-w9zIB-vD44ZkQ&sensor=false'], function($__0) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  $__0;
  var $__default = window.google.maps;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('provider/models/GeoLocation',['../utils/gMaps'], function($__0) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  var gMaps = $traceurRuntime.assertObject($__0).default;
  var LatLng = gMaps.LatLng;
  var _latLng = Symbol('_latLng', true);
  var $__default = (function() {
    var GeoLocation = function GeoLocation(latitude, longitude, address, zip) {
      $traceurRuntime.setProperty(this, _latLng, new gMaps.LatLng(latitude, longitude));
      this.address = address;
      this.zip = zip;
    };
    return ($traceurRuntime.createClass)(GeoLocation, {
      get latLng() {
        return this[$traceurRuntime.toProperty(_latLng)];
      },
      set latLng(value) {
        $traceurRuntime.setProperty(this, _latLng, value);
      }
    }, {});
  }());
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('provider/services/ProviderService',['../models/GeoLocation'], function($__0) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  var GeoLocation = $traceurRuntime.assertObject($__0).default;
  var PROVIDER_SEARCH_CONFIG = {BASE_API_URL: 'http://localhost:8080/<YourBaaS>/ProviderSearchAPI'};
  function ProviderRestangular(Restangular) {
    
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl(PROVIDER_SEARCH_CONFIG.BASE_API_URL);
      RestangularConfigurer.setDefaultRequestParams();
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
  var PROVIDER_SEARCH_PARAMS = {
    psize: 99,
    offset: 0,
    sort: 'distance',
    order: 'asc',
    specialty: '',
    address: '',
    distance: 50
  };
  var PROVIDER_SEARCH_GEOLOCATION = new GeoLocation();
  var _providerCache = Symbol('providers', true);
  var q = Symbol('q', true);
  var sanitize = Symbol('sanitize', true);
  var providerRestangular = Symbol('providerRestangular', true);
  var ProviderService = function ProviderService($q, $sanitize, ProviderRestangular, DSCacheFactory) {
    console.info('in ProviderService....');
    $traceurRuntime.setProperty(this, q, $q);
    $traceurRuntime.setProperty(this, sanitize, $sanitize);
    $traceurRuntime.setProperty(this, providerRestangular, ProviderRestangular);
    $traceurRuntime.setProperty(this, _providerCache, new DSCacheFactory('providerCache', {
      maxAge: 600000,
      deleteOnExpire: 'passive',
      onExpire: function(key, value) {
        console.log(("cache expired for drug key: " + key + ", value: " + value));
      }
    }));
  };
  ($traceurRuntime.createClass)(ProviderService, {
    _sanitizeParams: function(geoLoc, params) {
      var sanitizedParams = {
        psize: params.psize,
        offset: params.offset,
        sort: params.sort,
        order: params.order,
        lat: geoLoc.latLng.lat(),
        lng: geoLoc.latLng.lng(),
        distance: params.distance
      };
      if (params.specialty.trim().length !== 0) {
        sanitizedParams.specialty = this[$traceurRuntime.toProperty(sanitize)](angular.uppercase(params.specialty));
      }
      console.log('sanitizedParams', sanitizedParams);
      return sanitizedParams;
    },
    searchProviders: function() {
      var geoLoc = arguments[0] !== (void 0) ? arguments[0] : PROVIDER_SEARCH_GEOLOCATION;
      var searchParams = arguments[1] !== (void 0) ? arguments[1] : PROVIDER_SEARCH_PARAMS;
      console.log('geoLoc', geoLoc);
      console.log('searchParams', searchParams);
      return this[$traceurRuntime.toProperty(providerRestangular)].all('providers').getList(this._sanitizeParams(geoLoc, searchParams));
    },
    getProvider: function(providerId) {
      var $__1 = this;
      var promise = new Promise((function(resolve, reject) {
        var cachedProvider = $__1[$traceurRuntime.toProperty(_providerCache)].get(providerId);
        if (cachedProvider) {
          resolve(cachedProvider);
        } else {
          $__1[$traceurRuntime.toProperty(providerRestangular)].one('providers', providerId).get().then((function(provider) {
            $__1[$traceurRuntime.toProperty(_providerCache)].put(providerId, provider);
            resolve(provider);
          })).catch((function(err) {
            console.error(err);
            reject(err);
          }));
        }
      }));
      return this[$traceurRuntime.toProperty(q)].when(promise);
    }
  }, {});
  return {
    get PROVIDER_SEARCH_CONFIG() {
      return PROVIDER_SEARCH_CONFIG;
    },
    get ProviderRestangular() {
      return ProviderRestangular;
    },
    get PROVIDER_SEARCH_PARAMS() {
      return PROVIDER_SEARCH_PARAMS;
    },
    get PROVIDER_SEARCH_GEOLOCATION() {
      return PROVIDER_SEARCH_GEOLOCATION;
    },
    get ProviderService() {
      return ProviderService;
    },
    __esModule: true
  };
});

define('provider/routes',['./services/ProviderService'], function($__0) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  var $__1 = $traceurRuntime.assertObject($__0),
      PROVIDER_SEARCH_GEOLOCATION = $__1.PROVIDER_SEARCH_GEOLOCATION,
      PROVIDER_SEARCH_PARAMS = $__1.PROVIDER_SEARCH_PARAMS;
  var $__default = function routes($stateProvider) {
    
    return $stateProvider.state('providers', {
      abstract: true,
      url: '/providers',
      templateUrl: 'views/providers/providers.html',
      resolve: {geolocation: ['GeolocationService', function(GeolocationService) {
          return GeolocationService.getGeolocation();
        }]}
    }).state('providers.search', {
      url: '',
      access: {
        allowAnonymous: false,
        roles: ['ROLE_DATA_ADMIN']
      },
      resolve: {providers: ['ProviderService', 'angulargmUtils', 'geolocation', function(ProviderService, angulargmUtils, geolocation) {
          if (angulargmUtils.hasNaN(PROVIDER_SEARCH_GEOLOCATION.latLng)) {
            PROVIDER_SEARCH_GEOLOCATION.latLng = geolocation.latLng;
            PROVIDER_SEARCH_GEOLOCATION.address = geolocation.address;
          }
          return ProviderService.searchProviders();
        }]},
      views: {
        '@providers': {controller: function($scope, providers, ProviderService) {
            $scope.providers = providers;
            $scope.doSearch = (function() {
              PROVIDER_SEARCH_PARAMS.offset = 0;
              ProviderService.searchProviders().then((function(providers) {
                $scope.providers = providers;
              }));
            });
          }},
        'filters@providers.search': {
          templateUrl: 'views/providers/providers.search.html',
          controller: 'ProviderSearchController as psc'
        },
        'map@providers.search': {
          templateUrl: 'views/providers/providers.map.html',
          controller: 'ProviderMapController as pmc'
        },
        'results@providers.search': {
          templateUrl: 'views/providers/providers.results.html',
          controller: 'ProviderResultsController as prc'
        }
      }
    });
  };
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('provider/controllers/ProviderSearchController',['../services/ProviderService'], function($__0) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  var $__2 = $traceurRuntime.assertObject($__0),
      PROVIDER_SEARCH_PARAMS = $__2.PROVIDER_SEARCH_PARAMS,
      PROVIDER_SEARCH_GEOLOCATION = $__2.PROVIDER_SEARCH_GEOLOCATION;
  var scope = Symbol('scope', true);
  var state = Symbol('state', true);
  var http = Symbol('http', true);
  var providerRestangular = Symbol('providerRestangular', true);
  var geocoderService = Symbol('geocoderService', true);
  var providerService = Symbol('providerService', true);
  var $__default = (function() {
    var ProviderSearchController = function ProviderSearchController($scope, $http, $state, ProviderRestangular, GeocoderService, ProviderService) {
      console.log('in ProviderSearchController...');
      $traceurRuntime.setProperty(this, scope, $scope);
      $traceurRuntime.setProperty(this, state, $state);
      $traceurRuntime.setProperty(this, http, $http);
      $traceurRuntime.setProperty(this, providerRestangular, ProviderRestangular);
      $traceurRuntime.setProperty(this, geocoderService, GeocoderService);
      $traceurRuntime.setProperty(this, providerService, ProviderService);
      this.providerSearchParams = PROVIDER_SEARCH_PARAMS;
      this.providerSearchGeolocation = PROVIDER_SEARCH_GEOLOCATION;
      this.specialities = ['PEDIATRICS', 'CARDIOLOGY', 'NEPHROLOGY', 'CHIROPRACTIC MEDICINE'];
      this.searchCollapsed = true;
      this.status = {isopen: false};
      $scope.$parent.centerSearch = this.centerSearch;
    };
    return ($traceurRuntime.createClass)(ProviderSearchController, {
      setDistance: function(dist) {
        this.providerSearchParams.distance = dist;
        this.status.isopen = false;
      },
      onSelect: function($item, $model, $label) {
        this.providerSearchGeolocation.latLng = $model.geometry.location;
        this.providerSearchGeolocation.address = $model.formatted_address;
      },
      _getZip: function(address) {
        var addressComponents = address.address_components;
        var zippy = addressComponents.filter((function(i) {
          return i.types[0] === 'postal_code';
        }));
        if (undefined !== zippy && zippy.length > 0) {
          return zippy[0].long_name;
        }
      },
      dbCursorMove: function(n) {
        PROVIDER_SEARCH_PARAMS.offset = PROVIDER_SEARCH_PARAMS.offset + n;
        this[$traceurRuntime.toProperty(state)].transitionTo(this[$traceurRuntime.toProperty(state)].current, null, {
          reload: true,
          inherit: true,
          notify: true
        });
      },
      getLocations: function(address) {
        return this[$traceurRuntime.toProperty(geocoderService)].getLocations(address);
      },
      getSpecialities: function(prefix) {
        return this[$traceurRuntime.toProperty(providerRestangular)].all('providers').all('specialties').getList({'prefix': angular.uppercase(prefix)});
      }
    }, {});
  }());
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('provider/controllers/ProviderResultsController',[], function() {
  
  var $__default = (function() {
    var ProviderResultsController = function ProviderResultsController($scope, filterFilter) {
      var $__0 = this;
      console.log('in ProviderResultsController...');
      this.currentPage = 1;
      this.itemsPerPage = 3;
      this.maxSize = 7;
      this.filterField = '';
      $scope.$watch('providers', function(newProviders) {
        console.log('providers in scope changed...');
        $scope.filteredProviders = newProviders;
      });
      $scope.filterProviders = (function() {
        $scope.filteredProviders = filterFilter($scope.providers, {facilityName: $__0.filterField});
      });
    };
    return ($traceurRuntime.createClass)(ProviderResultsController, {}, {});
  }());
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('provider/controllers/ProviderMapController',['../utils/gMaps', '../services/ProviderService'], function($__0,$__1) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  var gMaps = $traceurRuntime.assertObject($__0).default;
  var PROVIDER_SEARCH_GEOLOCATION = $traceurRuntime.assertObject($__1).PROVIDER_SEARCH_GEOLOCATION;
  var scope = Symbol('scope', true);
  var $__default = (function() {
    var ProviderMapController = function ProviderMapController($scope) {
      var $__2 = this;
      $traceurRuntime.setProperty(this, scope, $scope);
      this.center = PROVIDER_SEARCH_GEOLOCATION;
      this.zoom = 13;
      this.bounds = this.getBounds($scope.providers);
      this.mapInitOptions = {
        zoom: this.zoom,
        center: this.bounds.getCenter(),
        mapTypeId: gMaps.MapTypeId.ROADMAP
      };
      this.markerOptions = {
        selected: {icon: 'images/hospital.png'},
        notselected: {icon: 'images/hospital_H_S_8x_2.png'},
        mouseover: {icon: 'images/hospital_H_search_L_8x_2.png'},
        mouseout: {icon: 'images/hospital_H_S_8x_2.png'}
      };
      this.mouseOverInfoWindowOptions = {pixelOffset: new google.maps.Size(120, 110)};
      this.selectedProvider = $scope.providers[0];
      this.selectedMarker = undefined;
      $scope.$watch('providers', (function(newProviders) {
        $__2.bounds = $__2.getBounds(newProviders);
      }));
    };
    return ($traceurRuntime.createClass)(ProviderMapController, {
      getBounds: function(providers) {
        var bounds = new gMaps.LatLngBounds();
        providers.forEach((function(provider) {
          bounds.extend(new gMaps.LatLng(provider.location.lat, provider.location.lng));
        }));
        return bounds;
      },
      onProviderClick: function(provider, marker) {
        this.selectedProvider = provider;
        PROVIDER_SEARCH_GEOLOCATION.latLng = new gMaps.LatLng(provider.location.lat, provider.location.lng);
        this[$traceurRuntime.toProperty(scope)].markerEvents = [{
          event: 'openinfowindow',
          ids: [provider.facilityId]
        }, {
          event: 'activatemarker',
          ids: [provider.facilityId]
        }];
      },
      activateMarker: function(marker) {
        if (this.selectedMarker) {
          this.selectedMarker.setIcon(this.markerOptions.notselected.icon);
        }
        this.selectedMarker = marker;
        marker.setIcon(this.markerOptions.selected.icon);
      },
      onMouseOver: function(provider, marker) {},
      onMouseOut: function(provider, marker) {},
      markerAnimate: function(marker) {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      },
      getProviderOpts: function(provider) {
        return angular.extend({
          title: provider.facilityName,
          animation: gMaps.Animation.DROP
        }, this.markerOptions.notselected);
      }
    }, {});
  }());
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('provider/controllers/ProviderDetailController',[], function() {
  
  var $__default = (function() {
    var ProviderDetailController = function ProviderDetailController($scope, provider) {
      $scope.selectedProvider = provider;
    };
    return ($traceurRuntime.createClass)(ProviderDetailController, {}, {});
  }());
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('provider/services/GeolocationService',['../models/GeoLocation'], function($__0) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  var GeoLocation = $traceurRuntime.assertObject($__0).default;
  var q = Symbol('q', true);
  var http = Symbol('http', true);
  var _window = Symbol('_window', true);
  function TelizeRestangular(Restangular) {
    
    return Restangular.withConfig((function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl('http://www.telize.com');
      RestangularConfigurer.setDefaultRequestParams();
      RestangularConfigurer.setJsonp(true);
      RestangularConfigurer.setDefaultRequestParams('jsonp', {callback: 'JSON_CALLBACK'});
    }));
  }
  var GeolocationService = function GeolocationService($q, $http, $window, TelizeRestangular) {
    console.info('in GeoIPService constructor....');
    $traceurRuntime.setProperty(this, q, $q);
    $traceurRuntime.setProperty(this, http, $http);
    $traceurRuntime.setProperty(this, _window, $window);
    this.TelizeRestangular = TelizeRestangular;
    this.cachedGeolocation = null;
  };
  ($traceurRuntime.createClass)(GeolocationService, {
    getGeolocation: function() {
      var refresh = arguments[0] !== (void 0) ? arguments[0] : false;
      var $__1 = this;
      var promise = new Promise((function(resolve, reject) {
        if ($__1.cachedGeolocation && refresh === false) {
          resolve($__1.cachedGeolocation);
        } else {
          $__1.getGeolocationByIp().then((function(geoLoc) {
            $__1.cachedGeolocation = geoLoc;
            resolve(geoLoc);
          })).catch((function(err) {
            console.log(err);
            $__1.getGeolocationByHtml5().then((function(geoLoc) {
              $__1.cachedGeolocation = geoLoc;
              resolve(geoLoc);
            }));
          }));
        }
      }));
      return this[$traceurRuntime.toProperty(q)].when(promise);
    },
    getGeolocationByIp: function() {
      return this.TelizeRestangular.all('geoip').customGET().then((function(geoInfo) {
        if (!geoInfo.hasOwnProperty('postal_code')) {
          throw Error('Geolocation has not enough accuracy');
        }
        return new GeoLocation(geoInfo.latitude, geoInfo.longitude, geoInfo.city + ', ' + geoInfo.region_code, geoInfo.postal_code);
      }));
    },
    getGeolocationByHtml5: function() {
      var $__1 = this;
      return new Promise((function(resolve, reject) {
        if ($__1[$traceurRuntime.toProperty(_window)].navigator && $__1[$traceurRuntime.toProperty(_window)].navigator.geolocation) {
          $__1[$traceurRuntime.toProperty(_window)].navigator.geolocation.getCurrentPosition((function(position) {
            resolve(new GeoLocation(position.coords.latitude, position.coords.longitude, '', ''));
          }), (function(error) {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                throw Error('You have rejected access to your location');
                break;
              case error.POSITION_UNAVAILABLE:
                throw Error('Unable to determine your location');
                break;
              case error.TIMEOUT:
                throw Error('Service timeout has been reached');
                break;
              default:
                throw Error('default error');
            }
          }));
        } else {
          throw Error('Browser does not support location services');
        }
      }));
    }
  }, {});
  return {
    get TelizeRestangular() {
      return TelizeRestangular;
    },
    get GeolocationService() {
      return GeolocationService;
    },
    __esModule: true
  };
});

define('provider/services/GeocoderService',['../utils/gMaps'], function($__0) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  var gMaps = $traceurRuntime.assertObject($__0).default;
  var $__default = (function() {
    var GeocoderService = function GeocoderService() {
      console.info('in GeocoderService constructor....');
    };
    return ($traceurRuntime.createClass)(GeocoderService, {getLocations: function(address) {
        return new Promise((function(resolve, reject) {
          var geocoder = new gMaps.Geocoder();
          return geocoder.geocode({
            'address': address,
            'region': 'us',
            componentRestrictions: {country: 'US'}
          }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
              resolve(results);
            } else {
              throw Error('Geocode was not successful for the following reason: ' + status);
            }
          });
        }));
      }}, {});
  }());
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('provider/utils/StartFromFilter',[], function() {
  
  var $__default = function StartFromFilter() {
    
    return function(input, start) {
      start = +start;
      return input.slice(start);
    };
  };
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('provider/index',['./routes', './controllers/ProviderSearchController', './controllers/ProviderResultsController', './controllers/ProviderMapController', './controllers/ProviderDetailController', './services/GeolocationService', './services/GeocoderService', './services/ProviderService', './utils/StartFromFilter'], function($__0,$__1,$__2,$__3,$__4,$__5,$__6,$__7,$__8) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  if (!$__3 || !$__3.__esModule)
    $__3 = {'default': $__3};
  if (!$__4 || !$__4.__esModule)
    $__4 = {'default': $__4};
  if (!$__5 || !$__5.__esModule)
    $__5 = {'default': $__5};
  if (!$__6 || !$__6.__esModule)
    $__6 = {'default': $__6};
  if (!$__7 || !$__7.__esModule)
    $__7 = {'default': $__7};
  if (!$__8 || !$__8.__esModule)
    $__8 = {'default': $__8};
  var routes = $traceurRuntime.assertObject($__0).default;
  var ProviderSearchController = $traceurRuntime.assertObject($__1).default;
  var ProviderResultsController = $traceurRuntime.assertObject($__2).default;
  var ProviderMapController = $traceurRuntime.assertObject($__3).default;
  var ProviderDetailController = $traceurRuntime.assertObject($__4).default;
  var $__9 = $traceurRuntime.assertObject($__5),
      TelizeRestangular = $__9.TelizeRestangular,
      GeolocationService = $__9.GeolocationService;
  var GeocoderService = $traceurRuntime.assertObject($__6).default;
  var $__9 = $traceurRuntime.assertObject($__7),
      PROVIDER_SEARCH_CONFIG = $__9.PROVIDER_SEARCH_CONFIG,
      ProviderRestangular = $__9.ProviderRestangular,
      ProviderService = $__9.ProviderService;
  var StartFromFilter = $traceurRuntime.assertObject($__8).default;
  var moduleName = 'spaApp.provider';
  var providerModule = angular.module(moduleName, ['restangular', 'ngTable', 'ui.bootstrap', 'AngularGM', 'truncate']);
  providerModule.factory('ProviderRestangular', ProviderRestangular);
  providerModule.factory('TelizeRestangular', TelizeRestangular);
  providerModule.service('GeolocationService', GeolocationService);
  providerModule.service('GeocoderService', GeocoderService);
  providerModule.service('ProviderService', ProviderService);
  providerModule.controller('ProviderSearchController', ProviderSearchController);
  providerModule.controller('ProviderResultsController', ProviderResultsController);
  providerModule.controller('ProviderMapController', ProviderMapController);
  providerModule.controller('ProviderDetailController', ProviderDetailController);
  providerModule.filter('startFrom', StartFromFilter);
  providerModule.config(routes);
  providerModule.config((function() {
    
    PROVIDER_SEARCH_CONFIG.BASE_API_URL = 'http://ve7d00000179:8080/REST_HBS_Canonical_Resiliency/service';
  }));
  var $__default = moduleName;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

