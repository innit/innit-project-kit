define('common/routes',[], function() {
  
  function routes($urlRouterProvider, $stateProvider) {
    
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
  }
  var $__default = routes;
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
  
  var serialize = $__0.serialize;
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
      var $__2 = this;
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
            $__2.UserService.currentUser().then((function(user) {
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

define('common/services/UserService',['./AuthenticationService', 'diary/diary'], function($__0,$__2) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  var AUTH_CONFIG = $__0.AUTH_CONFIG;
  var Diary = $__2.Diary;
  var USER_KEY = '_currentUser';
  var IS_LOGGED_IN = '_isLoggedIn';
  var USERNAME = '_username';
  var _userCache = Symbol('user', true);
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
  ($traceurRuntime.createClass)(UserService, {
    currentUser: function() {
      var $__4 = this;
      var promise = new Promise((function(resolve, reject) {
        $__4.logger.info('in currentUser');
        var _currentUser = $__4[$traceurRuntime.toProperty(_userCache)].get(USER_KEY);
        if (_currentUser) {
          resolve(_currentUser);
        } else {
          $__4.Restangular.oneUrl('UserProfile', AUTH_CONFIG.PROFILE_URL).get().then((function(userProfile) {
            $__4[$traceurRuntime.toProperty(_userCache)].put(IS_LOGGED_IN, true);
            $__4[$traceurRuntime.toProperty(_userCache)].put(USER_KEY, userProfile);
            $__4[$traceurRuntime.toProperty(_userCache)].put(USERNAME, userProfile.username);
            resolve(userProfile);
          })).catch((function(err) {
            $__4.logger.error(err);
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
  var $__default = UserService;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('common/controllers/LoginController',['diary/diary', '../services/AuthenticationService', '../services/UserService', '../services/AuthenticationService'], function($__0,$__2,$__4,$__6) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {'default': $__4};
  if (!$__6 || !$__6.__esModule)
    $__6 = {'default': $__6};
  var Diary = $__0.Diary;
  var AuthenticationServiceClass = $__2.AuthenticationService;
  var UserServiceClass = $__4.default;
  var AUTH_EVENTS = $__6.AUTH_EVENTS;
  var modalInstance;
  var LoginController = function LoginController($scope, $rootScope, growl, $modal, $state, UserService, AuthenticationService) {
    var $__8 = this;
    this.$rootScope = $rootScope;
    this.growl = growl;
    this.logger = Diary.logger('LoginController');
    this.$modal = $modal;
    this.$state = $state;
    this.UserService = UserService;
    this.AuthenticationService = AuthenticationService;
    this.loginDialogOpened = false;
    $scope.$on(AUTH_EVENTS.notAuthenticated, (function() {
      if (!$__8.loginDialogOpened) {
        $__8.growl.warning('LOGIN_REQUIRED');
        UserService.clear();
        $state.go('home');
        $__8.login();
      }
    }));
    $scope.$on(AUTH_EVENTS.sessionTimeout, (function() {
      if (!$__8.loginDialogOpened) {
        $__8.growl.warning('SESSION_TIMEOUT');
        UserService.clear();
        $state.go('home');
        $__8.login();
      }
    }));
    $scope.$on(AUTH_EVENTS.notAuthorized, (function() {
      if (!$__8.loginDialogOpened) {
        growl.error('You are not authorized to access this page');
        $__8.login();
      }
    }));
    $scope.$on(AUTH_EVENTS.loginSuccess, (function() {
      $__8.growl.success('LOGIN_SUCCESS');
      console.log('destination State', $scope.destinationState);
      if ($scope.destinationState) {
        $__8.logger.info(("redirecting to destination: " + $scope.destinationState.state.name));
        $state.go($scope.destinationState.state.name, $scope.destinationState.stateParams);
      }
    }));
    $scope.$on(AUTH_EVENTS.loginCancelled, (function() {
      $__8.growl.warning('LOGIN_CANCELLED');
    }));
    $scope.$on(AUTH_EVENTS.logoutSuccess, (function() {
      $__8.growl.warning('LOGOUT_SUCCESS');
      $__8.$state.go('home');
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
      var $__8 = this;
      modalInstance = this.$modal.open({
        templateUrl: 'views/common/login.html',
        controller: 'LoginModalController',
        backdrop: true,
        keyboard: true,
        windowClass: 'modal-login'
      });
      modalInstance.opened.then((function() {
        $__8.logger.info('Login modal opened');
        $__8.loginDialogOpened = true;
      }));
      modalInstance.result.then((function(result) {
        $__8.logger.warn(("got result: " + result + " from LoginModalController..."));
        $__8.loginDialogOpened = false;
      })).catch((function(err) {
        $__8.logger.warn('login Modal dismissed', err);
        $__8.loginDialogOpened = false;
      }));
    },
    logout: function() {
      var $__8 = this;
      this.logger.warn('in logout');
      this.AuthenticationService.logout().then((function() {
        $__8.AuthenticationService.logoutSuccess();
      })).catch((function(err) {
        $__8.logger.error(err);
        $__8.growl.error((err.config.url + " not accessible"), {ttl: 8000});
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
      var $__8 = this;
      this.AuthenticationService.login(credentials).then((function(result) {
        $__8.AuthenticationService.loginSuccess();
        modalInstance.close(result);
      })).catch((function(err) {
        $__8.logger.error(err);
        $__8.growl.error(err.message, {ttl: 8000});
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
  
  var SettingsController = function SettingsController($scope, UserService) {
    console.info('in SettingsController....');
    UserService.currentUser().then((function(user) {
      $scope.currentUser = user;
    }));
    $scope.changeTheme = function() {};
  };
  ($traceurRuntime.createClass)(SettingsController, {}, {});
  var $__default = SettingsController;
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
                    {
                      x = $__4.value;
                      $traceurRuntime.setProperty($__2, $__1++, x.authority);
                    }
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
                    {
                      x = $__4.value;
                      if (authorities.has(x))
                        $traceurRuntime.setProperty($__2, $__1++, x);
                    }
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
  
  var AUTH_EVENTS = $__0.AUTH_EVENTS;
  function hasPermission(AuthorizationService) {
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
  }
  var $__default = hasPermission;
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
  var AUTH_EVENTS = $__0.AUTH_EVENTS;
  function AuthInterceptor($rootScope, $q, httpBuffer) {
    
    return {responseError: function(rejection) {
        if (rejection.status === 401 && !rejection.config.ignoreAuthModule) {
          try {
            throw undefined;
          } catch (deferred) {
            {
              deferred = $q.defer();
              httpBuffer.append(rejection.config, deferred);
              $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, rejection);
              return deferred.promise;
            }
          }
        }
        if (rejection.status === 419 || rejection.status === 440) {
          $rootScope.$broadcast(AUTH_EVENTS.sessionTimeout, rejection);
        }
        if (rejection.status === 403 && !rejection.config.ignoreAuthModule) {
          try {
            throw undefined;
          } catch (deferred2) {
            {
              deferred2 = $q.defer();
              httpBuffer.append(rejection.config, deferred2);
              $rootScope.$broadcast(AUTH_EVENTS.notAuthorized, rejection);
              return deferred2.promise;
            }
          }
        }
        return $q.reject(rejection);
      }};
  }
  var $__default = AuthInterceptor;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

/* SockJS client, version 0.3.4, http://sockjs.org, MIT License

Copyright (c) 2011-2012 VMware, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// JSON2 by Douglas Crockford (minified).
var JSON;JSON||(JSON={}),function(){function str(a,b){var c,d,e,f,g=gap,h,i=b[a];i&&typeof i=="object"&&typeof i.toJSON=="function"&&(i=i.toJSON(a)),typeof rep=="function"&&(i=rep.call(b,a,i));switch(typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";gap+=indent,h=[];if(Object.prototype.toString.apply(i)==="[object Array]"){f=i.length;for(c=0;c<f;c+=1)h[c]=str(c,i)||"null";e=h.length===0?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]",gap=g;return e}if(rep&&typeof rep=="object"){f=rep.length;for(c=0;c<f;c+=1)typeof rep[c]=="string"&&(d=rep[c],e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e))}else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));e=h.length===0?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}",gap=g;return e}}function quote(a){escapable.lastIndex=0;return escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b=="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function f(a){return a<10?"0"+a:a}"use strict",typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(a){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(a,b,c){var d;gap="",indent="";if(typeof c=="number")for(d=0;d<c;d+=1)indent+=" ";else typeof c=="string"&&(indent=c);rep=b;if(!b||typeof b=="function"||typeof b=="object"&&typeof b.length=="number")return str("",{"":a});throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&typeof e=="object")for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),d!==undefined?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver=="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")})}()


//     [*] Including lib/index.js
// Public object
SockJS = (function(){
              var _document = document;
              var _window = window;
              var utils = {};


//         [*] Including lib/reventtarget.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

/* Simplified implementation of DOM2 EventTarget.
 *   http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
 */
var REventTarget = function() {};
REventTarget.prototype.addEventListener = function (eventType, listener) {
    if(!this._listeners) {
         this._listeners = {};
    }
    if(!(eventType in this._listeners)) {
        this._listeners[eventType] = [];
    }
    var arr = this._listeners[eventType];
    if(utils.arrIndexOf(arr, listener) === -1) {
        arr.push(listener);
    }
    return;
};

REventTarget.prototype.removeEventListener = function (eventType, listener) {
    if(!(this._listeners && (eventType in this._listeners))) {
        return;
    }
    var arr = this._listeners[eventType];
    var idx = utils.arrIndexOf(arr, listener);
    if (idx !== -1) {
        if(arr.length > 1) {
            this._listeners[eventType] = arr.slice(0, idx).concat( arr.slice(idx+1) );
        } else {
            delete this._listeners[eventType];
        }
        return;
    }
    return;
};

REventTarget.prototype.dispatchEvent = function (event) {
    var t = event.type;
    var args = Array.prototype.slice.call(arguments, 0);
    if (this['on'+t]) {
        this['on'+t].apply(this, args);
    }
    if (this._listeners && t in this._listeners) {
        for(var i=0; i < this._listeners[t].length; i++) {
            this._listeners[t][i].apply(this, args);
        }
    }
};
//         [*] End of lib/reventtarget.js


//         [*] Including lib/simpleevent.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var SimpleEvent = function(type, obj) {
    this.type = type;
    if (typeof obj !== 'undefined') {
        for(var k in obj) {
            if (!obj.hasOwnProperty(k)) continue;
            this[k] = obj[k];
        }
    }
};

SimpleEvent.prototype.toString = function() {
    var r = [];
    for(var k in this) {
        if (!this.hasOwnProperty(k)) continue;
        var v = this[k];
        if (typeof v === 'function') v = '[function]';
        r.push(k + '=' + v);
    }
    return 'SimpleEvent(' + r.join(', ') + ')';
};
//         [*] End of lib/simpleevent.js


//         [*] Including lib/eventemitter.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var EventEmitter = function(events) {
    var that = this;
    that._events = events || [];
    that._listeners = {};
};
EventEmitter.prototype.emit = function(type) {
    var that = this;
    that._verifyType(type);
    if (that._nuked) return;

    var args = Array.prototype.slice.call(arguments, 1);
    if (that['on'+type]) {
        that['on'+type].apply(that, args);
    }
    if (type in that._listeners) {
        for(var i = 0; i < that._listeners[type].length; i++) {
            that._listeners[type][i].apply(that, args);
        }
    }
};

EventEmitter.prototype.on = function(type, callback) {
    var that = this;
    that._verifyType(type);
    if (that._nuked) return;

    if (!(type in that._listeners)) {
        that._listeners[type] = [];
    }
    that._listeners[type].push(callback);
};

EventEmitter.prototype._verifyType = function(type) {
    var that = this;
    if (utils.arrIndexOf(that._events, type) === -1) {
        utils.log('Event ' + JSON.stringify(type) +
                  ' not listed ' + JSON.stringify(that._events) +
                  ' in ' + that);
    }
};

EventEmitter.prototype.nuke = function() {
    var that = this;
    that._nuked = true;
    for(var i=0; i<that._events.length; i++) {
        delete that[that._events[i]];
    }
    that._listeners = {};
};
//         [*] End of lib/eventemitter.js


//         [*] Including lib/utils.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var random_string_chars = 'abcdefghijklmnopqrstuvwxyz0123456789_';
utils.random_string = function(length, max) {
    max = max || random_string_chars.length;
    var i, ret = [];
    for(i=0; i < length; i++) {
        ret.push( random_string_chars.substr(Math.floor(Math.random() * max),1) );
    }
    return ret.join('');
};
utils.random_number = function(max) {
    return Math.floor(Math.random() * max);
};
utils.random_number_string = function(max) {
    var t = (''+(max - 1)).length;
    var p = Array(t+1).join('0');
    return (p + utils.random_number(max)).slice(-t);
};

// Assuming that url looks like: http://asdasd:111/asd
utils.getOrigin = function(url) {
    url += '/';
    var parts = url.split('/').slice(0, 3);
    return parts.join('/');
};

utils.isSameOriginUrl = function(url_a, url_b) {
    // location.origin would do, but it's not always available.
    if (!url_b) url_b = _window.location.href;

    return (url_a.split('/').slice(0,3).join('/')
                ===
            url_b.split('/').slice(0,3).join('/'));
};

utils.getParentDomain = function(url) {
    // ipv4 ip address
    if (/^[0-9.]*$/.test(url)) return url;
    // ipv6 ip address
    if (/^\[/.test(url)) return url;
    // no dots
    if (!(/[.]/.test(url))) return url;

    var parts = url.split('.').slice(1);
    return parts.join('.');
};

utils.objectExtend = function(dst, src) {
    for(var k in src) {
        if (src.hasOwnProperty(k)) {
            dst[k] = src[k];
        }
    }
    return dst;
};

var WPrefix = '_jp';

utils.polluteGlobalNamespace = function() {
    if (!(WPrefix in _window)) {
        _window[WPrefix] = {};
    }
};

utils.closeFrame = function (code, reason) {
    return 'c'+JSON.stringify([code, reason]);
};

utils.userSetCode = function (code) {
    return code === 1000 || (code >= 3000 && code <= 4999);
};

// See: http://www.erg.abdn.ac.uk/~gerrit/dccp/notes/ccid2/rto_estimator/
// and RFC 2988.
utils.countRTO = function (rtt) {
    var rto;
    if (rtt > 100) {
        rto = 3 * rtt; // rto > 300msec
    } else {
        rto = rtt + 200; // 200msec < rto <= 300msec
    }
    return rto;
}

utils.log = function() {
    if (_window.console && console.log && console.log.apply) {
        console.log.apply(console, arguments);
    }
};

utils.bind = function(fun, that) {
    if (fun.bind) {
        return fun.bind(that);
    } else {
        return function() {
            return fun.apply(that, arguments);
        };
    }
};

utils.flatUrl = function(url) {
    return url.indexOf('?') === -1 && url.indexOf('#') === -1;
};

utils.amendUrl = function(url) {
    var dl = _document.location;
    if (!url) {
        throw new Error('Wrong url for SockJS');
    }
    if (!utils.flatUrl(url)) {
        throw new Error('Only basic urls are supported in SockJS');
    }

    //  '//abc' --> 'http://abc'
    if (url.indexOf('//') === 0) {
        url = dl.protocol + url;
    }
    // '/abc' --> 'http://localhost:80/abc'
    if (url.indexOf('/') === 0) {
        url = dl.protocol + '//' + dl.host + url;
    }
    // strip trailing slashes
    url = url.replace(/[/]+$/,'');
    return url;
};

// IE doesn't support [].indexOf.
utils.arrIndexOf = function(arr, obj){
    for(var i=0; i < arr.length; i++){
        if(arr[i] === obj){
            return i;
        }
    }
    return -1;
};

utils.arrSkip = function(arr, obj) {
    var idx = utils.arrIndexOf(arr, obj);
    if (idx === -1) {
        return arr.slice();
    } else {
        var dst = arr.slice(0, idx);
        return dst.concat(arr.slice(idx+1));
    }
};

// Via: https://gist.github.com/1133122/2121c601c5549155483f50be3da5305e83b8c5df
utils.isArray = Array.isArray || function(value) {
    return {}.toString.call(value).indexOf('Array') >= 0
};

utils.delay = function(t, fun) {
    if(typeof t === 'function') {
        fun = t;
        t = 0;
    }
    return setTimeout(fun, t);
};


// Chars worth escaping, as defined by Douglas Crockford:
//   https://github.com/douglascrockford/JSON-js/blob/47a9882cddeb1e8529e07af9736218075372b8ac/json2.js#L196
var json_escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    json_lookup = {
"\u0000":"\\u0000","\u0001":"\\u0001","\u0002":"\\u0002","\u0003":"\\u0003",
"\u0004":"\\u0004","\u0005":"\\u0005","\u0006":"\\u0006","\u0007":"\\u0007",
"\b":"\\b","\t":"\\t","\n":"\\n","\u000b":"\\u000b","\f":"\\f","\r":"\\r",
"\u000e":"\\u000e","\u000f":"\\u000f","\u0010":"\\u0010","\u0011":"\\u0011",
"\u0012":"\\u0012","\u0013":"\\u0013","\u0014":"\\u0014","\u0015":"\\u0015",
"\u0016":"\\u0016","\u0017":"\\u0017","\u0018":"\\u0018","\u0019":"\\u0019",
"\u001a":"\\u001a","\u001b":"\\u001b","\u001c":"\\u001c","\u001d":"\\u001d",
"\u001e":"\\u001e","\u001f":"\\u001f","\"":"\\\"","\\":"\\\\",
"\u007f":"\\u007f","\u0080":"\\u0080","\u0081":"\\u0081","\u0082":"\\u0082",
"\u0083":"\\u0083","\u0084":"\\u0084","\u0085":"\\u0085","\u0086":"\\u0086",
"\u0087":"\\u0087","\u0088":"\\u0088","\u0089":"\\u0089","\u008a":"\\u008a",
"\u008b":"\\u008b","\u008c":"\\u008c","\u008d":"\\u008d","\u008e":"\\u008e",
"\u008f":"\\u008f","\u0090":"\\u0090","\u0091":"\\u0091","\u0092":"\\u0092",
"\u0093":"\\u0093","\u0094":"\\u0094","\u0095":"\\u0095","\u0096":"\\u0096",
"\u0097":"\\u0097","\u0098":"\\u0098","\u0099":"\\u0099","\u009a":"\\u009a",
"\u009b":"\\u009b","\u009c":"\\u009c","\u009d":"\\u009d","\u009e":"\\u009e",
"\u009f":"\\u009f","\u00ad":"\\u00ad","\u0600":"\\u0600","\u0601":"\\u0601",
"\u0602":"\\u0602","\u0603":"\\u0603","\u0604":"\\u0604","\u070f":"\\u070f",
"\u17b4":"\\u17b4","\u17b5":"\\u17b5","\u200c":"\\u200c","\u200d":"\\u200d",
"\u200e":"\\u200e","\u200f":"\\u200f","\u2028":"\\u2028","\u2029":"\\u2029",
"\u202a":"\\u202a","\u202b":"\\u202b","\u202c":"\\u202c","\u202d":"\\u202d",
"\u202e":"\\u202e","\u202f":"\\u202f","\u2060":"\\u2060","\u2061":"\\u2061",
"\u2062":"\\u2062","\u2063":"\\u2063","\u2064":"\\u2064","\u2065":"\\u2065",
"\u2066":"\\u2066","\u2067":"\\u2067","\u2068":"\\u2068","\u2069":"\\u2069",
"\u206a":"\\u206a","\u206b":"\\u206b","\u206c":"\\u206c","\u206d":"\\u206d",
"\u206e":"\\u206e","\u206f":"\\u206f","\ufeff":"\\ufeff","\ufff0":"\\ufff0",
"\ufff1":"\\ufff1","\ufff2":"\\ufff2","\ufff3":"\\ufff3","\ufff4":"\\ufff4",
"\ufff5":"\\ufff5","\ufff6":"\\ufff6","\ufff7":"\\ufff7","\ufff8":"\\ufff8",
"\ufff9":"\\ufff9","\ufffa":"\\ufffa","\ufffb":"\\ufffb","\ufffc":"\\ufffc",
"\ufffd":"\\ufffd","\ufffe":"\\ufffe","\uffff":"\\uffff"};

// Some extra characters that Chrome gets wrong, and substitutes with
// something else on the wire.
var extra_escapable = /[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g,
    extra_lookup;

// JSON Quote string. Use native implementation when possible.
var JSONQuote = (JSON && JSON.stringify) || function(string) {
    json_escapable.lastIndex = 0;
    if (json_escapable.test(string)) {
        string = string.replace(json_escapable, function(a) {
            return json_lookup[a];
        });
    }
    return '"' + string + '"';
};

// This may be quite slow, so let's delay until user actually uses bad
// characters.
var unroll_lookup = function(escapable) {
    var i;
    var unrolled = {}
    var c = []
    for(i=0; i<65536; i++) {
        c.push( String.fromCharCode(i) );
    }
    escapable.lastIndex = 0;
    c.join('').replace(escapable, function (a) {
        unrolled[ a ] = '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        return '';
    });
    escapable.lastIndex = 0;
    return unrolled;
};

// Quote string, also taking care of unicode characters that browsers
// often break. Especially, take care of unicode surrogates:
//    http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters#Surrogates
utils.quote = function(string) {
    var quoted = JSONQuote(string);

    // In most cases this should be very fast and good enough.
    extra_escapable.lastIndex = 0;
    if(!extra_escapable.test(quoted)) {
        return quoted;
    }

    if(!extra_lookup) extra_lookup = unroll_lookup(extra_escapable);

    return quoted.replace(extra_escapable, function(a) {
        return extra_lookup[a];
    });
}

var _all_protocols = ['websocket',
                      'xdr-streaming',
                      'xhr-streaming',
                      'iframe-eventsource',
                      'iframe-htmlfile',
                      'xdr-polling',
                      'xhr-polling',
                      'iframe-xhr-polling',
                      'jsonp-polling'];

utils.probeProtocols = function() {
    var probed = {};
    for(var i=0; i<_all_protocols.length; i++) {
        var protocol = _all_protocols[i];
        // User can have a typo in protocol name.
        probed[protocol] = SockJS[protocol] &&
                           SockJS[protocol].enabled();
    }
    return probed;
};

utils.detectProtocols = function(probed, protocols_whitelist, info) {
    var pe = {},
        protocols = [];
    if (!protocols_whitelist) protocols_whitelist = _all_protocols;
    for(var i=0; i<protocols_whitelist.length; i++) {
        var protocol = protocols_whitelist[i];
        pe[protocol] = probed[protocol];
    }
    var maybe_push = function(protos) {
        var proto = protos.shift();
        if (pe[proto]) {
            protocols.push(proto);
        } else {
            if (protos.length > 0) {
                maybe_push(protos);
            }
        }
    }

    // 1. Websocket
    if (info.websocket !== false) {
        maybe_push(['websocket']);
    }

    // 2. Streaming
    if (pe['xhr-streaming'] && !info.null_origin) {
        protocols.push('xhr-streaming');
    } else {
        if (pe['xdr-streaming'] && !info.cookie_needed && !info.null_origin) {
            protocols.push('xdr-streaming');
        } else {
            maybe_push(['iframe-eventsource',
                        'iframe-htmlfile']);
        }
    }

    // 3. Polling
    if (pe['xhr-polling'] && !info.null_origin) {
        protocols.push('xhr-polling');
    } else {
        if (pe['xdr-polling'] && !info.cookie_needed && !info.null_origin) {
            protocols.push('xdr-polling');
        } else {
            maybe_push(['iframe-xhr-polling',
                        'jsonp-polling']);
        }
    }
    return protocols;
}
//         [*] End of lib/utils.js


//         [*] Including lib/dom.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// May be used by htmlfile jsonp and transports.
var MPrefix = '_sockjs_global';
utils.createHook = function() {
    var window_id = 'a' + utils.random_string(8);
    if (!(MPrefix in _window)) {
        var map = {};
        _window[MPrefix] = function(window_id) {
            if (!(window_id in map)) {
                map[window_id] = {
                    id: window_id,
                    del: function() {delete map[window_id];}
                };
            }
            return map[window_id];
        }
    }
    return _window[MPrefix](window_id);
};



utils.attachMessage = function(listener) {
    utils.attachEvent('message', listener);
};
utils.attachEvent = function(event, listener) {
    if (typeof _window.addEventListener !== 'undefined') {
        _window.addEventListener(event, listener, false);
    } else {
        // IE quirks.
        // According to: http://stevesouders.com/misc/test-postmessage.php
        // the message gets delivered only to 'document', not 'window'.
        _document.attachEvent("on" + event, listener);
        // I get 'window' for ie8.
        _window.attachEvent("on" + event, listener);
    }
};

utils.detachMessage = function(listener) {
    utils.detachEvent('message', listener);
};
utils.detachEvent = function(event, listener) {
    if (typeof _window.addEventListener !== 'undefined') {
        _window.removeEventListener(event, listener, false);
    } else {
        _document.detachEvent("on" + event, listener);
        _window.detachEvent("on" + event, listener);
    }
};


var on_unload = {};
// Things registered after beforeunload are to be called immediately.
var after_unload = false;

var trigger_unload_callbacks = function() {
    for(var ref in on_unload) {
        on_unload[ref]();
        delete on_unload[ref];
    };
};

var unload_triggered = function() {
    if(after_unload) return;
    after_unload = true;
    trigger_unload_callbacks();
};

// 'unload' alone is not reliable in opera within an iframe, but we
// can't use `beforeunload` as IE fires it on javascript: links.
utils.attachEvent('unload', unload_triggered);

utils.unload_add = function(listener) {
    var ref = utils.random_string(8);
    on_unload[ref] = listener;
    if (after_unload) {
        utils.delay(trigger_unload_callbacks);
    }
    return ref;
};
utils.unload_del = function(ref) {
    if (ref in on_unload)
        delete on_unload[ref];
};


utils.createIframe = function (iframe_url, error_callback) {
    var iframe = _document.createElement('iframe');
    var tref, unload_ref;
    var unattach = function() {
        clearTimeout(tref);
        // Explorer had problems with that.
        try {iframe.onload = null;} catch (x) {}
        iframe.onerror = null;
    };
    var cleanup = function() {
        if (iframe) {
            unattach();
            // This timeout makes chrome fire onbeforeunload event
            // within iframe. Without the timeout it goes straight to
            // onunload.
            setTimeout(function() {
                if(iframe) {
                    iframe.parentNode.removeChild(iframe);
                }
                iframe = null;
            }, 0);
            utils.unload_del(unload_ref);
        }
    };
    var onerror = function(r) {
        if (iframe) {
            cleanup();
            error_callback(r);
        }
    };
    var post = function(msg, origin) {
        try {
            // When the iframe is not loaded, IE raises an exception
            // on 'contentWindow'.
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage(msg, origin);
            }
        } catch (x) {};
    };

    iframe.src = iframe_url;
    iframe.style.display = 'none';
    iframe.style.position = 'absolute';
    iframe.onerror = function(){onerror('onerror');};
    iframe.onload = function() {
        // `onload` is triggered before scripts on the iframe are
        // executed. Give it few seconds to actually load stuff.
        clearTimeout(tref);
        tref = setTimeout(function(){onerror('onload timeout');}, 2000);
    };
    _document.body.appendChild(iframe);
    tref = setTimeout(function(){onerror('timeout');}, 15000);
    unload_ref = utils.unload_add(cleanup);
    return {
        post: post,
        cleanup: cleanup,
        loaded: unattach
    };
};

utils.createHtmlfile = function (iframe_url, error_callback) {
    var doc = new ActiveXObject('htmlfile');
    var tref, unload_ref;
    var iframe;
    var unattach = function() {
        clearTimeout(tref);
    };
    var cleanup = function() {
        if (doc) {
            unattach();
            utils.unload_del(unload_ref);
            iframe.parentNode.removeChild(iframe);
            iframe = doc = null;
            CollectGarbage();
        }
    };
    var onerror = function(r)  {
        if (doc) {
            cleanup();
            error_callback(r);
        }
    };
    var post = function(msg, origin) {
        try {
            // When the iframe is not loaded, IE raises an exception
            // on 'contentWindow'.
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage(msg, origin);
            }
        } catch (x) {};
    };

    doc.open();
    doc.write('<html><s' + 'cript>' +
              'document.domain="' + document.domain + '";' +
              '</s' + 'cript></html>');
    doc.close();
    doc.parentWindow[WPrefix] = _window[WPrefix];
    var c = doc.createElement('div');
    doc.body.appendChild(c);
    iframe = doc.createElement('iframe');
    c.appendChild(iframe);
    iframe.src = iframe_url;
    tref = setTimeout(function(){onerror('timeout');}, 15000);
    unload_ref = utils.unload_add(cleanup);
    return {
        post: post,
        cleanup: cleanup,
        loaded: unattach
    };
};
//         [*] End of lib/dom.js


//         [*] Including lib/dom2.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var AbstractXHRObject = function(){};
AbstractXHRObject.prototype = new EventEmitter(['chunk', 'finish']);

AbstractXHRObject.prototype._start = function(method, url, payload, opts) {
    var that = this;

    try {
        that.xhr = new XMLHttpRequest();
    } catch(x) {};

    if (!that.xhr) {
        try {
            that.xhr = new _window.ActiveXObject('Microsoft.XMLHTTP');
        } catch(x) {};
    }
    if (_window.ActiveXObject || _window.XDomainRequest) {
        // IE8 caches even POSTs
        url += ((url.indexOf('?') === -1) ? '?' : '&') + 't='+(+new Date);
    }

    // Explorer tends to keep connection open, even after the
    // tab gets closed: http://bugs.jquery.com/ticket/5280
    that.unload_ref = utils.unload_add(function(){that._cleanup(true);});
    try {
        that.xhr.open(method, url, true);
    } catch(e) {
        // IE raises an exception on wrong port.
        that.emit('finish', 0, '');
        that._cleanup();
        return;
    };

    if (!opts || !opts.no_credentials) {
        // Mozilla docs says https://developer.mozilla.org/en/XMLHttpRequest :
        // "This never affects same-site requests."
        that.xhr.withCredentials = 'true';
    }
    if (opts && opts.headers) {
        for(var key in opts.headers) {
            that.xhr.setRequestHeader(key, opts.headers[key]);
        }
    }

    that.xhr.onreadystatechange = function() {
        if (that.xhr) {
            var x = that.xhr;
            switch (x.readyState) {
            case 3:
                // IE doesn't like peeking into responseText or status
                // on Microsoft.XMLHTTP and readystate=3
                try {
                    var status = x.status;
                    var text = x.responseText;
                } catch (x) {};
                // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
                if (status === 1223) status = 204;

                // IE does return readystate == 3 for 404 answers.
                if (text && text.length > 0) {
                    that.emit('chunk', status, text);
                }
                break;
            case 4:
                var status = x.status;
                // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
                if (status === 1223) status = 204;

                that.emit('finish', status, x.responseText);
                that._cleanup(false);
                break;
            }
        }
    };
    that.xhr.send(payload);
};

AbstractXHRObject.prototype._cleanup = function(abort) {
    var that = this;
    if (!that.xhr) return;
    utils.unload_del(that.unload_ref);

    // IE needs this field to be a function
    that.xhr.onreadystatechange = function(){};

    if (abort) {
        try {
            that.xhr.abort();
        } catch(x) {};
    }
    that.unload_ref = that.xhr = null;
};

AbstractXHRObject.prototype.close = function() {
    var that = this;
    that.nuke();
    that._cleanup(true);
};

var XHRCorsObject = utils.XHRCorsObject = function() {
    var that = this, args = arguments;
    utils.delay(function(){that._start.apply(that, args);});
};
XHRCorsObject.prototype = new AbstractXHRObject();

var XHRLocalObject = utils.XHRLocalObject = function(method, url, payload) {
    var that = this;
    utils.delay(function(){
        that._start(method, url, payload, {
            no_credentials: true
        });
    });
};
XHRLocalObject.prototype = new AbstractXHRObject();



// References:
//   http://ajaxian.com/archives/100-line-ajax-wrapper
//   http://msdn.microsoft.com/en-us/library/cc288060(v=VS.85).aspx
var XDRObject = utils.XDRObject = function(method, url, payload) {
    var that = this;
    utils.delay(function(){that._start(method, url, payload);});
};
XDRObject.prototype = new EventEmitter(['chunk', 'finish']);
XDRObject.prototype._start = function(method, url, payload) {
    var that = this;
    var xdr = new XDomainRequest();
    // IE caches even POSTs
    url += ((url.indexOf('?') === -1) ? '?' : '&') + 't='+(+new Date);

    var onerror = xdr.ontimeout = xdr.onerror = function() {
        that.emit('finish', 0, '');
        that._cleanup(false);
    };
    xdr.onprogress = function() {
        that.emit('chunk', 200, xdr.responseText);
    };
    xdr.onload = function() {
        that.emit('finish', 200, xdr.responseText);
        that._cleanup(false);
    };
    that.xdr = xdr;
    that.unload_ref = utils.unload_add(function(){that._cleanup(true);});
    try {
        // Fails with AccessDenied if port number is bogus
        that.xdr.open(method, url);
        that.xdr.send(payload);
    } catch(x) {
        onerror();
    }
};

XDRObject.prototype._cleanup = function(abort) {
    var that = this;
    if (!that.xdr) return;
    utils.unload_del(that.unload_ref);

    that.xdr.ontimeout = that.xdr.onerror = that.xdr.onprogress =
        that.xdr.onload = null;
    if (abort) {
        try {
            that.xdr.abort();
        } catch(x) {};
    }
    that.unload_ref = that.xdr = null;
};

XDRObject.prototype.close = function() {
    var that = this;
    that.nuke();
    that._cleanup(true);
};

// 1. Is natively via XHR
// 2. Is natively via XDR
// 3. Nope, but postMessage is there so it should work via the Iframe.
// 4. Nope, sorry.
utils.isXHRCorsCapable = function() {
    if (_window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest()) {
        return 1;
    }
    // XDomainRequest doesn't work if page is served from file://
    if (_window.XDomainRequest && _document.domain) {
        return 2;
    }
    if (IframeTransport.enabled()) {
        return 3;
    }
    return 4;
};
//         [*] End of lib/dom2.js


//         [*] Including lib/sockjs.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var SockJS = function(url, dep_protocols_whitelist, options) {
    if (this === _window) {
        // makes `new` optional
        return new SockJS(url, dep_protocols_whitelist, options);
    }
    
    var that = this, protocols_whitelist;
    that._options = {devel: false, debug: false, protocols_whitelist: [],
                     info: undefined, rtt: undefined};
    if (options) {
        utils.objectExtend(that._options, options);
    }
    that._base_url = utils.amendUrl(url);
    that._server = that._options.server || utils.random_number_string(1000);
    if (that._options.protocols_whitelist &&
        that._options.protocols_whitelist.length) {
        protocols_whitelist = that._options.protocols_whitelist;
    } else {
        // Deprecated API
        if (typeof dep_protocols_whitelist === 'string' &&
            dep_protocols_whitelist.length > 0) {
            protocols_whitelist = [dep_protocols_whitelist];
        } else if (utils.isArray(dep_protocols_whitelist)) {
            protocols_whitelist = dep_protocols_whitelist
        } else {
            protocols_whitelist = null;
        }
        if (protocols_whitelist) {
            that._debug('Deprecated API: Use "protocols_whitelist" option ' +
                        'instead of supplying protocol list as a second ' +
                        'parameter to SockJS constructor.');
        }
    }
    that._protocols = [];
    that.protocol = null;
    that.readyState = SockJS.CONNECTING;
    that._ir = createInfoReceiver(that._base_url);
    that._ir.onfinish = function(info, rtt) {
        that._ir = null;
        if (info) {
            if (that._options.info) {
                // Override if user supplies the option
                info = utils.objectExtend(info, that._options.info);
            }
            if (that._options.rtt) {
                rtt = that._options.rtt;
            }
            that._applyInfo(info, rtt, protocols_whitelist);
            that._didClose();
        } else {
            that._didClose(1002, 'Can\'t connect to server', true);
        }
    };
};
// Inheritance
SockJS.prototype = new REventTarget();

SockJS.version = "0.3.4";

SockJS.CONNECTING = 0;
SockJS.OPEN = 1;
SockJS.CLOSING = 2;
SockJS.CLOSED = 3;

SockJS.prototype._debug = function() {
    if (this._options.debug)
        utils.log.apply(utils, arguments);
};

SockJS.prototype._dispatchOpen = function() {
    var that = this;
    if (that.readyState === SockJS.CONNECTING) {
        if (that._transport_tref) {
            clearTimeout(that._transport_tref);
            that._transport_tref = null;
        }
        that.readyState = SockJS.OPEN;
        that.dispatchEvent(new SimpleEvent("open"));
    } else {
        // The server might have been restarted, and lost track of our
        // connection.
        that._didClose(1006, "Server lost session");
    }
};

SockJS.prototype._dispatchMessage = function(data) {
    var that = this;
    if (that.readyState !== SockJS.OPEN)
            return;
    that.dispatchEvent(new SimpleEvent("message", {data: data}));
};

SockJS.prototype._dispatchHeartbeat = function(data) {
    var that = this;
    if (that.readyState !== SockJS.OPEN)
        return;
    that.dispatchEvent(new SimpleEvent('heartbeat', {}));
};

SockJS.prototype._didClose = function(code, reason, force) {
    var that = this;
    if (that.readyState !== SockJS.CONNECTING &&
        that.readyState !== SockJS.OPEN &&
        that.readyState !== SockJS.CLOSING)
            throw new Error('INVALID_STATE_ERR');
    if (that._ir) {
        that._ir.nuke();
        that._ir = null;
    }

    if (that._transport) {
        that._transport.doCleanup();
        that._transport = null;
    }

    var close_event = new SimpleEvent("close", {
        code: code,
        reason: reason,
        wasClean: utils.userSetCode(code)});

    if (!utils.userSetCode(code) &&
        that.readyState === SockJS.CONNECTING && !force) {
        if (that._try_next_protocol(close_event)) {
            return;
        }
        close_event = new SimpleEvent("close", {code: 2000,
                                                reason: "All transports failed",
                                                wasClean: false,
                                                last_event: close_event});
    }
    that.readyState = SockJS.CLOSED;

    utils.delay(function() {
                   that.dispatchEvent(close_event);
                });
};

SockJS.prototype._didMessage = function(data) {
    var that = this;
    var type = data.slice(0, 1);
    switch(type) {
    case 'o':
        that._dispatchOpen();
        break;
    case 'a':
        var payload = JSON.parse(data.slice(1) || '[]');
        for(var i=0; i < payload.length; i++){
            that._dispatchMessage(payload[i]);
        }
        break;
    case 'm':
        var payload = JSON.parse(data.slice(1) || 'null');
        that._dispatchMessage(payload);
        break;
    case 'c':
        var payload = JSON.parse(data.slice(1) || '[]');
        that._didClose(payload[0], payload[1]);
        break;
    case 'h':
        that._dispatchHeartbeat();
        break;
    }
};

SockJS.prototype._try_next_protocol = function(close_event) {
    var that = this;
    if (that.protocol) {
        that._debug('Closed transport:', that.protocol, ''+close_event);
        that.protocol = null;
    }
    if (that._transport_tref) {
        clearTimeout(that._transport_tref);
        that._transport_tref = null;
    }

    while(1) {
        var protocol = that.protocol = that._protocols.shift();
        if (!protocol) {
            return false;
        }
        // Some protocols require access to `body`, what if were in
        // the `head`?
        if (SockJS[protocol] &&
            SockJS[protocol].need_body === true &&
            (!_document.body ||
             (typeof _document.readyState !== 'undefined'
              && _document.readyState !== 'complete'))) {
            that._protocols.unshift(protocol);
            that.protocol = 'waiting-for-load';
            utils.attachEvent('load', function(){
                that._try_next_protocol();
            });
            return true;
        }

        if (!SockJS[protocol] ||
              !SockJS[protocol].enabled(that._options)) {
            that._debug('Skipping transport:', protocol);
        } else {
            var roundTrips = SockJS[protocol].roundTrips || 1;
            var to = ((that._options.rto || 0) * roundTrips) || 5000;
            that._transport_tref = utils.delay(to, function() {
                if (that.readyState === SockJS.CONNECTING) {
                    // I can't understand how it is possible to run
                    // this timer, when the state is CLOSED, but
                    // apparently in IE everythin is possible.
                    that._didClose(2007, "Transport timeouted");
                }
            });

            var connid = utils.random_string(8);
            var trans_url = that._base_url + '/' + that._server + '/' + connid;
            that._debug('Opening transport:', protocol, ' url:'+trans_url,
                        ' RTO:'+that._options.rto);
            that._transport = new SockJS[protocol](that, trans_url,
                                                   that._base_url);
            return true;
        }
    }
};

SockJS.prototype.close = function(code, reason) {
    var that = this;
    if (code && !utils.userSetCode(code))
        throw new Error("INVALID_ACCESS_ERR");
    if(that.readyState !== SockJS.CONNECTING &&
       that.readyState !== SockJS.OPEN) {
        return false;
    }
    that.readyState = SockJS.CLOSING;
    that._didClose(code || 1000, reason || "Normal closure");
    return true;
};

SockJS.prototype.send = function(data) {
    var that = this;
    if (that.readyState === SockJS.CONNECTING)
        throw new Error('INVALID_STATE_ERR');
    if (that.readyState === SockJS.OPEN) {
        that._transport.doSend(utils.quote('' + data));
    }
    return true;
};

SockJS.prototype._applyInfo = function(info, rtt, protocols_whitelist) {
    var that = this;
    that._options.info = info;
    that._options.rtt = rtt;
    that._options.rto = utils.countRTO(rtt);
    that._options.info.null_origin = !_document.domain;
    var probed = utils.probeProtocols();
    that._protocols = utils.detectProtocols(probed, protocols_whitelist, info);
};
//         [*] End of lib/sockjs.js


//         [*] Including lib/trans-websocket.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var WebSocketTransport = SockJS.websocket = function(ri, trans_url) {
    var that = this;
    var url = trans_url + '/websocket';
    if (url.slice(0, 5) === 'https') {
        url = 'wss' + url.slice(5);
    } else {
        url = 'ws' + url.slice(4);
    }
    that.ri = ri;
    that.url = url;
    var Constructor = _window.WebSocket || _window.MozWebSocket;

    that.ws = new Constructor(that.url);
    that.ws.onmessage = function(e) {
        that.ri._didMessage(e.data);
    };
    // Firefox has an interesting bug. If a websocket connection is
    // created after onunload, it stays alive even when user
    // navigates away from the page. In such situation let's lie -
    // let's not open the ws connection at all. See:
    // https://github.com/sockjs/sockjs-client/issues/28
    // https://bugzilla.mozilla.org/show_bug.cgi?id=696085
    that.unload_ref = utils.unload_add(function(){that.ws.close()});
    that.ws.onclose = function() {
        that.ri._didMessage(utils.closeFrame(1006, "WebSocket connection broken"));
    };
};

WebSocketTransport.prototype.doSend = function(data) {
    this.ws.send('[' + data + ']');
};

WebSocketTransport.prototype.doCleanup = function() {
    var that = this;
    var ws = that.ws;
    if (ws) {
        ws.onmessage = ws.onclose = null;
        ws.close();
        utils.unload_del(that.unload_ref);
        that.unload_ref = that.ri = that.ws = null;
    }
};

WebSocketTransport.enabled = function() {
    return !!(_window.WebSocket || _window.MozWebSocket);
};

// In theory, ws should require 1 round trip. But in chrome, this is
// not very stable over SSL. Most likely a ws connection requires a
// separate SSL connection, in which case 2 round trips are an
// absolute minumum.
WebSocketTransport.roundTrips = 2;
//         [*] End of lib/trans-websocket.js


//         [*] Including lib/trans-sender.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var BufferedSender = function() {};
BufferedSender.prototype.send_constructor = function(sender) {
    var that = this;
    that.send_buffer = [];
    that.sender = sender;
};
BufferedSender.prototype.doSend = function(message) {
    var that = this;
    that.send_buffer.push(message);
    if (!that.send_stop) {
        that.send_schedule();
    }
};

// For polling transports in a situation when in the message callback,
// new message is being send. If the sending connection was started
// before receiving one, it is possible to saturate the network and
// timeout due to the lack of receiving socket. To avoid that we delay
// sending messages by some small time, in order to let receiving
// connection be started beforehand. This is only a halfmeasure and
// does not fix the big problem, but it does make the tests go more
// stable on slow networks.
BufferedSender.prototype.send_schedule_wait = function() {
    var that = this;
    var tref;
    that.send_stop = function() {
        that.send_stop = null;
        clearTimeout(tref);
    };
    tref = utils.delay(25, function() {
        that.send_stop = null;
        that.send_schedule();
    });
};

BufferedSender.prototype.send_schedule = function() {
    var that = this;
    if (that.send_buffer.length > 0) {
        var payload = '[' + that.send_buffer.join(',') + ']';
        that.send_stop = that.sender(that.trans_url, payload, function(success, abort_reason) {
            that.send_stop = null;
            if (success === false) {
                that.ri._didClose(1006, 'Sending error ' + abort_reason);
            } else {
                that.send_schedule_wait();
            }
        });
        that.send_buffer = [];
    }
};

BufferedSender.prototype.send_destructor = function() {
    var that = this;
    if (that._send_stop) {
        that._send_stop();
    }
    that._send_stop = null;
};

var jsonPGenericSender = function(url, payload, callback) {
    var that = this;

    if (!('_send_form' in that)) {
        var form = that._send_form = _document.createElement('form');
        var area = that._send_area = _document.createElement('textarea');
        area.name = 'd';
        form.style.display = 'none';
        form.style.position = 'absolute';
        form.method = 'POST';
        form.enctype = 'application/x-www-form-urlencoded';
        form.acceptCharset = "UTF-8";
        form.appendChild(area);
        _document.body.appendChild(form);
    }
    var form = that._send_form;
    var area = that._send_area;
    var id = 'a' + utils.random_string(8);
    form.target = id;
    form.action = url + '/jsonp_send?i=' + id;

    var iframe;
    try {
        // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
        iframe = _document.createElement('<iframe name="'+ id +'">');
    } catch(x) {
        iframe = _document.createElement('iframe');
        iframe.name = id;
    }
    iframe.id = id;
    form.appendChild(iframe);
    iframe.style.display = 'none';

    try {
        area.value = payload;
    } catch(e) {
        utils.log('Your browser is seriously broken. Go home! ' + e.message);
    }
    form.submit();

    var completed = function(e) {
        if (!iframe.onerror) return;
        iframe.onreadystatechange = iframe.onerror = iframe.onload = null;
        // Opera mini doesn't like if we GC iframe
        // immediately, thus this timeout.
        utils.delay(500, function() {
                       iframe.parentNode.removeChild(iframe);
                       iframe = null;
                   });
        area.value = '';
        // It is not possible to detect if the iframe succeeded or
        // failed to submit our form.
        callback(true);
    };
    iframe.onerror = iframe.onload = completed;
    iframe.onreadystatechange = function(e) {
        if (iframe.readyState == 'complete') completed();
    };
    return completed;
};

var createAjaxSender = function(AjaxObject) {
    return function(url, payload, callback) {
        var xo = new AjaxObject('POST', url + '/xhr_send', payload);
        xo.onfinish = function(status, text) {
            callback(status === 200 || status === 204,
                     'http status ' + status);
        };
        return function(abort_reason) {
            callback(false, abort_reason);
        };
    };
};
//         [*] End of lib/trans-sender.js


//         [*] Including lib/trans-jsonp-receiver.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// Parts derived from Socket.io:
//    https://github.com/LearnBoost/socket.io/blob/0.6.17/lib/socket.io/transports/jsonp-polling.js
// and jQuery-JSONP:
//    https://code.google.com/p/jquery-jsonp/source/browse/trunk/core/jquery.jsonp.js
var jsonPGenericReceiver = function(url, callback) {
    var tref;
    var script = _document.createElement('script');
    var script2;  // Opera synchronous load trick.
    var close_script = function(frame) {
        if (script2) {
            script2.parentNode.removeChild(script2);
            script2 = null;
        }
        if (script) {
            clearTimeout(tref);
            // Unfortunately, you can't really abort script loading of
            // the script.
            script.parentNode.removeChild(script);
            script.onreadystatechange = script.onerror =
                script.onload = script.onclick = null;
            script = null;
            callback(frame);
            callback = null;
        }
    };

    // IE9 fires 'error' event after orsc or before, in random order.
    var loaded_okay = false;
    var error_timer = null;

    script.id = 'a' + utils.random_string(8);
    script.src = url;
    script.type = 'text/javascript';
    script.charset = 'UTF-8';
    script.onerror = function(e) {
        if (!error_timer) {
            // Delay firing close_script.
            error_timer = setTimeout(function() {
                if (!loaded_okay) {
                    close_script(utils.closeFrame(
                        1006,
                        "JSONP script loaded abnormally (onerror)"));
                }
            }, 1000);
        }
    };
    script.onload = function(e) {
        close_script(utils.closeFrame(1006, "JSONP script loaded abnormally (onload)"));
    };

    script.onreadystatechange = function(e) {
        if (/loaded|closed/.test(script.readyState)) {
            if (script && script.htmlFor && script.onclick) {
                loaded_okay = true;
                try {
                    // In IE, actually execute the script.
                    script.onclick();
                } catch (x) {}
            }
            if (script) {
                close_script(utils.closeFrame(1006, "JSONP script loaded abnormally (onreadystatechange)"));
            }
        }
    };
    // IE: event/htmlFor/onclick trick.
    // One can't rely on proper order for onreadystatechange. In order to
    // make sure, set a 'htmlFor' and 'event' properties, so that
    // script code will be installed as 'onclick' handler for the
    // script object. Later, onreadystatechange, manually execute this
    // code. FF and Chrome doesn't work with 'event' and 'htmlFor'
    // set. For reference see:
    //   http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
    // Also, read on that about script ordering:
    //   http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
    if (typeof script.async === 'undefined' && _document.attachEvent) {
        // According to mozilla docs, in recent browsers script.async defaults
        // to 'true', so we may use it to detect a good browser:
        // https://developer.mozilla.org/en/HTML/Element/script
        if (!/opera/i.test(navigator.userAgent)) {
            // Naively assume we're in IE
            try {
                script.htmlFor = script.id;
                script.event = "onclick";
            } catch (x) {}
            script.async = true;
        } else {
            // Opera, second sync script hack
            script2 = _document.createElement('script');
            script2.text = "try{var a = document.getElementById('"+script.id+"'); if(a)a.onerror();}catch(x){};";
            script.async = script2.async = false;
        }
    }
    if (typeof script.async !== 'undefined') {
        script.async = true;
    }

    // Fallback mostly for Konqueror - stupid timer, 35 seconds shall be plenty.
    tref = setTimeout(function() {
                          close_script(utils.closeFrame(1006, "JSONP script loaded abnormally (timeout)"));
                      }, 35000);

    var head = _document.getElementsByTagName('head')[0];
    head.insertBefore(script, head.firstChild);
    if (script2) {
        head.insertBefore(script2, head.firstChild);
    }
    return close_script;
};
//         [*] End of lib/trans-jsonp-receiver.js


//         [*] Including lib/trans-jsonp-polling.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// The simplest and most robust transport, using the well-know cross
// domain hack - JSONP. This transport is quite inefficient - one
// mssage could use up to one http request. But at least it works almost
// everywhere.
// Known limitations:
//   o you will get a spinning cursor
//   o for Konqueror a dumb timer is needed to detect errors


var JsonPTransport = SockJS['jsonp-polling'] = function(ri, trans_url) {
    utils.polluteGlobalNamespace();
    var that = this;
    that.ri = ri;
    that.trans_url = trans_url;
    that.send_constructor(jsonPGenericSender);
    that._schedule_recv();
};

// Inheritnace
JsonPTransport.prototype = new BufferedSender();

JsonPTransport.prototype._schedule_recv = function() {
    var that = this;
    var callback = function(data) {
        that._recv_stop = null;
        if (data) {
            // no data - heartbeat;
            if (!that._is_closing) {
                that.ri._didMessage(data);
            }
        }
        // The message can be a close message, and change is_closing state.
        if (!that._is_closing) {
            that._schedule_recv();
        }
    };
    that._recv_stop = jsonPReceiverWrapper(that.trans_url + '/jsonp',
                                           jsonPGenericReceiver, callback);
};

JsonPTransport.enabled = function() {
    return true;
};

JsonPTransport.need_body = true;


JsonPTransport.prototype.doCleanup = function() {
    var that = this;
    that._is_closing = true;
    if (that._recv_stop) {
        that._recv_stop();
    }
    that.ri = that._recv_stop = null;
    that.send_destructor();
};


// Abstract away code that handles global namespace pollution.
var jsonPReceiverWrapper = function(url, constructReceiver, user_callback) {
    var id = 'a' + utils.random_string(6);
    var url_id = url + '?c=' + escape(WPrefix + '.' + id);

    // Unfortunately it is not possible to abort loading of the
    // script. We need to keep track of frake close frames.
    var aborting = 0;

    // Callback will be called exactly once.
    var callback = function(frame) {
        switch(aborting) {
        case 0:
            // Normal behaviour - delete hook _and_ emit message.
            delete _window[WPrefix][id];
            user_callback(frame);
            break;
        case 1:
            // Fake close frame - emit but don't delete hook.
            user_callback(frame);
            aborting = 2;
            break;
        case 2:
            // Got frame after connection was closed, delete hook, don't emit.
            delete _window[WPrefix][id];
            break;
        }
    };

    var close_script = constructReceiver(url_id, callback);
    _window[WPrefix][id] = close_script;
    var stop = function() {
        if (_window[WPrefix][id]) {
            aborting = 1;
            _window[WPrefix][id](utils.closeFrame(1000, "JSONP user aborted read"));
        }
    };
    return stop;
};
//         [*] End of lib/trans-jsonp-polling.js


//         [*] Including lib/trans-xhr.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var AjaxBasedTransport = function() {};
AjaxBasedTransport.prototype = new BufferedSender();

AjaxBasedTransport.prototype.run = function(ri, trans_url,
                                            url_suffix, Receiver, AjaxObject) {
    var that = this;
    that.ri = ri;
    that.trans_url = trans_url;
    that.send_constructor(createAjaxSender(AjaxObject));
    that.poll = new Polling(ri, Receiver,
                            trans_url + url_suffix, AjaxObject);
};

AjaxBasedTransport.prototype.doCleanup = function() {
    var that = this;
    if (that.poll) {
        that.poll.abort();
        that.poll = null;
    }
};

// xhr-streaming
var XhrStreamingTransport = SockJS['xhr-streaming'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr_streaming', XhrReceiver, utils.XHRCorsObject);
};

XhrStreamingTransport.prototype = new AjaxBasedTransport();

XhrStreamingTransport.enabled = function() {
    // Support for CORS Ajax aka Ajax2? Opera 12 claims CORS but
    // doesn't do streaming.
    return (_window.XMLHttpRequest &&
            'withCredentials' in new XMLHttpRequest() &&
            (!/opera/i.test(navigator.userAgent)));
};
XhrStreamingTransport.roundTrips = 2; // preflight, ajax

// Safari gets confused when a streaming ajax request is started
// before onload. This causes the load indicator to spin indefinetely.
XhrStreamingTransport.need_body = true;


// According to:
//   http://stackoverflow.com/questions/1641507/detect-browser-support-for-cross-domain-xmlhttprequests
//   http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/


// xdr-streaming
var XdrStreamingTransport = SockJS['xdr-streaming'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr_streaming', XhrReceiver, utils.XDRObject);
};

XdrStreamingTransport.prototype = new AjaxBasedTransport();

XdrStreamingTransport.enabled = function() {
    return !!_window.XDomainRequest;
};
XdrStreamingTransport.roundTrips = 2; // preflight, ajax



// xhr-polling
var XhrPollingTransport = SockJS['xhr-polling'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr', XhrReceiver, utils.XHRCorsObject);
};

XhrPollingTransport.prototype = new AjaxBasedTransport();

XhrPollingTransport.enabled = XhrStreamingTransport.enabled;
XhrPollingTransport.roundTrips = 2; // preflight, ajax


// xdr-polling
var XdrPollingTransport = SockJS['xdr-polling'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr', XhrReceiver, utils.XDRObject);
};

XdrPollingTransport.prototype = new AjaxBasedTransport();

XdrPollingTransport.enabled = XdrStreamingTransport.enabled;
XdrPollingTransport.roundTrips = 2; // preflight, ajax
//         [*] End of lib/trans-xhr.js


//         [*] Including lib/trans-iframe.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// Few cool transports do work only for same-origin. In order to make
// them working cross-domain we shall use iframe, served form the
// remote domain. New browsers, have capabilities to communicate with
// cross domain iframe, using postMessage(). In IE it was implemented
// from IE 8+, but of course, IE got some details wrong:
//    http://msdn.microsoft.com/en-us/library/cc197015(v=VS.85).aspx
//    http://stevesouders.com/misc/test-postmessage.php

var IframeTransport = function() {};

IframeTransport.prototype.i_constructor = function(ri, trans_url, base_url) {
    var that = this;
    that.ri = ri;
    that.origin = utils.getOrigin(base_url);
    that.base_url = base_url;
    that.trans_url = trans_url;

    var iframe_url = base_url + '/iframe.html';
    if (that.ri._options.devel) {
        iframe_url += '?t=' + (+new Date);
    }
    that.window_id = utils.random_string(8);
    iframe_url += '#' + that.window_id;

    that.iframeObj = utils.createIframe(iframe_url, function(r) {
                                            that.ri._didClose(1006, "Unable to load an iframe (" + r + ")");
                                        });

    that.onmessage_cb = utils.bind(that.onmessage, that);
    utils.attachMessage(that.onmessage_cb);
};

IframeTransport.prototype.doCleanup = function() {
    var that = this;
    if (that.iframeObj) {
        utils.detachMessage(that.onmessage_cb);
        try {
            // When the iframe is not loaded, IE raises an exception
            // on 'contentWindow'.
            if (that.iframeObj.iframe.contentWindow) {
                that.postMessage('c');
            }
        } catch (x) {}
        that.iframeObj.cleanup();
        that.iframeObj = null;
        that.onmessage_cb = that.iframeObj = null;
    }
};

IframeTransport.prototype.onmessage = function(e) {
    var that = this;
    if (e.origin !== that.origin) return;
    var window_id = e.data.slice(0, 8);
    var type = e.data.slice(8, 9);
    var data = e.data.slice(9);

    if (window_id !== that.window_id) return;

    switch(type) {
    case 's':
        that.iframeObj.loaded();
        that.postMessage('s', JSON.stringify([SockJS.version, that.protocol, that.trans_url, that.base_url]));
        break;
    case 't':
        that.ri._didMessage(data);
        break;
    }
};

IframeTransport.prototype.postMessage = function(type, data) {
    var that = this;
    that.iframeObj.post(that.window_id + type + (data || ''), that.origin);
};

IframeTransport.prototype.doSend = function (message) {
    this.postMessage('m', message);
};

IframeTransport.enabled = function() {
    // postMessage misbehaves in konqueror 4.6.5 - the messages are delivered with
    // huge delay, or not at all.
    var konqueror = navigator && navigator.userAgent && navigator.userAgent.indexOf('Konqueror') !== -1;
    return ((typeof _window.postMessage === 'function' ||
            typeof _window.postMessage === 'object') && (!konqueror));
};
//         [*] End of lib/trans-iframe.js


//         [*] Including lib/trans-iframe-within.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var curr_window_id;

var postMessage = function (type, data) {
    if(parent !== _window) {
        parent.postMessage(curr_window_id + type + (data || ''), '*');
    } else {
        utils.log("Can't postMessage, no parent window.", type, data);
    }
};

var FacadeJS = function() {};
FacadeJS.prototype._didClose = function (code, reason) {
    postMessage('t', utils.closeFrame(code, reason));
};
FacadeJS.prototype._didMessage = function (frame) {
    postMessage('t', frame);
};
FacadeJS.prototype._doSend = function (data) {
    this._transport.doSend(data);
};
FacadeJS.prototype._doCleanup = function () {
    this._transport.doCleanup();
};

utils.parent_origin = undefined;

SockJS.bootstrap_iframe = function() {
    var facade;
    curr_window_id = _document.location.hash.slice(1);
    var onMessage = function(e) {
        if(e.source !== parent) return;
        if(typeof utils.parent_origin === 'undefined')
            utils.parent_origin = e.origin;
        if (e.origin !== utils.parent_origin) return;

        var window_id = e.data.slice(0, 8);
        var type = e.data.slice(8, 9);
        var data = e.data.slice(9);
        if (window_id !== curr_window_id) return;
        switch(type) {
        case 's':
            var p = JSON.parse(data);
            var version = p[0];
            var protocol = p[1];
            var trans_url = p[2];
            var base_url = p[3];
            if (version !== SockJS.version) {
                utils.log("Incompatibile SockJS! Main site uses:" +
                          " \"" + version + "\", the iframe:" +
                          " \"" + SockJS.version + "\".");
            }
            if (!utils.flatUrl(trans_url) || !utils.flatUrl(base_url)) {
                utils.log("Only basic urls are supported in SockJS");
                return;
            }

            if (!utils.isSameOriginUrl(trans_url) ||
                !utils.isSameOriginUrl(base_url)) {
                utils.log("Can't connect to different domain from within an " +
                          "iframe. (" + JSON.stringify([_window.location.href, trans_url, base_url]) +
                          ")");
                return;
            }
            facade = new FacadeJS();
            facade._transport = new FacadeJS[protocol](facade, trans_url, base_url);
            break;
        case 'm':
            facade._doSend(data);
            break;
        case 'c':
            if (facade)
                facade._doCleanup();
            facade = null;
            break;
        }
    };

    // alert('test ticker');
    // facade = new FacadeJS();
    // facade._transport = new FacadeJS['w-iframe-xhr-polling'](facade, 'http://host.com:9999/ticker/12/basd');

    utils.attachMessage(onMessage);

    // Start
    postMessage('s');
};
//         [*] End of lib/trans-iframe-within.js


//         [*] Including lib/info.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var InfoReceiver = function(base_url, AjaxObject) {
    var that = this;
    utils.delay(function(){that.doXhr(base_url, AjaxObject);});
};

InfoReceiver.prototype = new EventEmitter(['finish']);

InfoReceiver.prototype.doXhr = function(base_url, AjaxObject) {
    var that = this;
    var t0 = (new Date()).getTime();
    var xo = new AjaxObject('GET', base_url + '/info');

    var tref = utils.delay(8000,
                           function(){xo.ontimeout();});

    xo.onfinish = function(status, text) {
        clearTimeout(tref);
        tref = null;
        if (status === 200) {
            var rtt = (new Date()).getTime() - t0;
            var info = JSON.parse(text);
            if (typeof info !== 'object') info = {};
            that.emit('finish', info, rtt);
        } else {
            that.emit('finish');
        }
    };
    xo.ontimeout = function() {
        xo.close();
        that.emit('finish');
    };
};

var InfoReceiverIframe = function(base_url) {
    var that = this;
    var go = function() {
        var ifr = new IframeTransport();
        ifr.protocol = 'w-iframe-info-receiver';
        var fun = function(r) {
            if (typeof r === 'string' && r.substr(0,1) === 'm') {
                var d = JSON.parse(r.substr(1));
                var info = d[0], rtt = d[1];
                that.emit('finish', info, rtt);
            } else {
                that.emit('finish');
            }
            ifr.doCleanup();
            ifr = null;
        };
        var mock_ri = {
            _options: {},
            _didClose: fun,
            _didMessage: fun
        };
        ifr.i_constructor(mock_ri, base_url, base_url);
    }
    if(!_document.body) {
        utils.attachEvent('load', go);
    } else {
        go();
    }
};
InfoReceiverIframe.prototype = new EventEmitter(['finish']);


var InfoReceiverFake = function() {
    // It may not be possible to do cross domain AJAX to get the info
    // data, for example for IE7. But we want to run JSONP, so let's
    // fake the response, with rtt=2s (rto=6s).
    var that = this;
    utils.delay(function() {
        that.emit('finish', {}, 2000);
    });
};
InfoReceiverFake.prototype = new EventEmitter(['finish']);

var createInfoReceiver = function(base_url) {
    if (utils.isSameOriginUrl(base_url)) {
        // If, for some reason, we have SockJS locally - there's no
        // need to start up the complex machinery. Just use ajax.
        return new InfoReceiver(base_url, utils.XHRLocalObject);
    }
    switch (utils.isXHRCorsCapable()) {
    case 1:
        // XHRLocalObject -> no_credentials=true
        return new InfoReceiver(base_url, utils.XHRLocalObject);
    case 2:
        return new InfoReceiver(base_url, utils.XDRObject);
    case 3:
        // Opera
        return new InfoReceiverIframe(base_url);
    default:
        // IE 7
        return new InfoReceiverFake();
    };
};


var WInfoReceiverIframe = FacadeJS['w-iframe-info-receiver'] = function(ri, _trans_url, base_url) {
    var ir = new InfoReceiver(base_url, utils.XHRLocalObject);
    ir.onfinish = function(info, rtt) {
        ri._didMessage('m'+JSON.stringify([info, rtt]));
        ri._didClose();
    }
};
WInfoReceiverIframe.prototype.doCleanup = function() {};
//         [*] End of lib/info.js


//         [*] Including lib/trans-iframe-eventsource.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var EventSourceIframeTransport = SockJS['iframe-eventsource'] = function () {
    var that = this;
    that.protocol = 'w-iframe-eventsource';
    that.i_constructor.apply(that, arguments);
};

EventSourceIframeTransport.prototype = new IframeTransport();

EventSourceIframeTransport.enabled = function () {
    return ('EventSource' in _window) && IframeTransport.enabled();
};

EventSourceIframeTransport.need_body = true;
EventSourceIframeTransport.roundTrips = 3; // html, javascript, eventsource


// w-iframe-eventsource
var EventSourceTransport = FacadeJS['w-iframe-eventsource'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/eventsource', EventSourceReceiver, utils.XHRLocalObject);
}
EventSourceTransport.prototype = new AjaxBasedTransport();
//         [*] End of lib/trans-iframe-eventsource.js


//         [*] Including lib/trans-iframe-xhr-polling.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var XhrPollingIframeTransport = SockJS['iframe-xhr-polling'] = function () {
    var that = this;
    that.protocol = 'w-iframe-xhr-polling';
    that.i_constructor.apply(that, arguments);
};

XhrPollingIframeTransport.prototype = new IframeTransport();

XhrPollingIframeTransport.enabled = function () {
    return _window.XMLHttpRequest && IframeTransport.enabled();
};

XhrPollingIframeTransport.need_body = true;
XhrPollingIframeTransport.roundTrips = 3; // html, javascript, xhr


// w-iframe-xhr-polling
var XhrPollingITransport = FacadeJS['w-iframe-xhr-polling'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr', XhrReceiver, utils.XHRLocalObject);
};

XhrPollingITransport.prototype = new AjaxBasedTransport();
//         [*] End of lib/trans-iframe-xhr-polling.js


//         [*] Including lib/trans-iframe-htmlfile.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// This transport generally works in any browser, but will cause a
// spinning cursor to appear in any browser other than IE.
// We may test this transport in all browsers - why not, but in
// production it should be only run in IE.

var HtmlFileIframeTransport = SockJS['iframe-htmlfile'] = function () {
    var that = this;
    that.protocol = 'w-iframe-htmlfile';
    that.i_constructor.apply(that, arguments);
};

// Inheritance.
HtmlFileIframeTransport.prototype = new IframeTransport();

HtmlFileIframeTransport.enabled = function() {
    return IframeTransport.enabled();
};

HtmlFileIframeTransport.need_body = true;
HtmlFileIframeTransport.roundTrips = 3; // html, javascript, htmlfile


// w-iframe-htmlfile
var HtmlFileTransport = FacadeJS['w-iframe-htmlfile'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/htmlfile', HtmlfileReceiver, utils.XHRLocalObject);
};
HtmlFileTransport.prototype = new AjaxBasedTransport();
//         [*] End of lib/trans-iframe-htmlfile.js


//         [*] Including lib/trans-polling.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var Polling = function(ri, Receiver, recv_url, AjaxObject) {
    var that = this;
    that.ri = ri;
    that.Receiver = Receiver;
    that.recv_url = recv_url;
    that.AjaxObject = AjaxObject;
    that._scheduleRecv();
};

Polling.prototype._scheduleRecv = function() {
    var that = this;
    var poll = that.poll = new that.Receiver(that.recv_url, that.AjaxObject);
    var msg_counter = 0;
    poll.onmessage = function(e) {
        msg_counter += 1;
        that.ri._didMessage(e.data);
    };
    poll.onclose = function(e) {
        that.poll = poll = poll.onmessage = poll.onclose = null;
        if (!that.poll_is_closing) {
            if (e.reason === 'permanent') {
                that.ri._didClose(1006, 'Polling error (' + e.reason + ')');
            } else {
                that._scheduleRecv();
            }
        }
    };
};

Polling.prototype.abort = function() {
    var that = this;
    that.poll_is_closing = true;
    if (that.poll) {
        that.poll.abort();
    }
};
//         [*] End of lib/trans-polling.js


//         [*] Including lib/trans-receiver-eventsource.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var EventSourceReceiver = function(url) {
    var that = this;
    var es = new EventSource(url);
    es.onmessage = function(e) {
        that.dispatchEvent(new SimpleEvent('message',
                                           {'data': unescape(e.data)}));
    };
    that.es_close = es.onerror = function(e, abort_reason) {
        // ES on reconnection has readyState = 0 or 1.
        // on network error it's CLOSED = 2
        var reason = abort_reason ? 'user' :
            (es.readyState !== 2 ? 'network' : 'permanent');
        that.es_close = es.onmessage = es.onerror = null;
        // EventSource reconnects automatically.
        es.close();
        es = null;
        // Safari and chrome < 15 crash if we close window before
        // waiting for ES cleanup. See:
        //   https://code.google.com/p/chromium/issues/detail?id=89155
        utils.delay(200, function() {
                        that.dispatchEvent(new SimpleEvent('close', {reason: reason}));
                    });
    };
};

EventSourceReceiver.prototype = new REventTarget();

EventSourceReceiver.prototype.abort = function() {
    var that = this;
    if (that.es_close) {
        that.es_close({}, true);
    }
};
//         [*] End of lib/trans-receiver-eventsource.js


//         [*] Including lib/trans-receiver-htmlfile.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var _is_ie_htmlfile_capable;
var isIeHtmlfileCapable = function() {
    if (_is_ie_htmlfile_capable === undefined) {
        if ('ActiveXObject' in _window) {
            try {
                _is_ie_htmlfile_capable = !!new ActiveXObject('htmlfile');
            } catch (x) {}
        } else {
            _is_ie_htmlfile_capable = false;
        }
    }
    return _is_ie_htmlfile_capable;
};


var HtmlfileReceiver = function(url) {
    var that = this;
    utils.polluteGlobalNamespace();

    that.id = 'a' + utils.random_string(6, 26);
    url += ((url.indexOf('?') === -1) ? '?' : '&') +
        'c=' + escape(WPrefix + '.' + that.id);

    var constructor = isIeHtmlfileCapable() ?
        utils.createHtmlfile : utils.createIframe;

    var iframeObj;
    _window[WPrefix][that.id] = {
        start: function () {
            iframeObj.loaded();
        },
        message: function (data) {
            that.dispatchEvent(new SimpleEvent('message', {'data': data}));
        },
        stop: function () {
            that.iframe_close({}, 'network');
        }
    };
    that.iframe_close = function(e, abort_reason) {
        iframeObj.cleanup();
        that.iframe_close = iframeObj = null;
        delete _window[WPrefix][that.id];
        that.dispatchEvent(new SimpleEvent('close', {reason: abort_reason}));
    };
    iframeObj = constructor(url, function(e) {
                                that.iframe_close({}, 'permanent');
                            });
};

HtmlfileReceiver.prototype = new REventTarget();

HtmlfileReceiver.prototype.abort = function() {
    var that = this;
    if (that.iframe_close) {
        that.iframe_close({}, 'user');
    }
};
//         [*] End of lib/trans-receiver-htmlfile.js


//         [*] Including lib/trans-receiver-xhr.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var XhrReceiver = function(url, AjaxObject) {
    var that = this;
    var buf_pos = 0;

    that.xo = new AjaxObject('POST', url, null);
    that.xo.onchunk = function(status, text) {
        if (status !== 200) return;
        while (1) {
            var buf = text.slice(buf_pos);
            var p = buf.indexOf('\n');
            if (p === -1) break;
            buf_pos += p+1;
            var msg = buf.slice(0, p);
            that.dispatchEvent(new SimpleEvent('message', {data: msg}));
        }
    };
    that.xo.onfinish = function(status, text) {
        that.xo.onchunk(status, text);
        that.xo = null;
        var reason = status === 200 ? 'network' : 'permanent';
        that.dispatchEvent(new SimpleEvent('close', {reason: reason}));
    }
};

XhrReceiver.prototype = new REventTarget();

XhrReceiver.prototype.abort = function() {
    var that = this;
    if (that.xo) {
        that.xo.close();
        that.dispatchEvent(new SimpleEvent('close', {reason: 'user'}));
        that.xo = null;
    }
};
//         [*] End of lib/trans-receiver-xhr.js


//         [*] Including lib/test-hooks.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// For testing
SockJS.getUtils = function(){
    return utils;
};

SockJS.getIframeTransport = function(){
    return IframeTransport;
};
//         [*] End of lib/test-hooks.js

                  return SockJS;
          })();
if ('_sockjs_onload' in window) setTimeout(_sockjs_onload, 1);

// AMD compliance
if (typeof define === 'function' && define.amd) {
    define('sockjs', [], function(){return SockJS;});
}
//     [*] End of lib/index.js

// [*] End of lib/all.js

;
// Generated by CoffeeScript 1.7.1

/*
   Stomp Over WebSocket http://www.jmesnil.net/stomp-websocket/doc/ | Apache License V2.0

   Copyright (C) 2010-2013 [Jeff Mesnil](http://jmesnil.net/)
   Copyright (C) 2012 [FuseSource, Inc.](http://fusesource.com)
 */

(function() {
  var Byte, Client, Frame, Stomp,
    __hasProp = {}.hasOwnProperty,
    __slice = [].slice;

  Byte = {
    LF: '\x0A',
    NULL: '\x00'
  };

  Frame = (function() {
    var unmarshallSingle;

    function Frame(command, headers, body) {
      this.command = command;
      this.headers = headers != null ? headers : {};
      this.body = body != null ? body : '';
    }

    Frame.prototype.toString = function() {
      var lines, name, skipContentLength, value, _ref;
      lines = [this.command];
      skipContentLength = this.headers['content-length'] === false ? true : false;
      if (skipContentLength) {
        delete this.headers['content-length'];
      }
      _ref = this.headers;
      for (name in _ref) {
        if (!__hasProp.call(_ref, name)) continue;
        value = _ref[name];
        lines.push("" + name + ":" + value);
      }
      if (this.body && !skipContentLength) {
        lines.push("content-length:" + (Frame.sizeOfUTF8(this.body)));
      }
      lines.push(Byte.LF + this.body);
      return lines.join(Byte.LF);
    };

    Frame.sizeOfUTF8 = function(s) {
      if (s) {
        return encodeURI(s).match(/%..|./g).length;
      } else {
        return 0;
      }
    };

    unmarshallSingle = function(data) {
      var body, chr, command, divider, headerLines, headers, i, idx, len, line, start, trim, _i, _j, _len, _ref, _ref1;
      divider = data.search(RegExp("" + Byte.LF + Byte.LF));
      headerLines = data.substring(0, divider).split(Byte.LF);
      command = headerLines.shift();
      headers = {};
      trim = function(str) {
        return str.replace(/^\s+|\s+$/g, '');
      };
      _ref = headerLines.reverse();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        idx = line.indexOf(':');
        headers[trim(line.substring(0, idx))] = trim(line.substring(idx + 1));
      }
      body = '';
      start = divider + 2;
      if (headers['content-length']) {
        len = parseInt(headers['content-length']);
        body = ('' + data).substring(start, start + len);
      } else {
        chr = null;
        for (i = _j = start, _ref1 = data.length; start <= _ref1 ? _j < _ref1 : _j > _ref1; i = start <= _ref1 ? ++_j : --_j) {
          chr = data.charAt(i);
          if (chr === Byte.NULL) {
            break;
          }
          body += chr;
        }
      }
      return new Frame(command, headers, body);
    };

    Frame.unmarshall = function(datas) {
      var data;
      return (function() {
        var _i, _len, _ref, _results;
        _ref = datas.split(RegExp("" + Byte.NULL + Byte.LF + "*"));
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          data = _ref[_i];
          if ((data != null ? data.length : void 0) > 0) {
            _results.push(unmarshallSingle(data));
          }
        }
        return _results;
      })();
    };

    Frame.marshall = function(command, headers, body) {
      var frame;
      frame = new Frame(command, headers, body);
      return frame.toString() + Byte.NULL;
    };

    return Frame;

  })();

  Client = (function() {
    var now;

    function Client(ws) {
      this.ws = ws;
      this.ws.binaryType = "arraybuffer";
      this.counter = 0;
      this.connected = false;
      this.heartbeat = {
        outgoing: 10000,
        incoming: 10000
      };
      this.maxWebSocketFrameSize = 16 * 1024;
      this.subscriptions = {};
    }

    Client.prototype.debug = function(message) {
      var _ref;
      return typeof window !== "undefined" && window !== null ? (_ref = window.console) != null ? _ref.log(message) : void 0 : void 0;
    };

    now = function() {
      if (Date.now) {
        return Date.now();
      } else {
        return new Date().valueOf;
      }
    };

    Client.prototype._transmit = function(command, headers, body) {
      var out;
      out = Frame.marshall(command, headers, body);
      if (typeof this.debug === "function") {
        this.debug(">>> " + out);
      }
      while (true) {
        if (out.length > this.maxWebSocketFrameSize) {
          this.ws.send(out.substring(0, this.maxWebSocketFrameSize));
          out = out.substring(this.maxWebSocketFrameSize);
          if (typeof this.debug === "function") {
            this.debug("remaining = " + out.length);
          }
        } else {
          return this.ws.send(out);
        }
      }
    };

    Client.prototype._setupHeartbeat = function(headers) {
      var serverIncoming, serverOutgoing, ttl, v, _ref, _ref1;
      if ((_ref = headers.version) !== Stomp.VERSIONS.V1_1 && _ref !== Stomp.VERSIONS.V1_2) {
        return;
      }
      _ref1 = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = headers['heart-beat'].split(",");
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          v = _ref1[_i];
          _results.push(parseInt(v));
        }
        return _results;
      })(), serverOutgoing = _ref1[0], serverIncoming = _ref1[1];
      if (!(this.heartbeat.outgoing === 0 || serverIncoming === 0)) {
        ttl = Math.max(this.heartbeat.outgoing, serverIncoming);
        if (typeof this.debug === "function") {
          this.debug("send PING every " + ttl + "ms");
        }
        this.pinger = Stomp.setInterval(ttl, (function(_this) {
          return function() {
            _this.ws.send(Byte.LF);
            return typeof _this.debug === "function" ? _this.debug(">>> PING") : void 0;
          };
        })(this));
      }
      if (!(this.heartbeat.incoming === 0 || serverOutgoing === 0)) {
        ttl = Math.max(this.heartbeat.incoming, serverOutgoing);
        if (typeof this.debug === "function") {
          this.debug("check PONG every " + ttl + "ms");
        }
        return this.ponger = Stomp.setInterval(ttl, (function(_this) {
          return function() {
            var delta;
            delta = now() - _this.serverActivity;
            if (delta > ttl * 2) {
              if (typeof _this.debug === "function") {
                _this.debug("did not receive server activity for the last " + delta + "ms");
              }
              return _this.ws.close();
            }
          };
        })(this));
      }
    };

    Client.prototype._parseConnect = function() {
      var args, connectCallback, errorCallback, headers;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      headers = {};
      switch (args.length) {
        case 2:
          headers = args[0], connectCallback = args[1];
          break;
        case 3:
          if (args[1] instanceof Function) {
            headers = args[0], connectCallback = args[1], errorCallback = args[2];
          } else {
            headers.login = args[0], headers.passcode = args[1], connectCallback = args[2];
          }
          break;
        case 4:
          headers.login = args[0], headers.passcode = args[1], connectCallback = args[2], errorCallback = args[3];
          break;
        default:
          headers.login = args[0], headers.passcode = args[1], connectCallback = args[2], errorCallback = args[3], headers.host = args[4];
      }
      return [headers, connectCallback, errorCallback];
    };

    Client.prototype.connect = function() {
      var args, errorCallback, headers, out;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      out = this._parseConnect.apply(this, args);
      headers = out[0], this.connectCallback = out[1], errorCallback = out[2];
      if (typeof this.debug === "function") {
        this.debug("Opening Web Socket...");
      }
      this.ws.onmessage = (function(_this) {
        return function(evt) {
          var arr, c, client, data, frame, messageID, onreceive, subscription, _i, _len, _ref, _results;
          data = typeof ArrayBuffer !== 'undefined' && evt.data instanceof ArrayBuffer ? (arr = new Uint8Array(evt.data), typeof _this.debug === "function" ? _this.debug("--- got data length: " + arr.length) : void 0, ((function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = arr.length; _i < _len; _i++) {
              c = arr[_i];
              _results.push(String.fromCharCode(c));
            }
            return _results;
          })()).join('')) : evt.data;
          _this.serverActivity = now();
          if (data === Byte.LF) {
            if (typeof _this.debug === "function") {
              _this.debug("<<< PONG");
            }
            return;
          }
          if (typeof _this.debug === "function") {
            _this.debug("<<< " + data);
          }
          _ref = Frame.unmarshall(data);
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            frame = _ref[_i];
            switch (frame.command) {
              case "CONNECTED":
                if (typeof _this.debug === "function") {
                  _this.debug("connected to server " + frame.headers.server);
                }
                _this.connected = true;
                _this._setupHeartbeat(frame.headers);
                _results.push(typeof _this.connectCallback === "function" ? _this.connectCallback(frame) : void 0);
                break;
              case "MESSAGE":
                subscription = frame.headers.subscription;
                onreceive = _this.subscriptions[subscription] || _this.onreceive;
                if (onreceive) {
                  client = _this;
                  messageID = frame.headers["message-id"];
                  frame.ack = function(headers) {
                    if (headers == null) {
                      headers = {};
                    }
                    return client.ack(messageID, subscription, headers);
                  };
                  frame.nack = function(headers) {
                    if (headers == null) {
                      headers = {};
                    }
                    return client.nack(messageID, subscription, headers);
                  };
                  _results.push(onreceive(frame));
                } else {
                  _results.push(typeof _this.debug === "function" ? _this.debug("Unhandled received MESSAGE: " + frame) : void 0);
                }
                break;
              case "RECEIPT":
                _results.push(typeof _this.onreceipt === "function" ? _this.onreceipt(frame) : void 0);
                break;
              case "ERROR":
                _results.push(typeof errorCallback === "function" ? errorCallback(frame) : void 0);
                break;
              default:
                _results.push(typeof _this.debug === "function" ? _this.debug("Unhandled frame: " + frame) : void 0);
            }
          }
          return _results;
        };
      })(this);
      this.ws.onclose = (function(_this) {
        return function() {
          var msg;
          msg = "Whoops! Lost connection to " + _this.ws.url;
          if (typeof _this.debug === "function") {
            _this.debug(msg);
          }
          _this._cleanUp();
          return typeof errorCallback === "function" ? errorCallback(msg) : void 0;
        };
      })(this);
      return this.ws.onopen = (function(_this) {
        return function() {
          if (typeof _this.debug === "function") {
            _this.debug('Web Socket Opened...');
          }
          headers["accept-version"] = Stomp.VERSIONS.supportedVersions();
          headers["heart-beat"] = [_this.heartbeat.outgoing, _this.heartbeat.incoming].join(',');
          return _this._transmit("CONNECT", headers);
        };
      })(this);
    };

    Client.prototype.disconnect = function(disconnectCallback, headers) {
      if (headers == null) {
        headers = {};
      }
      this._transmit("DISCONNECT", headers);
      this.ws.onclose = null;
      this.ws.close();
      this._cleanUp();
      return typeof disconnectCallback === "function" ? disconnectCallback() : void 0;
    };

    Client.prototype._cleanUp = function() {
      this.connected = false;
      if (this.pinger) {
        Stomp.clearInterval(this.pinger);
      }
      if (this.ponger) {
        return Stomp.clearInterval(this.ponger);
      }
    };

    Client.prototype.send = function(destination, headers, body) {
      if (headers == null) {
        headers = {};
      }
      if (body == null) {
        body = '';
      }
      headers.destination = destination;
      return this._transmit("SEND", headers, body);
    };

    Client.prototype.subscribe = function(destination, callback, headers) {
      var client;
      if (headers == null) {
        headers = {};
      }
      if (!headers.id) {
        headers.id = "sub-" + this.counter++;
      }
      headers.destination = destination;
      this.subscriptions[headers.id] = callback;
      this._transmit("SUBSCRIBE", headers);
      client = this;
      return {
        id: headers.id,
        unsubscribe: function() {
          return client.unsubscribe(headers.id);
        }
      };
    };

    Client.prototype.unsubscribe = function(id) {
      delete this.subscriptions[id];
      return this._transmit("UNSUBSCRIBE", {
        id: id
      });
    };

    Client.prototype.begin = function(transaction) {
      var client, txid;
      txid = transaction || "tx-" + this.counter++;
      this._transmit("BEGIN", {
        transaction: txid
      });
      client = this;
      return {
        id: txid,
        commit: function() {
          return client.commit(txid);
        },
        abort: function() {
          return client.abort(txid);
        }
      };
    };

    Client.prototype.commit = function(transaction) {
      return this._transmit("COMMIT", {
        transaction: transaction
      });
    };

    Client.prototype.abort = function(transaction) {
      return this._transmit("ABORT", {
        transaction: transaction
      });
    };

    Client.prototype.ack = function(messageID, subscription, headers) {
      if (headers == null) {
        headers = {};
      }
      headers["message-id"] = messageID;
      headers.subscription = subscription;
      return this._transmit("ACK", headers);
    };

    Client.prototype.nack = function(messageID, subscription, headers) {
      if (headers == null) {
        headers = {};
      }
      headers["message-id"] = messageID;
      headers.subscription = subscription;
      return this._transmit("NACK", headers);
    };

    return Client;

  })();

  Stomp = {
    VERSIONS: {
      V1_0: '1.0',
      V1_1: '1.1',
      V1_2: '1.2',
      supportedVersions: function() {
        return '1.1,1.0';
      }
    },
    client: function(url, protocols) {
      var klass, ws;
      if (protocols == null) {
        protocols = ['v10.stomp', 'v11.stomp'];
      }
      klass = Stomp.WebSocketClass || WebSocket;
      ws = new klass(url, protocols);
      return new Client(ws);
    },
    over: function(ws) {
      return new Client(ws);
    },
    Frame: Frame
  };

  if (typeof exports !== "undefined" && exports !== null) {
    exports.Stomp = Stomp;
  }

  if (typeof window !== "undefined" && window !== null) {
    Stomp.setInterval = function(interval, f) {
      return window.setInterval(f, interval);
    };
    Stomp.clearInterval = function(id) {
      return window.clearInterval(id);
    };
    window.Stomp = Stomp;
  } else if (!exports) {
    self.Stomp = Stomp;
  }

}).call(this);

define("stomp", function(){});

define('common/utils/Enum',[], function() {
  
  var EnumSymbol = function EnumSymbol(name, $__6, value) {
    var value = $traceurRuntime.assertObject($__6).value;
    this.name = name;
    this.value = (value !== undefined) ? value : Symbol(name);
    delete arguments[1].value;
    Object.assign(this, arguments[1]);
    Object.freeze(this);
  };
  ($traceurRuntime.createClass)(EnumSymbol, {
    toString: function() {
      return this.name;
    },
    valueOf: function() {
      return this.value;
    }
  }, {});
  EnumSymbol.parameters = [[$traceurRuntime.type.string], [], [$traceurRuntime.type.number]];
  var Enum = function Enum(enumLiterals) {
    for (var $key in enumLiterals) {
      try {
        throw undefined;
      } catch (key) {
        {
          key = $key;
          if (!enumLiterals[$traceurRuntime.toProperty(key)])
            throw new TypeError('each enum should have been initialized with atleast empty {} value');
          $traceurRuntime.setProperty(this, key, new EnumSymbol(key, enumLiterals[$traceurRuntime.toProperty(key)]));
        }
      }
    }
    Object.freeze(this);
  };
  ($traceurRuntime.createClass)(Enum, {
    symbols: function() {
      var $__3 = this;
      return (function() {
        var $__1 = 0,
            $__2 = [];
        for (var $__4 = Object.keys($__3)[$traceurRuntime.toProperty(Symbol.iterator)](),
            $__5; !($__5 = $__4.next()).done; ) {
          try {
            throw undefined;
          } catch (key) {
            {
              key = $__5.value;
              $traceurRuntime.setProperty($__2, $__1++, $__3[$traceurRuntime.toProperty(key)]);
            }
          }
        }
        return $__2;
      }());
    },
    keys: function() {
      return Object.keys(this);
    },
    contains: function(sym) {
      if (!sym instanceof EnumSymbol)
        return false;
      return this[$traceurRuntime.toProperty(sym.name)] === sym;
    }
  }, {});
  return {
    get EnumSymbol() {
      return EnumSymbol;
    },
    get Enum() {
      return Enum;
    },
    __esModule: true
  };
});

// ES6-shim 0.13.0 (c) 2013-2014 Paul Miller (http://paulmillr.com)
// ES6-shim may be freely distributed under the MIT license.
// For more details and documentation:
// https://github.com/paulmillr/es6-shim/

(function(undefined) {
  

  var isCallableWithoutNew = function(func) {
    try { func(); }
    catch (e) { return false; }
    return true;
  };

  var supportsSubclassing = function(C, f) {
    /* jshint proto:true */
    try {
      var Sub = function() { C.apply(this, arguments); };
      if (!Sub.__proto__) { return false; /* skip test on IE < 11 */ }
      Object.setPrototypeOf(Sub, C);
      Sub.prototype = Object.create(C.prototype, {
        constructor: { value: C }
      });
      return f(Sub);
    } catch (e) {
      return false;
    }
  };

  var arePropertyDescriptorsSupported = function() {
    try {
      Object.defineProperty({}, 'x', {});
      return true;
    } catch (e) { /* this is IE 8. */
      return false;
    }
  };

  var startsWithRejectsRegex = function() {
    var rejectsRegex = false;
    if (String.prototype.startsWith) {
      try {
        '/a/'.startsWith(/a/);
      } catch (e) { /* this is spec compliant */
        rejectsRegex = true;
      }
    }
    return rejectsRegex;
  };

  /*jshint evil: true */
  var getGlobal = new Function('return this;');
  /*jshint evil: false */

  var main = function() {
    var globals = getGlobal();
    var global_isFinite = globals.isFinite;
    var supportsDescriptors = !!Object.defineProperty && arePropertyDescriptorsSupported();
    var startsWithIsCompliant = startsWithRejectsRegex();
    var _slice = Array.prototype.slice;
    var _indexOf = String.prototype.indexOf;
    var _toString = Object.prototype.toString;
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var ArrayIterator; // make our implementation private

    // Define configurable, writable and non-enumerable props
    // if they don’t exist.
    var defineProperties = function(object, map) {
      Object.keys(map).forEach(function(name) {
        var method = map[name];
        if (name in object) return;
        if (supportsDescriptors) {
          Object.defineProperty(object, name, {
            configurable: true,
            enumerable: false,
            writable: true,
            value: method
          });
        } else {
          object[name] = method;
        }
      });
    };

    // Simple shim for Object.create on ES3 browsers
    // (unlike real shim, no attempt to support `prototype === null`)
    var create = Object.create || function(prototype, properties) {
      function Type() {}
      Type.prototype = prototype;
      var object = new Type();
      if (typeof properties !== "undefined") {
        defineProperties(object, properties);
      }
      return object;
    };

    // This is a private name in the es6 spec, equal to '[Symbol.iterator]'
    // we're going to use an arbitrary _-prefixed name to make our shims
    // work properly with each other, even though we don't have full Iterator
    // support.  That is, `Array.from(map.keys())` will work, but we don't
    // pretend to export a "real" Iterator interface.
    var $iterator$ = (typeof Symbol === 'object' && Symbol.iterator) ||
      '_es6shim_iterator_';
    // Firefox ships a partial implementation using the name @@iterator.
    // https://bugzilla.mozilla.org/show_bug.cgi?id=907077#c14
    // So use that name if we detect it.
    if (globals.Set && typeof new globals.Set()['@@iterator'] === 'function') {
      $iterator$ = '@@iterator';
    }
    var addIterator = function(prototype, impl) {
      if (!impl) { impl = function iterator() { return this; }; }
      var o = {};
      o[$iterator$] = impl;
      defineProperties(prototype, o);
    };

    // taken directly from https://github.com/ljharb/is-arguments/blob/master/index.js
    // can be replaced with require('is-arguments') if we ever use a build process instead
    var isArguments = function isArguments(value) {
      var str = _toString.call(value);
      var result = str === '[object Arguments]';
      if (!result) {
        result = str !== '[object Array]' &&
          value !== null &&
          typeof value === 'object' &&
          typeof value.length === 'number' &&
          value.length >= 0 &&
          _toString.call(value.callee) === '[object Function]';
      }
      return result;
    };

    var emulateES6construct = function(o) {
      if (!ES.TypeIsObject(o)) throw new TypeError('bad object');
      // es5 approximation to es6 subclass semantics: in es6, 'new Foo'
      // would invoke Foo.@@create to allocation/initialize the new object.
      // In es5 we just get the plain object.  So if we detect an
      // uninitialized object, invoke o.constructor.@@create
      if (!o._es6construct) {
        if (o.constructor && ES.IsCallable(o.constructor['@@create'])) {
          o = o.constructor['@@create'](o);
        }
        defineProperties(o, { _es6construct: true });
      }
      return o;
    };

    var ES = {
      CheckObjectCoercible: function(x, optMessage) {
        /* jshint eqnull:true */
        if (x == null)
          throw new TypeError(optMessage || ('Cannot call method on ' + x));
        return x;
      },

      TypeIsObject: function(x) {
        /* jshint eqnull:true */
        // this is expensive when it returns false; use this function
        // when you expect it to return true in the common case.
        return x != null && Object(x) === x;
      },

      ToObject: function(o, optMessage) {
        return Object(ES.CheckObjectCoercible(o, optMessage));
      },

      IsCallable: function(x) {
        return typeof x === 'function' &&
          // some versions of IE say that typeof /abc/ === 'function'
          _toString.call(x) === '[object Function]';
      },

      ToInt32: function(x) {
        return x >> 0;
      },

      ToUint32: function(x) {
        return x >>> 0;
      },

      ToInteger: function(value) {
        var number = +value;
        if (Number.isNaN(number)) return 0;
        if (number === 0 || !Number.isFinite(number)) return number;
        return Math.sign(number) * Math.floor(Math.abs(number));
      },

      ToLength: function(value) {
        var len = ES.ToInteger(value);
        if (len <= 0) return 0; // includes converting -0 to +0
        if (len > Number.MAX_SAFE_INTEGER) return Number.MAX_SAFE_INTEGER;
        return len;
      },

      SameValue: function(a, b) {
        if (a === b) {
          // 0 === -0, but they are not identical.
          if (a === 0) return 1 / a === 1 / b;
          return true;
        }
        return Number.isNaN(a) && Number.isNaN(b);
      },

      SameValueZero: function(a, b) {
        // same as SameValue except for SameValueZero(+0, -0) == true
        return (a === b) || (Number.isNaN(a) && Number.isNaN(b));
      },

      IsIterable: function(o) {
        return ES.TypeIsObject(o) &&
          (o[$iterator$] !== undefined || isArguments(o));
      },

      GetIterator: function(o) {
        if (isArguments(o)) {
          // special case support for `arguments`
          return new ArrayIterator(o, "value");
        }
        var it = o[$iterator$]();
        if (!ES.TypeIsObject(it)) {
          throw new TypeError('bad iterator');
        }
        return it;
      },

      IteratorNext: function(it) {
        var result = (arguments.length > 1) ? it.next(arguments[1]) : it.next();
        if (!ES.TypeIsObject(result)) {
          throw new TypeError('bad iterator');
        }
        return result;
      },

      Construct: function(C, args) {
        // CreateFromConstructor
        var obj;
        if (ES.IsCallable(C['@@create'])) {
          obj = C['@@create']();
        } else {
          // OrdinaryCreateFromConstructor
          obj = create(C.prototype || null);
        }
        // Mark that we've used the es6 construct path
        // (see emulateES6construct)
        defineProperties(obj, { _es6construct: true });
        // Call the constructor.
        var result = C.apply(obj, args);
        return ES.TypeIsObject(result) ? result : obj;
      }
    };

    var numberConversion = (function () {
      // from https://github.com/inexorabletash/polyfill/blob/master/typedarray.js#L176-L266
      // with permission and license, per https://twitter.com/inexorabletash/status/372206509540659200

      function roundToEven(n) {
        var w = Math.floor(n), f = n - w;
        if (f < 0.5) {
          return w;
        }
        if (f > 0.5) {
          return w + 1;
        }
        return w % 2 ? w + 1 : w;
      }

      function packIEEE754(v, ebits, fbits) {
        var bias = (1 << (ebits - 1)) - 1,
          s, e, f, ln,
          i, bits, str, bytes;

        // Compute sign, exponent, fraction
        if (v !== v) {
          // NaN
          // http://dev.w3.org/2006/webapi/WebIDL/#es-type-mapping
          e = (1 << ebits) - 1;
          f = Math.pow(2, fbits - 1);
          s = 0;
        } else if (v === Infinity || v === -Infinity) {
          e = (1 << ebits) - 1;
          f = 0;
          s = (v < 0) ? 1 : 0;
        } else if (v === 0) {
          e = 0;
          f = 0;
          s = (1 / v === -Infinity) ? 1 : 0;
        } else {
          s = v < 0;
          v = Math.abs(v);

          if (v >= Math.pow(2, 1 - bias)) {
            e = Math.min(Math.floor(Math.log(v) / Math.LN2), 1023);
            f = roundToEven(v / Math.pow(2, e) * Math.pow(2, fbits));
            if (f / Math.pow(2, fbits) >= 2) {
              e = e + 1;
              f = 1;
            }
            if (e > bias) {
              // Overflow
              e = (1 << ebits) - 1;
              f = 0;
            } else {
              // Normal
              e = e + bias;
              f = f - Math.pow(2, fbits);
            }
          } else {
            // Subnormal
            e = 0;
            f = roundToEven(v / Math.pow(2, 1 - bias - fbits));
          }
        }

        // Pack sign, exponent, fraction
        bits = [];
        for (i = fbits; i; i -= 1) {
          bits.push(f % 2 ? 1 : 0);
          f = Math.floor(f / 2);
        }
        for (i = ebits; i; i -= 1) {
          bits.push(e % 2 ? 1 : 0);
          e = Math.floor(e / 2);
        }
        bits.push(s ? 1 : 0);
        bits.reverse();
        str = bits.join('');

        // Bits to bytes
        bytes = [];
        while (str.length) {
          bytes.push(parseInt(str.substring(0, 8), 2));
          str = str.substring(8);
        }
        return bytes;
      }

      function unpackIEEE754(bytes, ebits, fbits) {
        // Bytes to bits
        var bits = [], i, j, b, str,
            bias, s, e, f;

        for (i = bytes.length; i; i -= 1) {
          b = bytes[i - 1];
          for (j = 8; j; j -= 1) {
            bits.push(b % 2 ? 1 : 0);
            b = b >> 1;
          }
        }
        bits.reverse();
        str = bits.join('');

        // Unpack sign, exponent, fraction
        bias = (1 << (ebits - 1)) - 1;
        s = parseInt(str.substring(0, 1), 2) ? -1 : 1;
        e = parseInt(str.substring(1, 1 + ebits), 2);
        f = parseInt(str.substring(1 + ebits), 2);

        // Produce number
        if (e === (1 << ebits) - 1) {
          return f !== 0 ? NaN : s * Infinity;
        } else if (e > 0) {
          // Normalized
          return s * Math.pow(2, e - bias) * (1 + f / Math.pow(2, fbits));
        } else if (f !== 0) {
          // Denormalized
          return s * Math.pow(2, -(bias - 1)) * (f / Math.pow(2, fbits));
        } else {
          return s < 0 ? -0 : 0;
        }
      }

      function unpackFloat64(b) { return unpackIEEE754(b, 11, 52); }
      function packFloat64(v) { return packIEEE754(v, 11, 52); }
      function unpackFloat32(b) { return unpackIEEE754(b, 8, 23); }
      function packFloat32(v) { return packIEEE754(v, 8, 23); }

      var conversions = {
        toFloat32: function (num) { return unpackFloat32(packFloat32(num)); }
      };
      if (typeof Float32Array !== 'undefined') {
        var float32array = new Float32Array(1);
        conversions.toFloat32 = function (num) {
          float32array[0] = num;
          return float32array[0];
        };
      }
      return conversions;
    }());

    defineProperties(String, {
      fromCodePoint: function() {
        var points = _slice.call(arguments, 0, arguments.length);
        var result = [];
        var next;
        for (var i = 0, length = points.length; i < length; i++) {
          next = Number(points[i]);
          if (!ES.SameValue(next, ES.ToInteger(next)) ||
              next < 0 || next > 0x10FFFF) {
            throw new RangeError('Invalid code point ' + next);
          }

          if (next < 0x10000) {
            result.push(String.fromCharCode(next));
          } else {
            next -= 0x10000;
            result.push(String.fromCharCode((next >> 10) + 0xD800));
            result.push(String.fromCharCode((next % 0x400) + 0xDC00));
          }
        }
        return result.join('');
      },

      raw: function(callSite) { // raw.length===1
        var substitutions = _slice.call(arguments, 1, arguments.length);
        var cooked = ES.ToObject(callSite, 'bad callSite');
        var rawValue = cooked.raw;
        var raw = ES.ToObject(rawValue, 'bad raw value');
        var len = Object.keys(raw).length;
        var literalsegments = ES.ToLength(len);
        if (literalsegments === 0) {
          return '';
        }

        var stringElements = [];
        var nextIndex = 0;
        var nextKey, next, nextSeg, nextSub;
        while (nextIndex < literalsegments) {
          nextKey = String(nextIndex);
          next = raw[nextKey];
          nextSeg = String(next);
          stringElements.push(nextSeg);
          if (nextIndex + 1 >= literalsegments) {
            break;
          }
          next = substitutions[nextKey];
          if (next === undefined) {
            break;
          }
          nextSub = String(next);
          stringElements.push(nextSub);
          nextIndex++;
        }
        return stringElements.join('');
      }
    });

    var StringShims = {
      // Fast repeat, uses the `Exponentiation by squaring` algorithm.
      // Perf: http://jsperf.com/string-repeat2/2
      repeat: (function() {
        var repeat = function(s, times) {
          if (times < 1) return '';
          if (times % 2) return repeat(s, times - 1) + s;
          var half = repeat(s, times / 2);
          return half + half;
        };

        return function(times) {
          var thisStr = String(ES.CheckObjectCoercible(this));
          times = ES.ToInteger(times);
          if (times < 0 || times === Infinity) {
            throw new RangeError('Invalid String#repeat value');
          }
          return repeat(thisStr, times);
        };
      })(),

      startsWith: function(searchStr) {
        var thisStr = String(ES.CheckObjectCoercible(this));
        if (_toString.call(searchStr) === '[object RegExp]') throw new TypeError('Cannot call method "startsWith" with a regex');
        searchStr = String(searchStr);
        var startArg = arguments.length > 1 ? arguments[1] : undefined;
        var start = Math.max(ES.ToInteger(startArg), 0);
        return thisStr.slice(start, start + searchStr.length) === searchStr;
      },

      endsWith: function(searchStr) {
        var thisStr = String(ES.CheckObjectCoercible(this));
        if (_toString.call(searchStr) === '[object RegExp]') throw new TypeError('Cannot call method "endsWith" with a regex');
        searchStr = String(searchStr);
        var thisLen = thisStr.length;
        var posArg = arguments.length > 1 ? arguments[1] : undefined;
        var pos = posArg === undefined ? thisLen : ES.ToInteger(posArg);
        var end = Math.min(Math.max(pos, 0), thisLen);
        return thisStr.slice(end - searchStr.length, end) === searchStr;
      },

      contains: function(searchString) {
        var position = arguments.length > 1 ? arguments[1] : undefined;
        // Somehow this trick makes method 100% compat with the spec.
        return _indexOf.call(this, searchString, position) !== -1;
      },

      codePointAt: function(pos) {
        var thisStr = String(ES.CheckObjectCoercible(this));
        var position = ES.ToInteger(pos);
        var length = thisStr.length;
        if (position < 0 || position >= length) return undefined;
        var first = thisStr.charCodeAt(position);
        var isEnd = (position + 1 === length);
        if (first < 0xD800 || first > 0xDBFF || isEnd) return first;
        var second = thisStr.charCodeAt(position + 1);
        if (second < 0xDC00 || second > 0xDFFF) return first;
        return ((first - 0xD800) * 1024) + (second - 0xDC00) + 0x10000;
      }
    };
    defineProperties(String.prototype, StringShims);

    var hasStringTrimBug = '\u0085'.trim().length !== 1;
    if (hasStringTrimBug) {
      var originalStringTrim = String.prototype.trim;
      delete String.prototype.trim;
      // whitespace from: http://es5.github.io/#x15.5.4.20
      // implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
      var ws = [
        '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003',
        '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028',
        '\u2029\uFEFF'
      ].join('');
      var trimBeginRegexp = new RegExp('^[' + ws + '][' + ws + ']*');
      var trimEndRegexp = new RegExp('[' + ws + '][' + ws + ']*$');
      defineProperties(String.prototype, {
        trim: function() {
          if (this === undefined || this === null) {
            throw new TypeError("can't convert " + this + " to object");
          }
          return String(this)
            .replace(trimBeginRegexp, "")
            .replace(trimEndRegexp, "");
          }
      });
    }

    // see https://people.mozilla.org/~jorendorff/es6-draft.html#sec-string.prototype-@@iterator
    var StringIterator = function(s) {
      this._s = String(ES.CheckObjectCoercible(s));
      this._i = 0;
    };
    StringIterator.prototype.next = function() {
      var s = this._s, i = this._i;
      if (s === undefined || i >= s.length) {
        this._s = undefined;
        return { value: undefined, done: true };
      }
      var first = s.charCodeAt(i), second, len;
      if (first < 0xD800 || first > 0xDBFF || (i+1) == s.length) {
        len = 1;
      } else {
        second = s.charCodeAt(i+1);
        len = (second < 0xDC00 || second > 0xDFFF) ? 1 : 2;
      }
      this._i = i + len;
      return { value: s.substr(i, len), done: false };
    };
    addIterator(StringIterator.prototype);
    addIterator(String.prototype, function() {
      return new StringIterator(this);
    });

    if (!startsWithIsCompliant) {
      // Firefox has a noncompliant startsWith implementation
      String.prototype.startsWith = StringShims.startsWith;
      String.prototype.endsWith = StringShims.endsWith;
    }

    defineProperties(Array, {
      from: function(iterable) {
        var mapFn = arguments.length > 1 ? arguments[1] : undefined;
        var thisArg = arguments.length > 2 ? arguments[2] : undefined;

        var list = ES.ToObject(iterable, 'bad iterable');
        if (mapFn !== undefined && !ES.IsCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        var usingIterator = ES.IsIterable(list);
        // does the spec really mean that Arrays should use ArrayIterator?
        // https://bugs.ecmascript.org/show_bug.cgi?id=2416
        //if (Array.isArray(list)) { usingIterator=false; }
        var length = usingIterator ? 0 : ES.ToLength(list.length);
        var result = ES.IsCallable(this) ? Object(usingIterator ? new this() : new this(length)) : new Array(length);
        var it = usingIterator ? ES.GetIterator(list) : null;
        var value;

        for (var i = 0; usingIterator || (i < length); i++) {
          if (usingIterator) {
            value = ES.IteratorNext(it);
            if (value.done) {
              length = i;
              break;
            }
            value = value.value;
          } else {
            value = list[i];
          }
          if (mapFn) {
            result[i] = thisArg ? mapFn.call(thisArg, value, i) : mapFn(value, i);
          } else {
            result[i] = value;
          }
        }

        result.length = length;
        return result;
      },

      of: function() {
        return Array.from(arguments);
      }
    });

    // Our ArrayIterator is private; see
    // https://github.com/paulmillr/es6-shim/issues/252
    ArrayIterator = function(array, kind) {
        this.i = 0;
        this.array = array;
        this.kind = kind;
    };

    defineProperties(ArrayIterator.prototype, {
      next: function() {
        var i = this.i, array = this.array;
        if (i === undefined || this.kind === undefined) {
          throw new TypeError('Not an ArrayIterator');
        }
        if (array!==undefined) {
          var len = ES.ToLength(array.length);
          for (; i < len; i++) {
            var kind = this.kind;
            var retval;
            if (kind === "key") {
              retval = i;
            } else if (kind === "value") {
              retval = array[i];
            } else if (kind === "entry") {
              retval = [i, array[i]];
            }
            this.i = i + 1;
            return { value: retval, done: false };
          }
        }
        this.array = undefined;
        return { value: undefined, done: true };
      }
    });
    addIterator(ArrayIterator.prototype);

    defineProperties(Array.prototype, {
      copyWithin: function(target, start) {
        var end = arguments[2]; // copyWithin.length must be 2
        var o = ES.ToObject(this);
        var len = ES.ToLength(o.length);
        target = ES.ToInteger(target);
        start = ES.ToInteger(start);
        var to = target < 0 ? Math.max(len + target, 0) : Math.min(target, len);
        var from = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
        end = (end===undefined) ? len : ES.ToInteger(end);
        var fin = end < 0 ? Math.max(len + end, 0) : Math.min(end, len);
        var count = Math.min(fin - from, len - to);
        var direction = 1;
        if (from < to && to < (from + count)) {
          direction = -1;
          from += count - 1;
          to += count - 1;
        }
        while (count > 0) {
          if (_hasOwnProperty.call(o, from)) {
            o[to] = o[from];
          } else {
            delete o[from];
          }
          from += direction;
          to += direction;
          count -= 1;
        }
        return o;
      },

      fill: function(value) {
        var start = arguments[1], end = arguments[2]; // fill.length===1
        var O = ES.ToObject(this);
        var len = ES.ToLength(O.length);
        start = ES.ToInteger(start===undefined ? 0 : start);
        end = ES.ToInteger(end===undefined ? len : end);

        var relativeStart = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);

        for (var i = relativeStart; i < len && i < end; ++i) {
          O[i] = value;
        }
        return O;
      },

      find: function(predicate) {
        var list = ES.ToObject(this);
        var length = ES.ToLength(list.length);
        if (!ES.IsCallable(predicate)) {
          throw new TypeError('Array#find: predicate must be a function');
        }
        var thisArg = arguments[1];
        for (var i = 0, value; i < length; i++) {
          if (i in list) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) return value;
          }
        }
        return undefined;
      },

      findIndex: function(predicate) {
        var list = ES.ToObject(this);
        var length = ES.ToLength(list.length);
        if (!ES.IsCallable(predicate)) {
          throw new TypeError('Array#findIndex: predicate must be a function');
        }
        var thisArg = arguments[1];
        for (var i = 0; i < length; i++) {
          if (i in list) {
            if (predicate.call(thisArg, list[i], i, list)) return i;
          }
        }
        return -1;
      },

      keys: function() {
        return new ArrayIterator(this, "key");
      },

      values: function() {
        return new ArrayIterator(this, "value");
      },

      entries: function() {
        return new ArrayIterator(this, "entry");
      }
    });
    addIterator(Array.prototype, function() { return this.values(); });
    // Chrome defines keys/values/entries on Array, but doesn't give us
    // any way to identify its iterator.  So add our own shimmed field.
    if (Object.getPrototypeOf) {
      addIterator(Object.getPrototypeOf([].values()));
    }

    var maxSafeInteger = Math.pow(2, 53) - 1;
    defineProperties(Number, {
      MAX_SAFE_INTEGER: maxSafeInteger,
      MIN_SAFE_INTEGER: -maxSafeInteger,
      EPSILON: 2.220446049250313e-16,

      parseInt: globals.parseInt,
      parseFloat: globals.parseFloat,

      isFinite: function(value) {
        return typeof value === 'number' && global_isFinite(value);
      },

      isInteger: function(value) {
        return typeof value === 'number' &&
          !Number.isNaN(value) &&
          Number.isFinite(value) &&
          ES.ToInteger(value) === value;
      },

      isSafeInteger: function(value) {
        return Number.isInteger(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER;
      },

      isNaN: function(value) {
        // NaN !== NaN, but they are identical.
        // NaNs are the only non-reflexive value, i.e., if x !== x,
        // then x is NaN.
        // isNaN is broken: it converts its argument to number, so
        // isNaN('foo') => true
        return value !== value;
      }

    });

    if (supportsDescriptors) {
      defineProperties(Object, {
        getPropertyDescriptor: function(subject, name) {
          var pd = Object.getOwnPropertyDescriptor(subject, name);
          var proto = Object.getPrototypeOf(subject);
          while (pd === undefined && proto !== null) {
            pd = Object.getOwnPropertyDescriptor(proto, name);
            proto = Object.getPrototypeOf(proto);
          }
          return pd;
        },

        getPropertyNames: function(subject) {
          var result = Object.getOwnPropertyNames(subject);
          var proto = Object.getPrototypeOf(subject);

          var addProperty = function(property) {
            if (result.indexOf(property) === -1) {
              result.push(property);
            }
          };

          while (proto !== null) {
            Object.getOwnPropertyNames(proto).forEach(addProperty);
            proto = Object.getPrototypeOf(proto);
          }
          return result;
        }
      });

      defineProperties(Object, {
        // 19.1.3.1
        assign: function(target, source) {
          if (!ES.TypeIsObject(target)) {
            throw new TypeError('target must be an object');
          }
          return Array.prototype.reduce.call(arguments, function(target, source) {
            if (!ES.TypeIsObject(source)) {
              throw new TypeError('source must be an object');
            }
            return Object.keys(source).reduce(function(target, key) {
              target[key] = source[key];
              return target;
            }, target);
          });
        },

        getOwnPropertyKeys: function(subject) {
          return Object.keys(subject);
        },

        is: function(a, b) {
          return ES.SameValue(a, b);
        },

        // 19.1.3.9
        // shim from https://gist.github.com/WebReflection/5593554
        setPrototypeOf: (function(Object, magic) {
          var set;

          var checkArgs = function(O, proto) {
            if (!ES.TypeIsObject(O)) {
              throw new TypeError('cannot set prototype on a non-object');
            }
            if (!(proto===null || ES.TypeIsObject(proto))) {
              throw new TypeError('can only set prototype to an object or null'+proto);
            }
          };

          var setPrototypeOf = function(O, proto) {
            checkArgs(O, proto);
            set.call(O, proto);
            return O;
          };

          try {
            // this works already in Firefox and Safari
            set = Object.getOwnPropertyDescriptor(Object.prototype, magic).set;
            set.call({}, null);
          } catch (e) {
            if (Object.prototype !== {}[magic]) {
              // IE < 11 cannot be shimmed
              return;
            }
            // probably Chrome or some old Mobile stock browser
            set = function(proto) {
              this[magic] = proto;
            };
            // please note that this will **not** work
            // in those browsers that do not inherit
            // __proto__ by mistake from Object.prototype
            // in these cases we should probably throw an error
            // or at least be informed about the issue
            setPrototypeOf.polyfill = setPrototypeOf(
              setPrototypeOf({}, null),
              Object.prototype
            ) instanceof Object;
            // setPrototypeOf.polyfill === true means it works as meant
            // setPrototypeOf.polyfill === false means it's not 100% reliable
            // setPrototypeOf.polyfill === undefined
            // or
            // setPrototypeOf.polyfill ==  null means it's not a polyfill
            // which means it works as expected
            // we can even delete Object.prototype.__proto__;
          }
          return setPrototypeOf;
        })(Object, '__proto__')
      });
    }

    // Workaround bug in Opera 12 where setPrototypeOf(x, null) doesn't work,
    // but Object.create(null) does.
    if (Object.setPrototypeOf && Object.getPrototypeOf &&
        Object.getPrototypeOf(Object.setPrototypeOf({}, null)) !== null &&
        Object.getPrototypeOf(Object.create(null)) === null) {
      (function() {
        var FAKENULL = Object.create(null);
        var gpo = Object.getPrototypeOf, spo = Object.setPrototypeOf;
        Object.getPrototypeOf = function(o) {
          var result = gpo(o);
          return result === FAKENULL ? null : result;
        };
        Object.setPrototypeOf = function(o, p) {
          if (p === null) { p = FAKENULL; }
          return spo(o, p);
        };
        Object.setPrototypeOf.polyfill = false;
      })();
    }

    try {
      Object.keys('foo');
    } catch (e) {
      var originalObjectKeys = Object.keys;
      Object.keys = function (obj) {
        return originalObjectKeys(ES.ToObject(obj));
      };
    }

    var MathShims = {
      acosh: function(value) {
        value = Number(value);
        if (Number.isNaN(value) || value < 1) return NaN;
        if (value === 1) return 0;
        if (value === Infinity) return value;
        return Math.log(value + Math.sqrt(value * value - 1));
      },

      asinh: function(value) {
        value = Number(value);
        if (value === 0 || !global_isFinite(value)) {
          return value;
        }
        return value < 0 ? -Math.asinh(-value) : Math.log(value + Math.sqrt(value * value + 1));
      },

      atanh: function(value) {
        value = Number(value);
        if (Number.isNaN(value) || value < -1 || value > 1) {
          return NaN;
        }
        if (value === -1) return -Infinity;
        if (value === 1) return Infinity;
        if (value === 0) return value;
        return 0.5 * Math.log((1 + value) / (1 - value));
      },

      cbrt: function(value) {
        value = Number(value);
        if (value === 0) return value;
        var negate = value < 0, result;
        if (negate) value = -value;
        result = Math.pow(value, 1/3);
        return negate ? -result : result;
      },

      clz32: function(value) {
        // See https://bugs.ecmascript.org/show_bug.cgi?id=2465
        value = Number(value);
        if (Number.isNaN(value)) return NaN;
        var number = ES.ToUint32(value);
        if (number === 0) {
          return 32;
        }
        return 32 - (number).toString(2).length;
      },

      cosh: function(value) {
        value = Number(value);
        if (value === 0) return 1; // +0 or -0
        if (Number.isNaN(value)) return NaN;
        if (!global_isFinite(value)) return Infinity;
        if (value < 0) value = -value;
        if (value > 21) return Math.exp(value) / 2;
        return (Math.exp(value) + Math.exp(-value)) / 2;
      },

      expm1: function(value) {
        value = Number(value);
        if (value === -Infinity) return -1;
        if (!global_isFinite(value) || value === 0) return value;
        return Math.exp(value) - 1;
      },

      hypot: function(x, y) {
        var anyNaN = false;
        var allZero = true;
        var anyInfinity = false;
        var numbers = [];
        Array.prototype.every.call(arguments, function(arg) {
          var num = Number(arg);
          if (Number.isNaN(num)) anyNaN = true;
          else if (num === Infinity || num === -Infinity) anyInfinity = true;
          else if (num !== 0) allZero = false;
          if (anyInfinity) {
            return false;
          } else if (!anyNaN) {
            numbers.push(Math.abs(num));
          }
          return true;
        });
        if (anyInfinity) return Infinity;
        if (anyNaN) return NaN;
        if (allZero) return 0;

        numbers.sort(function (a, b) { return b - a; });
        var largest = numbers[0];
        var divided = numbers.map(function (number) { return number / largest; });
        var sum = divided.reduce(function (sum, number) { return sum += number * number; }, 0);
        return largest * Math.sqrt(sum);
      },

      log2: function(value) {
        return Math.log(value) * Math.LOG2E;
      },

      log10: function(value) {
        return Math.log(value) * Math.LOG10E;
      },

      log1p: function(value) {
        value = Number(value);
        if (value < -1 || Number.isNaN(value)) return NaN;
        if (value === 0 || value === Infinity) return value;
        if (value === -1) return -Infinity;
        var result = 0;
        var n = 50;

        if (value < 0 || value > 1) return Math.log(1 + value);
        for (var i = 1; i < n; i++) {
          if ((i % 2) === 0) {
            result -= Math.pow(value, i) / i;
          } else {
            result += Math.pow(value, i) / i;
          }
        }

        return result;
      },

      sign: function(value) {
        var number = +value;
        if (number === 0) return number;
        if (Number.isNaN(number)) return number;
        return number < 0 ? -1 : 1;
      },

      sinh: function(value) {
        value = Number(value);
        if (!global_isFinite(value) || value === 0) return value;
        return (Math.exp(value) - Math.exp(-value)) / 2;
      },

      tanh: function(value) {
        value = Number(value);
        if (Number.isNaN(value) || value === 0) return value;
        if (value === Infinity) return 1;
        if (value === -Infinity) return -1;
        return (Math.exp(value) - Math.exp(-value)) / (Math.exp(value) + Math.exp(-value));
      },

      trunc: function(value) {
        var number = Number(value);
        return number < 0 ? -Math.floor(-number) : Math.floor(number);
      },

      imul: function(x, y) {
        // taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul
        var ah  = (x >>> 16) & 0xffff;
        var al = x & 0xffff;
        var bh  = (y >>> 16) & 0xffff;
        var bl = y & 0xffff;
        // the shift by 0 fixes the sign on the high part
        // the final |0 converts the unsigned value into a signed value
        return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
      },

      fround: function(x) {
        if (x === 0 || x === Infinity || x === -Infinity || Number.isNaN(x)) {
          return x;
        }
        var num = Number(x);
        return numberConversion.toFloat32(num);
      }
    };
    defineProperties(Math, MathShims);

    if (Math.imul(0xffffffff, 5) !== -5) {
      // Safari 6.1, at least, reports "0" for this value
      Math.imul = MathShims.imul;
    }

    // Promises
    // Simplest possible implementation; use a 3rd-party library if you
    // want the best possible speed and/or long stack traces.
    var PromiseShim = (function() {

      var Promise, Promise$prototype;

      ES.IsPromise = function(promise) {
        if (!ES.TypeIsObject(promise)) {
          return false;
        }
        if (!promise._promiseConstructor) {
          // _promiseConstructor is a bit more unique than _status, so we'll
          // check that instead of the [[PromiseStatus]] internal field.
          return false;
        }
        if (promise._status === undefined) {
          return false; // uninitialized
        }
        return true;
      };

      // "PromiseCapability" in the spec is what most promise implementations
      // call a "deferred".
      var PromiseCapability = function(C) {
        if (!ES.IsCallable(C)) {
          throw new TypeError('bad promise constructor');
        }
        var capability = this;
        var resolver = function(resolve, reject) {
          capability.resolve = resolve;
          capability.reject = reject;
        };
        capability.promise = ES.Construct(C, [resolver]);
        // see https://bugs.ecmascript.org/show_bug.cgi?id=2478
        if (!capability.promise._es6construct) {
          throw new TypeError('bad promise constructor');
        }
        if (!(ES.IsCallable(capability.resolve) &&
              ES.IsCallable(capability.reject))) {
          throw new TypeError('bad promise constructor');
        }
      };

      // find an appropriate setImmediate-alike
      var setTimeout = globals.setTimeout;
      var makeZeroTimeout;
      if (typeof window !== 'undefined' && ES.IsCallable(window.postMessage)) {
        makeZeroTimeout = function() {
          // from http://dbaron.org/log/20100309-faster-timeouts
          var timeouts = [];
          var messageName = "zero-timeout-message";
          var setZeroTimeout = function(fn) {
            timeouts.push(fn);
            window.postMessage(messageName, "*");
          };
          var handleMessage = function(event) {
            if (event.source == window && event.data == messageName) {
              event.stopPropagation();
              if (timeouts.length === 0) { return; }
              var fn = timeouts.shift();
              fn();
            }
          };
          window.addEventListener("message", handleMessage, true);
          return setZeroTimeout;
        };
      }
      var makePromiseAsap = function() {
        // An efficient task-scheduler based on a pre-existing Promise
        // implementation, which we can use even if we override the
        // global Promise below (in order to workaround bugs)
        // https://github.com/Raynos/observ-hash/issues/2#issuecomment-35857671
        var P = globals.Promise;
        return P && P.resolve && function(task) {
          return P.resolve().then(task);
        };
      };
      var enqueue = ES.IsCallable(globals.setImmediate) ?
        globals.setImmediate.bind(globals) :
        typeof process === 'object' && process.nextTick ? process.nextTick :
        makePromiseAsap() ||
        (ES.IsCallable(makeZeroTimeout) ? makeZeroTimeout() :
        function(task) { setTimeout(task, 0); }); // fallback

      var triggerPromiseReactions = function(reactions, x) {
        reactions.forEach(function(reaction) {
          enqueue(function() {
            // PromiseReactionTask
            var handler = reaction.handler;
            var capability = reaction.capability;
            var resolve = capability.resolve;
            var reject = capability.reject;
            try {
              var result = handler(x);
              if (result === capability.promise) {
                throw new TypeError('self resolution');
              }
              var updateResult =
                updatePromiseFromPotentialThenable(result, capability);
              if (!updateResult) {
                resolve(result);
              }
            } catch (e) {
              reject(e);
            }
          });
        });
      };

      var updatePromiseFromPotentialThenable = function(x, capability) {
        if (!ES.TypeIsObject(x)) {
          return false;
        }
        var resolve = capability.resolve;
        var reject = capability.reject;
        try {
          var then = x.then; // only one invocation of accessor
          if (!ES.IsCallable(then)) { return false; }
          then.call(x, resolve, reject);
        } catch(e) {
          reject(e);
        }
        return true;
      };

      var promiseResolutionHandler = function(promise, onFulfilled, onRejected){
        return function(x) {
          if (x === promise) {
            return onRejected(new TypeError('self resolution'));
          }
          var C = promise._promiseConstructor;
          var capability = new PromiseCapability(C);
          var updateResult = updatePromiseFromPotentialThenable(x, capability);
          if (updateResult) {
            return capability.promise.then(onFulfilled, onRejected);
          } else {
            return onFulfilled(x);
          }
        };
      };

      Promise = function(resolver) {
        var promise = this;
        promise = emulateES6construct(promise);
        if (!promise._promiseConstructor) {
          // we use _promiseConstructor as a stand-in for the internal
          // [[PromiseStatus]] field; it's a little more unique.
          throw new TypeError('bad promise');
        }
        if (promise._status !== undefined) {
          throw new TypeError('promise already initialized');
        }
        // see https://bugs.ecmascript.org/show_bug.cgi?id=2482
        if (!ES.IsCallable(resolver)) {
          throw new TypeError('not a valid resolver');
        }
        promise._status = 'unresolved';
        promise._resolveReactions = [];
        promise._rejectReactions = [];

        var resolve = function(resolution) {
          if (promise._status !== 'unresolved') { return; }
          var reactions = promise._resolveReactions;
          promise._result = resolution;
          promise._resolveReactions = undefined;
          promise._rejectReactions = undefined;
          promise._status = 'has-resolution';
          triggerPromiseReactions(reactions, resolution);
        };
        var reject = function(reason) {
          if (promise._status !== 'unresolved') { return; }
          var reactions = promise._rejectReactions;
          promise._result = reason;
          promise._resolveReactions = undefined;
          promise._rejectReactions = undefined;
          promise._status = 'has-rejection';
          triggerPromiseReactions(reactions, reason);
        };
        try {
          resolver(resolve, reject);
        } catch (e) {
          reject(e);
        }
        return promise;
      };
      Promise$prototype = Promise.prototype;
      defineProperties(Promise, {
        '@@create': function(obj) {
          var constructor = this;
          // AllocatePromise
          // The `obj` parameter is a hack we use for es5
          // compatibility.
          var prototype = constructor.prototype || Promise$prototype;
          obj = obj || create(prototype);
          defineProperties(obj, {
            _status: undefined,
            _result: undefined,
            _resolveReactions: undefined,
            _rejectReactions: undefined,
            _promiseConstructor: undefined
          });
          obj._promiseConstructor = constructor;
          return obj;
        }
      });

      var _promiseAllResolver = function(index, values, capability, remaining) {
        var done = false;
        return function(x) {
          if (done) { return; } // protect against being called multiple times
          done = true;
          values[index] = x;
          if ((--remaining.count) === 0) {
            var resolve = capability.resolve;
            resolve(values); // call w/ this===undefined
          }
        };
      };

      Promise.all = function(iterable) {
        var C = this;
        var capability = new PromiseCapability(C);
        var resolve = capability.resolve;
        var reject = capability.reject;
        try {
          if (!ES.IsIterable(iterable)) {
            throw new TypeError('bad iterable');
          }
          var it = ES.GetIterator(iterable);
          var values = [], remaining = { count: 1 };
          for (var index = 0; ; index++) {
            var next = ES.IteratorNext(it);
            if (next.done) {
              break;
            }
            var nextPromise = C.resolve(next.value);
            var resolveElement = _promiseAllResolver(
              index, values, capability, remaining
            );
            remaining.count++;
            nextPromise.then(resolveElement, capability.reject);
          }
          if ((--remaining.count) === 0) {
            resolve(values); // call w/ this===undefined
          }
        } catch (e) {
          reject(e);
        }
        return capability.promise;
      };

      Promise.race = function(iterable) {
        var C = this;
        var capability = new PromiseCapability(C);
        var resolve = capability.resolve;
        var reject = capability.reject;
        try {
          if (!ES.IsIterable(iterable)) {
            throw new TypeError('bad iterable');
          }
          var it = ES.GetIterator(iterable);
          while (true) {
            var next = ES.IteratorNext(it);
            if (next.done) {
              // If iterable has no items, resulting promise will never
              // resolve; see:
              // https://github.com/domenic/promises-unwrapping/issues/75
              // https://bugs.ecmascript.org/show_bug.cgi?id=2515
              break;
            }
            var nextPromise = C.resolve(next.value);
            nextPromise.then(resolve, reject);
          }
        } catch (e) {
          reject(e);
        }
        return capability.promise;
      };

      Promise.reject = function(reason) {
        var C = this;
        var capability = new PromiseCapability(C);
        var reject = capability.reject;
        reject(reason); // call with this===undefined
        return capability.promise;
      };

      Promise.resolve = function(v) {
        var C = this;
        if (ES.IsPromise(v)) {
          var constructor = v._promiseConstructor;
          if (constructor === C) { return v; }
        }
        var capability = new PromiseCapability(C);
        var resolve = capability.resolve;
        resolve(v); // call with this===undefined
        return capability.promise;
      };

      Promise.prototype['catch'] = function( onRejected ) {
        return this.then(undefined, onRejected);
      };

      Promise.prototype.then = function( onFulfilled, onRejected ) {
        var promise = this;
        if (!ES.IsPromise(promise)) { throw new TypeError('not a promise'); }
        // this.constructor not this._promiseConstructor; see
        // https://bugs.ecmascript.org/show_bug.cgi?id=2513
        var C = this.constructor;
        var capability = new PromiseCapability(C);
        if (!ES.IsCallable(onRejected)) {
          onRejected = function(e) { throw e; };
        }
        if (!ES.IsCallable(onFulfilled)) {
          onFulfilled = function(x) { return x; };
        }
        var resolutionHandler =
          promiseResolutionHandler(promise, onFulfilled, onRejected);
        var resolveReaction =
          { capability: capability, handler: resolutionHandler };
        var rejectReaction =
          { capability: capability, handler: onRejected };
        switch (promise._status) {
        case 'unresolved':
          promise._resolveReactions.push(resolveReaction);
          promise._rejectReactions.push(rejectReaction);
          break;
        case 'has-resolution':
          triggerPromiseReactions([resolveReaction], promise._result);
          break;
        case 'has-rejection':
          triggerPromiseReactions([rejectReaction], promise._result);
          break;
        default:
          throw new TypeError('unexpected');
        }
        return capability.promise;
      };

      return Promise;
    })();
    // export the Promise constructor.
    defineProperties(globals, { Promise: PromiseShim });
    // In Chrome 33 (and thereabouts) Promise is defined, but the
    // implementation is buggy in a number of ways.  Let's check subclassing
    // support to see if we have a buggy implementation.
    var promiseSupportsSubclassing = supportsSubclassing(globals.Promise, function(S) {
      return S.resolve(42) instanceof S;
    });
    var promiseIgnoresNonFunctionThenCallbacks = (function () {
      try {
        globals.Promise.reject(42).then(null, 5).then(null, function () {});
        return true;
      } catch (ex) {
        return false;
      }
    }());
    if (!promiseSupportsSubclassing || !promiseIgnoresNonFunctionThenCallbacks) {
      globals.Promise = PromiseShim;
    }

    // Map and Set require a true ES5 environment
    if (supportsDescriptors) {

      var fastkey = function fastkey(key) {
        var type = typeof key;
        if (type === 'string') {
          return '$' + key;
        } else if (type === 'number') {
          // note that -0 will get coerced to "0" when used as a property key
          return key;
        }
        return null;
      };

      var emptyObject = function emptyObject() {
        // accomodate some older not-quite-ES5 browsers
        return Object.create ? Object.create(null) : {};
      };

      var collectionShims = {
        Map: (function() {

          var empty = {};

          function MapEntry(key, value) {
            this.key = key;
            this.value = value;
            this.next = null;
            this.prev = null;
          }

          MapEntry.prototype.isRemoved = function() {
            return this.key === empty;
          };

          function MapIterator(map, kind) {
            this.head = map._head;
            this.i = this.head;
            this.kind = kind;
          }

          MapIterator.prototype = {
            next: function() {
              var i = this.i, kind = this.kind, head = this.head, result;
              if (this.i === undefined) {
                return { value: undefined, done: true };
              }
              while (i.isRemoved() && i !== head) {
                // back up off of removed entries
                i = i.prev;
              }
              // advance to next unreturned element.
              while (i.next !== head) {
                i = i.next;
                if (!i.isRemoved()) {
                  if (kind === "key") {
                    result = i.key;
                  } else if (kind === "value") {
                    result = i.value;
                  } else {
                    result = [i.key, i.value];
                  }
                  this.i = i;
                  return { value: result, done: false };
                }
              }
              // once the iterator is done, it is done forever.
              this.i = undefined;
              return { value: undefined, done: true };
            }
          };
          addIterator(MapIterator.prototype);

          function Map() {
            var map = this;
            map = emulateES6construct(map);
            if (!map._es6map) {
              throw new TypeError('bad map');
            }

            var head = new MapEntry(null, null);
            // circular doubly-linked list.
            head.next = head.prev = head;

            defineProperties(map, {
              '_head': head,
              '_storage': emptyObject(),
              '_size': 0
            });

            // Optionally initialize map from iterable
            var iterable = arguments[0];
            if (iterable !== undefined && iterable !== null) {
              var it = ES.GetIterator(iterable);
              var adder = map.set;
              if (!ES.IsCallable(adder)) { throw new TypeError('bad map'); }
              while (true) {
                var next = ES.IteratorNext(it);
                if (next.done) { break; }
                var nextItem = next.value;
                if (!ES.TypeIsObject(nextItem)) {
                  throw new TypeError('expected iterable of pairs');
                }
                adder.call(map, nextItem[0], nextItem[1]);
              }
            }
            return map;
          }
          var Map$prototype = Map.prototype;
          defineProperties(Map, {
            '@@create': function(obj) {
              var constructor = this;
              var prototype = constructor.prototype || Map$prototype;
              obj = obj || create(prototype);
              defineProperties(obj, { _es6map: true });
              return obj;
            }
          });

          Object.defineProperty(Map.prototype, 'size', {
            configurable: true,
            enumerable: false,
            get: function() {
              if (typeof this._size === 'undefined') {
                throw new TypeError('size method called on incompatible Map');
              }
              return this._size;
            }
          });

          defineProperties(Map.prototype, {
            get: function(key) {
              var fkey = fastkey(key);
              if (fkey !== null) {
                // fast O(1) path
                var entry = this._storage[fkey];
                return entry ? entry.value : undefined;
              }
              var head = this._head, i = head;
              while ((i = i.next) !== head) {
                if (ES.SameValueZero(i.key, key)) {
                  return i.value;
                }
              }
              return undefined;
            },

            has: function(key) {
              var fkey = fastkey(key);
              if (fkey !== null) {
                // fast O(1) path
                return typeof this._storage[fkey] !== 'undefined';
              }
              var head = this._head, i = head;
              while ((i = i.next) !== head) {
                if (ES.SameValueZero(i.key, key)) {
                  return true;
                }
              }
              return false;
            },

            set: function(key, value) {
              var head = this._head, i = head, entry;
              var fkey = fastkey(key);
              if (fkey !== null) {
                // fast O(1) path
                if (typeof this._storage[fkey] !== 'undefined') {
                  this._storage[fkey].value = value;
                  return;
                } else {
                  entry = this._storage[fkey] = new MapEntry(key, value);
                  i = head.prev;
                  // fall through
                }
              }
              while ((i = i.next) !== head) {
                if (ES.SameValueZero(i.key, key)) {
                  i.value = value;
                  return;
                }
              }
              entry = entry || new MapEntry(key, value);
              if (ES.SameValue(-0, key)) {
                entry.key = +0; // coerce -0 to +0 in entry
              }
              entry.next = this._head;
              entry.prev = this._head.prev;
              entry.prev.next = entry;
              entry.next.prev = entry;
              this._size += 1;
            },

            'delete': function(key) {
              var head = this._head, i = head;
              var fkey = fastkey(key);
              if (fkey !== null) {
                // fast O(1) path
                if (typeof this._storage[fkey] === 'undefined') {
                  return false;
                }
                i = this._storage[fkey].prev;
                delete this._storage[fkey];
                // fall through
              }
              while ((i = i.next) !== head) {
                if (ES.SameValueZero(i.key, key)) {
                  i.key = i.value = empty;
                  i.prev.next = i.next;
                  i.next.prev = i.prev;
                  this._size -= 1;
                  return true;
                }
              }
              return false;
            },

            clear: function() {
              this._size = 0;
              this._storage = emptyObject();
              var head = this._head, i = head, p = i.next;
              while ((i = p) !== head) {
                i.key = i.value = empty;
                p = i.next;
                i.next = i.prev = head;
              }
              head.next = head.prev = head;
            },

            keys: function() {
              return new MapIterator(this, "key");
            },

            values: function() {
              return new MapIterator(this, "value");
            },

            entries: function() {
              return new MapIterator(this, "key+value");
            },

            forEach: function(callback) {
              var context = arguments.length > 1 ? arguments[1] : null;
              var it = this.entries();
              for (var entry = it.next(); !entry.done; entry = it.next()) {
                callback.call(context, entry.value[1], entry.value[0], this);
              }
            }
          });
          addIterator(Map.prototype, function() { return this.entries(); });

          return Map;
        })(),

        Set: (function() {
          // Creating a Map is expensive.  To speed up the common case of
          // Sets containing only string or numeric keys, we use an object
          // as backing storage and lazily create a full Map only when
          // required.
          var SetShim = function Set() {
            var set = this;
            set = emulateES6construct(set);
            if (!set._es6set) {
              throw new TypeError('bad set');
            }

            defineProperties(set, {
              '[[SetData]]': null,
              '_storage': emptyObject()
            });

            // Optionally initialize map from iterable
            var iterable = arguments[0];
            if (iterable !== undefined && iterable !== null) {
              var it = ES.GetIterator(iterable);
              var adder = set.add;
              if (!ES.IsCallable(adder)) { throw new TypeError('bad set'); }
              while (true) {
                var next = ES.IteratorNext(it);
                if (next.done) { break; }
                var nextItem = next.value;
                adder.call(set, nextItem);
              }
            }
            return set;
          };
          var Set$prototype = SetShim.prototype;
          defineProperties(SetShim, {
            '@@create': function(obj) {
              var constructor = this;
              var prototype = constructor.prototype || Set$prototype;
              obj = obj || create(prototype);
              defineProperties(obj, { _es6set: true });
              return obj;
            }
          });

          // Switch from the object backing storage to a full Map.
          var ensureMap = function ensureMap(set) {
            if (!set['[[SetData]]']) {
              var m = set['[[SetData]]'] = new collectionShims.Map();
              Object.keys(set._storage).forEach(function(k) {
                // fast check for leading '$'
                if (k.charCodeAt(0) === 36) {
                  k = k.substring(1);
                } else {
                  k = +k;
                }
                m.set(k, k);
              });
              set._storage = null; // free old backing storage
            }
          };

          Object.defineProperty(SetShim.prototype, 'size', {
            configurable: true,
            enumerable: false,
            get: function() {
              if (typeof this._storage === 'undefined') {
                // https://github.com/paulmillr/es6-shim/issues/176
                throw new TypeError('size method called on incompatible Set');
              }
              ensureMap(this);
              return this['[[SetData]]'].size;
            }
          });

          defineProperties(SetShim.prototype, {
            has: function(key) {
              var fkey;
              if (this._storage && (fkey = fastkey(key)) !== null) {
                return !!this._storage[fkey];
              }
              ensureMap(this);
              return this['[[SetData]]'].has(key);
            },

            add: function(key) {
              var fkey;
              if (this._storage && (fkey = fastkey(key)) !== null) {
                this._storage[fkey]=true;
                return;
              }
              ensureMap(this);
              return this['[[SetData]]'].set(key, key);
            },

            'delete': function(key) {
              var fkey;
              if (this._storage && (fkey = fastkey(key)) !== null) {
                delete this._storage[fkey];
                return;
              }
              ensureMap(this);
              return this['[[SetData]]']['delete'](key);
            },

            clear: function() {
              if (this._storage) {
                this._storage = emptyObject();
                return;
              }
              return this['[[SetData]]'].clear();
            },

            keys: function() {
              ensureMap(this);
              return this['[[SetData]]'].keys();
            },

            values: function() {
              ensureMap(this);
              return this['[[SetData]]'].values();
            },

            entries: function() {
              ensureMap(this);
              return this['[[SetData]]'].entries();
            },

            forEach: function(callback) {
              var context = arguments.length > 1 ? arguments[1] : null;
              var entireSet = this;
              ensureMap(this);
              this['[[SetData]]'].forEach(function(value, key) {
                callback.call(context, key, key, entireSet);
              });
            }
          });
          addIterator(SetShim.prototype, function() { return this.values(); });

          return SetShim;
        })()
      };
      defineProperties(globals, collectionShims);

      if (globals.Map || globals.Set) {
        /*
          - In Firefox < 23, Map#size is a function.
          - In all current Firefox, Set#entries/keys/values & Map#clear do not exist
          - https://bugzilla.mozilla.org/show_bug.cgi?id=869996
          - In Firefox 24, Map and Set do not implement forEach
          - In Firefox 25 at least, Map and Set are callable without "new"
        */
        if (
          typeof globals.Map.prototype.clear !== 'function' ||
          new globals.Set().size !== 0 ||
          new globals.Map().size !== 0 ||
          typeof globals.Map.prototype.keys !== 'function' ||
          typeof globals.Set.prototype.keys !== 'function' ||
          typeof globals.Map.prototype.forEach !== 'function' ||
          typeof globals.Set.prototype.forEach !== 'function' ||
          isCallableWithoutNew(globals.Map) ||
          isCallableWithoutNew(globals.Set) ||
          !supportsSubclassing(globals.Map, function(M) {
            return (new M([])) instanceof M;
          })
        ) {
          globals.Map = collectionShims.Map;
          globals.Set = collectionShims.Set;
        }
      }
      // Shim incomplete iterator implementations.
      addIterator(Object.getPrototypeOf((new globals.Map()).keys()));
      addIterator(Object.getPrototypeOf((new globals.Set()).keys()));
    }
  };

  if (typeof define === 'function' && define.amd) {
    define('es6-shim',main); // RequireJS
  } else {
    main(); // CommonJS and <script>
  }
})();


// Copyright (C) 2011-2012 Software Languages Lab, Vrije Universiteit Brussel
// This code is dual-licensed under both the Apache License and the MPL

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* Version: MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is a shim for the ES-Harmony reflection module
 *
 * The Initial Developer of the Original Code is
 * Tom Van Cutsem, Vrije Universiteit Brussel.
 * Portions created by the Initial Developer are Copyright (C) 2011-2012
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 */

 // ----------------------------------------------------------------------------

 // This file is a polyfill for the upcoming ECMAScript Reflect API,
 // including support for Proxies. See the draft specification at:
 // http://wiki.ecmascript.org/doku.php?id=harmony:reflect_api
 // http://wiki.ecmascript.org/doku.php?id=harmony:direct_proxies

 // For an implementation of the Handler API, see handlers.js, which implements:
 // http://wiki.ecmascript.org/doku.php?id=harmony:virtual_object_api

 // This implementation supersedes the earlier polyfill at:
 // code.google.com/p/es-lab/source/browse/trunk/src/proxies/DirectProxies.js

 // This code was tested on tracemonkey / Firefox 12
//  (and should run fine on older Firefox versions starting with FF4)
 // The code also works correctly on
 //   v8 --harmony_proxies --harmony_weakmaps (v3.6.5.1)

 // Language Dependencies:
 //  - ECMAScript 5/strict
 //  - "old" (i.e. non-direct) Harmony Proxies
 //  - Harmony WeakMaps
 // Patches:
 //  - Object.{freeze,seal,preventExtensions}
 //  - Object.{isFrozen,isSealed,isExtensible}
 //  - Object.getPrototypeOf
 //  - Object.prototype.valueOf
 //  - Object.prototype.isPrototypeOf
 //  - Object.prototype.toString
 //  - Object.prototype.hasOwnProperty
 //  - Object.getOwnPropertyDescriptor
 //  - Object.keys
 //  - Function.prototype.toString
 //  - Date.prototype.toString
 //  - Array.isArray
 //  - Proxy
 // Adds new globals:
 //  - Reflect

 // Direct proxies can be created via Proxy(target, handler)

 // ----------------------------------------------------------------------------

(function(global){ // function-as-module pattern


// === Direct Proxies: Invariant Enforcement ===

// Direct proxies build on non-direct proxies by automatically wrapping
// all user-defined proxy handlers in a Validator handler that checks and
// enforces ES5 invariants.

// A direct proxy is a proxy for an existing object called the target object.

// A Validator handler is a wrapper for a target proxy handler H.
// The Validator forwards all operations to H, but additionally
// performs a number of integrity checks on the results of some traps,
// to make sure H does not violate the ES5 invariants w.r.t. non-configurable
// properties and non-extensible, sealed or frozen objects.

// For each property that H exposes as own, non-configurable
// (e.g. by returning a descriptor from a call to getOwnPropertyDescriptor)
// the Validator handler defines those properties on the target object.
// When the proxy becomes non-extensible, also configurable own properties
// are checked against the target.
// We will call properties that are defined on the target object
// "fixed properties".

// We will name fixed non-configurable properties "sealed properties".
// We will name fixed non-configurable non-writable properties "frozen
// properties".

// The Validator handler upholds the following invariants w.r.t. non-configurability:
// - getOwnPropertyDescriptor cannot report sealed properties as non-existent
// - getOwnPropertyDescriptor cannot report incompatible changes to the
//   attributes of a sealed property (e.g. reporting a non-configurable
//   property as configurable, or reporting a non-configurable, non-writable
//   property as writable)
// - getPropertyDescriptor cannot report sealed properties as non-existent
// - getPropertyDescriptor cannot report incompatible changes to the
//   attributes of a sealed property. It _can_ report incompatible changes
//   to the attributes of non-own, inherited properties.
// - defineProperty cannot make incompatible changes to the attributes of
//   sealed properties
// - deleteProperty cannot report a successful deletion of a sealed property
// - hasOwn cannot report a sealed property as non-existent
// - has cannot report a sealed property as non-existent
// - get cannot report inconsistent values for frozen data
//   properties, and must report undefined for sealed accessors with an
//   undefined getter
// - set cannot report a successful assignment for frozen data
//   properties or sealed accessors with an undefined setter.
// - get{Own}PropertyNames lists all sealed properties of the target.
// - keys lists all enumerable sealed properties of the target.
// - enumerate lists all enumerable sealed properties of the target.
// - if a property of a non-extensible proxy is reported as non-existent,
//   then it must forever be reported as non-existent. This applies to
//   own and inherited properties and is enforced in the
//   deleteProperty, get{Own}PropertyDescriptor, has{Own},
//   get{Own}PropertyNames, keys and enumerate traps

// Violation of any of these invariants by H will result in TypeError being
// thrown.

// Additionally, once Object.preventExtensions, Object.seal or Object.freeze
// is invoked on the proxy, the set of own property names for the proxy is
// fixed. Any property name that is not fixed is called a 'new' property.

// The Validator upholds the following invariants regarding extensibility:
// - getOwnPropertyDescriptor cannot report new properties as existent
//   (it must report them as non-existent by returning undefined)
// - defineProperty cannot successfully add a new property (it must reject)
// - getOwnPropertyNames cannot list new properties
// - hasOwn cannot report true for new properties (it must report false)
// - keys cannot list new properties

// Invariants currently not enforced:
// - getOwnPropertyNames lists only own property names
// - keys lists only enumerable own property names
// Both traps may list more property names than are actually defined on the
// target.

// Invariants with regard to inheritance are currently not enforced.
// - a non-configurable potentially inherited property on a proxy with
//   non-mutable ancestry cannot be reported as non-existent
// (An object with non-mutable ancestry is a non-extensible object whose
// [[Prototype]] is either null or an object with non-mutable ancestry.)

// Changes in Handler API compared to previous harmony:proxies, see:
// http://wiki.ecmascript.org/doku.php?id=strawman:direct_proxies
// http://wiki.ecmascript.org/doku.php?id=harmony:direct_proxies

// ----------------------------------------------------------------------------

// ---- WeakMap polyfill ----

// TODO: find a proper WeakMap polyfill

// define an empty WeakMap so that at least the Reflect module code
// will work in the absence of WeakMaps. Proxy emulation depends on
// actual WeakMaps, so will not work with this little shim.
if (typeof WeakMap === "undefined") {
  global.WeakMap = function(){};
  global.WeakMap.prototype = {
    get: function(k) { return undefined; },
    set: function(k,v) { throw new Error("WeakMap not supported"); }
  };
}

// ---- Normalization functions for property descriptors ----

function isStandardAttribute(name) {
  return /^(get|set|value|writable|enumerable|configurable)$/.test(name);
}

// Adapted from ES5 section 8.10.5
function toPropertyDescriptor(obj) {
  if (Object(obj) !== obj) {
    throw new TypeError("property descriptor should be an Object, given: "+
                        obj);
  }
  var desc = {};
  if ('enumerable' in obj) { desc.enumerable = !!obj.enumerable; }
  if ('configurable' in obj) { desc.configurable = !!obj.configurable; }
  if ('value' in obj) { desc.value = obj.value; }
  if ('writable' in obj) { desc.writable = !!obj.writable; }
  if ('get' in obj) {
    var getter = obj.get;
    if (getter !== undefined && typeof getter !== "function") {
      throw new TypeError("property descriptor 'get' attribute must be "+
                          "callable or undefined, given: "+getter);
    }
    desc.get = getter;
  }
  if ('set' in obj) {
    var setter = obj.set;
    if (setter !== undefined && typeof setter !== "function") {
      throw new TypeError("property descriptor 'set' attribute must be "+
                          "callable or undefined, given: "+setter);
    }
    desc.set = setter;
  }
  if ('get' in desc || 'set' in desc) {
    if ('value' in desc || 'writable' in desc) {
      throw new TypeError("property descriptor cannot be both a data and an "+
                          "accessor descriptor: "+obj);
    }
  }
  return desc;
}

function isAccessorDescriptor(desc) {
  if (desc === undefined) return false;
  return ('get' in desc || 'set' in desc);
}
function isDataDescriptor(desc) {
  if (desc === undefined) return false;
  return ('value' in desc || 'writable' in desc);
}
function isGenericDescriptor(desc) {
  if (desc === undefined) return false;
  return !isAccessorDescriptor(desc) && !isDataDescriptor(desc);
}

function toCompletePropertyDescriptor(desc) {
  var internalDesc = toPropertyDescriptor(desc);
  if (isGenericDescriptor(internalDesc) || isDataDescriptor(internalDesc)) {
    if (!('value' in internalDesc)) { internalDesc.value = undefined; }
    if (!('writable' in internalDesc)) { internalDesc.writable = false; }
  } else {
    if (!('get' in internalDesc)) { internalDesc.get = undefined; }
    if (!('set' in internalDesc)) { internalDesc.set = undefined; }
  }
  if (!('enumerable' in internalDesc)) { internalDesc.enumerable = false; }
  if (!('configurable' in internalDesc)) { internalDesc.configurable = false; }
  return internalDesc;
}

function isEmptyDescriptor(desc) {
  return !('get' in desc) &&
         !('set' in desc) &&
         !('value' in desc) &&
         !('writable' in desc) &&
         !('enumerable' in desc) &&
         !('configurable' in desc);
}

function isEquivalentDescriptor(desc1, desc2) {
  return sameValue(desc1.get, desc2.get) &&
         sameValue(desc1.set, desc2.set) &&
         sameValue(desc1.value, desc2.value) &&
         sameValue(desc1.writable, desc2.writable) &&
         sameValue(desc1.enumerable, desc2.enumerable) &&
         sameValue(desc1.configurable, desc2.configurable);
}

// copied from http://wiki.ecmascript.org/doku.php?id=harmony:egal
function sameValue(x, y) {
  if (x === y) {
    // 0 === -0, but they are not identical
    return x !== 0 || 1 / x === 1 / y;
  }

  // NaN !== NaN, but they are identical.
  // NaNs are the only non-reflexive value, i.e., if x !== x,
  // then x is a NaN.
  // isNaN is broken: it converts its argument to number, so
  // isNaN("foo") => true
  return x !== x && y !== y;
}

/**
 * Returns a fresh property descriptor that is guaranteed
 * to be complete (i.e. contain all the standard attributes).
 * Additionally, any non-standard enumerable properties of
 * attributes are copied over to the fresh descriptor.
 *
 * If attributes is undefined, returns undefined.
 *
 * See also: http://wiki.ecmascript.org/doku.php?id=harmony:proxies_semantics
 */
function normalizeAndCompletePropertyDescriptor(attributes) {
  if (attributes === undefined) { return undefined; }
  var desc = toCompletePropertyDescriptor(attributes);
  // Note: no need to call FromPropertyDescriptor(desc), as we represent
  // "internal" property descriptors as proper Objects from the start
  for (var name in attributes) {
    if (!isStandardAttribute(name)) {
      Object.defineProperty(desc, name,
        { value: attributes[name],
          writable: true,
          enumerable: true,
          configurable: true });
    }
  }
  return desc;
}

/**
 * Returns a fresh property descriptor whose standard
 * attributes are guaranteed to be data properties of the right type.
 * Additionally, any non-standard enumerable properties of
 * attributes are copied over to the fresh descriptor.
 *
 * If attributes is undefined, will throw a TypeError.
 *
 * See also: http://wiki.ecmascript.org/doku.php?id=harmony:proxies_semantics
 */
function normalizePropertyDescriptor(attributes) {
  var desc = toPropertyDescriptor(attributes);
  // Note: no need to call FromGenericPropertyDescriptor(desc), as we represent
  // "internal" property descriptors as proper Objects from the start
  for (var name in attributes) {
    if (!isStandardAttribute(name)) {
      Object.defineProperty(desc, name,
        { value: attributes[name],
          writable: true,
          enumerable: true,
          configurable: true });
    }
  }
  return desc;
}

// store a reference to the real ES5 primitives before patching them later
var prim_preventExtensions =        Object.preventExtensions,
    prim_seal =                     Object.seal,
    prim_freeze =                   Object.freeze,
    prim_isExtensible =             Object.isExtensible,
    prim_isSealed =                 Object.isSealed,
    prim_isFrozen =                 Object.isFrozen,
    prim_getPrototypeOf =           Object.getPrototypeOf,
    prim_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
    prim_defineProperty =           Object.defineProperty,
    prim_keys =                     Object.keys,
    prim_isArray =                  Array.isArray,
    prim_concat =                   Array.prototype.concat,
    prim_isPrototypeOf =            Object.prototype.isPrototypeOf,
    prim_hasOwnProperty =           Object.prototype.hasOwnProperty;

// these will point to the patched versions of the respective methods on
// Object. They are used within this module as the "intrinsic" bindings
// of these methods (i.e. the "original" bindings as defined in the spec)
var Object_isFrozen, Object_isSealed, Object_isExtensible, Object_getPrototypeOf;

/**
 * A property 'name' is fixed if it is an own property of the target.
 */
function isFixed(name, target) {
  return ({}).hasOwnProperty.call(target, name);
}
function isSealed(name, target) {
  var desc = Object.getOwnPropertyDescriptor(target, name);
  if (desc === undefined) { return false; }
  return desc.configurable === false;
}
function isSealedDesc(desc) {
  return desc !== undefined && desc.configurable === false;
}

/**
 * Performs all validation that Object.defineProperty performs,
 * without actually defining the property. Returns a boolean
 * indicating whether validation succeeded.
 *
 * Implementation transliterated from ES5.1 section 8.12.9
 */
function isCompatibleDescriptor(extensible, current, desc) {
  if (current === undefined && extensible === false) {
    return false;
  }
  if (current === undefined && extensible === true) {
    return true;
  }
  if (isEmptyDescriptor(desc)) {
    return true;
  }
  if (isEquivalentDescriptor(current, desc)) {
    return true;
  }
  if (current.configurable === false) {
    if (desc.configurable === true) {
      return false;
    }
    if ('enumerable' in desc && desc.enumerable !== current.enumerable) {
      return false;
    }
  }
  if (isGenericDescriptor(desc)) {
    return true;
  }
  if (isDataDescriptor(current) !== isDataDescriptor(desc)) {
    if (current.configurable === false) {
      return false;
    }
    return true;
  }
  if (isDataDescriptor(current) && isDataDescriptor(desc)) {
    if (current.configurable === false) {
      if (current.writable === false && desc.writable === true) {
        return false;
      }
      if (current.writable === false) {
        if ('value' in desc && !sameValue(desc.value, current.value)) {
          return false;
        }
      }
    }
    return true;
  }
  if (isAccessorDescriptor(current) && isAccessorDescriptor(desc)) {
    if (current.configurable === false) {
      if ('set' in desc && !sameValue(desc.set, current.set)) {
        return false;
      }
      if ('get' in desc && !sameValue(desc.get, current.get)) {
        return false;
      }
    }
  }
  return true;
}

// ES6 7.3.11 SetIntegrityLevel
//  - based on draft May 22, but using Object.getOwnPropertyNames rather than
//    Reflect.ownKeys (as ownKeys does no invariant checking)
// level is one of "sealed" or "frozen"
function setIntegrityLevel(target, level) {
  var ownProps = Object.getOwnPropertyNames(target);
  var pendingException = undefined;
  if (level === "sealed") {
    var l = +ownProps.length;
    var k;
    for (var i = 0; i < l; i++) {
      k = String(ownProps[i]);
      try {
        Object.defineProperty(target, k, { configurable: false });
      } catch (e) {
        if (pendingException === undefined) {
          pendingException = e;
        }
      }
    }
  } else {
    // level === "frozen"
    var l = +ownProps.length;
    var k;
    for (var i = 0; i < l; i++) {
      k = String(ownProps[i]);
      try {
        var currentDesc = Object.getOwnPropertyDescriptor(target, k);
        if (currentDesc !== undefined) {
          var desc;
          if (isAccessorDescriptor(currentDesc)) {
            desc = { configurable: false }
          } else {
            desc = { configurable: false, writable: false }
          }
          Object.defineProperty(target, k, desc);
        }        
      } catch (e) {
        if (pendingException === undefined) {
          pendingException = e;
        }
      }
    }
  }
  return Reflect.preventExtensions(target);
}

// ES6 7.3.12 TestIntegrityLevel
//  - based on draft May 22, but using Object.getOwnPropertyNames rather than
//    Reflect.ownKeys (as ownKeys does no invariant checking)
// level is one of "sealed" or "frozen"
function testIntegrityLevel(target, level) {
  var isExtensible = Object_isExtensible(target);
  if (isExtensible) return false;
  
  var ownProps = Object.getOwnPropertyNames(target);
  var pendingException = undefined;
  var configurable = false;
  var writable = false;
  
  var l = +ownProps.length;
  var k;
  var currentDesc;
  for (var i = 0; i < l; i++) {
    k = String(ownProps[i]);
    try {
      currentDesc = Object.getOwnPropertyDescriptor(target, k);
      configurable = configurable || currentDesc.configurable;
      if (isDataDescriptor(currentDesc)) {
        writable = writable || currentDesc.writable;
      }
    } catch (e) {
      if (pendingException === undefined) {
        pendingException = e;
        configurable = true;
      }
    }
  }
  if (pendingException !== undefined) {
    throw pendingException;
  }
  if (level === "frozen" && writable === true) {
    return false;
  }
  if (configurable === true) {
    return false;
  }
  return true;
}

// ---- The Validator handler wrapper around user handlers ----

/**
 * @param target the object wrapped by this proxy.
 * As long as the proxy is extensible, only non-configurable properties
 * are checked against the target. Once the proxy becomes non-extensible,
 * invariants w.r.t. non-extensibility are also enforced.
 *
 * @param handler the handler of the direct proxy. The object emulated by
 * this handler is validated against the target object of the direct proxy.
 * Any violations that the handler makes against the invariants
 * of the target will cause a TypeError to be thrown.
 *
 * Both target and handler must be proper Objects at initialization time.
 */
function Validator(target, handler) {
  // for non-revokable proxies, these are const references
  // for revokable proxies, on revocation:
  // - this.target is set to null
  // - this.handler is set to a handler that throws on all traps
  this.target  = target;
  this.handler = handler;
}

Validator.prototype = {

  /**
   * If getTrap returns undefined, the caller should perform the
   * default forwarding behavior.
   * If getTrap returns normally otherwise, the return value
   * will be a callable trap function. When calling the trap function,
   * the caller is responsible for binding its |this| to |this.handler|.
   */
  getTrap: function(trapName) {
    var trap = this.handler[trapName];
    if (trap === undefined) {
      // the trap was not defined,
      // perform the default forwarding behavior
      return undefined;
    }

    if (typeof trap !== "function") {
      throw new TypeError(trapName + " trap is not callable: "+trap);
    }

    return trap;
  },

  // === fundamental traps ===

  /**
   * If name denotes a fixed property, check:
   *   - whether targetHandler reports it as existent
   *   - whether the returned descriptor is compatible with the fixed property
   * If the proxy is non-extensible, check:
   *   - whether name is not a new property
   * Additionally, the returned descriptor is normalized and completed.
   */
  getOwnPropertyDescriptor: function(name) {
    

    var trap = this.getTrap("getOwnPropertyDescriptor");
    if (trap === undefined) {
      return Reflect.getOwnPropertyDescriptor(this.target, name);
    }

    name = String(name);
    var desc = trap.call(this.handler, this.target, name);
    desc = normalizeAndCompletePropertyDescriptor(desc);

    var targetDesc = Object.getOwnPropertyDescriptor(this.target, name);
    var extensible = Object.isExtensible(this.target);

    if (desc === undefined) {
      if (isSealedDesc(targetDesc)) {
        throw new TypeError("cannot report non-configurable property '"+name+
                            "' as non-existent");
      }
      if (!extensible && targetDesc !== undefined) {
          // if handler is allowed to return undefined, we cannot guarantee
          // that it will not return a descriptor for this property later.
          // Once a property has been reported as non-existent on a non-extensible
          // object, it should forever be reported as non-existent
          throw new TypeError("cannot report existing own property '"+name+
                              "' as non-existent on a non-extensible object");
      }
      return undefined;
    }

    // at this point, we know (desc !== undefined), i.e.
    // targetHandler reports 'name' as an existing property

    // Note: we could collapse the following two if-tests into a single
    // test. Separating out the cases to improve error reporting.

    if (!extensible) {
      if (targetDesc === undefined) {
        throw new TypeError("cannot report a new own property '"+
                            name + "' on a non-extensible object");
      }
    }

    if (name !== undefined) {
      if (!isCompatibleDescriptor(extensible, targetDesc, desc)) {
        throw new TypeError("cannot report incompatible property descriptor "+
                            "for property '"+name+"'");
      }
    }

    if (desc.configurable === false && !isSealedDesc(targetDesc)) {
      // if the property is configurable or non-existent on the target,
      // but is reported as a non-configurable property, it may later be
      // reported as configurable or non-existent, which violates the
      // invariant that if the property might change or disappear, the
      // configurable attribute must be true.
      throw new TypeError("cannot report a non-configurable descriptor "+
                          "for configurable or non-existent property '"+name+"'");
    }

    return desc;
  },

  /**
   * In the direct proxies design with refactored prototype climbing,
   * this trap is deprecated. For proxies-as-prototypes, instead
   * of calling this trap, the get, set, has or enumerate traps are
   * called instead.
   *
   * In this implementation, we "abuse" getPropertyDescriptor to
   * support trapping the get or set traps for proxies-as-prototypes.
   * We do this by returning a getter/setter pair that invokes
   * the corresponding traps.
   *
   * While this hack works for inherited property access, it has some
   * quirks:
   *
   * In Firefox, this trap is only called after a prior invocation
   * of the 'has' trap has returned true. Hence, expect the following
   * behavior:
   * <code>
   * var child = Object.create(Proxy(target, handler));
   * child[name] // triggers handler.has(target, name)
   * // if that returns true, triggers handler.get(target, name, child)
   * </code>
   *
   * On v8, the 'in' operator, when applied to an object that inherits
   * from a proxy, will call getPropertyDescriptor and walk the proto-chain.
   * That calls the below getPropertyDescriptor trap on the proxy. The
   * result of the 'in'-operator is then determined by whether this trap
   * returns undefined or a property descriptor object. That is why
   * we first explicitly trigger the 'has' trap to determine whether
   * the property exists.
   *
   * This has the side-effect that when enumerating properties on
   * an object that inherits from a proxy in v8, only properties
   * for which 'has' returns true are returned:
   *
   * <code>
   * var child = Object.create(Proxy(target, handler));
   * for (var prop in child) {
   *   // only enumerates prop if (prop in child) returns true
   * }
   * </code>
   */
  getPropertyDescriptor: function(name) {
    var handler = this;

    if (!handler.has(name)) return undefined;

    return {
      get: function() {
        return handler.get(this, name);
      },
      set: function(val) {
        if (handler.set(this, name, val)) {
          return val;
        } else {
          throw new TypeError("failed assignment to "+name);
        }
      },
      enumerable: true,
      configurable: true
    };
  },

  /**
   * If name denotes a fixed property, check for incompatible changes.
   * If the proxy is non-extensible, check that new properties are rejected.
   */
  defineProperty: function(name, desc) {
    // TODO(tvcutsem): the current tracemonkey implementation of proxies
    // auto-completes 'desc', which is not correct. 'desc' should be
    // normalized, but not completed. Consider:
    // Object.defineProperty(proxy, 'foo', {enumerable:false})
    // This trap will receive desc =
    //  {value:undefined,writable:false,enumerable:false,configurable:false}
    // This will also set all other attributes to their default value,
    // which is unexpected and different from [[DefineOwnProperty]].
    // Bug filed: https://bugzilla.mozilla.org/show_bug.cgi?id=601329

    var trap = this.getTrap("defineProperty");
    if (trap === undefined) {
      // default forwarding behavior
      return Reflect.defineProperty(this.target, name, desc);
    }

    name = String(name);
    desc = normalizePropertyDescriptor(desc);
    var success = trap.call(this.handler, this.target, name, desc);
    success = !!success; // coerce to Boolean

    if (success === true) {

      var targetDesc = Object.getOwnPropertyDescriptor(this.target, name);
      var extensible = Object.isExtensible(this.target);

      // Note: we could collapse the following two if-tests into a single
      // test. Separating out the cases to improve error reporting.

      if (!extensible) {
        if (targetDesc === undefined) {
          throw new TypeError("cannot successfully add a new property '"+
                              name + "' to a non-extensible object");
        }
      }

      if (targetDesc !== undefined) {
        if (!isCompatibleDescriptor(extensible, targetDesc, desc)) {
          throw new TypeError("cannot define incompatible property "+
                              "descriptor for property '"+name+"'");
        }
      }

      if (desc.configurable === false && !isSealedDesc(targetDesc)) {
        // if the property is configurable or non-existent on the target,
        // but is successfully being redefined as a non-configurable property,
        // it may later be reported as configurable or non-existent, which violates
        // the invariant that if the property might change or disappear, the
        // configurable attribute must be true.
        throw new TypeError("cannot successfully define a non-configurable "+
                            "descriptor for configurable or non-existent property '"+
                            name+"'");
      }

    }

    return success;
  },

  /**
   * On success, check whether the target object is indeed non-extensible.
   */
  preventExtensions: function() {
    var trap = this.getTrap("preventExtensions");
    if (trap === undefined) {
      // default forwarding behavior
      return Reflect.preventExtensions(this.target);
    }

    var success = trap.call(this.handler, this.target);
    success = !!success; // coerce to Boolean
    if (success) {
      if (Object_isExtensible(this.target)) {
        throw new TypeError("can't report extensible object as non-extensible: "+
                            this.target);
      }
    }
    return success;
  },

  /**
   * If name denotes a sealed property, check whether handler rejects.
   */
  delete: function(name) {
    
    var trap = this.getTrap("deleteProperty");
    if (trap === undefined) {
      // default forwarding behavior
      return Reflect.deleteProperty(this.target, name);
    }

    name = String(name);
    var res = trap.call(this.handler, this.target, name);
    res = !!res; // coerce to Boolean

    if (res === true) {
      if (isSealed(name, this.target)) {
        throw new TypeError("property '"+name+"' is non-configurable "+
                            "and can't be deleted");
      }
    }

    return res;
  },

  /**
   * Checks whether the trap result does not contain any new properties
   * if the proxy is non-extensible.
   *
   * Any own non-configurable properties of the target that are not included
   * in the trap result give rise to a TypeError. As such, we check whether the
   * returned result contains at least all sealed properties of the target
   * object.
   *
   * Additionally, the trap result is normalized.
   * Instead of returning the trap result directly:
   *  - create and return a fresh Array,
   *  - of which each element is coerced to String,
   *  - which does not contain duplicates.
   */
  getOwnPropertyNames: function() {
    var trap = this.getTrap("getOwnPropertyNames");
    if (trap === undefined) {
      // default forwarding behavior
      return Reflect.getOwnPropertyNames(this.target);
    }

    var trapResult = trap.call(this.handler, this.target);

    // propNames is used as a set of strings
    var propNames = Object.create(null);
    var numProps = +trapResult.length;
    var result = new Array(numProps);

    for (var i = 0; i < numProps; i++) {
      var s = String(trapResult[i]);
      if (propNames[s]) {
        throw new TypeError("getOwnPropertyNames cannot list a "+
                            "duplicate property '"+s+"'");
      }
      if (!Object.isExtensible(this.target) && !isFixed(s, this.target)) {
        // non-extensible proxies don't tolerate new own property names
        throw new TypeError("getOwnPropertyNames cannot list a new "+
                            "property '"+s+"' on a non-extensible object");
      }

      propNames[s] = true;
      result[i] = s;
    }

    var ownProps = Object.getOwnPropertyNames(this.target);
    var target = this.target;
    ownProps.forEach(function (ownProp) {
      if (!propNames[ownProp]) {
        if (isSealed(ownProp, target)) {
          throw new TypeError("getOwnPropertyNames trap failed to include "+
                              "non-configurable property '"+ownProp+"'");
        }
        if (!Object.isExtensible(target) &&
            isFixed(ownProp, target)) {
            // if handler is allowed to report ownProp as non-existent,
            // we cannot guarantee that it will never later report it as
            // existent. Once a property has been reported as non-existent
            // on a non-extensible object, it should forever be reported as
            // non-existent
            throw new TypeError("cannot report existing own property '"+ownProp+
                                "' as non-existent on a non-extensible object");
        }
      }
    });

    return result;
  },

  /**
   * Checks whether the trap result is consistent with the state of the
   * wrapped target.
   */
  isExtensible: function() {
    var trap = this.getTrap("isExtensible");
    if (trap === undefined) {
      // default forwarding behavior
      return Reflect.isExtensible(this.target);
    }

    var result = trap.call(this.handler, this.target);
    result = !!result; // coerce to Boolean
    var state = Object_isExtensible(this.target);
    if (result !== state) {
      if (result) {
        throw new TypeError("cannot report non-extensible object as extensible: "+
                             this.target);
      } else {
        throw new TypeError("cannot report extensible object as non-extensible: "+
                             this.target);
      }
    }
    return state;
  },

  /**
   * Check whether the trap result corresponds to the target's [[Prototype]]
   */
  getPrototypeOf: function() {
    var trap = this.getTrap("getPrototypeOf");
    if (trap === undefined) {
      // default forwarding behavior
      return Reflect.getPrototypeOf(this.target);
    }

    var allegedProto = trap.call(this.handler, this.target);

    if (!Object_isExtensible(this.target)) {
      var actualProto = Object_getPrototypeOf(this.target);
      if (!sameValue(allegedProto, actualProto)) {
        throw new TypeError("prototype value does not match: " + this.target);
      }
    }

    return allegedProto;
  },

  /**
   * If target is non-extensible and setPrototypeOf trap returns true,
   * check whether the trap result corresponds to the target's [[Prototype]]
   */
  setPrototypeOf: function(newProto) {
    var trap = this.getTrap("setPrototypeOf");
    if (trap === undefined) {
      // default forwarding behavior
      return Reflect.setPrototypeOf(this.target, newProto);
    }

    var success = trap.call(this.handler, this.target, newProto);

    success = !!success;
    if (success && !Object_isExtensible(this.target)) {
      var actualProto = Object_getPrototypeOf(this.target);
      if (!sameValue(newProto, actualProto)) {
        throw new TypeError("prototype value does not match: " + this.target);
      }
    }

    return success;
  },

  /**
   * In the direct proxies design with refactored prototype climbing,
   * this trap is deprecated. For proxies-as-prototypes, for-in will
   * call the enumerate() trap. If that trap is not defined, the
   * operation is forwarded to the target, no more fallback on this
   * fundamental trap.
   */
  getPropertyNames: function() {
    throw new TypeError("getPropertyNames trap is deprecated");
  },

  // === derived traps ===

  /**
   * If name denotes a fixed property, check whether the trap returns true.
   */
  has: function(name) {
    var trap = this.getTrap("has");
    if (trap === undefined) {
      // default forwarding behavior
      return Reflect.has(this.target, name);
    }

    name = String(name);
    var res = trap.call(this.handler, this.target, name);
    res = !!res; // coerce to Boolean

    if (res === false) {
      if (isSealed(name, this.target)) {
        throw new TypeError("cannot report existing non-configurable own "+
                            "property '"+ name + "' as a non-existent "+
                            "property");
      }
      if (!Object.isExtensible(this.target) &&
          isFixed(name, this.target)) {
          // if handler is allowed to return false, we cannot guarantee
          // that it will not return true for this property later.
          // Once a property has been reported as non-existent on a non-extensible
          // object, it should forever be reported as non-existent
          throw new TypeError("cannot report existing own property '"+name+
                              "' as non-existent on a non-extensible object");
      }
    }

    // if res === true, we don't need to check for extensibility
    // even for a non-extensible proxy that has no own name property,
    // the property may have been inherited

    return res;
  },

  /**
   * If name denotes a fixed non-configurable, non-writable data property,
   * check its return value against the previously asserted value of the
   * fixed property.
   */
  get: function(receiver, name) {

    // experimental support for invoke() trap on platforms that
    // support __noSuchMethod__
    /*
    if (name === '__noSuchMethod__') {
      var handler = this;
      return function(name, args) {
        return handler.invoke(receiver, name, args);
      }
    }
    */

    var trap = this.getTrap("get");
    if (trap === undefined) {
      // default forwarding behavior
      return Reflect.get(this.target, name, receiver);
    }

    name = String(name);
    var res = trap.call(this.handler, this.target, name, receiver);

    var fixedDesc = Object.getOwnPropertyDescriptor(this.target, name);
    // check consistency of the returned value
    if (fixedDesc !== undefined) { // getting an existing property
      if (isDataDescriptor(fixedDesc) &&
          fixedDesc.configurable === false &&
          fixedDesc.writable === false) { // own frozen data property
        if (!sameValue(res, fixedDesc.value)) {
          throw new TypeError("cannot report inconsistent value for "+
                              "non-writable, non-configurable property '"+
                              name+"'");
        }
      } else { // it's an accessor property
        if (isAccessorDescriptor(fixedDesc) &&
            fixedDesc.configurable === false &&
            fixedDesc.get === undefined) {
          if (res !== undefined) {
            throw new TypeError("must report undefined for non-configurable "+
                                "accessor property '"+name+"' without getter");
          }
        }
      }
    }

    return res;
  },

  /**
   * If name denotes a fixed non-configurable, non-writable data property,
   * check that the trap rejects the assignment.
   */
  set: function(receiver, name, val) {
    var trap = this.getTrap("set");
    if (trap === undefined) {
      // default forwarding behavior
      return Reflect.set(this.target, name, val, receiver);
    }

    name = String(name);
    var res = trap.call(this.handler, this.target, name, val, receiver);
    res = !!res; // coerce to Boolean

    // if success is reported, check whether property is truly assignable
    if (res === true) {
      var fixedDesc = Object.getOwnPropertyDescriptor(this.target, name);
      if (fixedDesc !== undefined) { // setting an existing property
        if (isDataDescriptor(fixedDesc) &&
            fixedDesc.configurable === false &&
            fixedDesc.writable === false) {
          if (!sameValue(val, fixedDesc.value)) {
            throw new TypeError("cannot successfully assign to a "+
                                "non-writable, non-configurable property '"+
                                name+"'");
          }
        } else {
          if (isAccessorDescriptor(fixedDesc) &&
              fixedDesc.configurable === false && // non-configurable
              fixedDesc.set === undefined) {      // accessor with undefined setter
            throw new TypeError("setting a property '"+name+"' that has "+
                                " only a getter");
          }
        }
      }
    }

    return res;
  },

  /**
   * Any own enumerable non-configurable properties of the target that are not
   * included in the trap result give rise to a TypeError. As such, we check
   * whether the returned result contains at least all sealed enumerable properties
   * of the target object.
   *
   * The trap should return an iterator.
   *
   * We convert the iterator to an array as current implementations expect
   * enumerate to still return an array of strings.
   */
  enumerate: function() {
    var trap = this.getTrap("enumerate");
    if (trap === undefined) {
      // default forwarding behavior
      var trapResult = Reflect.enumerate(this.target);
      var result = [];
      var nxt = trapResult.next();
      while (!nxt.done) {
        result.push(String(nxt.value));
        nxt = trapResult.next();
      }
      return result;
    }

    var trapResult = trap.call(this.handler, this.target);
    
    if (trapResult === null ||
        trapResult === undefined ||
        trapResult.next === undefined) {
      throw new TypeError("enumerate trap should return an iterator, got: "+
                          trapResult);    
    }
    
    // propNames is used as a set of strings
    var propNames = Object.create(null);
    
    // var numProps = +trapResult.length;
    var result = []; // new Array(numProps);
    
    // trapResult is supposed to be an iterator
    // drain iterator to array as current implementations still expect
    // enumerate to return an array of strings
    var nxt = trapResult.next();
    
    while (!nxt.done) {
      var s = String(nxt.value);
      if (propNames[s]) {
        throw new TypeError("enumerate trap cannot list a "+
                            "duplicate property '"+s+"'");
      }
      propNames[s] = true;
      result.push(s);
      nxt = trapResult.next();
    }
    
    /*for (var i = 0; i < numProps; i++) {
      var s = String(trapResult[i]);
      if (propNames[s]) {
        throw new TypeError("enumerate trap cannot list a "+
                            "duplicate property '"+s+"'");
      }

      propNames[s] = true;
      result[i] = s;
    } */

    var ownEnumerableProps = Object.keys(this.target);
    var target = this.target;
    ownEnumerableProps.forEach(function (ownEnumerableProp) {
      if (!propNames[ownEnumerableProp]) {
        if (isSealed(ownEnumerableProp, target)) {
          throw new TypeError("enumerate trap failed to include "+
                              "non-configurable enumerable property '"+
                              ownEnumerableProp+"'");
        }
        if (!Object.isExtensible(target) &&
            isFixed(ownEnumerableProp, target)) {
            // if handler is allowed not to report ownEnumerableProp as an own
            // property, we cannot guarantee that it will never report it as
            // an own property later. Once a property has been reported as
            // non-existent on a non-extensible object, it should forever be
            // reported as non-existent
            throw new TypeError("cannot report existing own property '"+
                                ownEnumerableProp+"' as non-existent on a "+
                                "non-extensible object");
        }
      }
    });

    return result;
  },

  /**
   * The iterate trap is deprecated by the enumerate trap.
   */
  iterate: Validator.prototype.enumerate,

  /**
   * Any own non-configurable properties of the target that are not included
   * in the trap result give rise to a TypeError. As such, we check whether the
   * returned result contains at least all sealed properties of the target
   * object.
   *
   * The trap result is normalized.
   * The trap result is not returned directly. Instead:
   *  - create and return a fresh Array,
   *  - of which each element is coerced to String,
   *  - which does not contain duplicates
   *
   * FIXME: keys trap is deprecated
   */
  /*
  keys: function() {
    var trap = this.getTrap("keys");
    if (trap === undefined) {
      // default forwarding behavior
      return Reflect.keys(this.target);
    }

    var trapResult = trap.call(this.handler, this.target);

    // propNames is used as a set of strings
    var propNames = Object.create(null);
    var numProps = +trapResult.length;
    var result = new Array(numProps);

    for (var i = 0; i < numProps; i++) {
     var s = String(trapResult[i]);
     if (propNames[s]) {
       throw new TypeError("keys trap cannot list a "+
                           "duplicate property '"+s+"'");
     }
     if (!Object.isExtensible(this.target) && !isFixed(s, this.target)) {
       // non-extensible proxies don't tolerate new own property names
       throw new TypeError("keys trap cannot list a new "+
                           "property '"+s+"' on a non-extensible object");
     }

     propNames[s] = true;
     result[i] = s;
    }

    var ownEnumerableProps = Object.keys(this.target);
    var target = this.target;
    ownEnumerableProps.forEach(function (ownEnumerableProp) {
      if (!propNames[ownEnumerableProp]) {
        if (isSealed(ownEnumerableProp, target)) {
          throw new TypeError("keys trap failed to include "+
                              "non-configurable enumerable property '"+
                              ownEnumerableProp+"'");
        }
        if (!Object.isExtensible(target) &&
            isFixed(ownEnumerableProp, target)) {
            // if handler is allowed not to report ownEnumerableProp as an own
            // property, we cannot guarantee that it will never report it as
            // an own property later. Once a property has been reported as
            // non-existent on a non-extensible object, it should forever be
            // reported as non-existent
            throw new TypeError("cannot report existing own property '"+
                                ownEnumerableProp+"' as non-existent on a "+
                                "non-extensible object");
        }
      }
    });

    return result;
  },
  */
  
  /**
   * This trap is called a.o. by Object.keys, which filters out only
   * the enumerable own properties.
   *
   * The trap should return an iterator. The proxy implementation only
   * checks whether the return value is an object.
   */
  ownKeys: function() {
    var trap = this.getTrap("ownKeys");
    if (trap === undefined) {
      // default forwarding behavior
      return Reflect.ownKeys(this.target);
    }

    var trapResult = trap.call(this.handler, this.target);

    if (trapResult === null ||
        trapResult === undefined ||
        typeof trapResult !== "object") {
      throw new TypeError("ownKeys should return an iterator object, got " +
                          trapResult);
    }

    return trapResult;
  },

  /**
   * New trap that reifies [[Call]].
   * If the target is a function, then a call to
   *   proxy(...args)
   * Triggers this trap
   */
  apply: function(target, thisBinding, args) {
    var trap = this.getTrap("apply");
    if (trap === undefined) {
      return Reflect.apply(target, thisBinding, args);
    }

    if (typeof this.target === "function") {
      return trap.call(this.handler, target, thisBinding, args);
    } else {
      throw new TypeError("apply: "+ target + " is not a function");
    }
  },

  /**
   * New trap that reifies [[Construct]].
   * If the target is a function, then a call to
   *   new proxy(...args)
   * Triggers this trap
   */
  construct: function(target, args) {
    var trap = this.getTrap("construct");
    if (trap === undefined) {
      return Reflect.construct(target, args);
    }

    if (typeof this.target === "function") {
      return trap.call(this.handler, target, args);
    } else {
      throw new TypeError("new: "+ target + " is not a function");
    }
  }
};

// ---- end of the Validator handler wrapper handler ----

// In what follows, a 'direct proxy' is a proxy
// whose handler is a Validator. Such proxies can be made non-extensible,
// sealed or frozen without losing the ability to trap.

// maps direct proxies to their Validator handlers
var directProxies = new WeakMap();

// patch Object.{preventExtensions,seal,freeze} so that
// they recognize fixable proxies and act accordingly
Object.preventExtensions = function(subject) {
  var vhandler = directProxies.get(subject);
  if (vhandler !== undefined) {
    if (vhandler.preventExtensions()) {
      return subject;
    } else {
      throw new TypeError("preventExtensions on "+subject+" rejected");
    }
  } else {
    return prim_preventExtensions(subject);
  }
};
Object.seal = function(subject) {
  return setIntegrityLevel(subject, "sealed");
};
Object.freeze = function(subject) {
  return setIntegrityLevel(subject, "frozen");
};
Object.isExtensible = Object_isExtensible = function(subject) {
  var vHandler = directProxies.get(subject);
  if (vHandler !== undefined) {
    return vHandler.isExtensible();
  } else {
    return prim_isExtensible(subject);
  }
};
Object.isSealed = Object_isSealed = function(subject) {
  return testIntegrityLevel(subject, "sealed");
};
Object.isFrozen = Object_isFrozen = function(subject) {
  return testIntegrityLevel(subject, "frozen");
};
Object.getPrototypeOf = Object_getPrototypeOf = function(subject) {
  var vHandler = directProxies.get(subject);
  if (vHandler !== undefined) {
    return vHandler.getPrototypeOf();
  } else {
    return prim_getPrototypeOf(subject);
  }
};

// patch Object.getOwnPropertyDescriptor to directly call
// the Validator.prototype.getOwnPropertyDescriptor trap
// This is to circumvent an assertion in the built-in Proxy
// trapping mechanism of v8, which disallows that trap to
// return non-configurable property descriptors (as per the
// old Proxy design)
Object.getOwnPropertyDescriptor = function(subject, name) {
  var vhandler = directProxies.get(subject);
  if (vhandler !== undefined) {
    return vhandler.getOwnPropertyDescriptor(name);
  } else {
    return prim_getOwnPropertyDescriptor(subject, name);
  }
};

// patch Object.defineProperty to directly call
// the Validator.prototype.defineProperty trap
// This is to circumvent two issues with the built-in
// trap mechanism:
// 1) the current tracemonkey implementation of proxies
// auto-completes 'desc', which is not correct. 'desc' should be
// normalized, but not completed. Consider:
// Object.defineProperty(proxy, 'foo', {enumerable:false})
// This trap will receive desc =
//  {value:undefined,writable:false,enumerable:false,configurable:false}
// This will also set all other attributes to their default value,
// which is unexpected and different from [[DefineOwnProperty]].
// Bug filed: https://bugzilla.mozilla.org/show_bug.cgi?id=601329
// 2) the current spidermonkey implementation does not
// throw an exception when this trap returns 'false', but instead silently
// ignores the operation (this is regardless of strict-mode)
// 2a) v8 does throw an exception for this case, but includes the rather
//     unhelpful error message:
// 'Proxy handler #<Object> returned false from 'defineProperty' trap'
Object.defineProperty = function(subject, name, desc) {
  var vhandler = directProxies.get(subject);
  if (vhandler !== undefined) {
    var normalizedDesc = normalizePropertyDescriptor(desc);
    var success = vhandler.defineProperty(name, normalizedDesc);
    if (success === false) {
      throw new TypeError("can't redefine property '"+name+"'");
    }
    return success;
  } else {
    return prim_defineProperty(subject, name, desc);
  }
};

Object.keys = function(subject) {
  var vHandler = directProxies.get(subject);
  if (vHandler !== undefined) {
    var ownKeysIterator = vHandler.ownKeys();
    var nxt = ownKeysIterator.next();
    var result = [];
    while (!nxt.done) {
      var k = String(nxt.value);
      var desc = Object.getOwnPropertyDescriptor(subject, k);
      if (desc !== undefined && desc.enumerable === true) {
        result.push(k);
      }
      nxt = ownKeysIterator.next();
    }
    return result;
  } else {
    return prim_keys(subject);
  }
}

// returns whether an argument is a reference to an object,
// which is legal as a WeakMap key.
function isObject(arg) {
  var type = typeof arg;
  return (type === 'object' && arg !== null) || (type === 'function');
};

// a wrapper for WeakMap.get which returns the undefined value
// for keys that are not objects (in which case the underlying
// WeakMap would have thrown a TypeError).
function safeWeakMapGet(map, key) {
  return isObject(key) ? map.get(key) : undefined;
};

// returns a new function of zero arguments that recursively
// unwraps any proxies specified as the |this|-value.
// The primitive is assumed to be a zero-argument method
// that uses its |this|-binding.
function makeUnwrapping0ArgMethod(primitive) {
  return function builtin() {
    var vHandler = safeWeakMapGet(directProxies, this);
    if (vHandler !== undefined) {
      return builtin.call(vHandler.target);
    } else {
      return primitive.call(this);
    }
  }
};

// returns a new function of 1 arguments that recursively
// unwraps any proxies specified as the |this|-value.
// The primitive is assumed to be a 1-argument method
// that uses its |this|-binding.
function makeUnwrapping1ArgMethod(primitive) {
  return function builtin(arg) {
    var vHandler = safeWeakMapGet(directProxies, this);
    if (vHandler !== undefined) {
      return builtin.call(vHandler.target, arg);
    } else {
      return primitive.call(this, arg);
    }
  }
};

Object.prototype.valueOf =
  makeUnwrapping0ArgMethod(Object.prototype.valueOf);
Object.prototype.toString =
  makeUnwrapping0ArgMethod(Object.prototype.toString);
Function.prototype.toString =
  makeUnwrapping0ArgMethod(Function.prototype.toString);
Date.prototype.toString =
  makeUnwrapping0ArgMethod(Date.prototype.toString);

Object.prototype.isPrototypeOf = function builtin(arg) {
  // bugfix thanks to Bill Mark:
  // built-in isPrototypeOf does not unwrap proxies used
  // as arguments. So, we implement the builtin ourselves,
  // based on the ECMAScript 6 spec. Our encoding will
  // make sure that if a proxy is used as an argument,
  // its getPrototypeOf trap will be called.
  while (true) {
    var vHandler2 = safeWeakMapGet(directProxies, arg);
    if (vHandler2 !== undefined) {
      arg = vHandler2.getPrototypeOf();
      if (arg === null) {
        return false;
      } else if (sameValue(arg, this)) {
        return true;
      }
    } else {
      return prim_isPrototypeOf.call(this, arg);
    }
  }
};

Array.isArray = function(subject) {
  var vHandler = safeWeakMapGet(directProxies, subject);
  if (vHandler !== undefined) {
    return Array.isArray(vHandler.target);
  } else {
    return prim_isArray(subject);
  }
};

function isProxyArray(arg) {
  var vHandler = safeWeakMapGet(directProxies, arg);
  if (vHandler !== undefined) {
    return Array.isArray(vHandler.target);
  }
  return false;
}

// Array.prototype.concat internally tests whether one of its
// arguments is an Array, by checking whether [[Class]] == "Array"
// As such, it will fail to recognize proxies-for-arrays as arrays.
// We patch Array.prototype.concat so that it "unwraps" proxies-for-arrays
// by making a copy. This will trigger the exact same sequence of
// traps on the proxy-for-array as if we would not have unwrapped it.
// See <https://github.com/tvcutsem/harmony-reflect/issues/19> for more.
Array.prototype.concat = function(/*...args*/) {
  var length;
  for (var i = 0; i < arguments.length; i++) {
    if (isProxyArray(arguments[i])) {
      length = arguments[i].length;
      arguments[i] = Array.prototype.slice.call(arguments[i], 0, length);
    }
  }
  return prim_concat.apply(this, arguments);
};

// setPrototypeOf support on platforms that support __proto__

var prim_setPrototypeOf = Object.setPrototypeOf;

// patch and extract original __proto__ setter
var __proto__setter = (function() {
  var protoDesc = prim_getOwnPropertyDescriptor(Object.prototype,'__proto__');
  if (protoDesc === undefined ||
      typeof protoDesc.set !== "function") {
    return function() {
      throw new TypeError("setPrototypeOf not supported on this platform");
    }
  }

  // see if we can actually mutate a prototype with the generic setter
  // (e.g. Chrome v28 doesn't allow setting __proto__ via the generic setter)
  try {
    protoDesc.set.call({},{});
  } catch (e) {
    return function() {
      throw new TypeError("setPrototypeOf not supported on this platform");
    }
  }

  prim_defineProperty(Object.prototype, '__proto__', {
    set: function(newProto) {
      return Object.setPrototypeOf(this, newProto);
    }
  });

  return protoDesc.set;
}());

Object.setPrototypeOf = function(target, newProto) {
  var handler = directProxies.get(target);
  if (handler !== undefined) {
    if (handler.setPrototypeOf(newProto)) {
      return target;
    } else {
      throw new TypeError("proxy rejected prototype mutation");
    }
  } else {
    if (!Object_isExtensible(target)) {
      throw new TypeError("can't set prototype on non-extensible object: " +
                          target);
    }
    if (prim_setPrototypeOf)
      return prim_setPrototypeOf(target, newProto);

    if (Object(newProto) !== newProto || newProto === null) {
      throw new TypeError("Object prototype may only be an Object or null: " +
                         newProto);
      // throw new TypeError("prototype must be an object or null")
    }
    __proto__setter.call(target, newProto);
    return target;
  }
}

Object.prototype.hasOwnProperty = function(name) {
  var handler = safeWeakMapGet(directProxies, this);
  if (handler !== undefined) {
    var desc = handler.getOwnPropertyDescriptor(name);
    return desc !== undefined;
  } else {
    return prim_hasOwnProperty.call(this, name);
  }
}

// ============= Reflection module =============
// see http://wiki.ecmascript.org/doku.php?id=harmony:reflect_api

var Reflect = global.Reflect = {
  getOwnPropertyDescriptor: function(target, name) {
    return Object.getOwnPropertyDescriptor(target, name);
  },
  getOwnPropertyNames: function(target) {
    return Object.getOwnPropertyNames(target);
  },
  defineProperty: function(target, name, desc) {

    // if target is a proxy, invoke its "defineProperty" trap
    var handler = directProxies.get(target);
    if (handler !== undefined) {
      return handler.defineProperty(target, name, desc);
    }

    // Implementation transliterated from [[DefineOwnProperty]]
    // see ES5.1 section 8.12.9
    // this is the _exact same algorithm_ as the isCompatibleDescriptor
    // algorithm defined above, except that at every place it
    // returns true, this algorithm actually does define the property.
    var current = Object.getOwnPropertyDescriptor(target, name);
    var extensible = Object.isExtensible(target);
    if (current === undefined && extensible === false) {
      return false;
    }
    if (current === undefined && extensible === true) {
      Object.defineProperty(target, name, desc); // should never fail
      return true;
    }
    if (isEmptyDescriptor(desc)) {
      return true;
    }
    if (isEquivalentDescriptor(current, desc)) {
      return true;
    }
    if (current.configurable === false) {
      if (desc.configurable === true) {
        return false;
      }
      if ('enumerable' in desc && desc.enumerable !== current.enumerable) {
        return false;
      }
    }
    if (isGenericDescriptor(desc)) {
      // no further validation necessary
    } else if (isDataDescriptor(current) !== isDataDescriptor(desc)) {
      if (current.configurable === false) {
        return false;
      }
    } else if (isDataDescriptor(current) && isDataDescriptor(desc)) {
      if (current.configurable === false) {
        if (current.writable === false && desc.writable === true) {
          return false;
        }
        if (current.writable === false) {
          if ('value' in desc && !sameValue(desc.value, current.value)) {
            return false;
          }
        }
      }
    } else if (isAccessorDescriptor(current) && isAccessorDescriptor(desc)) {
      if (current.configurable === false) {
        if ('set' in desc && !sameValue(desc.set, current.set)) {
          return false;
        }
        if ('get' in desc && !sameValue(desc.get, current.get)) {
          return false;
        }
      }
    }
    Object.defineProperty(target, name, desc); // should never fail
    return true;
  },
  deleteProperty: function(target, name) {
    var handler = directProxies.get(target);
    if (handler !== undefined) {
      return handler.deleteProperty(target, name);
    }
    
    var desc = Object.getOwnPropertyDescriptor(target, name);
    if (desc === undefined) {
      return true;
    }
    if (desc.configurable === true) {
      delete target[name];
      return true;
    }
    return false;    
  },
  getPrototypeOf: function(target) {
    return Object.getPrototypeOf(target);
  },
  setPrototypeOf: function(target, newProto) {
    
    var handler = directProxies.get(target);
    if (handler !== undefined) {
      return handler.setPrototypeOf(newProto);
    }
    
    if (Object(newProto) !== newProto || newProto === null) {
      throw new TypeError("Object prototype may only be an Object or null: " +
                         newProto);
    }
    
    if (!Object_isExtensible(target)) {
      return false;
    }
    
    var current = Object.getPrototypeOf(target);
    if (sameValue(current, newProto)) {
      return true;
    }
    
    if (prim_setPrototypeOf) {
      try {
        prim_setPrototypeOf(target, newProto);
        return true;
      } catch (e) {
        return false;
      }
    }

    __proto__setter.call(target, newProto);
    return true;
  },
  preventExtensions: function(target) {
    var handler = directProxies.get(target);
    if (handler !== undefined) {
      return handler.preventExtensions();
    }
    prim_preventExtensions(target);
    return true;
  },
  isExtensible: function(target) {
    return Object.isExtensible(target);
  },
  has: function(target, name) {
    return name in target;
  },
  get: function(target, name, receiver) {
    receiver = receiver || target;

    // if target is a proxy, invoke its "get" trap
    var handler = directProxies.get(target);
    if (handler !== undefined) {
      return handler.get(receiver, name);
    }

    var desc = Object.getOwnPropertyDescriptor(target, name);
    if (desc === undefined) {
      var proto = Object.getPrototypeOf(target);
      if (proto === null) {
        return undefined;
      }
      return Reflect.get(proto, name, receiver);
    }
    if (isDataDescriptor(desc)) {
      return desc.value;
    }
    var getter = desc.get;
    if (getter === undefined) {
      return undefined;
    }
    return desc.get.call(receiver);
  },
  // Reflect.set implementation based on latest version of [[SetP]] at
  // http://wiki.ecmascript.org/doku.php?id=harmony:proto_climbing_refactoring
  set: function(target, name, value, receiver) {
    receiver = receiver || target;

    // if target is a proxy, invoke its "set" trap
    var handler = directProxies.get(target);
    if (handler !== undefined) {
      return handler.set(receiver, name, value);
    }

    // first, check whether target has a non-writable property
    // shadowing name on receiver
    var ownDesc = Object.getOwnPropertyDescriptor(target, name);

    if (ownDesc === undefined) {
      // name is not defined in target, search target's prototype
      var proto = Object.getPrototypeOf(target);

      if (proto !== null) {
        // continue the search in target's prototype
        return Reflect.set(proto, name, value, receiver);
      }

      // Rev16 change. Cf. https://bugs.ecmascript.org/show_bug.cgi?id=1549
      // target was the last prototype, now we know that 'name' is not shadowed
      // by an existing (accessor or data) property, so we can add the property
      // to the initial receiver object
      // (this branch will intentionally fall through to the code below)
      ownDesc =
        { value: undefined,
          writable: true,
          enumerable: true,
          configurable: true };
    }

    // we now know that ownDesc !== undefined
    if (isAccessorDescriptor(ownDesc)) {
      var setter = ownDesc.set;
      if (setter === undefined) return false;
      setter.call(receiver, value); // assumes Function.prototype.call
      return true;
    }
    // otherwise, isDataDescriptor(ownDesc) must be true
    if (ownDesc.writable === false) return false;
    // we found an existing writable data property on the prototype chain.
    // Now update or add the data property on the receiver, depending on
    // whether the receiver already defines the property or not.
    var existingDesc = Object.getOwnPropertyDescriptor(receiver, name);
    if (existingDesc !== undefined) {
      var updateDesc =
        { value: value,
          // FIXME: it should not be necessary to describe the following
          // attributes. Added to circumvent a bug in tracemonkey:
          // https://bugzilla.mozilla.org/show_bug.cgi?id=601329
          writable:     existingDesc.writable,
          enumerable:   existingDesc.enumerable,
          configurable: existingDesc.configurable };
      Object.defineProperty(receiver, name, updateDesc);
      return true;
    } else {
      if (!Object.isExtensible(receiver)) return false;
      var newDesc =
        { value: value,
          writable: true,
          enumerable: true,
          configurable: true };
      Object.defineProperty(receiver, name, newDesc);
      return true;
    }
  },
  /*invoke: function(target, name, args, receiver) {
    receiver = receiver || target;

    var handler = directProxies.get(target);
    if (handler !== undefined) {
      return handler.invoke(receiver, name, args);
    }

    var fun = Reflect.get(target, name, receiver);
    return Function.prototype.apply.call(fun, receiver, args);
  },*/
  /*enumerate: function(target) {
    var result = [];
    for (var name in target) { result.push(name); };
    return result;
  },*/
  enumerate: function(target) {
    var handler = directProxies.get(target);
    if (handler !== undefined) {
      return handler.enumerate(handler.target);
    }

    var result = [];
    for (var name in target) { result.push(name); };
    var l = +result.length;
    var idx = 0;
    return {
      next: function() {
        if (idx === l) return { done: true };
        return { done: false, value: result[idx++] };
      }
    };
  },
  // imperfect ownKeys implementation: in ES6, should also include
  // symbol-keyed properties.
  ownKeys: function(target) {
    var handler = directProxies.get(target);
    if (handler !== undefined) {
      return handler.ownKeys();
    }

    var result = Reflect.getOwnPropertyNames(target);
    var l = +result.length;
    var idx = 0;
    return {
      next: function() {
        if (idx === l) { return { done: true } };
        return { done: false, value: result[idx++] };
      }
    };
  },
  apply: function(target, receiver, args) {
    // target.apply(receiver, args)
    return Function.prototype.apply.call(target, receiver, args);
  },
  construct: function(target, args) {
    // return new target(...args);

    // if target is a proxy, invoke its "construct" trap
    var handler = directProxies.get(target);
    if (handler !== undefined) {
      return handler.construct(handler.target, args);
    }

    var proto = target.prototype;
    var instance = (Object(proto) === proto) ? Object.create(proto) : {};
    var result = Function.prototype.apply.call(target, instance, args);
    return Object(result) === result ? result : instance;
  }
};

var revokedHandler = Proxy.create({
  get: function() { throw new TypeError("proxy is revoked"); }
});

// feature-test whether the Proxy global exists
if (typeof Proxy !== "undefined") {

  var primCreate = Proxy.create,
      primCreateFunction = Proxy.createFunction;

  global.Proxy = function(target, handler) {
    // check that target is an Object
    if (Object(target) !== target) {
      throw new TypeError("Proxy target must be an Object, given "+target);
    }
    // check that handler is an Object
    if (Object(handler) !== handler) {
      throw new TypeError("Proxy handler must be an Object, given "+handler);
    }

    var vHandler = new Validator(target, handler);
    var proxy;
    if (typeof target === "function") {
      proxy = primCreateFunction(vHandler,
        // call trap
        function() {
          var args = Array.prototype.slice.call(arguments);
          return vHandler.apply(target, this, args);
        },
        // construct trap
        function() {
          var args = Array.prototype.slice.call(arguments);
          return vHandler.construct(target, args);
        });
    } else {
      proxy = primCreate(vHandler, Object.getPrototypeOf(target));
    }
    directProxies.set(proxy, vHandler);
    return proxy;
  };

  global.Proxy.revocable = function(target, handler) {
    var proxy = new Proxy(target, handler);
    var revoke = function() {
      var vHandler = directProxies.get(proxy);
      if (vHandler !== null) {
        vHandler.target  = null;
        vHandler.handler = revokedHandler;
      }
      return undefined;
    };
    return {proxy: proxy, revoke: revoke};
  }

} else {
  // Proxy global not defined, so proxies are not supported

  global.Proxy = function(_target, _handler) {
    throw new Error("proxies not supported on this platform");
  }

}

// for node.js modules, export every property in the Reflect object
// as part of the module interface
if (typeof exports !== 'undefined') {
  Object.keys(Reflect).forEach(function (key) {
    exports[key] = Reflect[key];
  });
}

}(typeof exports !== 'undefined' ? global : this)); // function-as-module pattern;
define("reflect", ["es6-shim"], (function (global) {
    return function () {
        var ret, fn;
        return ret || global.Reflect;
    };
}(this)));

define('resiliency/Retry',['../common/utils/Enum', 'reflect'], function($__0,$__2) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  var $__1 = $__0,
      EnumSymbol = $__1.EnumSymbol,
      Enum = $__1.Enum;
  var Reflect = $__2.default;
  var $__8 = [{}, {}, {}],
      INCREMENTAL = $__8[0],
      EXPONENTIAL = $__8[1],
      FIBONACCI = $__8[2];
  var BackoffStrategy = new Enum({
    INCREMENTAL: INCREMENTAL,
    EXPONENTIAL: EXPONENTIAL,
    FIBONACCI: FIBONACCI
  });
  var intermediate = Symbol('intermediate', true);
  var Retry = function Retry($__8, maxTries, maxDelay, delayRatio, backoffStrategy, intermediate) {
    var $__10,
        $__11,
        $__12,
        $__13,
        $__14;
    var $__9 = $traceurRuntime.assertObject($__8),
        maxTries = ($__10 = $__9.maxTries) === void 0 ? 1 : $__10,
        maxDelay = ($__11 = $__9.maxDelay) === void 0 ? Infinity : $__11,
        delayRatio = ($__12 = $__9.delayRatio) === void 0 ? 1 : $__12,
        backoffStrategy = ($__13 = $__9.backoffStrategy) === void 0 ? BackoffStrategy.INCREMENTAL : $__13,
        intermediate = ($__14 = $__9.intermediate) === void 0 ? function() {} : $__14;
    if (!BackoffStrategy.contains(backoffStrategy))
      throw Error('backoffStrategy value should be of Enum<BackoffStrategy>  type');
    this.maxTries = maxTries;
    this.maxDelay = maxDelay;
    this.delayRatio = delayRatio;
    this.intermediate = intermediate;
    switch (backoffStrategy) {
      case BackoffStrategy.INCREMENTAL:
        this.backoffStrategy = this.incremental();
        break;
      case BackoffStrategy.EXPONENTIAL:
        this.backoffStrategy = this.exponential();
        break;
      case BackoffStrategy.FIBONACCI:
        this.backoffStrategy = this.fibonacci();
        break;
      default:
        this.backoffStrategy = this.incremental();
        break;
    }
  };
  var $Retry = Retry;
  ($traceurRuntime.createClass)(Retry, {
    try: function(target, receiver) {
      var $__15,
          args,
          intermediate,
          remainingTries,
          $__4,
          delay;
      var $arguments = arguments;
      return $traceurRuntime.asyncWrap(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              args = $arguments[2] !== (void 0) ? $arguments[2] : [];
              intermediate = $arguments[3] !== (void 0) ? $arguments[3] : this.intermediate;
              remainingTries = $arguments[4] !== (void 0) ? $arguments[4] : this.maxTries;
              $__4 = this;
              delay = this._calculateDelay(remainingTries);
              $ctx.state = 8;
              break;
            case 8:
              Promise.resolve(this._sleep(delay * 1000)).then($ctx.createCallback(3), $ctx.errback);
              return;
            case 3:
              $ctx.returnValue = ($__15 = target).call.apply($__15, $traceurRuntime.spread([receiver], args)).catch((function(error) {
                var intermediateResult = intermediate(error, remainingTries, delay);
                if (remainingTries <= 1) {
                  throw new Error('Giving up! maximum retry attempts reached.');
                }
                if (intermediateResult === false) {
                  throw new Error('Intermediate callback returned false. Retry stopped.');
                } else {
                  return $__4.try(target, receiver, args, intermediate, remainingTries - 1);
                }
              }));
              $ctx.state = 5;
              break;
            case 5:
              $ctx.state = -2;
              break;
            default:
              return $ctx.end();
          }
      }, this);
    },
    _calculateDelay: function(remainingTries) {
      var delay = this.delayRatio * this.backoffStrategy.next().value;
      return Math.min(delay, this.maxDelay);
    },
    _sleep: function(ms) {
      return new Promise((function(resolve) {
        setTimeout(resolve, ms);
      }));
    },
    incremental: $traceurRuntime.initGeneratorFunction(function $__16() {
      var i,
          reset;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              i = 0;
              $ctx.state = 9;
              break;
            case 9:
              $ctx.state = (true) ? 1 : -2;
              break;
            case 6:
              i++;
              $ctx.state = 9;
              break;
            case 1:
              $ctx.state = 2;
              return i;
            case 2:
              reset = $ctx.sent;
              $ctx.state = 4;
              break;
            case 4:
              if (reset) {
                i = 0;
              }
              $ctx.state = 6;
              break;
            default:
              return $ctx.end();
          }
      }, $__16, this);
    }),
    exponential: $traceurRuntime.initGeneratorFunction(function $__17() {
      var i,
          reset;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              i = 0;
              $ctx.state = 9;
              break;
            case 9:
              $ctx.state = (true) ? 1 : -2;
              break;
            case 6:
              i++;
              $ctx.state = 9;
              break;
            case 1:
              $ctx.state = 2;
              return Math.pow(2, i);
            case 2:
              reset = $ctx.sent;
              $ctx.state = 4;
              break;
            case 4:
              if (reset) {
                i = 0;
              }
              $ctx.state = 6;
              break;
            default:
              return $ctx.end();
          }
      }, $__17, this);
    }),
    fibonacci: $traceurRuntime.initGeneratorFunction(function $__18() {
      var $__8,
          $__10,
          prev,
          curr,
          reset;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              $__8 = [0, 1], prev = $__8[0], curr = $__8[1];
              $ctx.state = 11;
              break;
            case 11:
              $ctx.state = (true) ? 5 : -2;
              break;
            case 5:
              ($__8 = [curr, prev + curr], prev = $__8[0], curr = $__8[1], $__8);
              $ctx.state = 6;
              break;
            case 6:
              $ctx.state = 2;
              return curr;
            case 2:
              reset = $ctx.sent;
              $ctx.state = 4;
              break;
            case 4:
              if (reset) {
                ($__10 = [0, 1], prev = $__10[0], curr = $__10[1], $__10);
              }
              $ctx.state = 11;
              break;
            default:
              return $ctx.end();
          }
      }, $__18, this);
    })
  }, {proxify: function(obj) {
      var classRetry;
      var proxifyed = false;
      if (obj.annotations) {
        for (var $anno in obj.annotations) {
          try {
            throw undefined;
          } catch (anno) {
            {
              anno = $anno;
              if (anno instanceof $Retry) {
                classRetry = anno;
              }
            }
          }
        }
      }
      for (var $name in obj.__proto__) {
        try {
          throw undefined;
        } catch (methodRetry) {
          try {
            throw undefined;
          } catch (name) {
            {
              name = $name;
              ;
              if (obj[$traceurRuntime.toProperty(name)].annotations) {
                for (var $__6 = obj[$traceurRuntime.toProperty(name)].annotations[$traceurRuntime.toProperty(Symbol.iterator)](),
                    $__7; !($__7 = $__6.next()).done; ) {
                  try {
                    throw undefined;
                  } catch (anno) {
                    {
                      anno = $__7.value;
                      {
                        if (anno instanceof $Retry) {
                          methodRetry = anno;
                        }
                      }
                    }
                  }
                }
              }
              if (methodRetry || classRetry) {
                proxifyed = true;
                console.debug('applying retry aspect to: ', name);
                $traceurRuntime.setProperty(obj, name, new Proxy(obj[$traceurRuntime.toProperty(name)], {apply: (function(target, receiver, args) {
                    var retry = methodRetry || classRetry;
                    return retry.try.call(retry, target, receiver, args);
                  })}));
              }
            }
          }
        }
      }
      if (!proxifyed) {
        throw new Error('No @Retry annotations found on target class or its methods. Cannot apply Retry aspect');
      }
      return obj;
    }});
  Retry.parameters = [[], [$traceurRuntime.type.number], [$traceurRuntime.type.number], [$traceurRuntime.type.number], [EnumSymbol], [Function]];
  Retry.prototype.try.parameters = [[Function], [], [], [Function], [$traceurRuntime.type.number]];
  Retry.prototype._calculateDelay.parameters = [[$traceurRuntime.type.number]];
  return {
    get BackoffStrategy() {
      return BackoffStrategy;
    },
    get Retry() {
      return Retry;
    },
    __esModule: true
  };
});

