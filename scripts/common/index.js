define('common/routes',[], function() {
  
  var $__default = function routes($urlRouterProvider, $stateProvider) {
    
    return $stateProvider.state('settings', {
      url: '/settings',
      access: {allowAnonymous: false},
      templateUrl: 'views/common/settings.html',
      controller: 'SettingsController'
    }).state('testAuth', {
      url: '/testAuth',
      access: {allowAnonymous: false},
      templateUrl: 'views/experiments/testAuth.html',
      controller: 'LoginController as lc'
    });
  };
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('diary/diary',[], function() {
  
  var Diary = function Diary(group) {
    this.group = group;
  };
  var $Diary = Diary;
  ($traceurRuntime.createClass)(Diary, {log: function(level, group, message) {
      for (var $__1 = $Diary.reporters[Symbol.iterator](),
          $__2; !($__2 = $__1.next()).done; ) {
        var target = $__2.value;
        {
          var $__3 = $traceurRuntime.assertObject(target),
              config = $__3.config,
              reporter = $__3.reporter;
          if ((config.level.indexOf('*') !== -1 || config.level.indexOf(level) !== -1) && (config.group.indexOf('*') !== -1 || config.group.indexOf(group) !== -1)) {
            reporter.receive({
              level: level,
              group: group,
              message: message
            });
          }
        }
      }
    }}, {
    logger: function(group) {
      return new $Diary(group);
    },
    reporter: function(reporter) {
      var config = arguments[1] !== (void 0) ? arguments[1] : {};
      var defaults = {
        level: ['*'],
        group: ['*']
      };
      config = Object.assign(defaults, config);
      var newReporter = {
        reporter: reporter,
        config: config
      };
      $Diary.reporters.push(newReporter);
      return (function() {
        $Diary.reporters.splice($Diary.reporters.indexOf(newReporter), 1);
      });
    },
    get reporters() {
      return reporters;
    }
  });
  var reporters = [];
  for (var $__1 = ['info', 'warn', 'fatal', 'error'][Symbol.iterator](),
      $__2; !($__2 = $__1.next()).done; ) {
    var level = $__2.value;
    (function(level) {
      Diary.prototype[level] = function(message) {
        this.log(level, this.group, message);
      };
    })(level);
  }
  return {
    get Diary() {
      return Diary;
    },
    __esModule: true
  };
});

define('common/utils/util',[], function() {
  
  
  function loadDOMFromString(templateString) {
    var range = document.createRange();
    range.selectNode(document.body);
    var importedDoc = range.createContextualFragment(templateString);
    range.detach();
    return importedDoc;
  }
  function loadDOMFromString1(templateString) {
    var importedDoc = document.createDocumentFragment();
    var temp = document.createElement('div');
    temp.innerHTML = templateString;
    while (temp.firstChild) {
      importedDoc.appendChild(temp.firstChild);
    }
    return importedDoc;
  }
  function loadDOMFromLink(url) {
    return new Promise((function(resolve, reject) {
      var link = document.querySelector('link[rel=import][href$="' + url + '"]');
      if (link) {
        if (link.import) {
          resolve(link.import);
        } else {
          console.debug('link not loaded yet: ', link, 'onload' in link);
          setTimeout((function() {
            resolve(link.import);
          }), 50);
        }
      } else {
        link = document.createElement('link');
        link.rel = 'import';
        link.onload = (function(e) {
          console.debug('Loaded import: ' + e.target.href);
          resolve(e.target.import);
        });
        link.onerror = (function(e) {
          reject('Error loading import: ' + e.target.href);
        });
        link.href = url;
        document.head.appendChild(link);
      }
    }));
  }
  function serialize(data) {
    if (!angular.isObject(data)) {
      return ((data === null) ? '' : data.toString());
    }
    var buffer = [];
    for (var name in data) {
      if (!data.hasOwnProperty(name)) {
        continue;
      }
      var value = data[$traceurRuntime.toProperty(name)];
      buffer.push(encodeURIComponent(name) + '=' + encodeURIComponent((value === null) ? '' : value));
    }
    var source = buffer.join('&').replace(/%20/g, '+');
    return (source);
  }
  ;
  return {
    get loadDOMFromString() {
      return loadDOMFromString;
    },
    get loadDOMFromString1() {
      return loadDOMFromString1;
    },
    get loadDOMFromLink() {
      return loadDOMFromLink;
    },
    get serialize() {
      return serialize;
    },
    __esModule: true
  };
});

define('common/services/AuthenticationService',['../../common/utils/util'], function($__0) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  
  var serialize = $traceurRuntime.assertObject($__0).serialize;
  var AUTH_CONFIG = {
    BASE_URL: 'http://localhost:8080/<YourBaaS>',
    LOGIN_URL: 'http://localhost:8080/<YourBaaS>/j_spring_security_check',
    LOGOUT_URL: 'http://localhost:8080/<YourBaaS>/logout',
    PROFILE_URL: 'http://localhost:8080/<YourBaaS>/login/currentUser'
  };
  var AUTH_EVENTS = {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    loginCancelled: 'auth-login-cancelled',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  };
  var AuthenticationService = function AuthenticationService($q, $http, $sanitize, UserService, $rootScope, httpBuffer) {
    this.$q = $q;
    this.$http = $http;
    this.$sanitize = $sanitize;
    this.UserService = UserService;
    this.$rootScope = $rootScope;
    this.httpBuffer = httpBuffer;
  };
  ($traceurRuntime.createClass)(AuthenticationService, {
    _sanitizeCredentials: function(credentials) {
      return {
        j_username: this.$sanitize(credentials.username),
        j_password: this.$sanitize(credentials.password),
        _spring_security_remember_me: credentials.rememberMe,
        ajax: true
      };
    },
    login: function(credentials) {
      var $__1 = this;
      this.UserService.clear();
      var transformRequest = (function(data) {
        return serialize(data);
      });
      var headers = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};
      var _login = this.$http.post(AUTH_CONFIG.LOGIN_URL, this._sanitizeCredentials(credentials), {
        timeout: 10000,
        headers: headers,
        transformRequest: transformRequest
      });
      var promise = new Promise((function(resolve, reject) {
        _login.success((function(data, status, headers, config) {
          if (data.hasOwnProperty('error')) {
            reject(new Error(data.error));
          } else {
            $__1.UserService.currentUser().then((function(user) {
              resolve(true);
            }));
          }
        })).error((function(data, status, headers, config) {
          reject(new Error(data));
        }));
      }));
      return this.$q.when(promise);
    },
    logout: function() {
      return this.$http({
        method: 'POST',
        url: AUTH_CONFIG.LOGOUT_URL,
        params: {'ajax': true}
      });
    },
    loginSuccess: function(data, configUpdater) {
      var updater = configUpdater || function(config) {
        return config;
      };
      this.$rootScope.$broadcast(AUTH_EVENTS.loginSuccess, data);
      this.httpBuffer.retryAll(updater);
    },
    logoutSuccess: function(data) {
      this.UserService.clear();
      this.$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess, data);
    },
    loginCancelled: function(data, reason) {
      this.httpBuffer.rejectAll(reason);
      this.$rootScope.$broadcast(AUTH_EVENTS.loginCancelled, data);
    },
    notAuthorized: function(data) {
      this.$rootScope.$broadcast(AUTH_EVENTS.notAuthorized, data);
    },
    notAuthenticated: function(data) {
      this.$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, data);
    }
  }, {});
  return {
    get AUTH_CONFIG() {
      return AUTH_CONFIG;
    },
    get AUTH_EVENTS() {
      return AUTH_EVENTS;
    },
    get AuthenticationService() {
      return AuthenticationService;
    },
    __esModule: true
  };
});

