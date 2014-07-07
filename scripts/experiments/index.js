define('experiments/routes',[], function() {
  
  var $__default = function routes($stateProvider) {
    
    return $stateProvider.state('slow', {
      url: '/slow',
      templateUrl: '../views/experiments/experiment.html',
      controller: 'ExperimentController',
      resolve: {dummy: ['$stateParams', '$timeout', function($stateParams, $timeout) {
          return $timeout((function() {
            return [];
          }), 3000);
        }]},
      onEnter: function(dummy) {
        if (dummy) {
          console.log('inside slow: onEnter');
        }
      },
      onExit: function(dummy) {
        if (dummy) {
          console.log('inside slow: onExit');
        }
      }
    }).state('experiments', {
      url: '/experiments',
      templateUrl: '../views/experiments/experiment.html',
      controller: 'ExperimentController'
    }).state('translations', {
      url: '/translations',
      templateUrl: '../views/experiments/growlTranslate.html',
      controller: 'GrowlTranslateDemoController',
      resolve: {myTranslations: function($translatePartialLoader, $translate) {
          $translatePartialLoader.addPart('common');
          console.log('loading common module translations...');
          return $translate.refresh();
        }}
    }).state('elements', {
      url: '/elements',
      templateUrl: '../views/experiments/elements.html',
      controller: 'ElementsController'
    }).state('todoMVC', {
      url: '/todo',
      templateUrl: '../views/experiments/todo.html',
      controller: 'TodoController as tc'
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

define('experiments/services/EmailService',['diary/diary'], function($__0) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  var Diary = $traceurRuntime.assertObject($__0).Diary;
  var $__default = (function() {
    var EmailService = function EmailService() {
      this.logger = Diary.logger('EmailService');
      this.logger.info('in EmailService....');
      this.content_ = '';
    };
    return ($traceurRuntime.createClass)(EmailService, {
      send: function(recipient) {
        return $traceurRuntime.asyncWrap(function($ctx) {
          while (true)
            switch ($ctx.state) {
              case 0:
                this.logger.info('before await....');
                $ctx.state = 8;
                break;
              case 8:
                Promise.resolve(this.timeout(1000)).then($ctx.createCallback(3), $ctx.errback);
                return;
              case 3:
                this.logger.info('after await....');
                $ctx.state = 10;
                break;
              case 10:
                $ctx.returnValue = ("sending  " + this.content + " to " + recipient + " ...");
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
      timeout: function(ms) {
        return new Promise((function(resolve) {
          setTimeout(resolve, ms);
        }));
      }
    }, {
      format: function() {
        var name = arguments[0] !== (void 0) ? arguments[0] : "Anonymous";
        return name.toUpperCase();
      },
      add: function(a, b) {
        return a + b;
      }
    });
  }());
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('experiments/services/AsyncService',[], function() {
  
  var $__default = (function() {
    var AsyncService = function AsyncService($rootScope, $timeout) {
      console.info('in AsyncService constructor....');
      this.$rootScope = $rootScope;
      this.$timeout = $timeout;
      this.content_ = '';
    };
    return ($traceurRuntime.createClass)(AsyncService, {
      on: function(eventName, callback) {
        socket.on(eventName, function() {
          var args = arguments;
          this.$timeout(function() {
            callback.apply(socket, args);
          }, 0);
        });
      },
      emit: function(eventName, data, callback) {
        socket.emit(eventName, data, function() {
          var args = arguments;
          this.$rootScope.$apply(function() {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
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

define('di/util',[], function() {
  
  function isUpperCase(char) {
    return char.toUpperCase() === char;
  }
  function isClass(clsOrFunction) {
    if (clsOrFunction.name) {
      return isUpperCase(clsOrFunction.name.charAt(0));
    }
    return Object.keys(clsOrFunction.prototype).length > 0;
  }
  function isFunction(value) {
    return typeof value === 'function';
  }
  function isObject(value) {
    return typeof value === 'object';
  }
  function toString(token) {
    if (typeof token === 'string') {
      return token;
    }
    if (token === undefined || token === null) {
      return '' + token;
    }
    if (token.name) {
      return token.name;
    }
    return token.toString();
  }
  ;
  return {
    get isUpperCase() {
      return isUpperCase;
    },
    get isClass() {
      return isClass;
    },
    get isFunction() {
      return isFunction;
    },
    get isObject() {
      return isObject;
    },
    get toString() {
      return toString;
    },
    __esModule: true
  };
});

define('di/annotations',['./util'], function($__0) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  var isFunction = $traceurRuntime.assertObject($__0).isFunction;
  var SuperConstructor = function SuperConstructor() {};
  ($traceurRuntime.createClass)(SuperConstructor, {}, {});
  var TransientScope = function TransientScope() {};
  ($traceurRuntime.createClass)(TransientScope, {}, {});
  var Inject = function Inject() {
    for (var tokens = [],
        $__6 = 0; $__6 < arguments.length; $__6++)
      tokens[$__6] = arguments[$__6];
    this.tokens = tokens;
    this.isPromise = false;
    this.isLazy = false;
  };
  ($traceurRuntime.createClass)(Inject, {}, {});
  var InjectPromise = function InjectPromise() {
    for (var tokens = [],
        $__7 = 0; $__7 < arguments.length; $__7++)
      tokens[$__7] = arguments[$__7];
    this.tokens = tokens;
    this.isPromise = true;
    this.isLazy = false;
  };
  ($traceurRuntime.createClass)(InjectPromise, {}, {}, Inject);
  var InjectLazy = function InjectLazy() {
    for (var tokens = [],
        $__8 = 0; $__8 < arguments.length; $__8++)
      tokens[$__8] = arguments[$__8];
    this.tokens = tokens;
    this.isPromise = false;
    this.isLazy = true;
  };
  ($traceurRuntime.createClass)(InjectLazy, {}, {}, Inject);
  var Provide = function Provide(token) {
    this.token = token;
    this.isPromise = false;
  };
  ($traceurRuntime.createClass)(Provide, {}, {});
  var ProvidePromise = function ProvidePromise(token) {
    this.token = token;
    this.isPromise = true;
  };
  ($traceurRuntime.createClass)(ProvidePromise, {}, {}, Provide);
  function annotate(fn, annotation) {
    fn.annotations = fn.annotations || [];
    fn.annotations.push(annotation);
  }
  function hasAnnotation(fn, annotationClass) {
    if (!fn.annotations || fn.annotations.length === 0) {
      return false;
    }
    for (var $__2 = fn.annotations[Symbol.iterator](),
        $__3; !($__3 = $__2.next()).done; ) {
      var annotation = $__3.value;
      {
        if (annotation instanceof annotationClass) {
          return true;
        }
      }
    }
    return false;
  }
  function readAnnotations(fn) {
    var collectedAnnotations = {
      provide: {
        token: null,
        isPromise: false
      },
      params: []
    };
    if (fn.annotations && fn.annotations.length) {
      for (var $__2 = fn.annotations[Symbol.iterator](),
          $__3; !($__3 = $__2.next()).done; ) {
        var annotation = $__3.value;
        {
          if (annotation instanceof Inject) {
            collectedAnnotations.params = annotation.tokens.map((function(token) {
              return {
                token: token,
                isPromise: annotation.isPromise,
                isLazy: annotation.isLazy
              };
            }));
          }
          if (annotation instanceof Provide) {
            collectedAnnotations.provide.token = annotation.token;
            collectedAnnotations.provide.isPromise = annotation.isPromise;
          }
        }
      }
    }
    if (fn.parameters) {
      fn.parameters.forEach((function(param, idx) {
        for (var $__4 = param[Symbol.iterator](),
            $__5; !($__5 = $__4.next()).done; ) {
          var paramAnnotation = $__5.value;
          {
            if (isFunction(paramAnnotation) && !collectedAnnotations.params[idx]) {
              collectedAnnotations.params[idx] = {
                token: paramAnnotation,
                isPromise: false,
                isLazy: false
              };
            } else if (paramAnnotation instanceof Inject) {
              collectedAnnotations.params[idx] = {
                token: paramAnnotation.tokens[0],
                isPromise: paramAnnotation.isPromise,
                isLazy: paramAnnotation.isLazy
              };
            }
          }
        }
      }));
    }
    return collectedAnnotations;
  }
  ;
  return {
    get annotate() {
      return annotate;
    },
    get hasAnnotation() {
      return hasAnnotation;
    },
    get readAnnotations() {
      return readAnnotations;
    },
    get SuperConstructor() {
      return SuperConstructor;
    },
    get TransientScope() {
      return TransientScope;
    },
    get Inject() {
      return Inject;
    },
    get InjectPromise() {
      return InjectPromise;
    },
    get InjectLazy() {
      return InjectLazy;
    },
    get Provide() {
      return Provide;
    },
    get ProvidePromise() {
      return ProvidePromise;
    },
    __esModule: true
  };
});

define('di/profiler',['./util'], function($__0) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  var toString = $traceurRuntime.assertObject($__0).toString;
  var IS_DEBUG = false;
  var _global = null;
  if (typeof process === 'object' && process.env) {
    IS_DEBUG = !!process.env['DEBUG'];
    _global = global;
  } else if (typeof location === 'object' && location.search) {
    IS_DEBUG = /di_debug/.test(location.search);
    _global = window;
  }
  var globalCounter = 0;
  function getUniqueId() {
    return ++globalCounter;
  }
  function serializeToken(token, tokens) {
    if (!tokens.has(token)) {
      tokens.set(token, getUniqueId().toString());
    }
    return tokens.get(token);
  }
  function serializeProvider(provider, key, tokens) {
    return {
      id: serializeToken(key, tokens),
      name: toString(key),
      isPromise: provider.isPromise,
      dependencies: provider.params.map(function(param) {
        return {
          token: serializeToken(param.token, tokens),
          isPromise: param.isPromise,
          isLazy: param.isLazy
        };
      })
    };
  }
  function serializeInjector(injector, tokens, Injector) {
    var serializedInjector = {
      id: serializeToken(injector, tokens),
      parent_id: injector._parent ? serializeToken(injector._parent, tokens) : null,
      providers: {}
    };
    var injectorClassId = serializeToken(Injector, tokens);
    serializedInjector.providers[injectorClassId] = {
      id: injectorClassId,
      name: toString(Injector),
      isPromise: false,
      dependencies: []
    };
    injector._providers.forEach(function(provider, key) {
      var serializedProvider = serializeProvider(provider, key, tokens);
      serializedInjector.providers[serializedProvider.id] = serializedProvider;
    });
    return serializedInjector;
  }
  function profileInjector(injector, Injector) {
    if (!IS_DEBUG) {
      return;
    }
    if (!_global.__di_dump__) {
      _global.__di_dump__ = {
        injectors: [],
        tokens: new Map()
      };
    }
    _global.__di_dump__.injectors.push(serializeInjector(injector, _global.__di_dump__.tokens, Injector));
  }
  return {
    get profileInjector() {
      return profileInjector;
    },
    __esModule: true
  };
});

define('di/providers',['./annotations', './util'], function($__0,$__1) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  var $__5 = $traceurRuntime.assertObject($__0),
      SuperConstructorAnnotation = $__5.SuperConstructor,
      readAnnotations = $__5.readAnnotations;
  var $__5 = $traceurRuntime.assertObject($__1),
      isClass = $__5.isClass,
      isFunction = $__5.isFunction,
      isObject = $__5.isObject,
      toString = $__5.toString;
  var EmptyFunction = Object.getPrototypeOf(Function);
  var ClassProvider = function ClassProvider(clazz, params, isPromise) {
    this.provider = clazz;
    this.isPromise = isPromise;
    this.params = [];
    this._constructors = [];
    this._flattenParams(clazz, params);
    this._constructors.unshift([clazz, 0, this.params.length - 1]);
  };
  ($traceurRuntime.createClass)(ClassProvider, {
    _flattenParams: function(constructor, params) {
      var SuperConstructor;
      var constructorInfo;
      for (var $__3 = params[Symbol.iterator](),
          $__4; !($__4 = $__3.next()).done; ) {
        var param = $__4.value;
        {
          if (param.token === SuperConstructorAnnotation) {
            SuperConstructor = Object.getPrototypeOf(constructor);
            if (SuperConstructor === EmptyFunction) {
              throw new Error((toString(constructor) + " does not have a parent constructor. Only classes with a parent can ask for SuperConstructor!"));
            }
            constructorInfo = [SuperConstructor, this.params.length];
            this._constructors.push(constructorInfo);
            this._flattenParams(SuperConstructor, readAnnotations(SuperConstructor).params);
            constructorInfo.push(this.params.length - 1);
          } else {
            this.params.push(param);
          }
        }
      }
    },
    _createConstructor: function(currentConstructorIdx, context, allArguments) {
      var constructorInfo = this._constructors[currentConstructorIdx];
      var nextConstructorInfo = this._constructors[currentConstructorIdx + 1];
      var argsForCurrentConstructor;
      if (nextConstructorInfo) {
        argsForCurrentConstructor = allArguments.slice(constructorInfo[1], nextConstructorInfo[1]).concat([this._createConstructor(currentConstructorIdx + 1, context, allArguments)]).concat(allArguments.slice(nextConstructorInfo[2] + 1, constructorInfo[2] + 1));
      } else {
        argsForCurrentConstructor = allArguments.slice(constructorInfo[1], constructorInfo[2] + 1);
      }
      return function InjectedAndBoundSuperConstructor() {
        return constructorInfo[0].apply(context, argsForCurrentConstructor);
      };
    },
    create: function(args) {
      var context = Object.create(this.provider.prototype);
      var constructor = this._createConstructor(0, context, args);
      var returnedValue = constructor();
      if (isFunction(returnedValue) || isObject(returnedValue)) {
        return returnedValue;
      }
      return context;
    }
  }, {});
  var FactoryProvider = function FactoryProvider(factoryFunction, params, isPromise) {
    this.provider = factoryFunction;
    this.params = params;
    this.isPromise = isPromise;
    for (var $__3 = params[Symbol.iterator](),
        $__4; !($__4 = $__3.next()).done; ) {
      var param = $__4.value;
      {
        if (param.token === SuperConstructorAnnotation) {
          throw new Error((toString(factoryFunction) + " is not a class. Only classes with a parent can ask for SuperConstructor!"));
        }
      }
    }
  };
  ($traceurRuntime.createClass)(FactoryProvider, {create: function(args) {
      return this.provider.apply(undefined, args);
    }}, {});
  function createProviderFromFnOrClass(fnOrClass, annotations) {
    if (isClass(fnOrClass)) {
      return new ClassProvider(fnOrClass, annotations.params, annotations.provide.isPromise);
    }
    return new FactoryProvider(fnOrClass, annotations.params, annotations.provide.isPromise);
  }
  return {
    get createProviderFromFnOrClass() {
      return createProviderFromFnOrClass;
    },
    __esModule: true
  };
});

define('di/injector',['./annotations', './util', './profiler', './providers'], function($__0,$__1,$__2,$__3) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  if (!$__3 || !$__3.__esModule)
    $__3 = {'default': $__3};
  var $__8 = $traceurRuntime.assertObject($__0),
      annotate = $__8.annotate,
      readAnnotations = $__8.readAnnotations,
      hasAnnotation = $__8.hasAnnotation,
      ProvideAnnotation = $__8.Provide,
      TransientScopeAnnotation = $__8.TransientScope;
  var $__8 = $traceurRuntime.assertObject($__1),
      isFunction = $__8.isFunction,
      toString = $__8.toString;
  var profileInjector = $traceurRuntime.assertObject($__2).profileInjector;
  var createProviderFromFnOrClass = $traceurRuntime.assertObject($__3).createProviderFromFnOrClass;
  function constructResolvingMessage(resolving, token) {
    if (arguments.length > 1) {
      resolving.push(token);
    }
    if (resolving.length > 1) {
      return (" (" + resolving.map(toString).join(' -> ') + ")");
    }
    return '';
  }
  var Injector = function Injector() {
    var modules = arguments[0] !== (void 0) ? arguments[0] : [];
    var parentInjector = arguments[1] !== (void 0) ? arguments[1] : null;
    var providers = arguments[2] !== (void 0) ? arguments[2] : new Map();
    var scopes = arguments[3] !== (void 0) ? arguments[3] : [];
    this._cache = new Map();
    this._providers = providers;
    this._parent = parentInjector;
    this._scopes = scopes;
    this._loadModules(modules);
    profileInjector(this, $Injector);
  };
  var $Injector = Injector;
  ($traceurRuntime.createClass)(Injector, {
    _collectProvidersWithAnnotation: function(annotationClass, collectedProviders) {
      this._providers.forEach((function(provider, token) {
        if (!collectedProviders.has(token) && hasAnnotation(provider.provider, annotationClass)) {
          collectedProviders.set(token, provider);
        }
      }));
      if (this._parent) {
        this._parent._collectProvidersWithAnnotation(annotationClass, collectedProviders);
      }
    },
    _loadModules: function(modules) {
      for (var $__6 = modules[Symbol.iterator](),
          $__7; !($__7 = $__6.next()).done; ) {
        var module = $__7.value;
        {
          if (isFunction(module)) {
            this._loadFnOrClass(module);
            continue;
          }
          throw new Error('Invalid module!');
        }
      }
    },
    _loadFnOrClass: function(fnOrClass) {
      var annotations = readAnnotations(fnOrClass);
      var token = annotations.provide.token || fnOrClass;
      var provider = createProviderFromFnOrClass(fnOrClass, annotations);
      this._providers.set(token, provider);
    },
    _hasProviderFor: function(token) {
      if (this._providers.has(token)) {
        return true;
      }
      if (this._parent) {
        return this._parent._hasProviderFor(token);
      }
      return false;
    },
    _instantiateDefaultProvider: function(provider, token, resolving, wantPromise, wantLazy) {
      if (!this._parent) {
        this._providers.set(token, provider);
        return this.get(token, resolving, wantPromise, wantLazy);
      }
      for (var $__6 = this._scopes[Symbol.iterator](),
          $__7; !($__7 = $__6.next()).done; ) {
        var ScopeClass = $__7.value;
        {
          if (hasAnnotation(provider.provider, ScopeClass)) {
            this._providers.set(token, provider);
            return this.get(token, resolving, wantPromise, wantLazy);
          }
        }
      }
      return this._parent._instantiateDefaultProvider(provider, token, resolving, wantPromise, wantLazy);
    },
    get: function(token) {
      var resolving = arguments[1] !== (void 0) ? arguments[1] : [];
      var wantPromise = arguments[2] !== (void 0) ? arguments[2] : false;
      var wantLazy = arguments[3] !== (void 0) ? arguments[3] : false;
      var $__4 = this;
      var resolvingMsg = '';
      var provider;
      var instance;
      var injector = this;
      if (token === null || token === undefined) {
        resolvingMsg = constructResolvingMessage(resolving, token);
        throw new Error(("Invalid token \"" + token + "\" requested!" + resolvingMsg));
      }
      if (token === $Injector) {
        if (wantPromise) {
          return Promise.resolve(this);
        }
        return this;
      }
      if (wantLazy) {
        return function createLazyInstance() {
          var lazyInjector = injector;
          if (arguments.length) {
            var locals = [];
            var args = arguments;
            for (var i = 0; i < args.length; i += 2) {
              locals.push((function(ii) {
                var fn = function createLocalInstance() {
                  return args[ii + 1];
                };
                annotate(fn, new ProvideAnnotation(args[ii]));
                return fn;
              })(i));
            }
            lazyInjector = injector.createChild(locals);
          }
          return lazyInjector.get(token, resolving, wantPromise, false);
        };
      }
      if (this._cache.has(token)) {
        instance = this._cache.get(token);
        provider = this._providers.get(token);
        if (provider.isPromise && !wantPromise) {
          resolvingMsg = constructResolvingMessage(resolving, token);
          throw new Error(("Cannot instantiate " + toString(token) + " synchronously. It is provided as a promise!" + resolvingMsg));
        }
        if (!provider.isPromise && wantPromise) {
          return Promise.resolve(instance);
        }
        return instance;
      }
      provider = this._providers.get(token);
      if (!provider && isFunction(token) && !this._hasProviderFor(token)) {
        provider = createProviderFromFnOrClass(token, readAnnotations(token));
        return this._instantiateDefaultProvider(provider, token, resolving, wantPromise, wantLazy);
      }
      if (!provider) {
        if (!this._parent) {
          resolvingMsg = constructResolvingMessage(resolving, token);
          throw new Error(("No provider for " + toString(token) + "!" + resolvingMsg));
        }
        return this._parent.get(token, resolving, wantPromise, wantLazy);
      }
      if (resolving.indexOf(token) !== -1) {
        resolvingMsg = constructResolvingMessage(resolving, token);
        throw new Error(("Cannot instantiate cyclic dependency!" + resolvingMsg));
      }
      resolving.push(token);
      var delayingInstantiation = wantPromise && provider.params.some((function(param) {
        return !param.isPromise;
      }));
      var args = provider.params.map((function(param) {
        if (delayingInstantiation) {
          return $__4.get(param.token, resolving, true, param.isLazy);
        }
        return $__4.get(param.token, resolving, param.isPromise, param.isLazy);
      }));
      if (delayingInstantiation) {
        var delayedResolving = resolving.slice();
        resolving.pop();
        return Promise.all(args).then(function(args) {
          try {
            instance = provider.create(args);
          } catch (e) {
            resolvingMsg = constructResolvingMessage(delayedResolving);
            var originalMsg = 'ORIGINAL ERROR: ' + e.message;
            e.message = ("Error during instantiation of " + toString(token) + "!" + resolvingMsg + "\n" + originalMsg);
            throw e;
          }
          if (!hasAnnotation(provider.provider, TransientScopeAnnotation)) {
            injector._cache.set(token, instance);
          }
          return instance;
        });
      }
      try {
        instance = provider.create(args);
      } catch (e) {
        resolvingMsg = constructResolvingMessage(resolving);
        var originalMsg = 'ORIGINAL ERROR: ' + e.message;
        e.message = ("Error during instantiation of " + toString(token) + "!" + resolvingMsg + "\n" + originalMsg);
        throw e;
      }
      if (!hasAnnotation(provider.provider, TransientScopeAnnotation)) {
        this._cache.set(token, instance);
      }
      if (!wantPromise && provider.isPromise) {
        resolvingMsg = constructResolvingMessage(resolving);
        throw new Error(("Cannot instantiate " + toString(token) + " synchronously. It is provided as a promise!" + resolvingMsg));
      }
      if (wantPromise && !provider.isPromise) {
        instance = Promise.resolve(instance);
      }
      resolving.pop();
      return instance;
    },
    getPromise: function(token) {
      return this.get(token, [], true);
    },
    createChild: function() {
      var modules = arguments[0] !== (void 0) ? arguments[0] : [];
      var forceNewInstancesOf = arguments[1] !== (void 0) ? arguments[1] : [];
      var forcedProviders = new Map();
      forceNewInstancesOf.push(TransientScopeAnnotation);
      for (var $__6 = forceNewInstancesOf[Symbol.iterator](),
          $__7; !($__7 = $__6.next()).done; ) {
        var annotation = $__7.value;
        {
          this._collectProvidersWithAnnotation(annotation, forcedProviders);
        }
      }
      return new $Injector(modules, this, forcedProviders, forceNewInstancesOf);
    }
  }, {});
  ;
  return {
    get Injector() {
      return Injector;
    },
    __esModule: true
  };
});

define('di/index',['./injector', './annotations'], function($__0,$__1) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  var $__injector__ = $__0;
  var $__annotations__ = $__1;
  return {
    get Injector() {
      return $__injector__.Injector;
    },
    get annotate() {
      return $__annotations__.annotate;
    },
    get Inject() {
      return $__annotations__.Inject;
    },
    get InjectLazy() {
      return $__annotations__.InjectLazy;
    },
    get InjectPromise() {
      return $__annotations__.InjectPromise;
    },
    get Provide() {
      return $__annotations__.Provide;
    },
    get ProvidePromise() {
      return $__annotations__.ProvidePromise;
    },
    get SuperConstructor() {
      return $__annotations__.SuperConstructor;
    },
    get TransientScope() {
      return $__annotations__.TransientScope;
    },
    __esModule: true
  };
});

define('experiments/models/TodoItem',[], function() {
  
  var $__default = (function() {
    var TodoItem = function TodoItem(text) {
      var done = arguments[1] !== (void 0) ? arguments[1] : false;
      this.text = text;
      this.done = done;
    };
    return ($traceurRuntime.createClass)(TodoItem, {
      toggle: function() {
        this.done = !this.done;
      },
      toString: function() {
        return this.text;
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

define('common/utils/Generators',['di/index'], function($__0) {
  
  var $__4 = $traceurRuntime.initGeneratorFunction(entries),
      $__5 = $traceurRuntime.initGeneratorFunction(keys),
      $__6 = $traceurRuntime.initGeneratorFunction(take),
      $__7 = $traceurRuntime.initGeneratorFunction(values),
      $__8 = $traceurRuntime.initGeneratorFunction(keyGenerator);
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  
  var $__3 = $traceurRuntime.assertObject($__0),
      Provide = $__3.Provide,
      Inject = $__3.Inject,
      TransientScope = $__3.TransientScope;
  function entries(obj) {
    var $__1,
        $__2,
        key;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__1 = Object.keys(obj)[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = (!($__2 = $__1.next()).done) ? 9 : -2;
            break;
          case 9:
            $ctx.pushTry(7, null);
            $ctx.state = 10;
            break;
          case 10:
            throw undefined;
            $ctx.state = 12;
            break;
          case 12:
            $ctx.popTry();
            $ctx.state = 14;
            break;
          case 7:
            $ctx.popTry();
            key = $ctx.storedException;
            $ctx.state = 5;
            break;
          case 5:
            key = $__2.value;
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return [key, obj[$traceurRuntime.toProperty(key)]];
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 14;
            break;
          default:
            return $ctx.end();
        }
    }, $__4, this);
  }
  function keys(obj) {
    var $__1,
        $__2,
        key;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__1 = Object.keys(obj)[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = (!($__2 = $__1.next()).done) ? 9 : -2;
            break;
          case 9:
            $ctx.pushTry(7, null);
            $ctx.state = 10;
            break;
          case 10:
            throw undefined;
            $ctx.state = 12;
            break;
          case 12:
            $ctx.popTry();
            $ctx.state = 14;
            break;
          case 7:
            $ctx.popTry();
            key = $ctx.storedException;
            $ctx.state = 5;
            break;
          case 5:
            key = $__2.value;
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return key;
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 14;
            break;
          default:
            return $ctx.end();
        }
    }, $__5, this);
  }
  function take(iterator, n) {
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $ctx.state = (n > 0) ? 1 : -2;
            break;
          case 1:
            $ctx.state = 2;
            return iterator.next();
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 4;
            break;
          case 4:
            n--;
            $ctx.state = 0;
            break;
          default:
            return $ctx.end();
        }
    }, $__6, this);
  }
  function values(obj) {
    var $__1,
        $__2,
        key;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__1 = Object.keys(obj)[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = (!($__2 = $__1.next()).done) ? 9 : -2;
            break;
          case 9:
            $ctx.pushTry(7, null);
            $ctx.state = 10;
            break;
          case 10:
            throw undefined;
            $ctx.state = 12;
            break;
          case 12:
            $ctx.popTry();
            $ctx.state = 14;
            break;
          case 7:
            $ctx.popTry();
            key = $ctx.storedException;
            $ctx.state = 5;
            break;
          case 5:
            key = $__2.value;
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return obj[$traceurRuntime.toProperty(key)];
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 14;
            break;
          default:
            return $ctx.end();
        }
    }, $__7, this);
  }
  function keyGenerator() {
    var i,
        reset;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            i = 1;
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
    }, $__8, this);
  }
  keyGenerator.annotations = [new TransientScope, new Inject, new Provide('sumoKeyGen')];
  return {
    get entries() {
      return entries;
    },
    get keys() {
      return keys;
    },
    get take() {
      return take;
    },
    get values() {
      return values;
    },
    get keyGenerator() {
      return keyGenerator;
    },
    __esModule: true
  };
});

define('experiments/models/TodoList',['./TodoItem', '../../common/utils/Generators', 'di/index', 'diary/diary'], function($__0,$__1,$__2,$__3) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  if (!$__3 || !$__3.__esModule)
    $__3 = {'default': $__3};
  var Todo = $traceurRuntime.assertObject($__0).default;
  var $__7 = $traceurRuntime.assertObject($__1),
      values = $__7.values,
      keys = $__7.keys;
  var Inject = $traceurRuntime.assertObject($__2).Inject;
  var Diary = $traceurRuntime.assertObject($__3).Diary;
  var TodoList = function TodoList(sumoKeyGen) {
    this.logger = Diary.logger('TodoList');
    this.keyGen = sumoKeyGen;
    this.todos = {};
    this.length = 0;
  };
  ($traceurRuntime.createClass)(TodoList, {
    add: function(text) {
      var done = arguments[1] !== (void 0) ? arguments[1] : false;
      var todo = new Todo(text, done);
      var key = this.keyGen.next().value;
      $traceurRuntime.setProperty(this.todos, key, todo);
      this.length++;
    },
    getTodo: function(key) {
      return this.todos[$traceurRuntime.toProperty(key)];
    },
    allTodos: function() {
      return this.todos;
    },
    archiveCompleted: function() {
      for (var $__5 = values(this.todos)[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__6; !($__6 = $__5.next()).done; ) {
        try {
          throw undefined;
        } catch (todo) {
          todo = $__6.value;
          {
            if (todo.done) {
              console.log('removing...', todo);
            }
          }
        }
      }
    },
    remove: function(key) {
      delete this.todos[$traceurRuntime.toProperty(key)];
      this.length--;
    },
    getUncompletedCount: function() {
      var count = 0;
      for (var $__5 = values(this.todos)[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__6; !($__6 = $__5.next()).done; ) {
        try {
          throw undefined;
        } catch (todo) {
          todo = $__6.value;
          {
            if (!todo.done) {
              count++;
            }
          }
        }
      }
      return count;
    },
    completed: function() {
      return this.todos.values().filter((function(todo) {
        return todo.done === true;
      }));
    },
    remaining: function() {
      var $__8;
      return ($__8 = this.todos.values()).without.apply($__8, $traceurRuntime.toObject(this.completed()));
    },
    clearAll: function() {
      for (var $__5 = keys(this.todos)[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__6; !($__6 = $__5.next()).done; ) {
        try {
          throw undefined;
        } catch (todo) {
          todo = $__6.value;
          {
            this.remove(todo);
          }
        }
      }
      this.logger.info(("Reseting keyGen to : " + this.keyGen.next(true).value));
    }
  }, {});
  TodoList.annotations = [new Inject('sumoKeyGen')];
  var $__default = TodoList;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('common/utils/generators',['di/index'], function($__0) {
  
  var $__4 = $traceurRuntime.initGeneratorFunction(entries),
      $__5 = $traceurRuntime.initGeneratorFunction(keys),
      $__6 = $traceurRuntime.initGeneratorFunction(take),
      $__7 = $traceurRuntime.initGeneratorFunction(values),
      $__8 = $traceurRuntime.initGeneratorFunction(keyGenerator);
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  
  var $__3 = $traceurRuntime.assertObject($__0),
      Provide = $__3.Provide,
      Inject = $__3.Inject,
      TransientScope = $__3.TransientScope;
  function entries(obj) {
    var $__1,
        $__2,
        key;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__1 = Object.keys(obj)[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = (!($__2 = $__1.next()).done) ? 9 : -2;
            break;
          case 9:
            $ctx.pushTry(7, null);
            $ctx.state = 10;
            break;
          case 10:
            throw undefined;
            $ctx.state = 12;
            break;
          case 12:
            $ctx.popTry();
            $ctx.state = 14;
            break;
          case 7:
            $ctx.popTry();
            key = $ctx.storedException;
            $ctx.state = 5;
            break;
          case 5:
            key = $__2.value;
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return [key, obj[$traceurRuntime.toProperty(key)]];
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 14;
            break;
          default:
            return $ctx.end();
        }
    }, $__4, this);
  }
  function keys(obj) {
    var $__1,
        $__2,
        key;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__1 = Object.keys(obj)[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = (!($__2 = $__1.next()).done) ? 9 : -2;
            break;
          case 9:
            $ctx.pushTry(7, null);
            $ctx.state = 10;
            break;
          case 10:
            throw undefined;
            $ctx.state = 12;
            break;
          case 12:
            $ctx.popTry();
            $ctx.state = 14;
            break;
          case 7:
            $ctx.popTry();
            key = $ctx.storedException;
            $ctx.state = 5;
            break;
          case 5:
            key = $__2.value;
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return key;
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 14;
            break;
          default:
            return $ctx.end();
        }
    }, $__5, this);
  }
  function take(iterator, n) {
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $ctx.state = (n > 0) ? 1 : -2;
            break;
          case 1:
            $ctx.state = 2;
            return iterator.next();
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 4;
            break;
          case 4:
            n--;
            $ctx.state = 0;
            break;
          default:
            return $ctx.end();
        }
    }, $__6, this);
  }
  function values(obj) {
    var $__1,
        $__2,
        key;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__1 = Object.keys(obj)[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = (!($__2 = $__1.next()).done) ? 9 : -2;
            break;
          case 9:
            $ctx.pushTry(7, null);
            $ctx.state = 10;
            break;
          case 10:
            throw undefined;
            $ctx.state = 12;
            break;
          case 12:
            $ctx.popTry();
            $ctx.state = 14;
            break;
          case 7:
            $ctx.popTry();
            key = $ctx.storedException;
            $ctx.state = 5;
            break;
          case 5:
            key = $__2.value;
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return obj[$traceurRuntime.toProperty(key)];
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 14;
            break;
          default:
            return $ctx.end();
        }
    }, $__7, this);
  }
  function keyGenerator() {
    var i,
        reset;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            i = 1;
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
    }, $__8, this);
  }
  keyGenerator.annotations = [new TransientScope, new Inject, new Provide('sumoKeyGen')];
  return {
    get entries() {
      return entries;
    },
    get keys() {
      return keys;
    },
    get take() {
      return take;
    },
    get values() {
      return values;
    },
    get keyGenerator() {
      return keyGenerator;
    },
    __esModule: true
  };
});

define('experiments/controllers/TodoController',['di/index', '../models/TodoList', '../../common/utils/generators'], function($__0,$__1,$__2) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  var Injector = $traceurRuntime.assertObject($__0).Injector;
  var TodoList = $traceurRuntime.assertObject($__1).default;
  var keyGenerator = $traceurRuntime.assertObject($__2).keyGenerator;
  var $__default = (function() {
    var TodoController = function TodoController($scope, growl) {
      var injector = new Injector([keyGenerator]);
      this.todos = injector.get(TodoList);
      this.todos.add('learn AngularJS', true);
      this.todos.add('build an AngularJS app');
      this.newTodo = '';
      this.growl = growl;
    };
    return ($traceurRuntime.createClass)(TodoController, {
      addTodo: function() {
        this.todos.add(this.newTodo, false);
        this.growl.info((this.newTodo + " ... added"), {ttl: 3000});
        this.newTodo = '';
      },
      removeTodo: function(key) {
        var anItem = this.todos.getTodo(key);
        this.growl.warning((anItem.text + " ... removed"), {ttl: 3000});
        this.todos.remove(key);
      },
      clearAll: function() {
        this.todos.clearAll();
        this.growl.error('All Clear', {ttl: 3000});
      },
      completed: function() {
        return this.todos.completed();
      },
      remaining: function() {
        return this.todos.remaining();
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

define('experiments/controllers/AsyncController',[], function() {
  
  var $__default = (function() {
    var AsyncController = function AsyncController($scope, AsyncService) {
      AsyncService.emit('register');
      AsyncService.on('register', function(data) {
        $scope.data = data;
      });
    };
    return ($traceurRuntime.createClass)(AsyncController, {}, {});
  }());
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('experiments/services/PrimeGenerator',[], function() {
  
  
  var $__2 = $traceurRuntime.initGeneratorFunction(numbers),
      $__3 = $traceurRuntime.initGeneratorFunction(take),
      $__4 = $traceurRuntime.initGeneratorFunction(filter),
      $__5 = $traceurRuntime.initGeneratorFunction(primes);
  function numbers(start) {
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $ctx.state = (true) ? 1 : -2;
            break;
          case 1:
            $ctx.state = 2;
            return start++;
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 0;
            break;
          default:
            return $ctx.end();
        }
    }, $__2, this);
  }
  function take(count, seq) {
    var i;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            i = 0;
            $ctx.state = 7;
            break;
          case 7:
            $ctx.state = (i < count) ? 1 : -2;
            break;
          case 4:
            i++;
            $ctx.state = 7;
            break;
          case 1:
            $ctx.state = 2;
            return seq.next().value;
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 4;
            break;
          default:
            return $ctx.end();
        }
    }, $__3, this);
  }
  function filter(seq, prime) {
    var $__0,
        $__1,
        num;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__0 = seq[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = (!($__1 = $__0.next()).done) ? 6 : -2;
            break;
          case 6:
            num = $__1.value;
            $ctx.state = 7;
            break;
          case 7:
            $ctx.state = (num % prime !== 0) ? 1 : 4;
            break;
          case 1:
            $ctx.state = 2;
            return num;
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 4;
            break;
          default:
            return $ctx.end();
        }
    }, $__4, this);
  }
  function primes() {
    var seq,
        prime;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            seq = numbers(2);
            $ctx.state = 11;
            break;
          case 11:
            $ctx.state = (true) ? 5 : -2;
            break;
          case 5:
            prime = seq.next().value;
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return prime;
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 4;
            break;
          case 4:
            seq = filter(seq, prime);
            $ctx.state = 11;
            break;
          default:
            return $ctx.end();
        }
    }, $__5, this);
  }
  return {
    get take() {
      return take;
    },
    get primes() {
      return primes;
    },
    __esModule: true
  };
});

define('experiments/controllers/ExperimentController',['diary/diary', '../services/PrimeGenerator'], function($__0,$__1) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  var Diary = $traceurRuntime.assertObject($__0).Diary;
  var $__6 = $traceurRuntime.assertObject($__1),
      take = $__6.take,
      primes = $__6.primes;
  var $__default = (function() {
    var ExperimentController = function ExperimentController($http, $q, $scope, EmailService, UserService, DrugRestangular) {
      var $__2 = this;
      this.logger = Diary.logger('ExperimentController');
      this.logger.info('in ExperimentController....');
      EmailService.content = 'Greeting !';
      $scope.user = {
        name: 'awesome user',
        dob: new Date(1984, 4, 15)
      };
      $scope.sendEmail = (function(recipient) {
        var p = $q.when(EmailService.send(recipient));
        p.then((function(body) {
          $scope.output = body;
        })).catch((function(err) {
          $scope.output = err;
        }));
      });
      $scope.test403 = (function() {
        DrugRestangular.all('drugs/test403').getList().then(function(data) {
          $scope.output = data;
        });
      });
      $scope.genPrime = (function() {
        var max = arguments[0] !== (void 0) ? arguments[0] : 10;
        $scope.output = '';
        for (var $__4 = take(max, primes())[$traceurRuntime.toProperty(Symbol.iterator)](),
            $__5; !($__5 = $__4.next()).done; ) {
          var prime = $__5.value;
          {
            $scope.output += ', ' + prime;
          }
        }
      });
      $scope.currentUser = (function() {
        UserService.currentUser().then((function(user) {
          $scope.output = user;
        })).catch((function(err) {
          $__2.logger.error(err);
          $scope.output = err;
        }));
      });
      $scope.clearUser = function() {
        UserService.clear();
      };
    };
    return ($traceurRuntime.createClass)(ExperimentController, {}, {});
  }());
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('experiments/controllers/ElementsController',[], function() {
  
  var $__default = (function() {
    var ElementsController = function ElementsController($scope) {
      var $__0 = this;
      console.info('in ElementsController....');
      $scope.news = [{
        news: 'news1',
        breaking: false
      }, {
        news: 'news2',
        breaking: true
      }, {
        news: 'news3',
        breaking: false
      }, {
        news: 'news4',
        breaking: false
      }, {
        news: 'news5',
        breaking: true
      }, {
        news: 'news6',
        breaking: false
      }, {
        news: 'news7',
        breaking: false
      }];
      $scope.supportsWebComponents = (function() {
        console.log('test:', $__0.supportsTemplate(), $__0.supportsImports(), $__0.supportsCustomElements());
        if ($__0.supportsTemplate() && $__0.supportsImports() && $__0.supportsCustomElements()) {
          return 3;
        } else if ($__0.supportsTemplate() && $__0.supportsImports()) {
          return 2;
        } else if ($__0.supportsTemplate()) {
          return 1;
        } else {
          return 0;
        }
      });
    };
    return ($traceurRuntime.createClass)(ElementsController, {
      supportsTemplate: function() {
        return 'content' in document.createElement('template');
      },
      supportsImports: function() {
        return 'import' in document.createElement('link');
      },
      supportsCustomElements: function() {
        return 'registerElement' in document;
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

define('experiments/controllers/GrowlTranslateDemoController',['diary/diary'], function($__0) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  var Diary = $traceurRuntime.assertObject($__0).Diary;
  var $__default = (function() {
    var GrowlTranslateDemoController = function GrowlTranslateDemoController($scope, growl, $translate, AuthorizationService) {
      var $__1 = this;
      this.logger = Diary.logger('GrowlTranslateDemoController');
      $scope.setLang = function(langKey) {
        $translate.use(langKey);
      };
      $scope.addTranslatedMessage = (function() {
        growl.success('LOGIN_SUCCESS');
        growl.error('LOGOUT_SUCCESS');
        growl.warning('Override global <strong>ttl</strong> setting', {ttl: 10000});
      });
      $scope.addErrorMessage = (function() {
        growl.error('This adds a error message');
      });
      $scope.addWarnMessage = (function() {
        growl.warning("This adds a warn message", {title: 'Warning!'});
      });
      $scope.addInfoMessage = (function() {
        growl.info("This adds a info message with title", {title: 'Info!'});
        AuthorizationService.isAuthorized1(['ROLE_USER']).then((function(isAuthz) {
          $__1.logger.info(("User has ROLE_USER role? " + isAuthz));
        }));
      });
      $scope.addSuccessMessage = (function() {
        growl.success('This adds a success message');
      });
    };
    return ($traceurRuntime.createClass)(GrowlTranslateDemoController, {}, {});
  }());
  return {
    get default() {
      return $__default;
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

define('experiments/elements/myElement/MyElement',['../../../common/utils/util', 'diary/diary'], function($__0,$__1) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  var $__4 = $traceurRuntime.assertObject($__0),
      loadDOMFromString = $__4.loadDOMFromString,
      loadDOMFromLink = $__4.loadDOMFromLink;
  var Diary = $traceurRuntime.assertObject($__1).Diary;
  var _count = Symbol('count', true);
  var _max = Symbol('max', true);
  var $__default = (function($__super) {
    var MyElement = function MyElement() {
      $traceurRuntime.defaultSuperCall(this, MyElement.prototype, arguments);
    };
    return ($traceurRuntime.createClass)(MyElement, {
      createdCallback: function() {
        var max = arguments[0] !== (void 0) ? arguments[0] : 10;
        var startCount = arguments[1] !== (void 0) ? arguments[1] : 0;
        var $__2 = this;
        this.logger = Diary.logger('MyElement');
        this.max = this.getAttribute('max') || max;
        $traceurRuntime.setProperty(this, _count, this.getAttribute('startCount') || startCount);
        this.innerHTML = ("Using StartCount:<b>" + this[$traceurRuntime.toProperty(_count)] + "</b> and Max: <b>" + this[$traceurRuntime.toProperty(_max)] + "</b><br/>");
        this.addEventListener('click', (function(e) {
          $__2[$traceurRuntime.toProperty(_count)]++;
          $__2.logger.info(("_count: " + $__2[$traceurRuntime.toProperty(_count)]));
        }));
        this.addEventListener('dblclick', (function(e) {
          $__2.logger.info(("isMax: " + $__2.isMax));
        }));
        var root = this.createShadowRoot();
        var templatePromise = loadDOMFromLink('scripts/experiments/elements/myElement/myElementTemplate.html');
        templatePromise.then((function(importedDoc) {
          var myElementTemplate = importedDoc.querySelector('#my-element-template');
          {
            try {
              throw undefined;
            } catch (clone) {
              clone = myElementTemplate.content.cloneNode(true);
              var model = {
                'Twitter': '@jdcravens',
                'Facebook': 'jesse.cravens',
                'LinkedIn': 'jessecravens',
                'Github': 'jessecravens'
              };
              myElementTemplate.model = model;
              root.appendChild(clone);
            }
          }
        })).catch((function(error) {
          console.error(error);
        }));
      },
      get isMax() {
        return this[$traceurRuntime.toProperty(_count)] > this[$traceurRuntime.toProperty(_max)];
      },
      set max(value) {
        if (value < 0) {
          throw new Error('Max must be non-negative.');
        }
        $traceurRuntime.setProperty(this, _max, value);
      },
      doStuff: function() {}
    }, {}, $__super);
  }(HTMLElement));
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('experiments/elements/customButton/CustomButton',[], function() {
  
  var CustomButtonPrototype = Object.create(HTMLButtonElement.prototype);
  CustomButtonPrototype.createdCallback = function() {
    
    this.textContent = 'I am a custom button!';
  };
  var $__default = {
    prototype: CustomButtonPrototype,
    extends: 'button'
  };
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('experiments/elements/myNews/MyNews',['../../../common/utils/util'], function($__0) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  var $__2 = $traceurRuntime.assertObject($__0),
      loadDOMFromString = $__2.loadDOMFromString,
      loadDOMFromLink = $__2.loadDOMFromLink;
  var $__default = (function($__super) {
    var MyNews = function MyNews() {
      $traceurRuntime.defaultSuperCall(this, MyNews.prototype, arguments);
    };
    return ($traceurRuntime.createClass)(MyNews, {createdCallback: function() {
        var root = this.createShadowRoot();
        var templatePromise = loadDOMFromLink('scripts/experiments/elements/myNews/myNewsTemplate.html');
        templatePromise.then((function(template) {
          var t = template.querySelector('#t');
          root.appendChild(t.content.cloneNode(true));
          var ticker = root.querySelector('#ticker');
          ticker.pseudo = 'x-ticker';
          var s = ticker.createShadowRoot();
          var u = template.querySelector('#u');
          s.appendChild(u.content.cloneNode(true));
        }));
      }}, {}, $__super);
  }(HTMLElement));
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define('experiments/index',['./routes', './services/EmailService', './services/AsyncService', './controllers/TodoController', './controllers/AsyncController', './controllers/ExperimentController', './controllers/ElementsController', './controllers/GrowlTranslateDemoController', './elements/myElement/MyElement', './elements/customButton/CustomButton', './elements/myNews/MyNews'], function($__0,$__1,$__2,$__3,$__4,$__5,$__6,$__7,$__8,$__9,$__10) {
  
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
  if (!$__9 || !$__9.__esModule)
    $__9 = {'default': $__9};
  if (!$__10 || !$__10.__esModule)
    $__10 = {'default': $__10};
  var routes = $traceurRuntime.assertObject($__0).default;
  var EmailService = $traceurRuntime.assertObject($__1).default;
  var AsyncService = $traceurRuntime.assertObject($__2).default;
  var TodoController = $traceurRuntime.assertObject($__3).default;
  var AsyncController = $traceurRuntime.assertObject($__4).default;
  var ExperimentController = $traceurRuntime.assertObject($__5).default;
  var ElementsController = $traceurRuntime.assertObject($__6).default;
  var GrowlTranslateDemoController = $traceurRuntime.assertObject($__7).default;
  var MyElement = $traceurRuntime.assertObject($__8).default;
  var CustomButton = $traceurRuntime.assertObject($__9).default;
  var MyNews = $traceurRuntime.assertObject($__10).default;
  var moduleName = 'spaApp.experiments';
  var experimentsModule = angular.module(moduleName, []);
  experimentsModule.service('EmailService', EmailService);
  experimentsModule.factory('AsyncService', AsyncService);
  experimentsModule.controller('TodoController', TodoController);
  experimentsModule.controller('AsyncController', AsyncController);
  experimentsModule.controller('ExperimentController', ExperimentController);
  experimentsModule.controller('ElementsController', ElementsController);
  experimentsModule.controller('GrowlTranslateDemoController', GrowlTranslateDemoController);
  experimentsModule.config(routes);
  if ('registerElement' in document) {
    document.registerElement('my-element', MyElement);
    document.registerElement('custom-button', CustomButton);
    document.registerElement('my-news', MyNews);
  }
  var $__default = moduleName;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