define('common/services/EventBus',['sockjs', 'stomp', '../utils/Enum', '../../resiliency/Retry'], function($__0,$__1,$__2,$__4) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {'default': $__4};
  $__0;
  $__1;
  var $__3 = $__2,
      EnumSymbol = $__3.EnumSymbol,
      Enum = $__3.Enum;
  var $__5 = $__4,
      BackoffStrategy = $__5.BackoffStrategy,
      Retry = $__5.Retry;
  var EBUS_CONFIG = {
    BASE_URL: 'http://localhost:8080/<YourBaaS>/stomp',
    CONNECTION_OPTIONS: {headers: {}}
  };
  var ReadyState = new Enum({
    CONNECTING: {
      value: 0,
      description: 'Connecting'
    },
    OPEN: {
      value: 1,
      description: 'Open'
    },
    AUTHENTICATED: {
      value: 2,
      description: 'Authenticated'
    },
    CLOSING: {
      value: 3,
      description: 'Closing'
    },
    CLOSED: {
      value: 4,
      description: 'Closed'
    },
    RECONNECT_ABORTED: {
      value: 5,
      description: 'Reconnect Aborted'
    }
  });
  var user = Symbol('user', true);
  var handlers = Symbol('handlers', true);
  var subscriptions = Symbol('subscriptions', true);
  var cBaseUrl = Symbol('cBaseUrl', true);
  var cOptions = Symbol('cOptions', true);
  var readyState = Symbol('readyState', true);
  var onDisconnectDefaultListener = Symbol('onDisconnect', true);
  var retryIntermediateCallback = (function(error, remainingTries, delay) {
    console.error(("Previous error: [" + error + "]"));
    console.info(("Previous remaining tries: [" + remainingTries + "]"));
    console.info(("Previous delay: [" + delay + "s]"));
  });
  var EventBus = function EventBus() {
    var baseUrl = arguments[0] !== (void 0) ? arguments[0] : EBUS_CONFIG.BASE_URL;
    var options = arguments[1] !== (void 0) ? arguments[1] : EBUS_CONFIG.CONNECTION_OPTIONS;
    var $__6 = this;
    $traceurRuntime.setProperty(this, cOptions, options);
    $traceurRuntime.setProperty(this, readyState, ReadyState.CLOSED);
    $traceurRuntime.setProperty(this, cBaseUrl, baseUrl);
    this.stompClient = undefined;
    $traceurRuntime.setProperty(this, handlers, new Map());
    $traceurRuntime.setProperty(this, subscriptions, new Map());
    $traceurRuntime.setProperty(this, onDisconnectDefaultListener, (function(error) {
      console.error('in onDisconnectDefaultListener. will try in 30sec. Error: ', error);
      setTimeout((function() {
        return $__6.open(true, $__6[$traceurRuntime.toProperty(onDisconnectDefaultListener)]);
      }), 30000);
    }));
  };
  ($traceurRuntime.createClass)(EventBus, {
    get readyState() {
      return this[$traceurRuntime.toProperty(readyState)];
    },
    getUser: function() {
      return this[$traceurRuntime.toProperty(user)];
    },
    open: function() {
      var force = arguments[0] !== (void 0) ? arguments[0] : false;
      var onDisconnect = arguments[1] !== (void 0) ? arguments[1] : this[$traceurRuntime.toProperty(onDisconnectDefaultListener)];
      var $__6 = this;
      return new Promise((function(resolve, reject) {
        if (force || $__6[$traceurRuntime.toProperty(readyState)] >= ReadyState.CLOSED) {
          try {
            throw undefined;
          } catch (socket) {
            {
              console.log('trying to open STOMP connection...');
              socket = new SockJS($__6[$traceurRuntime.toProperty(cBaseUrl)]);
              $__6.stompClient = Stomp.over(socket);
              $traceurRuntime.setProperty($__6, readyState, ReadyState.CONNECTING);
              $__6.stompClient.connect($__6[$traceurRuntime.toProperty(cOptions)].headers, (function(frame) {
                if (frame.headers[$traceurRuntime.toProperty("user-name")]) {
                  $traceurRuntime.setProperty($__6, readyState, ReadyState.AUTHENTICATED);
                } else {
                  $traceurRuntime.setProperty($__6, readyState, ReadyState.OPEN);
                }
                $__6._resubscribe();
                console.group();
                console.log('%cConnection Opened Succssfully.', 'background: #222; color: #bada55');
                console.info(("%cFrame: " + frame), 'background: #222; color: #bada55');
                console.info(("%cConnected username: %c" + frame.headers[$traceurRuntime.toProperty("user-name")]), 'background: #222; color: #bada55', 'background: #222; color: #7FFFD4');
                console.info('Registering onDisconnect listener to monitoring future disconnects.');
                $traceurRuntime.setProperty($__6, user, frame.headers[$traceurRuntime.toProperty("user-name")]);
                $__6.stompClient.ws.onclose = (function(error) {
                  $traceurRuntime.setProperty($__6, readyState, ReadyState.CLOSED);
                  onDisconnect(error);
                });
                console.groupEnd();
                resolve(frame);
              }), (function(error) {
                $traceurRuntime.setProperty($__6, readyState, ReadyState.CLOSED);
                reject(error);
              }));
            }
          }
        } else {
          console.info('EventBus already open');
          resolve();
        }
      }));
    },
    close: function() {
      var force = arguments[0] !== (void 0) ? arguments[0] : false;
      var $__6 = this;
      return new Promise((function(resolve, reject) {
        if (force || $__6[$traceurRuntime.toProperty(readyState)] < ReadyState.CLOSED) {
          $traceurRuntime.setProperty($__6, readyState, ReadyState.CLOSING);
          $__6.stompClient.disconnect((function() {
            $traceurRuntime.setProperty($__6, readyState, ReadyState.CLOSED);
            console.log("%cSTOMP connection closed", 'background: #222; color: #bada55');
            resolve('STOMP connection closed');
          }));
        } else {
          console.log("%cSTOMP connection already closed", 'background: #222; color: #bada55');
          resolve('STOMP connection already closed');
        }
      }));
    },
    _resubscribe: function() {
      var $__6 = this;
      var myHandlers = this[$traceurRuntime.toProperty(handlers)];
      myHandlers.forEach((function(callback, address, myHandlers) {
        $__6[$traceurRuntime.toProperty(subscriptions)].set(address, $__6.stompClient.subscribe(address, callback));
      }));
    },
    registerHandler: function(address, callback) {
      this[$traceurRuntime.toProperty(handlers)].set(address, callback);
      if ((this[$traceurRuntime.toProperty(readyState)] === ReadyState.OPEN || this[$traceurRuntime.toProperty(readyState)] === ReadyState.AUTHENTICATED) && !this[$traceurRuntime.toProperty(subscriptions)].has(address)) {
        this[$traceurRuntime.toProperty(subscriptions)].set(address, this.stompClient.subscribe(address, callback));
      }
    },
    unregisterHandler: function(address) {
      this[$traceurRuntime.toProperty(handlers)].delete(address);
      if (this[$traceurRuntime.toProperty(subscriptions)].has(address)) {
        this[$traceurRuntime.toProperty(subscriptions)].get(address).unsubscribe();
        this[$traceurRuntime.toProperty(subscriptions)].delete(address);
      }
    },
    send: function(address, data) {
      var headers = arguments[2] !== (void 0) ? arguments[2] : {};
      var $__6 = this;
      return new Promise((function(resolve, reject) {
        var subscription = $__6.stompClient.subscribe(address, (function(result) {
          if (result.body) {
            resolve(JSON.parse(result.body));
          } else {
            reject({error: 'got empty message'});
          }
        }));
      }));
    },
    publish: function(address, data) {
      var headers = arguments[2] !== (void 0) ? arguments[2] : {};
      this.stompClient.send(address, headers, JSON.stringify(data));
    }
  }, {});
  EventBus.parameters = [[$traceurRuntime.type.string], [Object]];
  EventBus.prototype.open.annotations = [new Retry({
    maxTries: 20,
    maxDelay: 5,
    backoffStrategy: BackoffStrategy.INCREMENTAL,
    intermediate: retryIntermediateCallback
  })];
  EventBus.prototype.open.parameters = [[], [Function]];
  return {
    get EBUS_CONFIG() {
      return EBUS_CONFIG;
    },
    get ReadyState() {
      return ReadyState;
    },
    get EventBus() {
      return EventBus;
    },
    __esModule: true
  };
});