define('common/services/UserService',['./AuthenticationService', 'diary/diary'], function($__0,$__1) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  var AUTH_CONFIG = $traceurRuntime.assertObject($__0).AUTH_CONFIG;
  var Diary = $traceurRuntime.assertObject($__1).Diary;
  var USER_KEY = '_currentUser';
  var IS_LOGGED_IN = '_isLoggedIn';
  var USERNAME = '_username';
  var _userCache = Symbol('user', true);
  var $__default = (function() {
    var UserService = function UserService($q, $log, Restangular, DSCacheFactory) {
      this.$q = $q;
      this.Restangular = Restangular;
      this.logger = Diary.logger('UserService');
      $traceurRuntime.setProperty(this, _userCache, new DSCacheFactory('userCache', {
        capacity: 5,
        storageMode: 'sessionStorage',
        verifyIntegrity: true
      }));
    };
    return ($traceurRuntime.createClass)(UserService, {
      currentUser: function() {
        var $__2 = this;
        var promise = new Promise((function(resolve, reject) {
          $__2.logger.info('in currentUser');
          var _currentUser = $__2[$traceurRuntime.toProperty(_userCache)].get(USER_KEY);
          if (_currentUser) {
            resolve(_currentUser);
          } else {
            $__2.Restangular.oneUrl('UserProfile', AUTH_CONFIG.PROFILE_URL).get().then((function(userProfile) {
              $__2[$traceurRuntime.toProperty(_userCache)].put(IS_LOGGED_IN, true);
              $__2[$traceurRuntime.toProperty(_userCache)].put(USER_KEY, userProfile);
              $__2[$traceurRuntime.toProperty(_userCache)].put(USERNAME, userProfile.username);
              resolve(userProfile);
            })).catch((function(err) {
              $__2.logger.error(err);
              reject(err);
            }));
          }
        }));
        return this.$q.when(promise);
      },
      currentUserFromCache: function() {
        return this[$traceurRuntime.toProperty(_userCache)].get(USER_KEY);
      },
      isLoggedIn: function() {
        return this[$traceurRuntime.toProperty(_userCache)].get(IS_LOGGED_IN) || false;
      },
      getUsername: function() {
        return this[$traceurRuntime.toProperty(_userCache)].get(USERNAME) || false;
      },
      clear: function() {
        this[$traceurRuntime.toProperty(_userCache)].removeAll();
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

define('common/controllers/LoginController',['diary/diary', '../services/AuthenticationService', '../services/UserService', '../services/AuthenticationService'], function($__0,$__1,$__2,$__3) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  if (!$__3 || !$__3.__esModule)
    $__3 = {'default': $__3};
  var Diary = $traceurRuntime.assertObject($__0).Diary;
  var AuthenticationServiceClass = $traceurRuntime.assertObject($__1).AuthenticationService;
  var UserServiceClass = $traceurRuntime.assertObject($__2).default;
  var AUTH_EVENTS = $traceurRuntime.assertObject($__3).AUTH_EVENTS;
  var modalInstance;
  var LoginController = function LoginController($scope, $rootScope, growl, $modal, $state, UserService, AuthenticationService) {
    var $__4 = this;
    this.$rootScope = $rootScope;
    this.growl = growl;
    this.logger = Diary.logger('LoginController');
    this.$modal = $modal;
    this.$state = $state;
    this.UserService = UserService;
    this.AuthenticationService = AuthenticationService;
    this.loginDialogOpened = false;
    $scope.$on(AUTH_EVENTS.notAuthenticated, (function() {
      if (!$__4.loginDialogOpened) {
        $__4.growl.warning('LOGIN_REQUIRED');
        UserService.clear();
        $state.go('home');
        $__4.login();
      }
    }));
    $scope.$on(AUTH_EVENTS.sessionTimeout, (function() {
      if (!$__4.loginDialogOpened) {
        $__4.growl.warning('SESSION_TIMEOUT');
        UserService.clear();
        $state.go('home');
        $__4.login();
      }
    }));
    $scope.$on(AUTH_EVENTS.notAuthorized, (function() {
      if (!$__4.loginDialogOpened) {
        growl.error('You are not authorized to access this page');
        $__4.login();
      }
    }));
    $scope.$on(AUTH_EVENTS.loginSuccess, (function() {
      $__4.growl.success('LOGIN_SUCCESS');
      console.log('destination State', $scope.destinationState);
      if ($scope.destinationState) {
        $__4.logger.info(("redirecting to destination: " + $scope.destinationState.state.name));
        $state.go($scope.destinationState.state.name, $scope.destinationState.stateParams);
      }
    }));
    $scope.$on(AUTH_EVENTS.loginCancelled, (function() {
      $__4.growl.warning('LOGIN_CANCELLED');
    }));
    $scope.$on(AUTH_EVENTS.logoutSuccess, (function() {
      $__4.growl.warning('LOGOUT_SUCCESS');
      $__4.$state.go('home');
    }));
  };
  ($traceurRuntime.createClass)(LoginController, {
    isLoggedIn: function() {
      return this.UserService.isLoggedIn();
    },
    getUsername: function() {
      return this.UserService.getUsername();
    },
    getCurrentUser: function() {
      return this.UserService.currentUserFromCache();
    },
    login: function() {
      var $__4 = this;
      modalInstance = this.$modal.open({
        templateUrl: 'views/common/login.html',
        controller: 'LoginModalController',
        backdrop: true,
        keyboard: true,
        windowClass: 'modal-login'
      });
      modalInstance.opened.then((function() {
        $__4.logger.info('Login modal opened');
        $__4.loginDialogOpened = true;
      }));
      modalInstance.result.then((function(result) {
        $__4.logger.warn(("got result: " + result + " from LoginModalController..."));
        $__4.loginDialogOpened = false;
      })).catch((function(err) {
        $__4.logger.warn('login Modal dismissed', err);
        $__4.loginDialogOpened = false;
      }));
    },
    logout: function() {
      var $__4 = this;
      this.logger.warn('in logout');
      this.AuthenticationService.logout().then((function() {
        $__4.AuthenticationService.logoutSuccess();
      })).catch((function(err) {
        $__4.logger.error(err);
        $__4.logger.log(err);
        $__4.growl.error((err.config.url + " not accessible"), {ttl: 8000});
      }));
    }
  }, {});
  LoginController.parameters = [[], [], [], [], [], [UserServiceClass], [AuthenticationServiceClass]];
  var LoginModalController = function LoginModalController($scope, growl, AuthenticationService) {
    this.$scope = $scope;
    this.growl = growl;
    this.logger = Diary.logger('LoginModalController');
    this.AuthenticationService = AuthenticationService;
    this.$scope.credentials = {
      username: '',
      password: '',
      rememberMe: false
    };
  };
  ($traceurRuntime.createClass)(LoginModalController, {
    submit: function(credentials) {
      var $__4 = this;
      this.AuthenticationService.login(credentials).then((function(result) {
        $__4.AuthenticationService.loginSuccess();
        modalInstance.close(result);
      })).catch((function(err) {
        $__4.logger.error(err);
        $__4.growl.error(err.message, {ttl: 8000});
      }));
    },
    cancel: function() {
      this.AuthenticationService.loginCancelled();
      modalInstance.dismiss('cancel');
    }
  }, {});
  ;
  return {
    get LoginController() {
      return LoginController;
    },
    get LoginModalController() {
      return LoginModalController;
    },
    __esModule: true
  };
});

define('common/controllers/SettingsController',[], function() {
  
  var $__default = (function() {
    var SettingsController = function SettingsController($scope, UserService) {
      console.info('in SettingsController....');
      UserService.currentUser().then((function(user) {
        $scope.currentUser = user;
      }));
      $scope.changeTheme = function() {};
    };
    return ($traceurRuntime.createClass)(SettingsController, {}, {});
  }());
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('common/services/AuthorizationService',[], function() {
  
  var USER_ROLES = {
    all: '*',
    any: '?',
    USER: 'ROLE_USER',
    DATA_ADMIN: 'ROLE_DATA_ADMIN',
    IT_ADMIN: 'ROLE_IT_ADMIN',
    BUSINESS_ADMIN: 'ROLE_BUSINESS_ADMIN',
    SWITCH_USER: 'ROLE_SWITCH_USER',
    SUPER_ADMIN: 'ROLE_SUPER_ADMIN'
  };
  var USER_ROLE_HIERARCHIE = {
    ROLE_USER: ['ROLE_USER'],
    ROLE_DATA_ADMIN: ['ROLE_DATA_ADMIN', 'ROLE_USER'],
    ROLE_IT_ADMIN: ['ROLE_IT_ADMIN', 'ROLE_USER'],
    ROLE_BUSINESS_ADMIN: ['ROLE_BUSINESS_ADMIN', 'ROLE_IT_ADMIN', 'ROLE_DATA_ADMIN', 'ROLE_USER'],
    ROLE_SWITCH_USER: ['ROLE_SWITCH_USER', 'ROLE_BUSINESS_ADMIN', 'ROLE_IT_ADMIN', 'ROLE_DATA_ADMIN', 'ROLE_USER'],
    ROLE_SUPER_ADMIN: ['ROLE_SUPER_ADMIN', 'ROLE_SWITCH_USER', 'ROLE_BUSINESS_ADMIN', 'ROLE_IT_ADMIN', 'ROLE_DATA_ADMIN', 'ROLE_USER']
  };
  var AuthorizationService = function AuthorizationService($rootScope, UserService) {
    this.$rootScope = $rootScope;
    this.UserService = UserService;
  };
  ($traceurRuntime.createClass)(AuthorizationService, {
    isAuthenticated: function() {
      return this.UserService.isLoggedIn();
    },
    isAuthorized: function(authorizedRoles) {
      if (!this.isAuthenticated()) {
        return false;
      }
      if (typeof authorizedRoles === 'undefined') {
        return true;
      }
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      var currentUser = this.UserService.currentUserFromCache();
      var authorities = currentUser.authorities.map((function(x) {
        return x.authority;
      }));
      var expandedAuthorities = _.flatten(authorities.map((function(x) {
        return USER_ROLE_HIERARCHIE[$traceurRuntime.toProperty(x)];
      })));
      var intersection = _.intersection(expandedAuthorities, authorizedRoles);
      return (this.isAuthenticated() && intersection.length > 0);
    },
    isAuthorized1: function(authorizedRoles) {
      var currentUser,
          authorities,
          intersection;
      return $traceurRuntime.asyncWrap(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              $ctx.state = (!this.isAuthenticated()) ? 1 : 3;
              break;
            case 1:
              $ctx.returnValue = false;
              $ctx.state = 2;
              break;
            case 2:
              $ctx.state = -2;
              break;
            case 3:
              $ctx.state = (typeof authorizedRoles === 'undefined') ? 5 : 7;
              break;
            case 5:
              $ctx.returnValue = true;
              $ctx.state = 6;
              break;
            case 6:
              $ctx.state = -2;
              break;
            case 7:
              if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
              }
              $ctx.state = 16;
              break;
            case 16:
              Promise.resolve(this.UserService.currentUser()).then($ctx.createCallback(10), $ctx.errback);
              return;
            case 10:
              currentUser = $ctx.value;
              $ctx.state = 11;
              break;
            case 11:
              authorities = new Set((function() {
                var $__1 = 0,
                    $__2 = [];
                for (var $__3 = currentUser.authorities[$traceurRuntime.toProperty(Symbol.iterator)](),
                    $__4; !($__4 = $__3.next()).done; ) {
                  try {
                    throw undefined;
                  } catch (x) {
                    x = $__4.value;
                    $traceurRuntime.setProperty($__2, $__1++, x.authority);
                  }
                }
                return $__2;
              }()));
              intersection = (function() {
                var $__1 = 0,
                    $__2 = [];
                for (var $__3 = authorizedRoles[$traceurRuntime.toProperty(Symbol.iterator)](),
                    $__4; !($__4 = $__3.next()).done; ) {
                  try {
                    throw undefined;
                  } catch (x) {
                    x = $__4.value;
                    if (authorities.has(x))
                      $traceurRuntime.setProperty($__2, $__1++, x);
                  }
                }
                return $__2;
              }());
              $ctx.state = 18;
              break;
            case 18:
              $ctx.returnValue = (this.isAuthenticated() && intersection.length > 0);
              $ctx.state = 13;
              break;
            case 13:
              $ctx.state = -2;
              break;
            default:
              return $ctx.end();
          }
      }, this);
    }
  }, {});
  return {
    get USER_ROLES() {
      return USER_ROLES;
    },
    get AuthorizationService() {
      return AuthorizationService;
    },
    __esModule: true
  };
});

define('common/elements/hasPermission',['../services/AuthenticationService'], function($__0) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  
  var AUTH_EVENTS = $traceurRuntime.assertObject($__0).AUTH_EVENTS;
  var $__default = function hasPermission(AuthorizationService) {
    return {link: function(scope, element, attrs) {
        if (!angular.isString(attrs.hasPermission)) {
          throw 'hasPermission value must be a string';
        }
        var value = attrs.hasPermission.trim();
        var notPermissionFlag = value[0] === '!';
        if (notPermissionFlag) {
          value = value.slice(1).trim();
        }
        function toggleVisibilityBasedOnPermission() {
          var hasPermission = AuthorizationService.isAuthorized(value);
          if (hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag) {
            (element[0].tagName === 'DIV') ? element.removeClass('ng-hide') : element.removeClass('disabled');
          } else {
            (element[0].tagName === 'DIV') ? element.addClass('ng-hide') : element.addClass('disabled');
          }
        }
        toggleVisibilityBasedOnPermission();
        scope.$on(AUTH_EVENTS.loginSuccess, toggleVisibilityBasedOnPermission);
        scope.$on(AUTH_EVENTS.notAuthenticated, toggleVisibilityBasedOnPermission);
        scope.$on(AUTH_EVENTS.logoutSuccess, toggleVisibilityBasedOnPermission);
      }};
  };
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('common/utils/AuthInterceptor',['../services/AuthenticationService'], function($__0) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  var AUTH_EVENTS = $traceurRuntime.assertObject($__0).AUTH_EVENTS;
  var $__default = function AuthInterceptor($rootScope, $q, httpBuffer) {
    
    return {responseError: function(rejection) {
        if (rejection.status === 401 && !rejection.config.ignoreAuthModule) {
          try {
            throw undefined;
          } catch (deferred) {
            deferred = $q.defer();
            httpBuffer.append(rejection.config, deferred);
            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, rejection);
            return deferred.promise;
          }
        }
        if (rejection.status === 419 || rejection.status === 440) {
          $rootScope.$broadcast(AUTH_EVENTS.sessionTimeout, rejection);
        }
        if (rejection.status === 403 && !rejection.config.ignoreAuthModule) {
          try {
            throw undefined;
          } catch (deferred2) {
            deferred2 = $q.defer();
            httpBuffer.append(rejection.config, deferred2);
            $rootScope.$broadcast(AUTH_EVENTS.notAuthorized, rejection);
            return deferred2.promise;
          }
        }
        return $q.reject(rejection);
      }};
  };
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('common/index',['./routes', './controllers/LoginController', './controllers/SettingsController', './services/AuthenticationService', './services/AuthorizationService', './services/UserService', './elements/hasPermission', './utils/AuthInterceptor'], function($__0,$__1,$__2,$__3,$__4,$__5,$__6,$__7) {
  
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
  var routes = $traceurRuntime.assertObject($__0).default;
  var $__8 = $traceurRuntime.assertObject($__1),
      LoginController = $__8.LoginController,
      LoginModalController = $__8.LoginModalController;
  var SettingsController = $traceurRuntime.assertObject($__2).default;
  var $__8 = $traceurRuntime.assertObject($__3),
      AUTH_CONFIG = $__8.AUTH_CONFIG,
      AuthenticationService = $__8.AuthenticationService;
  var AuthorizationService = $traceurRuntime.assertObject($__4).AuthorizationService;
  var UserService = $traceurRuntime.assertObject($__5).default;
  var hasPermission = $traceurRuntime.assertObject($__6).default;
  var AuthInterceptor = $traceurRuntime.assertObject($__7).default;
  var moduleName = 'spaApp.common';
  var commonModule = angular.module(moduleName, ['http-auth-interceptor-buffer']);
  commonModule.service('UserService', UserService);
  commonModule.service('AuthenticationService', AuthenticationService);
  commonModule.service('AuthorizationService', AuthorizationService);
  commonModule.directive('hasPermission', hasPermission);
  commonModule.controller('LoginController', LoginController);
  commonModule.controller('LoginModalController', LoginModalController);
  commonModule.controller('SettingsController', SettingsController);
  commonModule.config(routes);
  commonModule.config((function($httpProvider) {
    
    $httpProvider.interceptors.push(AuthInterceptor);
    AUTH_CONFIG.BASE_URL = 'http://ve7d00000010:8080/apiApp';
    AUTH_CONFIG.LOGIN_URL = AUTH_CONFIG.BASE_URL + '/j_spring_security_check';
    AUTH_CONFIG.LOGOUT_URL = AUTH_CONFIG.BASE_URL + '/logout';
    AUTH_CONFIG.PROFILE_URL = AUTH_CONFIG.BASE_URL + '/login/currentUser';
  }));
  var $__default = moduleName;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