define('common/index',['./routes', './controllers/LoginController', './controllers/SettingsController', './services/AuthenticationService', './services/AuthorizationService', './services/UserService', './elements/hasPermission', './utils/AuthInterceptor', './services/EventBus', '../resiliency/Retry'], function($__0,$__2,$__4,$__6,$__8,$__10,$__12,$__14,$__16,$__18) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {'default': $__4};
  if (!$__6 || !$__6.__esModule)
    $__6 = {'default': $__6};
  if (!$__8 || !$__8.__esModule)
    $__8 = {'default': $__8};
  if (!$__10 || !$__10.__esModule)
    $__10 = {'default': $__10};
  if (!$__12 || !$__12.__esModule)
    $__12 = {'default': $__12};
  if (!$__14 || !$__14.__esModule)
    $__14 = {'default': $__14};
  if (!$__16 || !$__16.__esModule)
    $__16 = {'default': $__16};
  if (!$__18 || !$__18.__esModule)
    $__18 = {'default': $__18};
  var routes = $__0.default;
  var $__3 = $__2,
      LoginController = $__3.LoginController,
      LoginModalController = $__3.LoginModalController;
  var SettingsController = $__4.default;
  var $__7 = $__6,
      AUTH_CONFIG = $__7.AUTH_CONFIG,
      AUTH_EVENTS = $__7.AUTH_EVENTS,
      AuthenticationService = $__7.AuthenticationService;
  var AuthorizationService = $__8.AuthorizationService;
  var UserService = $__10.default;
  var hasPermission = $__12.default;
  var AuthInterceptor = $__14.default;
  var $__17 = $__16,
      EBUS_CONFIG = $__17.EBUS_CONFIG,
      EventBus = $__17.EventBus;
  var $__19 = $__18,
      BackoffStrategy = $__19.BackoffStrategy,
      Retry = $__19.Retry;
  var moduleName = 'spaApp.common';
  var commonModule = angular.module(moduleName, ['http-auth-interceptor-buffer']);
  commonModule.service('UserService', UserService);
  commonModule.service('AuthenticationService', AuthenticationService);
  commonModule.service('AuthorizationService', AuthorizationService);
  commonModule.service('$eventBus', EventBus);
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
    EBUS_CONFIG.BASE_URL = 'http://ve7d00000010:8080/apiApp/stomp';
  }));
  commonModule.run((function($rootScope, $eventBus) {
    
    var eventBus = Retry.proxify($eventBus);
    if (typeof Object.observe === 'function') {
      Object.observe(eventBus, (function(changes) {
        $rootScope.$apply();
      }), ['update']);
    } else {
      console.warn('O.o() not supported');
    }
    var onDisconnectListener = (function(error) {
      console.log('in onDisconnectListener - Error: ', error);
      console.error(("SockJS closed.........readyState: " + eventBus.readyState.description));
      console.info("Attempting to reconnect");
      eventBus.open(true, onDisconnectListener);
    });
    var openConnection = (function() {
      return eventBus.open(true, onDisconnectListener).catch((function(error) {
        console.error('Error: ', error);
      }));
    });
    $rootScope.$on(AUTH_EVENTS.loginSuccess, (function() {
      eventBus.close().then((function(msg) {
        console.log('reconnection STOMP after loginSuccess');
      })).then(openConnection);
    }));
    $rootScope.$on(AUTH_EVENTS.logoutSuccess, (function() {
      eventBus.close();
    }));
    openConnection();
  }));
  var $__default = moduleName;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

