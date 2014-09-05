define('experiments/routes',[], function() {
  
  function routes($stateProvider) {
    
    return $stateProvider.state('slow', {
      url: '/slow',
      templateUrl: 'views/experiments/experiment.html',
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
      templateUrl: 'views/experiments/experiment.html',
      controller: 'ExperimentController'
    }).state('translations', {
      url: '/translations',
      templateUrl: 'views/experiments/growlTranslate.html',
      controller: 'GrowlTranslateDemoController',
      resolve: {myTranslations: function($translatePartialLoader, $translate) {
          $translatePartialLoader.addPart('common');
          console.log('loading common module translations...');
          return $translate.refresh();
        }}
    }).state('elements', {
      url: '/elements',
      templateUrl: 'views/experiments/elements.html',
      controller: 'ElementsController'
    }).state('messaging', {
      url: '/messaging',
      templateUrl: 'views/experiments/messaging.html',
      controller: 'MessagingController as mc'
    }).state('terminal', {
      url: '/terminal/:containerId',
      access: {allowAnonymous: false},
      templateUrl: 'views/experiments/terminal.html',
      controller: 'TerminalController as tc',
      onExit: function() {
        console.log('exit terminal');
      }
    }).state('todoMVC', {
      url: '/todo',
      templateUrl: 'views/experiments/todo.html',
      controller: 'TodoController as tc'
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

//# sourceMappingURL=../experiments/routes.js.map;
define('assert',[], function() {
  
  var POSITION_NAME = ['', '1st', '2nd', '3rd'];
  function argPositionName(i) {
    var position = (i / 2) + 1;
    return POSITION_NAME[position] || (position + 'th');
  }
  var primitives = $traceurRuntime.type;
  function assertArgumentTypes() {
    for (var params = [],
        $__2 = 0; $__2 < arguments.length; $__2++)
      params[$__2] = arguments[$__2];
    var actual,
        type;
    var currentArgErrors;
    var errors = [];
    var msg;
    for (var i = 0,
        l = params.length; i < l; i = i + 2) {
      actual = params[i];
      type = params[i + 1];
      currentArgErrors = [];
      if (!isType(actual, type, currentArgErrors)) {
        errors.push(argPositionName(i) + ' argument has to be an instance of ' + prettyPrint(type) + ', got ' + prettyPrint(actual));
        if (currentArgErrors.length) {
          errors.push(currentArgErrors);
        }
      }
    }
    if (errors.length) {
      throw new Error('Invalid arguments given!\n' + formatErrors(errors));
    }
  }
  function prettyPrint(value) {
    if (typeof value === 'undefined') {
      return 'undefined';
    }
    if (typeof value === 'string') {
      return '"' + value + '"';
    }
    if (typeof value === 'boolean') {
      return value.toString();
    }
    if (value === null) {
      return 'null';
    }
    if (typeof value === 'object') {
      if (value.map) {
        return '[' + value.map(prettyPrint).join(', ') + ']';
      }
      var properties = Object.keys(value);
      return '{' + properties.map((function(p) {
        return p + ': ' + prettyPrint(value[p]);
      })).join(', ') + '}';
    }
    return value.__assertName || value.name || value.toString();
  }
  function isType(value, T, errors) {
    if (typeof value === 'undefined') {
      return true;
    }
    if (T === primitives.void) {
      return typeof value === 'undefined';
    }
    if (T === primitives.any || value === null) {
      return true;
    }
    if (T === primitives.string) {
      return typeof value === 'string';
    }
    if (T === primitives.number) {
      return typeof value === 'number';
    }
    if (T === primitives.boolean) {
      return typeof value === 'boolean';
    }
    if (typeof T.assert === 'function') {
      var parentStack = currentStack;
      var isValid;
      currentStack = errors;
      try {
        isValid = T.assert(value);
      } catch (e) {
        fail(e.message);
        isValid = false;
      }
      currentStack = parentStack;
      if (typeof isValid === 'undefined') {
        isValid = errors.length === 0;
      }
      return isValid;
    }
    return value instanceof T;
  }
  function formatErrors(errors) {
    var indent = arguments[1] !== (void 0) ? arguments[1] : '  ';
    return errors.map((function(e) {
      if (typeof e === 'string')
        return indent + '- ' + e;
      return formatErrors(e, indent + '  ');
    })).join('\n');
  }
  function type(actual, T) {
    var errors = [];
    if (!isType(actual, T, errors)) {
      var msg = 'Expected an instance of ' + prettyPrint(T) + ', got ' + prettyPrint(actual) + '!';
      if (errors.length) {
        msg += '\n' + formatErrors(errors);
      }
      throw new Error(msg);
    }
  }
  function returnType(actual, T) {
    var errors = [];
    if (!isType(actual, T, errors)) {
      var msg = 'Expected to return an instance of ' + prettyPrint(T) + ', got ' + prettyPrint(actual) + '!';
      if (errors.length) {
        msg += '\n' + formatErrors(errors);
      }
      throw new Error(msg);
    }
    return actual;
  }
  var string = define('string', function(value) {
    return typeof value === 'string';
  });
  var boolean = define('boolean', function(value) {
    return typeof value === 'boolean';
  });
  var number = define('number', function(value) {
    return typeof value === 'number';
  });
  function arrayOf() {
    for (var types = [],
        $__3 = 0; $__3 < arguments.length; $__3++)
      types[$__3] = arguments[$__3];
    return assert.define('array of ' + types.map(prettyPrint).join('/'), function(value) {
      var $__5;
      if (assert(value).is(Array)) {
        for (var $__0 = value[Symbol.iterator](),
            $__1; !($__1 = $__0.next()).done; ) {
          var item = $__1.value;
          {
            ($__5 = assert(item)).is.apply($__5, $traceurRuntime.spread(types));
          }
        }
      }
    });
  }
  function structure(definition) {
    var properties = Object.keys(definition);
    return assert.define('object with properties ' + properties.join(', '), function(value) {
      if (assert(value).is(Object)) {
        for (var $__0 = properties[Symbol.iterator](),
            $__1; !($__1 = $__0.next()).done; ) {
          var property = $__1.value;
          {
            assert(value[property]).is(definition[property]);
          }
        }
      }
    });
  }
  var currentStack = [];
  function fail(message) {
    currentStack.push(message);
  }
  function define(classOrName, check) {
    var cls = classOrName;
    if (typeof classOrName === 'string') {
      cls = function() {};
      cls.__assertName = classOrName;
    }
    cls.assert = function(value) {
      return check(value);
    };
    return cls;
  }
  function assert(value) {
    return {is: function is() {
        var $__5;
        for (var types = [],
            $__4 = 0; $__4 < arguments.length; $__4++)
          types[$__4] = arguments[$__4];
        var allErrors = [];
        var errors;
        for (var $__0 = types[Symbol.iterator](),
            $__1; !($__1 = $__0.next()).done; ) {
          var type = $__1.value;
          {
            errors = [];
            if (isType(value, type, errors)) {
              return true;
            }
            allErrors.push(prettyPrint(value) + ' is not instance of ' + prettyPrint(type));
            if (errors.length) {
              allErrors.push(errors);
            }
          }
        }
        ($__5 = currentStack).push.apply($__5, $traceurRuntime.spread(allErrors));
        return false;
      }};
  }
  assert.type = type;
  assert.argumentTypes = assertArgumentTypes;
  assert.returnType = returnType;
  assert.define = define;
  assert.fail = fail;
  assert.string = string;
  assert.number = number;
  assert.boolean = boolean;
  assert.arrayOf = arrayOf;
  assert.structure = structure;
  ;
  return {
    get assert() {
      return assert;
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
          var $__3 = target,
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

define('experiments/services/EmailService',["assert", 'diary/diary'], function($__0,$__2) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  var assert = $__0.assert;
  var Diary = $__2.Diary;
  var EmailService = function EmailService() {
    this.logger = Diary.logger('EmailService');
    this.logger.info('in EmailService....');
    this.content = '';
  };
  ($traceurRuntime.createClass)(EmailService, {
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
      return assert.returnType((new Promise((function(resolve) {
        setTimeout(resolve, ms);
      }))), Promise);
    }
  }, {
    format: function() {
      var name = arguments[0] !== (void 0) ? arguments[0] : "Anonymous";
      assert.argumentTypes(name, $traceurRuntime.type.string);
      return assert.returnType((name.toUpperCase()), $traceurRuntime.type.string);
    },
    add: function(a, b) {
      assert.argumentTypes(a, $traceurRuntime.type.number, b, $traceurRuntime.type.number);
      return assert.returnType((a + b), $traceurRuntime.type.number);
    }
  });
  var $__default = EmailService;
  EmailService.format.parameters = [[$traceurRuntime.type.string]];
  EmailService.add.parameters = [[$traceurRuntime.type.number], [$traceurRuntime.type.number]];
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

//# sourceMappingURL=../../experiments/services/EmailService.js.map;
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
    $__0 = {default: $__0};
  var isFunction = $__0.isFunction;
  var SuperConstructor = function SuperConstructor() {};
  ($traceurRuntime.createClass)(SuperConstructor, {}, {});
  var TransientScope = function TransientScope() {};
  ($traceurRuntime.createClass)(TransientScope, {}, {});
  var Inject = function Inject() {
    for (var tokens = [],
        $__7 = 0; $__7 < arguments.length; $__7++)
      tokens[$__7] = arguments[$__7];
    this.tokens = tokens;
    this.isPromise = false;
    this.isLazy = false;
  };
  ($traceurRuntime.createClass)(Inject, {}, {});
  var InjectPromise = function InjectPromise() {
    for (var tokens = [],
        $__8 = 0; $__8 < arguments.length; $__8++)
      tokens[$__8] = arguments[$__8];
    this.tokens = tokens;
    this.isPromise = true;
    this.isLazy = false;
  };
  ($traceurRuntime.createClass)(InjectPromise, {}, {}, Inject);
  var InjectLazy = function InjectLazy() {
    for (var tokens = [],
        $__9 = 0; $__9 < arguments.length; $__9++)
      tokens[$__9] = arguments[$__9];
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
    for (var $__3 = fn.annotations[Symbol.iterator](),
        $__4; !($__4 = $__3.next()).done; ) {
      var annotation = $__4.value;
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
      for (var $__3 = fn.annotations[Symbol.iterator](),
          $__4; !($__4 = $__3.next()).done; ) {
        var annotation = $__4.value;
        {
          if (annotation instanceof Inject) {
            annotation.tokens.forEach((function(token) {
              collectedAnnotations.params.push({
                token: token,
                isPromise: annotation.isPromise,
                isLazy: annotation.isLazy
              });
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
        for (var $__5 = param[Symbol.iterator](),
            $__6; !($__6 = $__5.next()).done; ) {
          var paramAnnotation = $__6.value;
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
    $__0 = {default: $__0};
  var toString = $__0.toString;
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

define('di/providers',['./annotations', './util'], function($__0,$__2) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  var $__1 = $__0,
      SuperConstructorAnnotation = $__1.SuperConstructor,
      readAnnotations = $__1.readAnnotations;
  var $__3 = $__2,
      isClass = $__3.isClass,
      isFunction = $__3.isFunction,
      isObject = $__3.isObject,
      toString = $__3.toString;
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
      for (var $__5 = params[Symbol.iterator](),
          $__6; !($__6 = $__5.next()).done; ) {
        var param = $__6.value;
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
    for (var $__5 = params[Symbol.iterator](),
        $__6; !($__6 = $__5.next()).done; ) {
      var param = $__6.value;
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

define('di/injector',['./annotations', './util', './profiler', './providers'], function($__0,$__2,$__4,$__6) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {default: $__4};
  if (!$__6 || !$__6.__esModule)
    $__6 = {default: $__6};
  var $__1 = $__0,
      annotate = $__1.annotate,
      readAnnotations = $__1.readAnnotations,
      hasAnnotation = $__1.hasAnnotation,
      ProvideAnnotation = $__1.Provide,
      TransientScopeAnnotation = $__1.TransientScope;
  var $__3 = $__2,
      isFunction = $__3.isFunction,
      toString = $__3.toString;
  var profileInjector = $__4.profileInjector;
  var createProviderFromFnOrClass = $__6.createProviderFromFnOrClass;
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
      for (var $__10 = modules[Symbol.iterator](),
          $__11; !($__11 = $__10.next()).done; ) {
        var module = $__11.value;
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
      for (var $__10 = this._scopes[Symbol.iterator](),
          $__11; !($__11 = $__10.next()).done; ) {
        var ScopeClass = $__11.value;
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
      var $__8 = this;
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
          return $__8.get(param.token, resolving, true, param.isLazy);
        }
        return $__8.get(param.token, resolving, param.isPromise, param.isLazy);
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
      for (var $__10 = forceNewInstancesOf[Symbol.iterator](),
          $__11; !($__11 = $__10.next()).done; ) {
        var annotation = $__11.value;
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
    $__0 = {default: $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {default: $__1};
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
  
  var TodoItem = function TodoItem(text) {
    var done = arguments[1] !== (void 0) ? arguments[1] : false;
    this.text = text;
    this.done = done;
  };
  ($traceurRuntime.createClass)(TodoItem, {
    toggle: function() {
      this.done = !this.done;
    },
    toString: function() {
      return this.text;
    }
  }, {});
  var $__default = TodoItem;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

//# sourceMappingURL=../../experiments/models/TodoItem.js.map;
define('common/utils/Generators',['di/index'], function($__0) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  
  var $__1 = $__0,
      Provide = $__1.Provide,
      Inject = $__1.Inject,
      TransientScope = $__1.TransientScope;
  var Generators = function Generators() {};
  ($traceurRuntime.createClass)(Generators, {}, {
    entries: $traceurRuntime.initGeneratorFunction(function $__5(obj) {
      var $__3,
          $__4,
          key;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              $__3 = Object.keys(obj)[$traceurRuntime.toProperty(Symbol.iterator)]();
              $ctx.state = 14;
              break;
            case 14:
              $ctx.state = (!($__4 = $__3.next()).done) ? 9 : -2;
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
              key = $__4.value;
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
      }, $__5, this);
    }),
    keys: $traceurRuntime.initGeneratorFunction(function $__6(obj) {
      var $__3,
          $__4,
          key;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              $__3 = Object.keys(obj)[$traceurRuntime.toProperty(Symbol.iterator)]();
              $ctx.state = 14;
              break;
            case 14:
              $ctx.state = (!($__4 = $__3.next()).done) ? 9 : -2;
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
              key = $__4.value;
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
      }, $__6, this);
    }),
    take: $traceurRuntime.initGeneratorFunction(function $__7(iterator, n) {
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
      }, $__7, this);
    }),
    values: $traceurRuntime.initGeneratorFunction(function $__8(obj) {
      var $__3,
          $__4,
          key;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              $__3 = Object.keys(obj)[$traceurRuntime.toProperty(Symbol.iterator)]();
              $ctx.state = 14;
              break;
            case 14:
              $ctx.state = (!($__4 = $__3.next()).done) ? 9 : -2;
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
              key = $__4.value;
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
      }, $__8, this);
    }),
    keyGenerator: $traceurRuntime.initGeneratorFunction(function $__9() {
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
      }, $__9, this);
    })
  });
  Generators.keyGenerator.annotations = [new TransientScope, new Inject, new Provide('sumoKeyGen')];
  return {
    get Generators() {
      return Generators;
    },
    __esModule: true
  };
});

//# sourceMappingURL=../../common/utils/Generators.js.map;
define('experiments/models/TodoList',['./TodoItem', '../../common/utils/Generators', 'di/index', 'diary/diary'], function($__0,$__2,$__4,$__6) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {default: $__4};
  if (!$__6 || !$__6.__esModule)
    $__6 = {default: $__6};
  var Todo = $__0.default;
  var Generators = $__2.Generators;
  var Inject = $__4.Inject;
  var Diary = $__6.Diary;
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
      for (var $__9 = Generators.values(this.todos)[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__10; !($__10 = $__9.next()).done; ) {
        try {
          throw undefined;
        } catch (todo) {
          {
            todo = $__10.value;
            {
              if (todo.done) {
                console.log('removing...', todo);
              }
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
      for (var $__9 = Generators.values(this.todos)[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__10; !($__10 = $__9.next()).done; ) {
        try {
          throw undefined;
        } catch (todo) {
          {
            todo = $__10.value;
            {
              if (!todo.done) {
                count++;
              }
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
      var $__11;
      return ($__11 = this.todos.values()).without.apply($__11, $traceurRuntime.spread(this.completed()));
    },
    clearAll: function() {
      for (var $__9 = Generators.keys(this.todos)[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__10; !($__10 = $__9.next()).done; ) {
        try {
          throw undefined;
        } catch (todo) {
          {
            todo = $__10.value;
            {
              this.remove(todo);
            }
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

//# sourceMappingURL=../../experiments/models/TodoList.js.map;
define('common/utils/generators',['di/index'], function($__0) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  
  var $__1 = $__0,
      Provide = $__1.Provide,
      Inject = $__1.Inject,
      TransientScope = $__1.TransientScope;
  var Generators = function Generators() {};
  ($traceurRuntime.createClass)(Generators, {}, {
    entries: $traceurRuntime.initGeneratorFunction(function $__5(obj) {
      var $__3,
          $__4,
          key;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              $__3 = Object.keys(obj)[$traceurRuntime.toProperty(Symbol.iterator)]();
              $ctx.state = 14;
              break;
            case 14:
              $ctx.state = (!($__4 = $__3.next()).done) ? 9 : -2;
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
              key = $__4.value;
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
      }, $__5, this);
    }),
    keys: $traceurRuntime.initGeneratorFunction(function $__6(obj) {
      var $__3,
          $__4,
          key;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              $__3 = Object.keys(obj)[$traceurRuntime.toProperty(Symbol.iterator)]();
              $ctx.state = 14;
              break;
            case 14:
              $ctx.state = (!($__4 = $__3.next()).done) ? 9 : -2;
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
              key = $__4.value;
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
      }, $__6, this);
    }),
    take: $traceurRuntime.initGeneratorFunction(function $__7(iterator, n) {
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
      }, $__7, this);
    }),
    values: $traceurRuntime.initGeneratorFunction(function $__8(obj) {
      var $__3,
          $__4,
          key;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              $__3 = Object.keys(obj)[$traceurRuntime.toProperty(Symbol.iterator)]();
              $ctx.state = 14;
              break;
            case 14:
              $ctx.state = (!($__4 = $__3.next()).done) ? 9 : -2;
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
              key = $__4.value;
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
      }, $__8, this);
    }),
    keyGenerator: $traceurRuntime.initGeneratorFunction(function $__9() {
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
      }, $__9, this);
    })
  });
  Generators.keyGenerator.annotations = [new TransientScope, new Inject, new Provide('sumoKeyGen')];
  return {
    get Generators() {
      return Generators;
    },
    __esModule: true
  };
});

//# sourceMappingURL=../../common/utils/Generators.js.map;
define('experiments/controllers/TodoController',['di/index', '../models/TodoList', '../../common/utils/generators'], function($__0,$__2,$__4) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {default: $__4};
  var Injector = $__0.Injector;
  var TodoList = $__2.default;
  var Generators = $__4.Generators;
  var TodoController = function TodoController($scope, growl) {
    var injector = new Injector([Generators.keyGenerator]);
    this.todos = injector.get(TodoList);
    this.todos.add('learn AngularJS', true);
    this.todos.add('build an AngularJS app');
    this.newTodo = '';
    this.growl = growl;
  };
  ($traceurRuntime.createClass)(TodoController, {
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
  var $__default = TodoController;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

//# sourceMappingURL=../../experiments/controllers/TodoController.js.map;
define('experiments/controllers/MessagingController',[], function() {
  
  var _scope = Symbol('scope');
  var _eventBus = Symbol('eventBus');
  var MessagingController = function MessagingController($scope, $eventBus, UserService) {
    var $__0 = this;
    this.users = [];
    this.rooms = [];
    this.messages = [];
    this.notifications = [];
    this.selectedUser = 'All';
    this.selectedRoom = 'Developers';
    this.joined = false;
    $traceurRuntime.setProperty(this, _scope, $scope);
    $traceurRuntime.setProperty(this, _eventBus, $eventBus);
    var notify = (function(message, error) {
      if ($__0.notifications.length > 2) {
        $__0.notifications.shift();
      }
      $__0.notifications.push({
        message: message,
        error: error
      });
    });
    if (!UserService.isLoggedIn()) {
      notify('Please login to participate in the Chat', true);
    }
    $scope.$watch((function() {
      return $eventBus.readyState.value;
    }), (function(value) {
      $__0.readyState = value;
      notify(("Connection state: " + $__0[$traceurRuntime.toProperty(_eventBus)].readyState.description), $eventBus.readyState.value > 2);
    }));
    this.getChatRooms();
    this.getActiveUsers('stocks');
    var onMessage = (function(message) {
      var privt = arguments[1] !== (void 0) ? arguments[1] : false;
      if (message.body) {
        $scope.$apply((function() {
          if ($__0.messages.length > 9) {
            $__0.messages.shift();
          }
          $__0.messages.push({
            message: JSON.parse(message.body),
            private: privt
          });
        }));
      }
    });
    var onError = (function(error) {
      if (error.body) {
        $scope.$apply((function() {
          notify(error.body, true);
        }));
      }
    });
    var onStockQuote = (function(message) {
      switch (message.headers.destination) {
        case '/topic/price.stock.AAPL':
          $__0.AAPL = JSON.parse(message.body);
          break;
        case '/topic/price.stock.GOOG':
          $__0.GOOG = JSON.parse(message.body);
          break;
        case '/topic/price.stock.YHOO':
          $__0.YHOO = JSON.parse(message.body);
          break;
      }
      $scope.$apply();
    });
    var onAnnouncements = (function(message) {
      notify(JSON.parse(message.body));
      $__0.getActiveUsers('stocks');
      $__0.selectedUser = 'All';
    });
    $eventBus.registerHandler('/topic/chat/announcements.*', onAnnouncements);
    $eventBus.registerHandler('/topic/chat/messages', onMessage);
    $eventBus.registerHandler('/user/queue/chat/messages', (function(message) {
      onMessage(message, true);
    }));
    $eventBus.registerHandler('/user/queue/chat/self', onMessage);
    $eventBus.registerHandler('/user/queue/errors', onError);
    $eventBus.registerHandler('/topic/price.stock.*', onStockQuote);
    $scope.$on('$destroy', (function() {
      $eventBus.publish('/app/chat/leave', 'Goodbye World');
      $eventBus.unregisterHandler('/topic/chat/announcements.*');
      $eventBus.unregisterHandler('/topic/chat/messages');
      $eventBus.unregisterHandler('/user/queue/chat/messages');
      $eventBus.unregisterHandler('/user/queue/chat/self');
      $eventBus.unregisterHandler('/user/queue/errors');
      $eventBus.unregisterHandler('/topic/price.stock.*');
    }));
  };
  ($traceurRuntime.createClass)(MessagingController, {
    joinLeave: function() {
      if (this.joined) {
        this[$traceurRuntime.toProperty(_eventBus)].publish('/app/chat/leave', 'Goodbye World');
        this.joined = false;
      } else {
        this[$traceurRuntime.toProperty(_eventBus)].publish('/app/chat/join', 'Hello World');
        this.joined = true;
      }
    },
    getChatRooms: function() {
      var $__0 = this;
      this[$traceurRuntime.toProperty(_eventBus)].send('/app/chat/rooms/' + 'sumo').then((function(rooms) {
        $__0[$traceurRuntime.toProperty(_scope)].$apply((function() {
          $__0.rooms = rooms;
        }));
      }));
    },
    getActiveUsers: function(room) {
      var $__0 = this;
      this[$traceurRuntime.toProperty(_eventBus)].send('/app/chat/users/' + room).then((function(users) {
        $__0[$traceurRuntime.toProperty(_scope)].$apply((function() {
          $__0.users = users;
        }));
      }));
    },
    sendSelf: function(message) {
      this[$traceurRuntime.toProperty(_eventBus)].publish('/app/chat/self', message);
    },
    sendMessage: function(newMessage) {
      if (this.selectedUser === 'All') {
        this[$traceurRuntime.toProperty(_eventBus)].publish('/app/chat/messages', newMessage);
      } else {
        this.messages.push({
          message: ("[ >> " + this.selectedUser + "]: " + newMessage),
          private: true
        });
        this[$traceurRuntime.toProperty(_eventBus)].publish(("/user/" + this.selectedUser + "/queue/chat/messages"), ("[" + this[$traceurRuntime.toProperty(_eventBus)].getUser() + "]: " + newMessage));
      }
      this.newMessage = '';
    }
  }, {});
  var $__default = MessagingController;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

//# sourceMappingURL=../../experiments/controllers/MessagingController.js.map;
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

/**
 * term.js - an xterm emulator
 * Copyright (c) 2012-2013, Christopher Jeffrey (MIT License)
 * https://github.com/chjj/term.js
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Originally forked from (with the author's permission):
 *   Fabrice Bellard's javascript vt100 for jslinux:
 *   http://bellard.org/jslinux/
 *   Copyright (c) 2011 Fabrice Bellard
 *   The original design remains. The terminal itself
 *   has been extended to include xterm CSI codes, among
 *   other features.
 */

;(function() {

/**
 * Terminal Emulation References:
 *   http://vt100.net/
 *   http://invisible-island.net/xterm/ctlseqs/ctlseqs.txt
 *   http://invisible-island.net/xterm/ctlseqs/ctlseqs.html
 *   http://invisible-island.net/vttest/
 *   http://www.inwap.com/pdp10/ansicode.txt
 *   http://linux.die.net/man/4/console_codes
 *   http://linux.die.net/man/7/urxvt
 */



/**
 * Shared
 */

var window = this
  , document = this.document;

/**
 * EventEmitter
 */

function EventEmitter() {
  this._events = this._events || {};
}

EventEmitter.prototype.addListener = function(type, listener) {
  this._events[type] = this._events[type] || [];
  this._events[type].push(listener);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.removeListener = function(type, listener) {
  if (!this._events[type]) return;

  var obj = this._events[type]
    , i = obj.length;

  while (i--) {
    if (obj[i] === listener || obj[i].listener === listener) {
      obj.splice(i, 1);
      return;
    }
  }
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners = function(type) {
  if (this._events[type]) delete this._events[type];
};

EventEmitter.prototype.once = function(type, listener) {
  function on() {
    var args = Array.prototype.slice.call(arguments);
    this.removeListener(type, on);
    return listener.apply(this, args);
  }
  on.listener = listener;
  return this.on(type, on);
};

EventEmitter.prototype.emit = function(type) {
  if (!this._events[type]) return;

  var args = Array.prototype.slice.call(arguments, 1)
    , obj = this._events[type]
    , l = obj.length
    , i = 0;

  for (; i < l; i++) {
    obj[i].apply(this, args);
  }
};

EventEmitter.prototype.listeners = function(type) {
  return this._events[type] = this._events[type] || [];
};

/**
 * States
 */

var normal = 0
  , escaped = 1
  , csi = 2
  , osc = 3
  , charset = 4
  , dcs = 5
  , ignore = 6;

/**
 * Terminal
 */

function Terminal(options) {
  var self = this;

  if (!(this instanceof Terminal)) {
    return new Terminal(arguments[0], arguments[1], arguments[2]);
  }

  EventEmitter.call(this);

  if (typeof options === 'number') {
    options = {
      cols: arguments[0],
      rows: arguments[1],
      handler: arguments[2]
    };
  }

  options = options || {};

  each(keys(Terminal.defaults), function(key) {
    if (options[key] == null) {
      options[key] = Terminal.options[key];
      // Legacy:
      if (Terminal[key] !== Terminal.defaults[key]) {
        options[key] = Terminal[key];
      }
    }
    self[key] = options[key];
  });

  if (options.colors.length === 8) {
    options.colors = options.colors.concat(Terminal._colors.slice(8));
  } else if (options.colors.length === 16) {
    options.colors = options.colors.concat(Terminal._colors.slice(16));
  } else if (options.colors.length === 10) {
    options.colors = options.colors.slice(0, -2).concat(
      Terminal._colors.slice(8, -2), options.colors.slice(-2));
  } else if (options.colors.length === 18) {
    options.colors = options.colors.concat(
      Terminal._colors.slice(16, -2), options.colors.slice(-2));
  }
  this.colors = options.colors;

  this.options = options;

  // this.context = options.context || window;
  // this.document = options.document || document;
  this.parent = options.body || options.parent
    || (document ? document.getElementsByTagName('body')[0] : null);

  this.cols = options.cols || options.geometry[0];
  this.rows = options.rows || options.geometry[1];

  if (options.handler) {
    this.on('data', options.handler);
  }

  this.ybase = 0;
  this.ydisp = 0;
  this.x = 0;
  this.y = 0;
  this.cursorState = 0;
  this.cursorHidden = false;
  this.convertEol;
  this.state = 0;
  this.queue = '';
  this.scrollTop = 0;
  this.scrollBottom = this.rows - 1;

  // modes
  this.applicationKeypad = false;
  this.applicationCursor = false;
  this.originMode = false;
  this.insertMode = false;
  this.wraparoundMode = false;
  this.normal = null;

  // select modes
  this.prefixMode = false;
  this.selectMode = false;
  this.visualMode = false;
  this.searchMode = false;
  this.searchDown;
  this.entry = '';
  this.entryPrefix = 'Search: ';
  this._real;
  this._selected;
  this._textarea;

  // charset
  this.charset = null;
  this.gcharset = null;
  this.glevel = 0;
  this.charsets = [null];

  // mouse properties
  this.decLocator;
  this.x10Mouse;
  this.vt200Mouse;
  this.vt300Mouse;
  this.normalMouse;
  this.mouseEvents;
  this.sendFocus;
  this.utfMouse;
  this.sgrMouse;
  this.urxvtMouse;

  // misc
  this.element;
  this.children;
  this.refreshStart;
  this.refreshEnd;
  this.savedX;
  this.savedY;
  this.savedCols;

  // stream
  this.readable = true;
  this.writable = true;

  this.defAttr = (0 << 18) | (257 << 9) | (256 << 0);
  this.curAttr = this.defAttr;

  this.params = [];
  this.currentParam = 0;
  this.prefix = '';
  this.postfix = '';

  this.lines = [];
  var i = this.rows;
  while (i--) {
    this.lines.push(this.blankLine());
  }

  this.tabs;
  this.setupStops();
}

inherits(Terminal, EventEmitter);

// back_color_erase feature for xterm.
Terminal.prototype.eraseAttr = function() {
  // if (this.is('screen')) return this.defAttr;
  return (this.defAttr & ~0x1ff) | (this.curAttr & 0x1ff);
};

/**
 * Colors
 */

// Colors 0-15
Terminal.tangoColors = [
  // dark:
  '#2e3436',
  '#cc0000',
  '#4e9a06',
  '#c4a000',
  '#3465a4',
  '#75507b',
  '#06989a',
  '#d3d7cf',
  // bright:
  '#555753',
  '#ef2929',
  '#8ae234',
  '#fce94f',
  '#729fcf',
  '#ad7fa8',
  '#34e2e2',
  '#eeeeec'
];

Terminal.xtermColors = [
  // dark:
  '#000000', // black
  '#cd0000', // red3
  '#00cd00', // green3
  '#cdcd00', // yellow3
  '#0000ee', // blue2
  '#cd00cd', // magenta3
  '#00cdcd', // cyan3
  '#e5e5e5', // gray90
  // bright:
  '#7f7f7f', // gray50
  '#ff0000', // red
  '#00ff00', // green
  '#ffff00', // yellow
  '#5c5cff', // rgb:5c/5c/ff
  '#ff00ff', // magenta
  '#00ffff', // cyan
  '#ffffff'  // white
];

// Colors 0-15 + 16-255
// Much thanks to TooTallNate for writing this.
Terminal.colors = (function() {
  var colors = Terminal.tangoColors.slice()
    , r = [0x00, 0x5f, 0x87, 0xaf, 0xd7, 0xff]
    , i;

  // 16-231
  i = 0;
  for (; i < 216; i++) {
    out(r[(i / 36) % 6 | 0], r[(i / 6) % 6 | 0], r[i % 6]);
  }

  // 232-255 (grey)
  i = 0;
  for (; i < 24; i++) {
    r = 8 + i * 10;
    out(r, r, r);
  }

  function out(r, g, b) {
    colors.push('#' + hex(r) + hex(g) + hex(b));
  }

  function hex(c) {
    c = c.toString(16);
    return c.length < 2 ? '0' + c : c;
  }

  return colors;
})();

// Default BG/FG
Terminal.colors[256] = '#000000';
Terminal.colors[257] = '#f0f0f0';

Terminal._colors = Terminal.colors.slice();

Terminal.vcolors = (function() {
  var out = []
    , colors = Terminal.colors
    , i = 0
    , color;

  for (; i < 256; i++) {
    color = parseInt(colors[i].substring(1), 16);
    out.push([
      (color >> 16) & 0xff,
      (color >> 8) & 0xff,
      color & 0xff
    ]);
  }

  return out;
})();

/**
 * Options
 */

Terminal.defaults = {
  colors: Terminal.colors,
  convertEol: false,
  termName: 'xterm',
  geometry: [80, 24],
  cursorBlink: true,
  visualBell: false,
  popOnBell: false,
  scrollback: 1000,
  screenKeys: false,
  debug: false,
  useStyle: false
  // programFeatures: false,
  // focusKeys: false,
};

Terminal.options = {};

each(keys(Terminal.defaults), function(key) {
  Terminal[key] = Terminal.defaults[key];
  Terminal.options[key] = Terminal.defaults[key];
});

/**
 * Focused Terminal
 */

Terminal.focus = null;

Terminal.prototype.focus = function() {
  if (Terminal.focus === this) return;

  if (Terminal.focus) {
    Terminal.focus.blur();
  }

  if (this.sendFocus) this.send('\x1b[I');
  this.showCursor();

  // try {
  //   this.element.focus();
  // } catch (e) {
  //   ;
  // }

  // this.emit('focus');

  Terminal.focus = this;
};

Terminal.prototype.blur = function() {
  if (Terminal.focus !== this) return;

  this.cursorState = 0;
  this.refresh(this.y, this.y);
  if (this.sendFocus) this.send('\x1b[O');

  // try {
  //   this.element.blur();
  // } catch (e) {
  //   ;
  // }

  // this.emit('blur');

  Terminal.focus = null;
};

/**
 * Initialize global behavior
 */

Terminal.prototype.initGlobal = function() {
  var document = this.document;

  Terminal._boundDocs = Terminal._boundDocs || [];
  if (~indexOf(Terminal._boundDocs, document)) {
    return;
  }
  Terminal._boundDocs.push(document);

  Terminal.bindPaste(document);

  Terminal.bindKeys(document);

  Terminal.bindCopy(document);

  if (this.isIpad || this.isIphone) {
    Terminal.fixIpad(document);
  }

  if (this.useStyle) {
    Terminal.insertStyle(document, this.colors[256], this.colors[257]);
  }
};

/**
 * Bind to paste event
 */

Terminal.bindPaste = function(document) {
  // This seems to work well for ctrl-V and middle-click,
  // even without the contentEditable workaround.
  var window = document.defaultView;
  on(window, 'paste', function(ev) {
    var term = Terminal.focus;
    if (!term) return;
    if (ev.clipboardData) {
      term.send(ev.clipboardData.getData('text/plain'));
    } else if (term.context.clipboardData) {
      term.send(term.context.clipboardData.getData('Text'));
    }
    // Not necessary. Do it anyway for good measure.
    term.element.contentEditable = 'inherit';
    return cancel(ev);
  });
};

/**
 * Global Events for key handling
 */

Terminal.bindKeys = function(document) {
  // We should only need to check `target === body` below,
  // but we can check everything for good measure.
  on(document, 'keydown', function(ev) {
    if (!Terminal.focus) return;
    var target = ev.target || ev.srcElement;
    if (!target) return;
    if (target === Terminal.focus.element
        || target === Terminal.focus.context
        || target === Terminal.focus.document
        || target === Terminal.focus.body
        || target === Terminal._textarea
        || target === Terminal.focus.parent) {
      return Terminal.focus.keyDown(ev);
    }
  }, true);

  on(document, 'keypress', function(ev) {
    if (!Terminal.focus) return;
    var target = ev.target || ev.srcElement;
    if (!target) return;
    if (target === Terminal.focus.element
        || target === Terminal.focus.context
        || target === Terminal.focus.document
        || target === Terminal.focus.body
        || target === Terminal._textarea
        || target === Terminal.focus.parent) {
      return Terminal.focus.keyPress(ev);
    }
  }, true);

  // If we click somewhere other than a
  // terminal, unfocus the terminal.
  on(document, 'mousedown', function(ev) {
    if (!Terminal.focus) return;

    var el = ev.target || ev.srcElement;
    if (!el) return;

    do {
      if (el === Terminal.focus.element) return;
    } while (el = el.parentNode);

    Terminal.focus.blur();
  });
};

/**
 * Copy Selection w/ Ctrl-C (Select Mode)
 */

Terminal.bindCopy = function(document) {
  var window = document.defaultView;

  // if (!('onbeforecopy' in document)) {
  //   // Copies to *only* the clipboard.
  //   on(window, 'copy', function fn(ev) {
  //     var term = Terminal.focus;
  //     if (!term) return;
  //     if (!term._selected) return;
  //     var text = term.grabText(
  //       term._selected.x1, term._selected.x2,
  //       term._selected.y1, term._selected.y2);
  //     term.emit('copy', text);
  //     ev.clipboardData.setData('text/plain', text);
  //   });
  //   return;
  // }

  // Copies to primary selection *and* clipboard.
  // NOTE: This may work better on capture phase,
  // or using the `beforecopy` event.
  on(window, 'copy', function(ev) {
    var term = Terminal.focus;
    if (!term) return;
    if (!term._selected) return;
    var textarea = term.getCopyTextarea();
    var text = term.grabText(
      term._selected.x1, term._selected.x2,
      term._selected.y1, term._selected.y2);
    term.emit('copy', text);
    textarea.focus();
    textarea.textContent = text;
    textarea.value = text;
    textarea.setSelectionRange(0, text.length);
    setTimeout(function() {
      term.element.focus();
      term.focus();
    }, 1);
  });
};

/**
 * Fix iPad - no idea if this works
 */

Terminal.fixIpad = function(document) {
  var textarea = document.createElement('textarea');
  textarea.style.position = 'absolute';
  textarea.style.left = '-32000px';
  textarea.style.top = '-32000px';
  textarea.style.width = '0px';
  textarea.style.height = '0px';
  textarea.style.opacity = '0';
  textarea.style.backgroundColor = 'transparent';
  textarea.style.borderStyle = 'none';
  textarea.style.outlineStyle = 'none';
  textarea.autocapitalize = 'none';
  textarea.autocorrect = 'off';

  document.getElementsByTagName('body')[0].appendChild(textarea);

  Terminal._textarea = textarea;

  setTimeout(function() {
    textarea.focus();
  }, 1000);
};

/**
 * Insert a default style
 */

Terminal.insertStyle = function(document, bg, fg) {
  var style = document.getElementById('term-style');
  if (style) return;

  var head = document.getElementsByTagName('head')[0];
  if (!head) return;

  var style = document.createElement('style');
  style.id = 'term-style';

  // textContent doesn't work well with IE for <style> elements.
  style.innerHTML = ''
    + '.terminal {\n'
    + '  float: left;\n'
    + '  border: ' + bg + ' solid 5px;\n'
    + '  font-family: "DejaVu Sans Mono", "Liberation Mono", monospace;\n'
    + '  font-size: 11px;\n'
    + '  color: ' + fg + ';\n'
    + '  background: ' + bg + ';\n'
    + '}\n'
    + '\n'
    + '.terminal-cursor {\n'
    + '  color: ' + bg + ';\n'
    + '  background: ' + fg + ';\n'
    + '}\n';

  // var out = '';
  // each(Terminal.colors, function(color, i) {
  //   if (i === 256) {
  //     out += '\n.term-bg-color-default { background-color: ' + color + '; }';
  //   }
  //   if (i === 257) {
  //     out += '\n.term-fg-color-default { color: ' + color + '; }';
  //   }
  //   out += '\n.term-bg-color-' + i + ' { background-color: ' + color + '; }';
  //   out += '\n.term-fg-color-' + i + ' { color: ' + color + '; }';
  // });
  // style.innerHTML += out + '\n';

  head.insertBefore(style, head.firstChild);
};

/**
 * Open Terminal
 */

Terminal.prototype.open = function(parent) {
  var self = this
    , i = 0
    , div;

  this.parent = parent || this.parent;

  if (!this.parent) {
    throw new Error('Terminal requires a parent element.');
  }

  // Grab global elements.
  this.context = this.parent.ownerDocument.defaultView;
  this.document = this.parent.ownerDocument;
  this.body = this.document.getElementsByTagName('body')[0];

  // Parse user-agent strings.
  if (this.context.navigator && this.context.navigator.userAgent) {
    this.isMac = !!~this.context.navigator.userAgent.indexOf('Mac');
    this.isIpad = !!~this.context.navigator.userAgent.indexOf('iPad');
    this.isIphone = !!~this.context.navigator.userAgent.indexOf('iPhone');
    this.isMSIE = !!~this.context.navigator.userAgent.indexOf('MSIE');
  }

  // Create our main terminal element.
  this.element = this.document.createElement('div');
  this.element.className = 'terminal';
  this.element.style.outline = 'none';
  this.element.setAttribute('tabindex', 0);
  this.element.style.backgroundColor = this.colors[256];
  this.element.style.color = this.colors[257];

  // Create the lines for our terminal.
  this.children = [];
  for (; i < this.rows; i++) {
    div = this.document.createElement('div');
    this.element.appendChild(div);
    this.children.push(div);
  }
  this.parent.appendChild(this.element);

  // Draw the screen.
  this.refresh(0, this.rows - 1);

  // Initialize global actions that
  // need to be taken on the document.
  this.initGlobal();

  // Ensure there is a Terminal.focus.
  this.focus();

  // Start blinking the cursor.
  this.startBlink();

  // Bind to DOM events related
  // to focus and paste behavior.
  on(this.element, 'focus', function() {
    self.focus();
    if (self.isIpad || self.isIphone) {
      Terminal._textarea.focus();
    }
  });

  // This causes slightly funky behavior.
  // on(this.element, 'blur', function() {
  //   self.blur();
  // });

  on(this.element, 'mousedown', function() {
    self.focus();
  });

  // Clickable paste workaround, using contentEditable.
  // This probably shouldn't work,
  // ... but it does. Firefox's paste
  // event seems to only work for textareas?
  on(this.element, 'mousedown', function(ev) {
    var button = ev.button != null
      ? +ev.button
      : ev.which != null
        ? ev.which - 1
        : null;

    // Does IE9 do this?
    if (self.isMSIE) {
      button = button === 1 ? 0 : button === 4 ? 1 : button;
    }

    if (button !== 2) return;

    self.element.contentEditable = 'true';
    setTimeout(function() {
      self.element.contentEditable = 'inherit'; // 'false';
    }, 1);
  }, true);

  // Listen for mouse events and translate
  // them into terminal mouse protocols.
  this.bindMouse();

  // Figure out whether boldness affects
  // the character width of monospace fonts.
  if (Terminal.brokenBold == null) {
    Terminal.brokenBold = isBoldBroken(this.document);
  }

  // this.emit('open');

  // This can be useful for pasting,
  // as well as the iPad fix.
  setTimeout(function() {
    self.element.focus();
  }, 100);
};

// XTerm mouse events
// http://invisible-island.net/xterm/ctlseqs/ctlseqs.html#Mouse%20Tracking
// To better understand these
// the xterm code is very helpful:
// Relevant files:
//   button.c, charproc.c, misc.c
// Relevant functions in xterm/button.c:
//   BtnCode, EmitButtonCode, EditorButton, SendMousePosition
Terminal.prototype.bindMouse = function() {
  var el = this.element
    , self = this
    , pressed = 32;

  var wheelEvent = 'onmousewheel' in this.context
    ? 'mousewheel'
    : 'DOMMouseScroll';

  // mouseup, mousedown, mousewheel
  // left click: ^[[M 3<^[[M#3<
  // mousewheel up: ^[[M`3>
  function sendButton(ev) {
    var button
      , pos;

    // get the xterm-style button
    button = getButton(ev);

    // get mouse coordinates
    pos = getCoords(ev);
    if (!pos) return;

    sendEvent(button, pos);

    switch (ev.type) {
      case 'mousedown':
        pressed = button;
        break;
      case 'mouseup':
        // keep it at the left
        // button, just in case.
        pressed = 32;
        break;
      case wheelEvent:
        // nothing. don't
        // interfere with
        // `pressed`.
        break;
    }
  }

  // motion example of a left click:
  // ^[[M 3<^[[M@4<^[[M@5<^[[M@6<^[[M@7<^[[M#7<
  function sendMove(ev) {
    var button = pressed
      , pos;

    pos = getCoords(ev);
    if (!pos) return;

    // buttons marked as motions
    // are incremented by 32
    button += 32;

    sendEvent(button, pos);
  }

  // encode button and
  // position to characters
  function encode(data, ch) {
    if (!self.utfMouse) {
      if (ch === 255) return data.push(0);
      if (ch > 127) ch = 127;
      data.push(ch);
    } else {
      if (ch === 2047) return data.push(0);
      if (ch < 127) {
        data.push(ch);
      } else {
        if (ch > 2047) ch = 2047;
        data.push(0xC0 | (ch >> 6));
        data.push(0x80 | (ch & 0x3F));
      }
    }
  }

  // send a mouse event:
  // regular/utf8: ^[[M Cb Cx Cy
  // urxvt: ^[[ Cb ; Cx ; Cy M
  // sgr: ^[[ Cb ; Cx ; Cy M/m
  // vt300: ^[[ 24(1/3/5)~ [ Cx , Cy ] \r
  // locator: CSI P e ; P b ; P r ; P c ; P p & w
  function sendEvent(button, pos) {
    // self.emit('mouse', {
    //   x: pos.x - 32,
    //   y: pos.x - 32,
    //   button: button
    // });

    if (self.vt300Mouse) {
      // NOTE: Unstable.
      // http://www.vt100.net/docs/vt3xx-gp/chapter15.html
      button &= 3;
      pos.x -= 32;
      pos.y -= 32;
      var data = '\x1b[24';
      if (button === 0) data += '1';
      else if (button === 1) data += '3';
      else if (button === 2) data += '5';
      else if (button === 3) return;
      else data += '0';
      data += '~[' + pos.x + ',' + pos.y + ']\r';
      self.send(data);
      return;
    }

    if (self.decLocator) {
      // NOTE: Unstable.
      button &= 3;
      pos.x -= 32;
      pos.y -= 32;
      if (button === 0) button = 2;
      else if (button === 1) button = 4;
      else if (button === 2) button = 6;
      else if (button === 3) button = 3;
      self.send('\x1b['
        + button
        + ';'
        + (button === 3 ? 4 : 0)
        + ';'
        + pos.y
        + ';'
        + pos.x
        + ';'
        + (pos.page || 0)
        + '&w');
      return;
    }

    if (self.urxvtMouse) {
      pos.x -= 32;
      pos.y -= 32;
      pos.x++;
      pos.y++;
      self.send('\x1b[' + button + ';' + pos.x + ';' + pos.y + 'M');
      return;
    }

    if (self.sgrMouse) {
      pos.x -= 32;
      pos.y -= 32;
      self.send('\x1b[<'
        + ((button & 3) === 3 ? button & ~3 : button)
        + ';'
        + pos.x
        + ';'
        + pos.y
        + ((button & 3) === 3 ? 'm' : 'M'));
      return;
    }

    var data = [];

    encode(data, button);
    encode(data, pos.x);
    encode(data, pos.y);

    self.send('\x1b[M' + String.fromCharCode.apply(String, data));
  }

  function getButton(ev) {
    var button
      , shift
      , meta
      , ctrl
      , mod;

    // two low bits:
    // 0 = left
    // 1 = middle
    // 2 = right
    // 3 = release
    // wheel up/down:
    // 1, and 2 - with 64 added
    switch (ev.type) {
      case 'mousedown':
        button = ev.button != null
          ? +ev.button
          : ev.which != null
            ? ev.which - 1
            : null;

        if (self.isMSIE) {
          button = button === 1 ? 0 : button === 4 ? 1 : button;
        }
        break;
      case 'mouseup':
        button = 3;
        break;
      case 'DOMMouseScroll':
        button = ev.detail < 0
          ? 64
          : 65;
        break;
      case 'mousewheel':
        button = ev.wheelDeltaY > 0
          ? 64
          : 65;
        break;
    }

    // next three bits are the modifiers:
    // 4 = shift, 8 = meta, 16 = control
    shift = ev.shiftKey ? 4 : 0;
    meta = ev.metaKey ? 8 : 0;
    ctrl = ev.ctrlKey ? 16 : 0;
    mod = shift | meta | ctrl;

    // no mods
    if (self.vt200Mouse) {
      // ctrl only
      mod &= ctrl;
    } else if (!self.normalMouse) {
      mod = 0;
    }

    // increment to SP
    button = (32 + (mod << 2)) + button;

    return button;
  }

  // mouse coordinates measured in cols/rows
  function getCoords(ev) {
    var x, y, w, h, el;

    // ignore browsers without pageX for now
    if (ev.pageX == null) return;

    x = ev.pageX;
    y = ev.pageY;
    el = self.element;

    // should probably check offsetParent
    // but this is more portable
    while (el && el !== self.document.documentElement) {
      x -= el.offsetLeft;
      y -= el.offsetTop;
      el = 'offsetParent' in el
        ? el.offsetParent
        : el.parentNode;
    }

    // convert to cols/rows
    w = self.element.clientWidth;
    h = self.element.clientHeight;
    x = Math.round((x / w) * self.cols);
    y = Math.round((y / h) * self.rows);

    // be sure to avoid sending
    // bad positions to the program
    if (x < 0) x = 0;
    if (x > self.cols) x = self.cols;
    if (y < 0) y = 0;
    if (y > self.rows) y = self.rows;

    // xterm sends raw bytes and
    // starts at 32 (SP) for each.
    x += 32;
    y += 32;

    return {
      x: x,
      y: y,
      type: ev.type === wheelEvent
        ? 'mousewheel'
        : ev.type
    };
  }

  on(el, 'mousedown', function(ev) {
    if (!self.mouseEvents) return;

    // send the button
    sendButton(ev);

    // ensure focus
    self.focus();

    // fix for odd bug
    //if (self.vt200Mouse && !self.normalMouse) {
    if (self.vt200Mouse) {
      sendButton({ __proto__: ev, type: 'mouseup' });
      return cancel(ev);
    }

    // bind events
    if (self.normalMouse) on(self.document, 'mousemove', sendMove);

    // x10 compatibility mode can't send button releases
    if (!self.x10Mouse) {
      on(self.document, 'mouseup', function up(ev) {
        sendButton(ev);
        if (self.normalMouse) off(self.document, 'mousemove', sendMove);
        off(self.document, 'mouseup', up);
        return cancel(ev);
      });
    }

    return cancel(ev);
  });

  //if (self.normalMouse) {
  //  on(self.document, 'mousemove', sendMove);
  //}

  on(el, wheelEvent, function(ev) {
    if (!self.mouseEvents) return;
    if (self.x10Mouse
        || self.vt300Mouse
        || self.decLocator) return;
    sendButton(ev);
    return cancel(ev);
  });

  // allow mousewheel scrolling in
  // the shell for example
  on(el, wheelEvent, function(ev) {
    if (self.mouseEvents) return;
    if (self.applicationKeypad) return;
    if (ev.type === 'DOMMouseScroll') {
      self.scrollDisp(ev.detail < 0 ? -5 : 5);
    } else {
      self.scrollDisp(ev.wheelDeltaY > 0 ? -5 : 5);
    }
    return cancel(ev);
  });
};

/**
 * Destroy Terminal
 */

Terminal.prototype.destroy = function() {
  this.readable = false;
  this.writable = false;
  this._events = {};
  this.handler = function() {};
  this.write = function() {};
  if (this.element.parentNode) {
    this.element.parentNode.removeChild(this.element);
  }
  //this.emit('close');
};

/**
 * Rendering Engine
 */

// In the screen buffer, each character
// is stored as a an array with a character
// and a 32-bit integer.
// First value: a utf-16 character.
// Second value:
// Next 9 bits: background color (0-511).
// Next 9 bits: foreground color (0-511).
// Next 14 bits: a mask for misc. flags:
//   1=bold, 2=underline, 4=blink, 8=inverse, 16=invisible

Terminal.prototype.refresh = function(start, end) {
  var x
    , y
    , i
    , line
    , out
    , ch
    , width
    , data
    , attr
    , bg
    , fg
    , flags
    , row
    , parent;

  if (end - start >= this.rows / 2) {
    parent = this.element.parentNode;
    if (parent) parent.removeChild(this.element);
  }

  width = this.cols;
  y = start;

  if (end >= this.lines.length) {
    this.log('`end` is too large. Most likely a bad CSR.');
    end = this.lines.length - 1;
  }

  for (; y <= end; y++) {
    row = y + this.ydisp;

    line = this.lines[row];
    out = '';

    if (y === this.y
        && this.cursorState
        && (this.ydisp === this.ybase || this.selectMode)
        && !this.cursorHidden) {
      x = this.x;
    } else {
      x = -1;
    }

    attr = this.defAttr;
    i = 0;

    for (; i < width; i++) {
      data = line[i][0];
      ch = line[i][1];

      if (i === x) data = -1;

      if (data !== attr) {
        if (attr !== this.defAttr) {
          out += '</span>';
        }
        if (data !== this.defAttr) {
          if (data === -1) {
            out += '<span class="reverse-video terminal-cursor">';
          } else {
            out += '<span style="';

            bg = data & 0x1ff;
            fg = (data >> 9) & 0x1ff;
            flags = data >> 18;

            // bold
            if (flags & 1) {
              if (!Terminal.brokenBold) {
                out += 'font-weight:bold;';
              }
              // See: XTerm*boldColors
              if (fg < 8) fg += 8;
            }

            // underline
            if (flags & 2) {
              out += 'text-decoration:underline;';
            }

            // blink
            if (flags & 4) {
              if (flags & 2) {
                out = out.slice(0, -1);
                out += ' blink;';
              } else {
                out += 'text-decoration:blink;';
              }
            }

            // inverse
            if (flags & 8) {
              bg = (data >> 9) & 0x1ff;
              fg = data & 0x1ff;
              // Should inverse just be before the
              // above boldColors effect instead?
              if ((flags & 1) && fg < 8) fg += 8;
            }

            // invisible
            if (flags & 16) {
              out += 'visibility:hidden;';
            }

            // out += '" class="'
            //   + 'term-bg-color-' + bg
            //   + ' '
            //   + 'term-fg-color-' + fg
            //   + '">';

            if (bg !== 256) {
              out += 'background-color:'
                + this.colors[bg]
                + ';';
            }

            if (fg !== 257) {
              out += 'color:'
                + this.colors[fg]
                + ';';
            }

            out += '">';
          }
        }
      }

      switch (ch) {
        case '&':
          out += '&amp;';
          break;
        case '<':
          out += '&lt;';
          break;
        case '>':
          out += '&gt;';
          break;
        default:
          if (ch <= ' ') {
            out += '&nbsp;';
          } else {
            if (isWide(ch)) i++;
            out += ch;
          }
          break;
      }

      attr = data;
    }

    if (attr !== this.defAttr) {
      out += '</span>';
    }

    this.children[y].innerHTML = out;
  }

  if (parent) parent.appendChild(this.element);
};

Terminal.prototype._cursorBlink = function() {
  if (Terminal.focus !== this) return;
  this.cursorState ^= 1;
  this.refresh(this.y, this.y);
};

Terminal.prototype.showCursor = function() {
  if (!this.cursorState) {
    this.cursorState = 1;
    this.refresh(this.y, this.y);
  } else {
    // Temporarily disabled:
    // this.refreshBlink();
  }
};

Terminal.prototype.startBlink = function() {
  if (!this.cursorBlink) return;
  var self = this;
  this._blinker = function() {
    self._cursorBlink();
  };
  this._blink = setInterval(this._blinker, 500);
};

Terminal.prototype.refreshBlink = function() {
  if (!this.cursorBlink) return;
  clearInterval(this._blink);
  this._blink = setInterval(this._blinker, 500);
};

Terminal.prototype.scroll = function() {
  var row;

  if (++this.ybase === this.scrollback) {
    this.ybase = this.ybase / 2 | 0;
    this.lines = this.lines.slice(-(this.ybase + this.rows) + 1);
  }

  this.ydisp = this.ybase;

  // last line
  row = this.ybase + this.rows - 1;

  // subtract the bottom scroll region
  row -= this.rows - 1 - this.scrollBottom;

  if (row === this.lines.length) {
    // potential optimization:
    // pushing is faster than splicing
    // when they amount to the same
    // behavior.
    this.lines.push(this.blankLine());
  } else {
    // add our new line
    this.lines.splice(row, 0, this.blankLine());
  }

  if (this.scrollTop !== 0) {
    if (this.ybase !== 0) {
      this.ybase--;
      this.ydisp = this.ybase;
    }
    this.lines.splice(this.ybase + this.scrollTop, 1);
  }

  // this.maxRange();
  this.updateRange(this.scrollTop);
  this.updateRange(this.scrollBottom);
};

Terminal.prototype.scrollDisp = function(disp) {
  this.ydisp += disp;

  if (this.ydisp > this.ybase) {
    this.ydisp = this.ybase;
  } else if (this.ydisp < 0) {
    this.ydisp = 0;
  }

  this.refresh(0, this.rows - 1);
};

Terminal.prototype.write = function(data) {
  var l = data.length
    , i = 0
    , j
    , cs
    , ch;

  this.refreshStart = this.y;
  this.refreshEnd = this.y;

  if (this.ybase !== this.ydisp) {
    this.ydisp = this.ybase;
    this.maxRange();
  }

  // this.log(JSON.stringify(data.replace(/\x1b/g, '^[')));

  for (; i < l; i++) {
    ch = data[i];
    switch (this.state) {
      case normal:
        switch (ch) {
          // '\0'
          // case '\0':
          // case '\200':
          //   break;

          // '\a'
          case '\x07':
            this.bell();
            break;

          // '\n', '\v', '\f'
          case '\n':
          case '\x0b':
          case '\x0c':
            if (this.convertEol) {
              this.x = 0;
            }
            // TODO: Implement eat_newline_glitch.
            // if (this.realX >= this.cols) break;
            // this.realX = 0;
            this.y++;
            if (this.y > this.scrollBottom) {
              this.y--;
              this.scroll();
            }
            break;

          // '\r'
          case '\r':
            this.x = 0;
            break;

          // '\b'
          case '\x08':
            if (this.x > 0) {
              this.x--;
            }
            break;

          // '\t'
          case '\t':
            this.x = this.nextStop();
            break;

          // shift out
          case '\x0e':
            this.setgLevel(1);
            break;

          // shift in
          case '\x0f':
            this.setgLevel(0);
            break;

          // '\e'
          case '\x1b':
            this.state = escaped;
            break;

          default:
            // ' '
            if (ch >= ' ') {
              if (this.charset && this.charset[ch]) {
                ch = this.charset[ch];
              }

              if (this.x >= this.cols) {
                this.x = 0;
                this.y++;
                if (this.y > this.scrollBottom) {
                  this.y--;
                  this.scroll();
                }
              }

              this.lines[this.y + this.ybase][this.x] = [this.curAttr, ch];
              this.x++;
              this.updateRange(this.y);

              if (isWide(ch)) {
                j = this.y + this.ybase;
                if (this.cols < 2 || this.x >= this.cols) {
                  this.lines[j][this.x - 1] = [this.curAttr, ' '];
                  break;
                }
                this.lines[j][this.x] = [this.curAttr, ' '];
                this.x++;
              }
            }
            break;
        }
        break;
      case escaped:
        switch (ch) {
          // ESC [ Control Sequence Introducer ( CSI is 0x9b).
          case '[':
            this.params = [];
            this.currentParam = 0;
            this.state = csi;
            break;

          // ESC ] Operating System Command ( OSC is 0x9d).
          case ']':
            this.params = [];
            this.currentParam = 0;
            this.state = osc;
            break;

          // ESC P Device Control String ( DCS is 0x90).
          case 'P':
            this.params = [];
            this.currentParam = 0;
            this.state = dcs;
            break;

          // ESC _ Application Program Command ( APC is 0x9f).
          case '_':
            this.state = ignore;
            break;

          // ESC ^ Privacy Message ( PM is 0x9e).
          case '^':
            this.state = ignore;
            break;

          // ESC c Full Reset (RIS).
          case 'c':
            this.reset();
            break;

          // ESC E Next Line ( NEL is 0x85).
          // ESC D Index ( IND is 0x84).
          case 'E':
            this.x = 0;
            ;
          case 'D':
            this.index();
            break;

          // ESC M Reverse Index ( RI is 0x8d).
          case 'M':
            this.reverseIndex();
            break;

          // ESC % Select default/utf-8 character set.
          // @ = default, G = utf-8
          case '%':
            //this.charset = null;
            this.setgLevel(0);
            this.setgCharset(0, Terminal.charsets.US);
            this.state = normal;
            i++;
            break;

          // ESC (,),*,+,-,. Designate G0-G2 Character Set.
          case '(': // <-- this seems to get all the attention
          case ')':
          case '*':
          case '+':
          case '-':
          case '.':
            switch (ch) {
              case '(':
                this.gcharset = 0;
                break;
              case ')':
                this.gcharset = 1;
                break;
              case '*':
                this.gcharset = 2;
                break;
              case '+':
                this.gcharset = 3;
                break;
              case '-':
                this.gcharset = 1;
                break;
              case '.':
                this.gcharset = 2;
                break;
            }
            this.state = charset;
            break;

          // Designate G3 Character Set (VT300).
          // A = ISO Latin-1 Supplemental.
          // Not implemented.
          case '/':
            this.gcharset = 3;
            this.state = charset;
            i--;
            break;

          // ESC N
          // Single Shift Select of G2 Character Set
          // ( SS2 is 0x8e). This affects next character only.
          case 'N':
            break;
          // ESC O
          // Single Shift Select of G3 Character Set
          // ( SS3 is 0x8f). This affects next character only.
          case 'O':
            break;
          // ESC n
          // Invoke the G2 Character Set as GL (LS2).
          case 'n':
            this.setgLevel(2);
            break;
          // ESC o
          // Invoke the G3 Character Set as GL (LS3).
          case 'o':
            this.setgLevel(3);
            break;
          // ESC |
          // Invoke the G3 Character Set as GR (LS3R).
          case '|':
            this.setgLevel(3);
            break;
          // ESC }
          // Invoke the G2 Character Set as GR (LS2R).
          case '}':
            this.setgLevel(2);
            break;
          // ESC ~
          // Invoke the G1 Character Set as GR (LS1R).
          case '~':
            this.setgLevel(1);
            break;

          // ESC 7 Save Cursor (DECSC).
          case '7':
            this.saveCursor();
            this.state = normal;
            break;

          // ESC 8 Restore Cursor (DECRC).
          case '8':
            this.restoreCursor();
            this.state = normal;
            break;

          // ESC # 3 DEC line height/width
          case '#':
            this.state = normal;
            i++;
            break;

          // ESC H Tab Set (HTS is 0x88).
          case 'H':
            this.tabSet();
            break;

          // ESC = Application Keypad (DECPAM).
          case '=':
            this.log('Serial port requested application keypad.');
            this.applicationKeypad = true;
            this.state = normal;
            break;

          // ESC > Normal Keypad (DECPNM).
          case '>':
            this.log('Switching back to normal keypad.');
            this.applicationKeypad = false;
            this.state = normal;
            break;

          default:
            this.state = normal;
            this.error('Unknown ESC control: %s.', ch);
            break;
        }
        break;

      case charset:
        switch (ch) {
          case '0': // DEC Special Character and Line Drawing Set.
            cs = Terminal.charsets.SCLD;
            break;
          case 'A': // UK
            cs = Terminal.charsets.UK;
            break;
          case 'B': // United States (USASCII).
            cs = Terminal.charsets.US;
            break;
          case '4': // Dutch
            cs = Terminal.charsets.Dutch;
            break;
          case 'C': // Finnish
          case '5':
            cs = Terminal.charsets.Finnish;
            break;
          case 'R': // French
            cs = Terminal.charsets.French;
            break;
          case 'Q': // FrenchCanadian
            cs = Terminal.charsets.FrenchCanadian;
            break;
          case 'K': // German
            cs = Terminal.charsets.German;
            break;
          case 'Y': // Italian
            cs = Terminal.charsets.Italian;
            break;
          case 'E': // NorwegianDanish
          case '6':
            cs = Terminal.charsets.NorwegianDanish;
            break;
          case 'Z': // Spanish
            cs = Terminal.charsets.Spanish;
            break;
          case 'H': // Swedish
          case '7':
            cs = Terminal.charsets.Swedish;
            break;
          case '=': // Swiss
            cs = Terminal.charsets.Swiss;
            break;
          case '/': // ISOLatin (actually /A)
            cs = Terminal.charsets.ISOLatin;
            i++;
            break;
          default: // Default
            cs = Terminal.charsets.US;
            break;
        }
        this.setgCharset(this.gcharset, cs);
        this.gcharset = null;
        this.state = normal;
        break;

      case osc:
        // OSC Ps ; Pt ST
        // OSC Ps ; Pt BEL
        //   Set Text Parameters.
        if (ch === '\x1b' || ch === '\x07') {
          if (ch === '\x1b') i++;

          this.params.push(this.currentParam);

          switch (this.params[0]) {
            case 0:
            case 1:
            case 2:
              if (this.params[1]) {
                this.title = this.params[1];
                this.handleTitle(this.title);
              }
              break;
            case 3:
              // set X property
              break;
            case 4:
            case 5:
              // change dynamic colors
              break;
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
            case 16:
            case 17:
            case 18:
            case 19:
              // change dynamic ui colors
              break;
            case 46:
              // change log file
              break;
            case 50:
              // dynamic font
              break;
            case 51:
              // emacs shell
              break;
            case 52:
              // manipulate selection data
              break;
            case 104:
            case 105:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
              // reset colors
              break;
          }

          this.params = [];
          this.currentParam = 0;
          this.state = normal;
        } else {
          if (!this.params.length) {
            if (ch >= '0' && ch <= '9') {
              this.currentParam =
                this.currentParam * 10 + ch.charCodeAt(0) - 48;
            } else if (ch === ';') {
              this.params.push(this.currentParam);
              this.currentParam = '';
            }
          } else {
            this.currentParam += ch;
          }
        }
        break;

      case csi:
        // '?', '>', '!'
        if (ch === '?' || ch === '>' || ch === '!') {
          this.prefix = ch;
          break;
        }

        // 0 - 9
        if (ch >= '0' && ch <= '9') {
          this.currentParam = this.currentParam * 10 + ch.charCodeAt(0) - 48;
          break;
        }

        // '$', '"', ' ', '\''
        if (ch === '$' || ch === '"' || ch === ' ' || ch === '\'') {
          this.postfix = ch;
          break;
        }

        this.params.push(this.currentParam);
        this.currentParam = 0;

        // ';'
        if (ch === ';') break;

        this.state = normal;

        switch (ch) {
          // CSI Ps A
          // Cursor Up Ps Times (default = 1) (CUU).
          case 'A':
            this.cursorUp(this.params);
            break;

          // CSI Ps B
          // Cursor Down Ps Times (default = 1) (CUD).
          case 'B':
            this.cursorDown(this.params);
            break;

          // CSI Ps C
          // Cursor Forward Ps Times (default = 1) (CUF).
          case 'C':
            this.cursorForward(this.params);
            break;

          // CSI Ps D
          // Cursor Backward Ps Times (default = 1) (CUB).
          case 'D':
            this.cursorBackward(this.params);
            break;

          // CSI Ps ; Ps H
          // Cursor Position [row;column] (default = [1,1]) (CUP).
          case 'H':
            this.cursorPos(this.params);
            break;

          // CSI Ps J  Erase in Display (ED).
          case 'J':
            this.eraseInDisplay(this.params);
            break;

          // CSI Ps K  Erase in Line (EL).
          case 'K':
            this.eraseInLine(this.params);
            break;

          // CSI Pm m  Character Attributes (SGR).
          case 'm':
            if (!this.prefix) {
              this.charAttributes(this.params);
            }
            break;

          // CSI Ps n  Device Status Report (DSR).
          case 'n':
            if (!this.prefix) {
              this.deviceStatus(this.params);
            }
            break;

          /**
           * Additions
           */

          // CSI Ps @
          // Insert Ps (Blank) Character(s) (default = 1) (ICH).
          case '@':
            this.insertChars(this.params);
            break;

          // CSI Ps E
          // Cursor Next Line Ps Times (default = 1) (CNL).
          case 'E':
            this.cursorNextLine(this.params);
            break;

          // CSI Ps F
          // Cursor Preceding Line Ps Times (default = 1) (CNL).
          case 'F':
            this.cursorPrecedingLine(this.params);
            break;

          // CSI Ps G
          // Cursor Character Absolute  [column] (default = [row,1]) (CHA).
          case 'G':
            this.cursorCharAbsolute(this.params);
            break;

          // CSI Ps L
          // Insert Ps Line(s) (default = 1) (IL).
          case 'L':
            this.insertLines(this.params);
            break;

          // CSI Ps M
          // Delete Ps Line(s) (default = 1) (DL).
          case 'M':
            this.deleteLines(this.params);
            break;

          // CSI Ps P
          // Delete Ps Character(s) (default = 1) (DCH).
          case 'P':
            this.deleteChars(this.params);
            break;

          // CSI Ps X
          // Erase Ps Character(s) (default = 1) (ECH).
          case 'X':
            this.eraseChars(this.params);
            break;

          // CSI Pm `  Character Position Absolute
          //   [column] (default = [row,1]) (HPA).
          case '`':
            this.charPosAbsolute(this.params);
            break;

          // 141 61 a * HPR -
          // Horizontal Position Relative
          case 'a':
            this.HPositionRelative(this.params);
            break;

          // CSI P s c
          // Send Device Attributes (Primary DA).
          // CSI > P s c
          // Send Device Attributes (Secondary DA)
          case 'c':
            this.sendDeviceAttributes(this.params);
            break;

          // CSI Pm d
          // Line Position Absolute  [row] (default = [1,column]) (VPA).
          case 'd':
            this.linePosAbsolute(this.params);
            break;

          // 145 65 e * VPR - Vertical Position Relative
          case 'e':
            this.VPositionRelative(this.params);
            break;

          // CSI Ps ; Ps f
          //   Horizontal and Vertical Position [row;column] (default =
          //   [1,1]) (HVP).
          case 'f':
            this.HVPosition(this.params);
            break;

          // CSI Pm h  Set Mode (SM).
          // CSI ? Pm h - mouse escape codes, cursor escape codes
          case 'h':
            this.setMode(this.params);
            break;

          // CSI Pm l  Reset Mode (RM).
          // CSI ? Pm l
          case 'l':
            this.resetMode(this.params);
            break;

          // CSI Ps ; Ps r
          //   Set Scrolling Region [top;bottom] (default = full size of win-
          //   dow) (DECSTBM).
          // CSI ? Pm r
          case 'r':
            this.setScrollRegion(this.params);
            break;

          // CSI s
          //   Save cursor (ANSI.SYS).
          case 's':
            this.saveCursor(this.params);
            break;

          // CSI u
          //   Restore cursor (ANSI.SYS).
          case 'u':
            this.restoreCursor(this.params);
            break;

          /**
           * Lesser Used
           */

          // CSI Ps I
          // Cursor Forward Tabulation Ps tab stops (default = 1) (CHT).
          case 'I':
            this.cursorForwardTab(this.params);
            break;

          // CSI Ps S  Scroll up Ps lines (default = 1) (SU).
          case 'S':
            this.scrollUp(this.params);
            break;

          // CSI Ps T  Scroll down Ps lines (default = 1) (SD).
          // CSI Ps ; Ps ; Ps ; Ps ; Ps T
          // CSI > Ps; Ps T
          case 'T':
            // if (this.prefix === '>') {
            //   this.resetTitleModes(this.params);
            //   break;
            // }
            // if (this.params.length > 2) {
            //   this.initMouseTracking(this.params);
            //   break;
            // }
            if (this.params.length < 2 && !this.prefix) {
              this.scrollDown(this.params);
            }
            break;

          // CSI Ps Z
          // Cursor Backward Tabulation Ps tab stops (default = 1) (CBT).
          case 'Z':
            this.cursorBackwardTab(this.params);
            break;

          // CSI Ps b  Repeat the preceding graphic character Ps times (REP).
          case 'b':
            this.repeatPrecedingCharacter(this.params);
            break;

          // CSI Ps g  Tab Clear (TBC).
          case 'g':
            this.tabClear(this.params);
            break;

          // CSI Pm i  Media Copy (MC).
          // CSI ? Pm i
          // case 'i':
          //   this.mediaCopy(this.params);
          //   break;

          // CSI Pm m  Character Attributes (SGR).
          // CSI > Ps; Ps m
          // case 'm': // duplicate
          //   if (this.prefix === '>') {
          //     this.setResources(this.params);
          //   } else {
          //     this.charAttributes(this.params);
          //   }
          //   break;

          // CSI Ps n  Device Status Report (DSR).
          // CSI > Ps n
          // case 'n': // duplicate
          //   if (this.prefix === '>') {
          //     this.disableModifiers(this.params);
          //   } else {
          //     this.deviceStatus(this.params);
          //   }
          //   break;

          // CSI > Ps p  Set pointer mode.
          // CSI ! p   Soft terminal reset (DECSTR).
          // CSI Ps$ p
          //   Request ANSI mode (DECRQM).
          // CSI ? Ps$ p
          //   Request DEC private mode (DECRQM).
          // CSI Ps ; Ps " p
          case 'p':
            switch (this.prefix) {
              // case '>':
              //   this.setPointerMode(this.params);
              //   break;
              case '!':
                this.softReset(this.params);
                break;
              // case '?':
              //   if (this.postfix === '$') {
              //     this.requestPrivateMode(this.params);
              //   }
              //   break;
              // default:
              //   if (this.postfix === '"') {
              //     this.setConformanceLevel(this.params);
              //   } else if (this.postfix === '$') {
              //     this.requestAnsiMode(this.params);
              //   }
              //   break;
            }
            break;

          // CSI Ps q  Load LEDs (DECLL).
          // CSI Ps SP q
          // CSI Ps " q
          // case 'q':
          //   if (this.postfix === ' ') {
          //     this.setCursorStyle(this.params);
          //     break;
          //   }
          //   if (this.postfix === '"') {
          //     this.setCharProtectionAttr(this.params);
          //     break;
          //   }
          //   this.loadLEDs(this.params);
          //   break;

          // CSI Ps ; Ps r
          //   Set Scrolling Region [top;bottom] (default = full size of win-
          //   dow) (DECSTBM).
          // CSI ? Pm r
          // CSI Pt; Pl; Pb; Pr; Ps$ r
          // case 'r': // duplicate
          //   if (this.prefix === '?') {
          //     this.restorePrivateValues(this.params);
          //   } else if (this.postfix === '$') {
          //     this.setAttrInRectangle(this.params);
          //   } else {
          //     this.setScrollRegion(this.params);
          //   }
          //   break;

          // CSI s     Save cursor (ANSI.SYS).
          // CSI ? Pm s
          // case 's': // duplicate
          //   if (this.prefix === '?') {
          //     this.savePrivateValues(this.params);
          //   } else {
          //     this.saveCursor(this.params);
          //   }
          //   break;

          // CSI Ps ; Ps ; Ps t
          // CSI Pt; Pl; Pb; Pr; Ps$ t
          // CSI > Ps; Ps t
          // CSI Ps SP t
          // case 't':
          //   if (this.postfix === '$') {
          //     this.reverseAttrInRectangle(this.params);
          //   } else if (this.postfix === ' ') {
          //     this.setWarningBellVolume(this.params);
          //   } else {
          //     if (this.prefix === '>') {
          //       this.setTitleModeFeature(this.params);
          //     } else {
          //       this.manipulateWindow(this.params);
          //     }
          //   }
          //   break;

          // CSI u     Restore cursor (ANSI.SYS).
          // CSI Ps SP u
          // case 'u': // duplicate
          //   if (this.postfix === ' ') {
          //     this.setMarginBellVolume(this.params);
          //   } else {
          //     this.restoreCursor(this.params);
          //   }
          //   break;

          // CSI Pt; Pl; Pb; Pr; Pp; Pt; Pl; Pp$ v
          // case 'v':
          //   if (this.postfix === '$') {
          //     this.copyRectagle(this.params);
          //   }
          //   break;

          // CSI Pt ; Pl ; Pb ; Pr ' w
          // case 'w':
          //   if (this.postfix === '\'') {
          //     this.enableFilterRectangle(this.params);
          //   }
          //   break;

          // CSI Ps x  Request Terminal Parameters (DECREQTPARM).
          // CSI Ps x  Select Attribute Change Extent (DECSACE).
          // CSI Pc; Pt; Pl; Pb; Pr$ x
          // case 'x':
          //   if (this.postfix === '$') {
          //     this.fillRectangle(this.params);
          //   } else {
          //     this.requestParameters(this.params);
          //     //this.__(this.params);
          //   }
          //   break;

          // CSI Ps ; Pu ' z
          // CSI Pt; Pl; Pb; Pr$ z
          // case 'z':
          //   if (this.postfix === '\'') {
          //     this.enableLocatorReporting(this.params);
          //   } else if (this.postfix === '$') {
          //     this.eraseRectangle(this.params);
          //   }
          //   break;

          // CSI Pm ' {
          // CSI Pt; Pl; Pb; Pr$ {
          // case '{':
          //   if (this.postfix === '\'') {
          //     this.setLocatorEvents(this.params);
          //   } else if (this.postfix === '$') {
          //     this.selectiveEraseRectangle(this.params);
          //   }
          //   break;

          // CSI Ps ' |
          // case '|':
          //   if (this.postfix === '\'') {
          //     this.requestLocatorPosition(this.params);
          //   }
          //   break;

          // CSI P m SP }
          // Insert P s Column(s) (default = 1) (DECIC), VT420 and up.
          // case '}':
          //   if (this.postfix === ' ') {
          //     this.insertColumns(this.params);
          //   }
          //   break;

          // CSI P m SP ~
          // Delete P s Column(s) (default = 1) (DECDC), VT420 and up
          // case '~':
          //   if (this.postfix === ' ') {
          //     this.deleteColumns(this.params);
          //   }
          //   break;

          default:
            this.error('Unknown CSI code: %s.', ch);
            break;
        }

        this.prefix = '';
        this.postfix = '';
        break;

      case dcs:
        if (ch === '\x1b' || ch === '\x07') {
          if (ch === '\x1b') i++;

          switch (this.prefix) {
            // User-Defined Keys (DECUDK).
            case '':
              break;

            // Request Status String (DECRQSS).
            // test: echo -e '\eP$q"p\e\\'
            case '$q':
              var pt = this.currentParam
                , valid = false;

              switch (pt) {
                // DECSCA
                case '"q':
                  pt = '0"q';
                  break;

                // DECSCL
                case '"p':
                  pt = '61"p';
                  break;

                // DECSTBM
                case 'r':
                  pt = ''
                    + (this.scrollTop + 1)
                    + ';'
                    + (this.scrollBottom + 1)
                    + 'r';
                  break;

                // SGR
                case 'm':
                  pt = '0m';
                  break;

                default:
                  this.error('Unknown DCS Pt: %s.', pt);
                  pt = '';
                  break;
              }

              this.send('\x1bP' + +valid + '$r' + pt + '\x1b\\');
              break;

            // Set Termcap/Terminfo Data (xterm, experimental).
            case '+p':
              break;

            // Request Termcap/Terminfo String (xterm, experimental)
            // Regular xterm does not even respond to this sequence.
            // This can cause a small glitch in vim.
            // test: echo -ne '\eP+q6b64\e\\'
            case '+q':
              var pt = this.currentParam
                , valid = false;

              this.send('\x1bP' + +valid + '+r' + pt + '\x1b\\');
              break;

            default:
              this.error('Unknown DCS prefix: %s.', this.prefix);
              break;
          }

          this.currentParam = 0;
          this.prefix = '';
          this.state = normal;
        } else if (!this.currentParam) {
          if (!this.prefix && ch !== '$' && ch !== '+') {
            this.currentParam = ch;
          } else if (this.prefix.length === 2) {
            this.currentParam = ch;
          } else {
            this.prefix += ch;
          }
        } else {
          this.currentParam += ch;
        }
        break;

      case ignore:
        // For PM and APC.
        if (ch === '\x1b' || ch === '\x07') {
          if (ch === '\x1b') i++;
          this.state = normal;
        }
        break;
    }
  }

  this.updateRange(this.y);
  this.refresh(this.refreshStart, this.refreshEnd);
};

Terminal.prototype.writeln = function(data) {
  this.write(data + '\r\n');
};

// Key Resources:
// https://developer.mozilla.org/en-US/docs/DOM/KeyboardEvent
Terminal.prototype.keyDown = function(ev) {
  var self = this
    , key;

  switch (ev.keyCode) {
    // backspace
    case 8:
      if (ev.shiftKey) {
        key = '\x08'; // ^H
        break;
      }
      key = '\x7f'; // ^?
      break;
    // tab
    case 9:
      if (ev.shiftKey) {
        key = '\x1b[Z';
        break;
      }
      key = '\t';
      break;
    // return/enter
    case 13:
      key = '\r';
      break;
    // escape
    case 27:
      key = '\x1b';
      break;
    // left-arrow
    case 37:
      if (this.applicationCursor) {
        key = '\x1bOD'; // SS3 as ^[O for 7-bit
        //key = '\x8fD'; // SS3 as 0x8f for 8-bit
        break;
      }
      key = '\x1b[D';
      break;
    // right-arrow
    case 39:
      if (this.applicationCursor) {
        key = '\x1bOC';
        break;
      }
      key = '\x1b[C';
      break;
    // up-arrow
    case 38:
      if (this.applicationCursor) {
        key = '\x1bOA';
        break;
      }
      if (ev.ctrlKey) {
        this.scrollDisp(-1);
        return cancel(ev);
      } else {
        key = '\x1b[A';
      }
      break;
    // down-arrow
    case 40:
      if (this.applicationCursor) {
        key = '\x1bOB';
        break;
      }
      if (ev.ctrlKey) {
        this.scrollDisp(1);
        return cancel(ev);
      } else {
        key = '\x1b[B';
      }
      break;
    // delete
    case 46:
      key = '\x1b[3~';
      break;
    // insert
    case 45:
      key = '\x1b[2~';
      break;
    // home
    case 36:
      if (this.applicationKeypad) {
        key = '\x1bOH';
        break;
      }
      key = '\x1bOH';
      break;
    // end
    case 35:
      if (this.applicationKeypad) {
        key = '\x1bOF';
        break;
      }
      key = '\x1bOF';
      break;
    // page up
    case 33:
      if (ev.shiftKey) {
        this.scrollDisp(-(this.rows - 1));
        return cancel(ev);
      } else {
        key = '\x1b[5~';
      }
      break;
    // page down
    case 34:
      if (ev.shiftKey) {
        this.scrollDisp(this.rows - 1);
        return cancel(ev);
      } else {
        key = '\x1b[6~';
      }
      break;
    // F1
    case 112:
      key = '\x1bOP';
      break;
    // F2
    case 113:
      key = '\x1bOQ';
      break;
    // F3
    case 114:
      key = '\x1bOR';
      break;
    // F4
    case 115:
      key = '\x1bOS';
      break;
    // F5
    case 116:
      key = '\x1b[15~';
      break;
    // F6
    case 117:
      key = '\x1b[17~';
      break;
    // F7
    case 118:
      key = '\x1b[18~';
      break;
    // F8
    case 119:
      key = '\x1b[19~';
      break;
    // F9
    case 120:
      key = '\x1b[20~';
      break;
    // F10
    case 121:
      key = '\x1b[21~';
      break;
    // F11
    case 122:
      key = '\x1b[23~';
      break;
    // F12
    case 123:
      key = '\x1b[24~';
      break;
    default:
      // a-z and space
      if (ev.ctrlKey) {
        if (ev.keyCode >= 65 && ev.keyCode <= 90) {
          // Ctrl-A
          if (this.screenKeys) {
            if (!this.prefixMode && !this.selectMode && ev.keyCode === 65) {
              this.enterPrefix();
              return cancel(ev);
            }
          }
          // Ctrl-V
          if (this.prefixMode && ev.keyCode === 86) {
            this.leavePrefix();
            return;
          }
          // Ctrl-C
          if ((this.prefixMode || this.selectMode) && ev.keyCode === 67) {
            if (this.visualMode) {
              setTimeout(function() {
                self.leaveVisual();
              }, 1);
            }
            return;
          }
          key = String.fromCharCode(ev.keyCode - 64);
        } else if (ev.keyCode === 32) {
          // NUL
          key = String.fromCharCode(0);
        } else if (ev.keyCode >= 51 && ev.keyCode <= 55) {
          // escape, file sep, group sep, record sep, unit sep
          key = String.fromCharCode(ev.keyCode - 51 + 27);
        } else if (ev.keyCode === 56) {
          // delete
          key = String.fromCharCode(127);
        } else if (ev.keyCode === 219) {
          // ^[ - escape
          key = String.fromCharCode(27);
        } else if (ev.keyCode === 221) {
          // ^] - group sep
          key = String.fromCharCode(29);
        }
      } else if ((!this.isMac && ev.altKey) || (this.isMac && ev.metaKey)) {
        if (ev.keyCode >= 65 && ev.keyCode <= 90) {
          key = '\x1b' + String.fromCharCode(ev.keyCode + 32);
        } else if (ev.keyCode === 192) {
          key = '\x1b`';
        } else if (ev.keyCode >= 48 && ev.keyCode <= 57) {
          key = '\x1b' + (ev.keyCode - 48);
        }
      }
      break;
  }

  if (!key) return true;

  if (this.prefixMode) {
    this.leavePrefix();
    return cancel(ev);
  }

  if (this.selectMode) {
    this.keySelect(ev, key);
    return cancel(ev);
  }

  this.emit('keydown', ev);
  this.emit('key', key, ev);

  this.showCursor();
  this.handler(key);

  return cancel(ev);
};

Terminal.prototype.setgLevel = function(g) {
  this.glevel = g;
  this.charset = this.charsets[g];
};

Terminal.prototype.setgCharset = function(g, charset) {
  this.charsets[g] = charset;
  if (this.glevel === g) {
    this.charset = charset;
  }
};

Terminal.prototype.keyPress = function(ev) {
  var key;

  cancel(ev);

  if (ev.charCode) {
    key = ev.charCode;
  } else if (ev.which == null) {
    key = ev.keyCode;
  } else if (ev.which !== 0 && ev.charCode !== 0) {
    key = ev.which;
  } else {
    return false;
  }

  if (!key || ev.ctrlKey || ev.altKey || ev.metaKey) return false;

  key = String.fromCharCode(key);

  if (this.prefixMode) {
    this.leavePrefix();
    this.keyPrefix(ev, key);
    return false;
  }

  if (this.selectMode) {
    this.keySelect(ev, key);
    return false;
  }

  this.emit('keypress', key, ev);
  this.emit('key', key, ev);

  this.showCursor();
  this.handler(key);

  return false;
};

Terminal.prototype.send = function(data) {
  var self = this;

  if (!this.queue) {
    setTimeout(function() {
      self.handler(self.queue);
      self.queue = '';
    }, 1);
  }

  this.queue += data;
};

Terminal.prototype.bell = function() {
  if (!this.visualBell) return;
  var self = this;
  this.element.style.borderColor = 'white';
  setTimeout(function() {
    self.element.style.borderColor = '';
  }, 10);
  if (this.popOnBell) this.focus();
};

Terminal.prototype.log = function() {
  if (!this.debug) return;
  if (!this.context.console || !this.context.console.log) return;
  var args = Array.prototype.slice.call(arguments);
  this.context.console.log.apply(this.context.console, args);
};

Terminal.prototype.error = function() {
  if (!this.debug) return;
  if (!this.context.console || !this.context.console.error) return;
  var args = Array.prototype.slice.call(arguments);
  this.context.console.error.apply(this.context.console, args);
};

Terminal.prototype.resize = function(x, y) {
  var line
    , el
    , i
    , j
    , ch;

  if (x < 1) x = 1;
  if (y < 1) y = 1;

  // resize cols
  j = this.cols;
  if (j < x) {
    ch = [this.defAttr, ' ']; // does xterm use the default attr?
    i = this.lines.length;
    while (i--) {
      while (this.lines[i].length < x) {
        this.lines[i].push(ch);
      }
    }
  } else if (j > x) {
    i = this.lines.length;
    while (i--) {
      while (this.lines[i].length > x) {
        this.lines[i].pop();
      }
    }
  }
  this.setupStops(j);
  this.cols = x;

  // resize rows
  j = this.rows;
  if (j < y) {
    el = this.element;
    while (j++ < y) {
      if (this.lines.length < y + this.ybase) {
        this.lines.push(this.blankLine());
      }
      if (this.children.length < y) {
        line = this.document.createElement('div');
        el.appendChild(line);
        this.children.push(line);
      }
    }
  } else if (j > y) {
    while (j-- > y) {
      if (this.lines.length > y + this.ybase) {
        this.lines.pop();
      }
      if (this.children.length > y) {
        el = this.children.pop();
        if (!el) continue;
        el.parentNode.removeChild(el);
      }
    }
  }
  this.rows = y;

  // make sure the cursor stays on screen
  if (this.y >= y) this.y = y - 1;
  if (this.x >= x) this.x = x - 1;

  this.scrollTop = 0;
  this.scrollBottom = y - 1;

  this.refresh(0, this.rows - 1);

  // it's a real nightmare trying
  // to resize the original
  // screen buffer. just set it
  // to null for now.
  this.normal = null;
};

Terminal.prototype.updateRange = function(y) {
  if (y < this.refreshStart) this.refreshStart = y;
  if (y > this.refreshEnd) this.refreshEnd = y;
  // if (y > this.refreshEnd) {
  //   this.refreshEnd = y;
  //   if (y > this.rows - 1) {
  //     this.refreshEnd = this.rows - 1;
  //   }
  // }
};

Terminal.prototype.maxRange = function() {
  this.refreshStart = 0;
  this.refreshEnd = this.rows - 1;
};

Terminal.prototype.setupStops = function(i) {
  if (i != null) {
    if (!this.tabs[i]) {
      i = this.prevStop(i);
    }
  } else {
    this.tabs = {};
    i = 0;
  }

  for (; i < this.cols; i += 8) {
    this.tabs[i] = true;
  }
};

Terminal.prototype.prevStop = function(x) {
  if (x == null) x = this.x;
  while (!this.tabs[--x] && x > 0);
  return x >= this.cols
    ? this.cols - 1
    : x < 0 ? 0 : x;
};

Terminal.prototype.nextStop = function(x) {
  if (x == null) x = this.x;
  while (!this.tabs[++x] && x < this.cols);
  return x >= this.cols
    ? this.cols - 1
    : x < 0 ? 0 : x;
};

Terminal.prototype.eraseRight = function(x, y) {
  var line = this.lines[this.ybase + y]
    , ch = [this.eraseAttr(), ' ']; // xterm


  for (; x < this.cols; x++) {
    line[x] = ch;
  }

  this.updateRange(y);
};

Terminal.prototype.eraseLeft = function(x, y) {
  var line = this.lines[this.ybase + y]
    , ch = [this.eraseAttr(), ' ']; // xterm

  x++;
  while (x--) line[x] = ch;

  this.updateRange(y);
};

Terminal.prototype.eraseLine = function(y) {
  this.eraseRight(0, y);
};

Terminal.prototype.blankLine = function(cur) {
  var attr = cur
    ? this.eraseAttr()
    : this.defAttr;

  var ch = [attr, ' ']
    , line = []
    , i = 0;

  for (; i < this.cols; i++) {
    line[i] = ch;
  }

  return line;
};

Terminal.prototype.ch = function(cur) {
  return cur
    ? [this.eraseAttr(), ' ']
    : [this.defAttr, ' '];
};

Terminal.prototype.is = function(term) {
  var name = this.termName;
  return (name + '').indexOf(term) === 0;
};

Terminal.prototype.handler = function(data) {
  this.emit('data', data);
};

Terminal.prototype.handleTitle = function(title) {
  this.emit('title', title);
};

/**
 * ESC
 */

// ESC D Index (IND is 0x84).
Terminal.prototype.index = function() {
  this.y++;
  if (this.y > this.scrollBottom) {
    this.y--;
    this.scroll();
  }
  this.state = normal;
};

// ESC M Reverse Index (RI is 0x8d).
Terminal.prototype.reverseIndex = function() {
  var j;
  this.y--;
  if (this.y < this.scrollTop) {
    this.y++;
    // possibly move the code below to term.reverseScroll();
    // test: echo -ne '\e[1;1H\e[44m\eM\e[0m'
    // blankLine(true) is xterm/linux behavior
    this.lines.splice(this.y + this.ybase, 0, this.blankLine(true));
    j = this.rows - 1 - this.scrollBottom;
    this.lines.splice(this.rows - 1 + this.ybase - j + 1, 1);
    // this.maxRange();
    this.updateRange(this.scrollTop);
    this.updateRange(this.scrollBottom);
  }
  this.state = normal;
};

// ESC c Full Reset (RIS).
Terminal.prototype.reset = function() {
  this.options.rows = this.rows;
  this.options.cols = this.cols;
  Terminal.call(this, this.options);
  this.refresh(0, this.rows - 1);
};

// ESC H Tab Set (HTS is 0x88).
Terminal.prototype.tabSet = function() {
  this.tabs[this.x] = true;
  this.state = normal;
};

/**
 * CSI
 */

// CSI Ps A
// Cursor Up Ps Times (default = 1) (CUU).
Terminal.prototype.cursorUp = function(params) {
  var param = params[0];
  if (param < 1) param = 1;
  this.y -= param;
  if (this.y < 0) this.y = 0;
};

// CSI Ps B
// Cursor Down Ps Times (default = 1) (CUD).
Terminal.prototype.cursorDown = function(params) {
  var param = params[0];
  if (param < 1) param = 1;
  this.y += param;
  if (this.y >= this.rows) {
    this.y = this.rows - 1;
  }
};

// CSI Ps C
// Cursor Forward Ps Times (default = 1) (CUF).
Terminal.prototype.cursorForward = function(params) {
  var param = params[0];
  if (param < 1) param = 1;
  this.x += param;
  if (this.x >= this.cols) {
    this.x = this.cols - 1;
  }
};

// CSI Ps D
// Cursor Backward Ps Times (default = 1) (CUB).
Terminal.prototype.cursorBackward = function(params) {
  var param = params[0];
  if (param < 1) param = 1;
  this.x -= param;
  if (this.x < 0) this.x = 0;
};

// CSI Ps ; Ps H
// Cursor Position [row;column] (default = [1,1]) (CUP).
Terminal.prototype.cursorPos = function(params) {
  var row, col;

  row = params[0] - 1;

  if (params.length >= 2) {
    col = params[1] - 1;
  } else {
    col = 0;
  }

  if (row < 0) {
    row = 0;
  } else if (row >= this.rows) {
    row = this.rows - 1;
  }

  if (col < 0) {
    col = 0;
  } else if (col >= this.cols) {
    col = this.cols - 1;
  }

  this.x = col;
  this.y = row;
};

// CSI Ps J  Erase in Display (ED).
//     Ps = 0  -> Erase Below (default).
//     Ps = 1  -> Erase Above.
//     Ps = 2  -> Erase All.
//     Ps = 3  -> Erase Saved Lines (xterm).
// CSI ? Ps J
//   Erase in Display (DECSED).
//     Ps = 0  -> Selective Erase Below (default).
//     Ps = 1  -> Selective Erase Above.
//     Ps = 2  -> Selective Erase All.
Terminal.prototype.eraseInDisplay = function(params) {
  var j;
  switch (params[0]) {
    case 0:
      this.eraseRight(this.x, this.y);
      j = this.y + 1;
      for (; j < this.rows; j++) {
        this.eraseLine(j);
      }
      break;
    case 1:
      this.eraseLeft(this.x, this.y);
      j = this.y;
      while (j--) {
        this.eraseLine(j);
      }
      break;
    case 2:
      j = this.rows;
      while (j--) this.eraseLine(j);
      break;
    case 3:
      ; // no saved lines
      break;
  }
};

// CSI Ps K  Erase in Line (EL).
//     Ps = 0  -> Erase to Right (default).
//     Ps = 1  -> Erase to Left.
//     Ps = 2  -> Erase All.
// CSI ? Ps K
//   Erase in Line (DECSEL).
//     Ps = 0  -> Selective Erase to Right (default).
//     Ps = 1  -> Selective Erase to Left.
//     Ps = 2  -> Selective Erase All.
Terminal.prototype.eraseInLine = function(params) {
  switch (params[0]) {
    case 0:
      this.eraseRight(this.x, this.y);
      break;
    case 1:
      this.eraseLeft(this.x, this.y);
      break;
    case 2:
      this.eraseLine(this.y);
      break;
  }
};

// CSI Pm m  Character Attributes (SGR).
//     Ps = 0  -> Normal (default).
//     Ps = 1  -> Bold.
//     Ps = 4  -> Underlined.
//     Ps = 5  -> Blink (appears as Bold).
//     Ps = 7  -> Inverse.
//     Ps = 8  -> Invisible, i.e., hidden (VT300).
//     Ps = 2 2  -> Normal (neither bold nor faint).
//     Ps = 2 4  -> Not underlined.
//     Ps = 2 5  -> Steady (not blinking).
//     Ps = 2 7  -> Positive (not inverse).
//     Ps = 2 8  -> Visible, i.e., not hidden (VT300).
//     Ps = 3 0  -> Set foreground color to Black.
//     Ps = 3 1  -> Set foreground color to Red.
//     Ps = 3 2  -> Set foreground color to Green.
//     Ps = 3 3  -> Set foreground color to Yellow.
//     Ps = 3 4  -> Set foreground color to Blue.
//     Ps = 3 5  -> Set foreground color to Magenta.
//     Ps = 3 6  -> Set foreground color to Cyan.
//     Ps = 3 7  -> Set foreground color to White.
//     Ps = 3 9  -> Set foreground color to default (original).
//     Ps = 4 0  -> Set background color to Black.
//     Ps = 4 1  -> Set background color to Red.
//     Ps = 4 2  -> Set background color to Green.
//     Ps = 4 3  -> Set background color to Yellow.
//     Ps = 4 4  -> Set background color to Blue.
//     Ps = 4 5  -> Set background color to Magenta.
//     Ps = 4 6  -> Set background color to Cyan.
//     Ps = 4 7  -> Set background color to White.
//     Ps = 4 9  -> Set background color to default (original).

//   If 16-color support is compiled, the following apply.  Assume
//   that xterm's resources are set so that the ISO color codes are
//   the first 8 of a set of 16.  Then the aixterm colors are the
//   bright versions of the ISO colors:
//     Ps = 9 0  -> Set foreground color to Black.
//     Ps = 9 1  -> Set foreground color to Red.
//     Ps = 9 2  -> Set foreground color to Green.
//     Ps = 9 3  -> Set foreground color to Yellow.
//     Ps = 9 4  -> Set foreground color to Blue.
//     Ps = 9 5  -> Set foreground color to Magenta.
//     Ps = 9 6  -> Set foreground color to Cyan.
//     Ps = 9 7  -> Set foreground color to White.
//     Ps = 1 0 0  -> Set background color to Black.
//     Ps = 1 0 1  -> Set background color to Red.
//     Ps = 1 0 2  -> Set background color to Green.
//     Ps = 1 0 3  -> Set background color to Yellow.
//     Ps = 1 0 4  -> Set background color to Blue.
//     Ps = 1 0 5  -> Set background color to Magenta.
//     Ps = 1 0 6  -> Set background color to Cyan.
//     Ps = 1 0 7  -> Set background color to White.

//   If xterm is compiled with the 16-color support disabled, it
//   supports the following, from rxvt:
//     Ps = 1 0 0  -> Set foreground and background color to
//     default.

//   If 88- or 256-color support is compiled, the following apply.
//     Ps = 3 8  ; 5  ; Ps -> Set foreground color to the second
//     Ps.
//     Ps = 4 8  ; 5  ; Ps -> Set background color to the second
//     Ps.
Terminal.prototype.charAttributes = function(params) {
  // Optimize a single SGR0.
  if (params.length === 1 && params[0] === 0) {
    this.curAttr = this.defAttr;
    return;
  }

  var l = params.length
    , i = 0
    , flags = this.curAttr >> 18
    , fg = (this.curAttr >> 9) & 0x1ff
    , bg = this.curAttr & 0x1ff
    , p;

  for (; i < l; i++) {
    p = params[i];
    if (p >= 30 && p <= 37) {
      // fg color 8
      fg = p - 30;
    } else if (p >= 40 && p <= 47) {
      // bg color 8
      bg = p - 40;
    } else if (p >= 90 && p <= 97) {
      // fg color 16
      p += 8;
      fg = p - 90;
    } else if (p >= 100 && p <= 107) {
      // bg color 16
      p += 8;
      bg = p - 100;
    } else if (p === 0) {
      // default
      flags = this.defAttr >> 18;
      fg = (this.defAttr >> 9) & 0x1ff;
      bg = this.defAttr & 0x1ff;
      // flags = 0;
      // fg = 0x1ff;
      // bg = 0x1ff;
    } else if (p === 1) {
      // bold text
      flags |= 1;
    } else if (p === 4) {
      // underlined text
      flags |= 2;
    } else if (p === 5) {
      // blink
      flags |= 4;
    } else if (p === 7) {
      // inverse and positive
      // test with: echo -e '\e[31m\e[42mhello\e[7mworld\e[27mhi\e[m'
      flags |= 8;
    } else if (p === 8) {
      // invisible
      flags |= 16;
    } else if (p === 22) {
      // not bold
      flags &= ~1;
    } else if (p === 24) {
      // not underlined
      flags &= ~2;
    } else if (p === 25) {
      // not blink
      flags &= ~4;
    } else if (p === 27) {
      // not inverse
      flags &= ~8;
    } else if (p === 28) {
      // not invisible
      flags &= ~16;
    } else if (p === 39) {
      // reset fg
      fg = (this.defAttr >> 9) & 0x1ff;
    } else if (p === 49) {
      // reset bg
      bg = this.defAttr & 0x1ff;
    } else if (p === 38) {
      // fg color 256
      if (params[i + 1] === 2) {
        i += 2;
        fg = matchColor(
          params[i] & 0xff,
          params[i + 1] & 0xff,
          params[i + 2] & 0xff);
        if (fg === -1) fg = 0x1ff;
        i += 2;
      } else if (params[i + 1] === 5) {
        i += 2;
        p = params[i] & 0xff;
        fg = p;
      }
    } else if (p === 48) {
      // bg color 256
      if (params[i + 1] === 2) {
        i += 2;
        bg = matchColor(
          params[i] & 0xff,
          params[i + 1] & 0xff,
          params[i + 2] & 0xff);
        if (bg === -1) bg = 0x1ff;
        i += 2;
      } else if (params[i + 1] === 5) {
        i += 2;
        p = params[i] & 0xff;
        bg = p;
      }
    } else if (p === 100) {
      // reset fg/bg
      fg = (this.defAttr >> 9) & 0x1ff;
      bg = this.defAttr & 0x1ff;
    } else {
      this.error('Unknown SGR attribute: %d.', p);
    }
  }

  this.curAttr = (flags << 18) | (fg << 9) | bg;
};

// CSI Ps n  Device Status Report (DSR).
//     Ps = 5  -> Status Report.  Result (``OK'') is
//   CSI 0 n
//     Ps = 6  -> Report Cursor Position (CPR) [row;column].
//   Result is
//   CSI r ; c R
// CSI ? Ps n
//   Device Status Report (DSR, DEC-specific).
//     Ps = 6  -> Report Cursor Position (CPR) [row;column] as CSI
//     ? r ; c R (assumes page is zero).
//     Ps = 1 5  -> Report Printer status as CSI ? 1 0  n  (ready).
//     or CSI ? 1 1  n  (not ready).
//     Ps = 2 5  -> Report UDK status as CSI ? 2 0  n  (unlocked)
//     or CSI ? 2 1  n  (locked).
//     Ps = 2 6  -> Report Keyboard status as
//   CSI ? 2 7  ;  1  ;  0  ;  0  n  (North American).
//   The last two parameters apply to VT400 & up, and denote key-
//   board ready and LK01 respectively.
//     Ps = 5 3  -> Report Locator status as
//   CSI ? 5 3  n  Locator available, if compiled-in, or
//   CSI ? 5 0  n  No Locator, if not.
Terminal.prototype.deviceStatus = function(params) {
  if (!this.prefix) {
    switch (params[0]) {
      case 5:
        // status report
        this.send('\x1b[0n');
        break;
      case 6:
        // cursor position
        this.send('\x1b['
          + (this.y + 1)
          + ';'
          + (this.x + 1)
          + 'R');
        break;
    }
  } else if (this.prefix === '?') {
    // modern xterm doesnt seem to
    // respond to any of these except ?6, 6, and 5
    switch (params[0]) {
      case 6:
        // cursor position
        this.send('\x1b[?'
          + (this.y + 1)
          + ';'
          + (this.x + 1)
          + 'R');
        break;
      case 15:
        // no printer
        // this.send('\x1b[?11n');
        break;
      case 25:
        // dont support user defined keys
        // this.send('\x1b[?21n');
        break;
      case 26:
        // north american keyboard
        // this.send('\x1b[?27;1;0;0n');
        break;
      case 53:
        // no dec locator/mouse
        // this.send('\x1b[?50n');
        break;
    }
  }
};

/**
 * Additions
 */

// CSI Ps @
// Insert Ps (Blank) Character(s) (default = 1) (ICH).
Terminal.prototype.insertChars = function(params) {
  var param, row, j, ch;

  param = params[0];
  if (param < 1) param = 1;

  row = this.y + this.ybase;
  j = this.x;
  ch = [this.eraseAttr(), ' ']; // xterm

  while (param-- && j < this.cols) {
    this.lines[row].splice(j++, 0, ch);
    this.lines[row].pop();
  }
};

// CSI Ps E
// Cursor Next Line Ps Times (default = 1) (CNL).
// same as CSI Ps B ?
Terminal.prototype.cursorNextLine = function(params) {
  var param = params[0];
  if (param < 1) param = 1;
  this.y += param;
  if (this.y >= this.rows) {
    this.y = this.rows - 1;
  }
  this.x = 0;
};

// CSI Ps F
// Cursor Preceding Line Ps Times (default = 1) (CNL).
// reuse CSI Ps A ?
Terminal.prototype.cursorPrecedingLine = function(params) {
  var param = params[0];
  if (param < 1) param = 1;
  this.y -= param;
  if (this.y < 0) this.y = 0;
  this.x = 0;
};

// CSI Ps G
// Cursor Character Absolute  [column] (default = [row,1]) (CHA).
Terminal.prototype.cursorCharAbsolute = function(params) {
  var param = params[0];
  if (param < 1) param = 1;
  this.x = param - 1;
};

// CSI Ps L
// Insert Ps Line(s) (default = 1) (IL).
Terminal.prototype.insertLines = function(params) {
  var param, row, j;

  param = params[0];
  if (param < 1) param = 1;
  row = this.y + this.ybase;

  j = this.rows - 1 - this.scrollBottom;
  j = this.rows - 1 + this.ybase - j + 1;

  while (param--) {
    // test: echo -e '\e[44m\e[1L\e[0m'
    // blankLine(true) - xterm/linux behavior
    this.lines.splice(row, 0, this.blankLine(true));
    this.lines.splice(j, 1);
  }

  // this.maxRange();
  this.updateRange(this.y);
  this.updateRange(this.scrollBottom);
};

// CSI Ps M
// Delete Ps Line(s) (default = 1) (DL).
Terminal.prototype.deleteLines = function(params) {
  var param, row, j;

  param = params[0];
  if (param < 1) param = 1;
  row = this.y + this.ybase;

  j = this.rows - 1 - this.scrollBottom;
  j = this.rows - 1 + this.ybase - j;

  while (param--) {
    // test: echo -e '\e[44m\e[1M\e[0m'
    // blankLine(true) - xterm/linux behavior
    this.lines.splice(j + 1, 0, this.blankLine(true));
    this.lines.splice(row, 1);
  }

  // this.maxRange();
  this.updateRange(this.y);
  this.updateRange(this.scrollBottom);
};

// CSI Ps P
// Delete Ps Character(s) (default = 1) (DCH).
Terminal.prototype.deleteChars = function(params) {
  var param, row, ch;

  param = params[0];
  if (param < 1) param = 1;

  row = this.y + this.ybase;
  ch = [this.eraseAttr(), ' ']; // xterm

  while (param--) {
    this.lines[row].splice(this.x, 1);
    this.lines[row].push(ch);
  }
};

// CSI Ps X
// Erase Ps Character(s) (default = 1) (ECH).
Terminal.prototype.eraseChars = function(params) {
  var param, row, j, ch;

  param = params[0];
  if (param < 1) param = 1;

  row = this.y + this.ybase;
  j = this.x;
  ch = [this.eraseAttr(), ' ']; // xterm

  while (param-- && j < this.cols) {
    this.lines[row][j++] = ch;
  }
};

// CSI Pm `  Character Position Absolute
//   [column] (default = [row,1]) (HPA).
Terminal.prototype.charPosAbsolute = function(params) {
  var param = params[0];
  if (param < 1) param = 1;
  this.x = param - 1;
  if (this.x >= this.cols) {
    this.x = this.cols - 1;
  }
};

// 141 61 a * HPR -
// Horizontal Position Relative
// reuse CSI Ps C ?
Terminal.prototype.HPositionRelative = function(params) {
  var param = params[0];
  if (param < 1) param = 1;
  this.x += param;
  if (this.x >= this.cols) {
    this.x = this.cols - 1;
  }
};

// CSI Ps c  Send Device Attributes (Primary DA).
//     Ps = 0  or omitted -> request attributes from terminal.  The
//     response depends on the decTerminalID resource setting.
//     -> CSI ? 1 ; 2 c  (``VT100 with Advanced Video Option'')
//     -> CSI ? 1 ; 0 c  (``VT101 with No Options'')
//     -> CSI ? 6 c  (``VT102'')
//     -> CSI ? 6 0 ; 1 ; 2 ; 6 ; 8 ; 9 ; 1 5 ; c  (``VT220'')
//   The VT100-style response parameters do not mean anything by
//   themselves.  VT220 parameters do, telling the host what fea-
//   tures the terminal supports:
//     Ps = 1  -> 132-columns.
//     Ps = 2  -> Printer.
//     Ps = 6  -> Selective erase.
//     Ps = 8  -> User-defined keys.
//     Ps = 9  -> National replacement character sets.
//     Ps = 1 5  -> Technical characters.
//     Ps = 2 2  -> ANSI color, e.g., VT525.
//     Ps = 2 9  -> ANSI text locator (i.e., DEC Locator mode).
// CSI > Ps c
//   Send Device Attributes (Secondary DA).
//     Ps = 0  or omitted -> request the terminal's identification
//     code.  The response depends on the decTerminalID resource set-
//     ting.  It should apply only to VT220 and up, but xterm extends
//     this to VT100.
//     -> CSI  > Pp ; Pv ; Pc c
//   where Pp denotes the terminal type
//     Pp = 0  -> ``VT100''.
//     Pp = 1  -> ``VT220''.
//   and Pv is the firmware version (for xterm, this was originally
//   the XFree86 patch number, starting with 95).  In a DEC termi-
//   nal, Pc indicates the ROM cartridge registration number and is
//   always zero.
// More information:
//   xterm/charproc.c - line 2012, for more information.
//   vim responds with ^[[?0c or ^[[?1c after the terminal's response (?)
Terminal.prototype.sendDeviceAttributes = function(params) {
  if (params[0] > 0) return;

  if (!this.prefix) {
    if (this.is('xterm')
        || this.is('rxvt-unicode')
        || this.is('screen')) {
      this.send('\x1b[?1;2c');
    } else if (this.is('linux')) {
      this.send('\x1b[?6c');
    }
  } else if (this.prefix === '>') {
    // xterm and urxvt
    // seem to spit this
    // out around ~370 times (?).
    if (this.is('xterm')) {
      this.send('\x1b[>0;276;0c');
    } else if (this.is('rxvt-unicode')) {
      this.send('\x1b[>85;95;0c');
    } else if (this.is('linux')) {
      // not supported by linux console.
      // linux console echoes parameters.
      this.send(params[0] + 'c');
    } else if (this.is('screen')) {
      this.send('\x1b[>83;40003;0c');
    }
  }
};

// CSI Pm d
// Line Position Absolute  [row] (default = [1,column]) (VPA).
Terminal.prototype.linePosAbsolute = function(params) {
  var param = params[0];
  if (param < 1) param = 1;
  this.y = param - 1;
  if (this.y >= this.rows) {
    this.y = this.rows - 1;
  }
};

// 145 65 e * VPR - Vertical Position Relative
// reuse CSI Ps B ?
Terminal.prototype.VPositionRelative = function(params) {
  var param = params[0];
  if (param < 1) param = 1;
  this.y += param;
  if (this.y >= this.rows) {
    this.y = this.rows - 1;
  }
};

// CSI Ps ; Ps f
//   Horizontal and Vertical Position [row;column] (default =
//   [1,1]) (HVP).
Terminal.prototype.HVPosition = function(params) {
  if (params[0] < 1) params[0] = 1;
  if (params[1] < 1) params[1] = 1;

  this.y = params[0] - 1;
  if (this.y >= this.rows) {
    this.y = this.rows - 1;
  }

  this.x = params[1] - 1;
  if (this.x >= this.cols) {
    this.x = this.cols - 1;
  }
};

// CSI Pm h  Set Mode (SM).
//     Ps = 2  -> Keyboard Action Mode (AM).
//     Ps = 4  -> Insert Mode (IRM).
//     Ps = 1 2  -> Send/receive (SRM).
//     Ps = 2 0  -> Automatic Newline (LNM).
// CSI ? Pm h
//   DEC Private Mode Set (DECSET).
//     Ps = 1  -> Application Cursor Keys (DECCKM).
//     Ps = 2  -> Designate USASCII for character sets G0-G3
//     (DECANM), and set VT100 mode.
//     Ps = 3  -> 132 Column Mode (DECCOLM).
//     Ps = 4  -> Smooth (Slow) Scroll (DECSCLM).
//     Ps = 5  -> Reverse Video (DECSCNM).
//     Ps = 6  -> Origin Mode (DECOM).
//     Ps = 7  -> Wraparound Mode (DECAWM).
//     Ps = 8  -> Auto-repeat Keys (DECARM).
//     Ps = 9  -> Send Mouse X & Y on button press.  See the sec-
//     tion Mouse Tracking.
//     Ps = 1 0  -> Show toolbar (rxvt).
//     Ps = 1 2  -> Start Blinking Cursor (att610).
//     Ps = 1 8  -> Print form feed (DECPFF).
//     Ps = 1 9  -> Set print extent to full screen (DECPEX).
//     Ps = 2 5  -> Show Cursor (DECTCEM).
//     Ps = 3 0  -> Show scrollbar (rxvt).
//     Ps = 3 5  -> Enable font-shifting functions (rxvt).
//     Ps = 3 8  -> Enter Tektronix Mode (DECTEK).
//     Ps = 4 0  -> Allow 80 -> 132 Mode.
//     Ps = 4 1  -> more(1) fix (see curses resource).
//     Ps = 4 2  -> Enable Nation Replacement Character sets (DECN-
//     RCM).
//     Ps = 4 4  -> Turn On Margin Bell.
//     Ps = 4 5  -> Reverse-wraparound Mode.
//     Ps = 4 6  -> Start Logging.  This is normally disabled by a
//     compile-time option.
//     Ps = 4 7  -> Use Alternate Screen Buffer.  (This may be dis-
//     abled by the titeInhibit resource).
//     Ps = 6 6  -> Application keypad (DECNKM).
//     Ps = 6 7  -> Backarrow key sends backspace (DECBKM).
//     Ps = 1 0 0 0  -> Send Mouse X & Y on button press and
//     release.  See the section Mouse Tracking.
//     Ps = 1 0 0 1  -> Use Hilite Mouse Tracking.
//     Ps = 1 0 0 2  -> Use Cell Motion Mouse Tracking.
//     Ps = 1 0 0 3  -> Use All Motion Mouse Tracking.
//     Ps = 1 0 0 4  -> Send FocusIn/FocusOut events.
//     Ps = 1 0 0 5  -> Enable Extended Mouse Mode.
//     Ps = 1 0 1 0  -> Scroll to bottom on tty output (rxvt).
//     Ps = 1 0 1 1  -> Scroll to bottom on key press (rxvt).
//     Ps = 1 0 3 4  -> Interpret "meta" key, sets eighth bit.
//     (enables the eightBitInput resource).
//     Ps = 1 0 3 5  -> Enable special modifiers for Alt and Num-
//     Lock keys.  (This enables the numLock resource).
//     Ps = 1 0 3 6  -> Send ESC   when Meta modifies a key.  (This
//     enables the metaSendsEscape resource).
//     Ps = 1 0 3 7  -> Send DEL from the editing-keypad Delete
//     key.
//     Ps = 1 0 3 9  -> Send ESC  when Alt modifies a key.  (This
//     enables the altSendsEscape resource).
//     Ps = 1 0 4 0  -> Keep selection even if not highlighted.
//     (This enables the keepSelection resource).
//     Ps = 1 0 4 1  -> Use the CLIPBOARD selection.  (This enables
//     the selectToClipboard resource).
//     Ps = 1 0 4 2  -> Enable Urgency window manager hint when
//     Control-G is received.  (This enables the bellIsUrgent
//     resource).
//     Ps = 1 0 4 3  -> Enable raising of the window when Control-G
//     is received.  (enables the popOnBell resource).
//     Ps = 1 0 4 7  -> Use Alternate Screen Buffer.  (This may be
//     disabled by the titeInhibit resource).
//     Ps = 1 0 4 8  -> Save cursor as in DECSC.  (This may be dis-
//     abled by the titeInhibit resource).
//     Ps = 1 0 4 9  -> Save cursor as in DECSC and use Alternate
//     Screen Buffer, clearing it first.  (This may be disabled by
//     the titeInhibit resource).  This combines the effects of the 1
//     0 4 7  and 1 0 4 8  modes.  Use this with terminfo-based
//     applications rather than the 4 7  mode.
//     Ps = 1 0 5 0  -> Set terminfo/termcap function-key mode.
//     Ps = 1 0 5 1  -> Set Sun function-key mode.
//     Ps = 1 0 5 2  -> Set HP function-key mode.
//     Ps = 1 0 5 3  -> Set SCO function-key mode.
//     Ps = 1 0 6 0  -> Set legacy keyboard emulation (X11R6).
//     Ps = 1 0 6 1  -> Set VT220 keyboard emulation.
//     Ps = 2 0 0 4  -> Set bracketed paste mode.
// Modes:
//   http://vt100.net/docs/vt220-rm/chapter4.html
Terminal.prototype.setMode = function(params) {
  if (typeof params === 'object') {
    var l = params.length
      , i = 0;

    for (; i < l; i++) {
      this.setMode(params[i]);
    }

    return;
  }

  if (!this.prefix) {
    switch (params) {
      case 4:
        this.insertMode = true;
        break;
      case 20:
        //this.convertEol = true;
        break;
    }
  } else if (this.prefix === '?') {
    switch (params) {
      case 1:
        this.applicationCursor = true;
        break;
      case 2:
        this.setgCharset(0, Terminal.charsets.US);
        this.setgCharset(1, Terminal.charsets.US);
        this.setgCharset(2, Terminal.charsets.US);
        this.setgCharset(3, Terminal.charsets.US);
        // set VT100 mode here
        break;
      case 3: // 132 col mode
        this.savedCols = this.cols;
        this.resize(132, this.rows);
        break;
      case 6:
        this.originMode = true;
        break;
      case 7:
        this.wraparoundMode = true;
        break;
      case 12:
        // this.cursorBlink = true;
        break;
      case 66:
        this.log('Serial port requested application keypad.');
        this.applicationKeypad = true;
        break;
      case 9: // X10 Mouse
        // no release, no motion, no wheel, no modifiers.
      case 1000: // vt200 mouse
        // no motion.
        // no modifiers, except control on the wheel.
      case 1002: // button event mouse
      case 1003: // any event mouse
        // any event - sends motion events,
        // even if there is no button held down.
        this.x10Mouse = params === 9;
        this.vt200Mouse = params === 1000;
        this.normalMouse = params > 1000;
        this.mouseEvents = true;
        this.element.style.cursor = 'default';
        this.log('Binding to mouse events.');
        break;
      case 1004: // send focusin/focusout events
        // focusin: ^[[I
        // focusout: ^[[O
        this.sendFocus = true;
        break;
      case 1005: // utf8 ext mode mouse
        this.utfMouse = true;
        // for wide terminals
        // simply encodes large values as utf8 characters
        break;
      case 1006: // sgr ext mode mouse
        this.sgrMouse = true;
        // for wide terminals
        // does not add 32 to fields
        // press: ^[[<b;x;yM
        // release: ^[[<b;x;ym
        break;
      case 1015: // urxvt ext mode mouse
        this.urxvtMouse = true;
        // for wide terminals
        // numbers for fields
        // press: ^[[b;x;yM
        // motion: ^[[b;x;yT
        break;
      case 25: // show cursor
        this.cursorHidden = false;
        break;
      case 1049: // alt screen buffer cursor
        //this.saveCursor();
        ; // FALL-THROUGH
      case 47: // alt screen buffer
      case 1047: // alt screen buffer
        if (!this.normal) {
          var normal = {
            lines: this.lines,
            ybase: this.ybase,
            ydisp: this.ydisp,
            x: this.x,
            y: this.y,
            scrollTop: this.scrollTop,
            scrollBottom: this.scrollBottom,
            tabs: this.tabs
            // XXX save charset(s) here?
            // charset: this.charset,
            // glevel: this.glevel,
            // charsets: this.charsets
          };
          this.reset();
          this.normal = normal;
          this.showCursor();
        }
        break;
    }
  }
};

// CSI Pm l  Reset Mode (RM).
//     Ps = 2  -> Keyboard Action Mode (AM).
//     Ps = 4  -> Replace Mode (IRM).
//     Ps = 1 2  -> Send/receive (SRM).
//     Ps = 2 0  -> Normal Linefeed (LNM).
// CSI ? Pm l
//   DEC Private Mode Reset (DECRST).
//     Ps = 1  -> Normal Cursor Keys (DECCKM).
//     Ps = 2  -> Designate VT52 mode (DECANM).
//     Ps = 3  -> 80 Column Mode (DECCOLM).
//     Ps = 4  -> Jump (Fast) Scroll (DECSCLM).
//     Ps = 5  -> Normal Video (DECSCNM).
//     Ps = 6  -> Normal Cursor Mode (DECOM).
//     Ps = 7  -> No Wraparound Mode (DECAWM).
//     Ps = 8  -> No Auto-repeat Keys (DECARM).
//     Ps = 9  -> Don't send Mouse X & Y on button press.
//     Ps = 1 0  -> Hide toolbar (rxvt).
//     Ps = 1 2  -> Stop Blinking Cursor (att610).
//     Ps = 1 8  -> Don't print form feed (DECPFF).
//     Ps = 1 9  -> Limit print to scrolling region (DECPEX).
//     Ps = 2 5  -> Hide Cursor (DECTCEM).
//     Ps = 3 0  -> Don't show scrollbar (rxvt).
//     Ps = 3 5  -> Disable font-shifting functions (rxvt).
//     Ps = 4 0  -> Disallow 80 -> 132 Mode.
//     Ps = 4 1  -> No more(1) fix (see curses resource).
//     Ps = 4 2  -> Disable Nation Replacement Character sets (DEC-
//     NRCM).
//     Ps = 4 4  -> Turn Off Margin Bell.
//     Ps = 4 5  -> No Reverse-wraparound Mode.
//     Ps = 4 6  -> Stop Logging.  (This is normally disabled by a
//     compile-time option).
//     Ps = 4 7  -> Use Normal Screen Buffer.
//     Ps = 6 6  -> Numeric keypad (DECNKM).
//     Ps = 6 7  -> Backarrow key sends delete (DECBKM).
//     Ps = 1 0 0 0  -> Don't send Mouse X & Y on button press and
//     release.  See the section Mouse Tracking.
//     Ps = 1 0 0 1  -> Don't use Hilite Mouse Tracking.
//     Ps = 1 0 0 2  -> Don't use Cell Motion Mouse Tracking.
//     Ps = 1 0 0 3  -> Don't use All Motion Mouse Tracking.
//     Ps = 1 0 0 4  -> Don't send FocusIn/FocusOut events.
//     Ps = 1 0 0 5  -> Disable Extended Mouse Mode.
//     Ps = 1 0 1 0  -> Don't scroll to bottom on tty output
//     (rxvt).
//     Ps = 1 0 1 1  -> Don't scroll to bottom on key press (rxvt).
//     Ps = 1 0 3 4  -> Don't interpret "meta" key.  (This disables
//     the eightBitInput resource).
//     Ps = 1 0 3 5  -> Disable special modifiers for Alt and Num-
//     Lock keys.  (This disables the numLock resource).
//     Ps = 1 0 3 6  -> Don't send ESC  when Meta modifies a key.
//     (This disables the metaSendsEscape resource).
//     Ps = 1 0 3 7  -> Send VT220 Remove from the editing-keypad
//     Delete key.
//     Ps = 1 0 3 9  -> Don't send ESC  when Alt modifies a key.
//     (This disables the altSendsEscape resource).
//     Ps = 1 0 4 0  -> Do not keep selection when not highlighted.
//     (This disables the keepSelection resource).
//     Ps = 1 0 4 1  -> Use the PRIMARY selection.  (This disables
//     the selectToClipboard resource).
//     Ps = 1 0 4 2  -> Disable Urgency window manager hint when
//     Control-G is received.  (This disables the bellIsUrgent
//     resource).
//     Ps = 1 0 4 3  -> Disable raising of the window when Control-
//     G is received.  (This disables the popOnBell resource).
//     Ps = 1 0 4 7  -> Use Normal Screen Buffer, clearing screen
//     first if in the Alternate Screen.  (This may be disabled by
//     the titeInhibit resource).
//     Ps = 1 0 4 8  -> Restore cursor as in DECRC.  (This may be
//     disabled by the titeInhibit resource).
//     Ps = 1 0 4 9  -> Use Normal Screen Buffer and restore cursor
//     as in DECRC.  (This may be disabled by the titeInhibit
//     resource).  This combines the effects of the 1 0 4 7  and 1 0
//     4 8  modes.  Use this with terminfo-based applications rather
//     than the 4 7  mode.
//     Ps = 1 0 5 0  -> Reset terminfo/termcap function-key mode.
//     Ps = 1 0 5 1  -> Reset Sun function-key mode.
//     Ps = 1 0 5 2  -> Reset HP function-key mode.
//     Ps = 1 0 5 3  -> Reset SCO function-key mode.
//     Ps = 1 0 6 0  -> Reset legacy keyboard emulation (X11R6).
//     Ps = 1 0 6 1  -> Reset keyboard emulation to Sun/PC style.
//     Ps = 2 0 0 4  -> Reset bracketed paste mode.
Terminal.prototype.resetMode = function(params) {
  if (typeof params === 'object') {
    var l = params.length
      , i = 0;

    for (; i < l; i++) {
      this.resetMode(params[i]);
    }

    return;
  }

  if (!this.prefix) {
    switch (params) {
      case 4:
        this.insertMode = false;
        break;
      case 20:
        //this.convertEol = false;
        break;
    }
  } else if (this.prefix === '?') {
    switch (params) {
      case 1:
        this.applicationCursor = false;
        break;
      case 3:
        if (this.cols === 132 && this.savedCols) {
          this.resize(this.savedCols, this.rows);
        }
        delete this.savedCols;
        break;
      case 6:
        this.originMode = false;
        break;
      case 7:
        this.wraparoundMode = false;
        break;
      case 12:
        // this.cursorBlink = false;
        break;
      case 66:
        this.log('Switching back to normal keypad.');
        this.applicationKeypad = false;
        break;
      case 9: // X10 Mouse
      case 1000: // vt200 mouse
      case 1002: // button event mouse
      case 1003: // any event mouse
        this.x10Mouse = false;
        this.vt200Mouse = false;
        this.normalMouse = false;
        this.mouseEvents = false;
        this.element.style.cursor = '';
        break;
      case 1004: // send focusin/focusout events
        this.sendFocus = false;
        break;
      case 1005: // utf8 ext mode mouse
        this.utfMouse = false;
        break;
      case 1006: // sgr ext mode mouse
        this.sgrMouse = false;
        break;
      case 1015: // urxvt ext mode mouse
        this.urxvtMouse = false;
        break;
      case 25: // hide cursor
        this.cursorHidden = true;
        break;
      case 1049: // alt screen buffer cursor
        ; // FALL-THROUGH
      case 47: // normal screen buffer
      case 1047: // normal screen buffer - clearing it first
        if (this.normal) {
          this.lines = this.normal.lines;
          this.ybase = this.normal.ybase;
          this.ydisp = this.normal.ydisp;
          this.x = this.normal.x;
          this.y = this.normal.y;
          this.scrollTop = this.normal.scrollTop;
          this.scrollBottom = this.normal.scrollBottom;
          this.tabs = this.normal.tabs;
          this.normal = null;
          // if (params === 1049) {
          //   this.x = this.savedX;
          //   this.y = this.savedY;
          // }
          this.refresh(0, this.rows - 1);
          this.showCursor();
        }
        break;
    }
  }
};

// CSI Ps ; Ps r
//   Set Scrolling Region [top;bottom] (default = full size of win-
//   dow) (DECSTBM).
// CSI ? Pm r
Terminal.prototype.setScrollRegion = function(params) {
  if (this.prefix) return;
  this.scrollTop = (params[0] || 1) - 1;
  this.scrollBottom = (params[1] || this.rows) - 1;
  this.x = 0;
  this.y = 0;
};

// CSI s
//   Save cursor (ANSI.SYS).
Terminal.prototype.saveCursor = function(params) {
  this.savedX = this.x;
  this.savedY = this.y;
};

// CSI u
//   Restore cursor (ANSI.SYS).
Terminal.prototype.restoreCursor = function(params) {
  this.x = this.savedX || 0;
  this.y = this.savedY || 0;
};

/**
 * Lesser Used
 */

// CSI Ps I
//   Cursor Forward Tabulation Ps tab stops (default = 1) (CHT).
Terminal.prototype.cursorForwardTab = function(params) {
  var param = params[0] || 1;
  while (param--) {
    this.x = this.nextStop();
  }
};

// CSI Ps S  Scroll up Ps lines (default = 1) (SU).
Terminal.prototype.scrollUp = function(params) {
  var param = params[0] || 1;
  while (param--) {
    this.lines.splice(this.ybase + this.scrollTop, 1);
    this.lines.splice(this.ybase + this.scrollBottom, 0, this.blankLine());
  }
  // this.maxRange();
  this.updateRange(this.scrollTop);
  this.updateRange(this.scrollBottom);
};

// CSI Ps T  Scroll down Ps lines (default = 1) (SD).
Terminal.prototype.scrollDown = function(params) {
  var param = params[0] || 1;
  while (param--) {
    this.lines.splice(this.ybase + this.scrollBottom, 1);
    this.lines.splice(this.ybase + this.scrollTop, 0, this.blankLine());
  }
  // this.maxRange();
  this.updateRange(this.scrollTop);
  this.updateRange(this.scrollBottom);
};

// CSI Ps ; Ps ; Ps ; Ps ; Ps T
//   Initiate highlight mouse tracking.  Parameters are
//   [func;startx;starty;firstrow;lastrow].  See the section Mouse
//   Tracking.
Terminal.prototype.initMouseTracking = function(params) {
  // Relevant: DECSET 1001
};

// CSI > Ps; Ps T
//   Reset one or more features of the title modes to the default
//   value.  Normally, "reset" disables the feature.  It is possi-
//   ble to disable the ability to reset features by compiling a
//   different default for the title modes into xterm.
//     Ps = 0  -> Do not set window/icon labels using hexadecimal.
//     Ps = 1  -> Do not query window/icon labels using hexadeci-
//     mal.
//     Ps = 2  -> Do not set window/icon labels using UTF-8.
//     Ps = 3  -> Do not query window/icon labels using UTF-8.
//   (See discussion of "Title Modes").
Terminal.prototype.resetTitleModes = function(params) {
  ;
};

// CSI Ps Z  Cursor Backward Tabulation Ps tab stops (default = 1) (CBT).
Terminal.prototype.cursorBackwardTab = function(params) {
  var param = params[0] || 1;
  while (param--) {
    this.x = this.prevStop();
  }
};

// CSI Ps b  Repeat the preceding graphic character Ps times (REP).
Terminal.prototype.repeatPrecedingCharacter = function(params) {
  var param = params[0] || 1
    , line = this.lines[this.ybase + this.y]
    , ch = line[this.x - 1] || [this.defAttr, ' '];

  while (param--) line[this.x++] = ch;
};

// CSI Ps g  Tab Clear (TBC).
//     Ps = 0  -> Clear Current Column (default).
//     Ps = 3  -> Clear All.
// Potentially:
//   Ps = 2  -> Clear Stops on Line.
//   http://vt100.net/annarbor/aaa-ug/section6.html
Terminal.prototype.tabClear = function(params) {
  var param = params[0];
  if (param <= 0) {
    delete this.tabs[this.x];
  } else if (param === 3) {
    this.tabs = {};
  }
};

// CSI Pm i  Media Copy (MC).
//     Ps = 0  -> Print screen (default).
//     Ps = 4  -> Turn off printer controller mode.
//     Ps = 5  -> Turn on printer controller mode.
// CSI ? Pm i
//   Media Copy (MC, DEC-specific).
//     Ps = 1  -> Print line containing cursor.
//     Ps = 4  -> Turn off autoprint mode.
//     Ps = 5  -> Turn on autoprint mode.
//     Ps = 1  0  -> Print composed display, ignores DECPEX.
//     Ps = 1  1  -> Print all pages.
Terminal.prototype.mediaCopy = function(params) {
  ;
};

// CSI > Ps; Ps m
//   Set or reset resource-values used by xterm to decide whether
//   to construct escape sequences holding information about the
//   modifiers pressed with a given key.  The first parameter iden-
//   tifies the resource to set/reset.  The second parameter is the
//   value to assign to the resource.  If the second parameter is
//   omitted, the resource is reset to its initial value.
//     Ps = 1  -> modifyCursorKeys.
//     Ps = 2  -> modifyFunctionKeys.
//     Ps = 4  -> modifyOtherKeys.
//   If no parameters are given, all resources are reset to their
//   initial values.
Terminal.prototype.setResources = function(params) {
  ;
};

// CSI > Ps n
//   Disable modifiers which may be enabled via the CSI > Ps; Ps m
//   sequence.  This corresponds to a resource value of "-1", which
//   cannot be set with the other sequence.  The parameter identi-
//   fies the resource to be disabled:
//     Ps = 1  -> modifyCursorKeys.
//     Ps = 2  -> modifyFunctionKeys.
//     Ps = 4  -> modifyOtherKeys.
//   If the parameter is omitted, modifyFunctionKeys is disabled.
//   When modifyFunctionKeys is disabled, xterm uses the modifier
//   keys to make an extended sequence of functions rather than
//   adding a parameter to each function key to denote the modi-
//   fiers.
Terminal.prototype.disableModifiers = function(params) {
  ;
};

// CSI > Ps p
//   Set resource value pointerMode.  This is used by xterm to
//   decide whether to hide the pointer cursor as the user types.
//   Valid values for the parameter:
//     Ps = 0  -> never hide the pointer.
//     Ps = 1  -> hide if the mouse tracking mode is not enabled.
//     Ps = 2  -> always hide the pointer.  If no parameter is
//     given, xterm uses the default, which is 1 .
Terminal.prototype.setPointerMode = function(params) {
  ;
};

// CSI ! p   Soft terminal reset (DECSTR).
// http://vt100.net/docs/vt220-rm/table4-10.html
Terminal.prototype.softReset = function(params) {
  this.cursorHidden = false;
  this.insertMode = false;
  this.originMode = false;
  this.wraparoundMode = false; // autowrap
  this.applicationKeypad = false; // ?
  this.applicationCursor = false;
  this.scrollTop = 0;
  this.scrollBottom = this.rows - 1;
  this.curAttr = this.defAttr;
  this.x = this.y = 0; // ?
  this.charset = null;
  this.glevel = 0; // ??
  this.charsets = [null]; // ??
};

// CSI Ps$ p
//   Request ANSI mode (DECRQM).  For VT300 and up, reply is
//     CSI Ps; Pm$ y
//   where Ps is the mode number as in RM, and Pm is the mode
//   value:
//     0 - not recognized
//     1 - set
//     2 - reset
//     3 - permanently set
//     4 - permanently reset
Terminal.prototype.requestAnsiMode = function(params) {
  ;
};

// CSI ? Ps$ p
//   Request DEC private mode (DECRQM).  For VT300 and up, reply is
//     CSI ? Ps; Pm$ p
//   where Ps is the mode number as in DECSET, Pm is the mode value
//   as in the ANSI DECRQM.
Terminal.prototype.requestPrivateMode = function(params) {
  ;
};

// CSI Ps ; Ps " p
//   Set conformance level (DECSCL).  Valid values for the first
//   parameter:
//     Ps = 6 1  -> VT100.
//     Ps = 6 2  -> VT200.
//     Ps = 6 3  -> VT300.
//   Valid values for the second parameter:
//     Ps = 0  -> 8-bit controls.
//     Ps = 1  -> 7-bit controls (always set for VT100).
//     Ps = 2  -> 8-bit controls.
Terminal.prototype.setConformanceLevel = function(params) {
  ;
};

// CSI Ps q  Load LEDs (DECLL).
//     Ps = 0  -> Clear all LEDS (default).
//     Ps = 1  -> Light Num Lock.
//     Ps = 2  -> Light Caps Lock.
//     Ps = 3  -> Light Scroll Lock.
//     Ps = 2  1  -> Extinguish Num Lock.
//     Ps = 2  2  -> Extinguish Caps Lock.
//     Ps = 2  3  -> Extinguish Scroll Lock.
Terminal.prototype.loadLEDs = function(params) {
  ;
};

// CSI Ps SP q
//   Set cursor style (DECSCUSR, VT520).
//     Ps = 0  -> blinking block.
//     Ps = 1  -> blinking block (default).
//     Ps = 2  -> steady block.
//     Ps = 3  -> blinking underline.
//     Ps = 4  -> steady underline.
Terminal.prototype.setCursorStyle = function(params) {
  ;
};

// CSI Ps " q
//   Select character protection attribute (DECSCA).  Valid values
//   for the parameter:
//     Ps = 0  -> DECSED and DECSEL can erase (default).
//     Ps = 1  -> DECSED and DECSEL cannot erase.
//     Ps = 2  -> DECSED and DECSEL can erase.
Terminal.prototype.setCharProtectionAttr = function(params) {
  ;
};

// CSI ? Pm r
//   Restore DEC Private Mode Values.  The value of Ps previously
//   saved is restored.  Ps values are the same as for DECSET.
Terminal.prototype.restorePrivateValues = function(params) {
  ;
};

// CSI Pt; Pl; Pb; Pr; Ps$ r
//   Change Attributes in Rectangular Area (DECCARA), VT400 and up.
//     Pt; Pl; Pb; Pr denotes the rectangle.
//     Ps denotes the SGR attributes to change: 0, 1, 4, 5, 7.
// NOTE: xterm doesn't enable this code by default.
Terminal.prototype.setAttrInRectangle = function(params) {
  var t = params[0]
    , l = params[1]
    , b = params[2]
    , r = params[3]
    , attr = params[4];

  var line
    , i;

  for (; t < b + 1; t++) {
    line = this.lines[this.ybase + t];
    for (i = l; i < r; i++) {
      line[i] = [attr, line[i][1]];
    }
  }

  // this.maxRange();
  this.updateRange(params[0]);
  this.updateRange(params[2]);
};

// CSI ? Pm s
//   Save DEC Private Mode Values.  Ps values are the same as for
//   DECSET.
Terminal.prototype.savePrivateValues = function(params) {
  ;
};

// CSI Ps ; Ps ; Ps t
//   Window manipulation (from dtterm, as well as extensions).
//   These controls may be disabled using the allowWindowOps
//   resource.  Valid values for the first (and any additional
//   parameters) are:
//     Ps = 1  -> De-iconify window.
//     Ps = 2  -> Iconify window.
//     Ps = 3  ;  x ;  y -> Move window to [x, y].
//     Ps = 4  ;  height ;  width -> Resize the xterm window to
//     height and width in pixels.
//     Ps = 5  -> Raise the xterm window to the front of the stack-
//     ing order.
//     Ps = 6  -> Lower the xterm window to the bottom of the
//     stacking order.
//     Ps = 7  -> Refresh the xterm window.
//     Ps = 8  ;  height ;  width -> Resize the text area to
//     [height;width] in characters.
//     Ps = 9  ;  0  -> Restore maximized window.
//     Ps = 9  ;  1  -> Maximize window (i.e., resize to screen
//     size).
//     Ps = 1 0  ;  0  -> Undo full-screen mode.
//     Ps = 1 0  ;  1  -> Change to full-screen.
//     Ps = 1 1  -> Report xterm window state.  If the xterm window
//     is open (non-iconified), it returns CSI 1 t .  If the xterm
//     window is iconified, it returns CSI 2 t .
//     Ps = 1 3  -> Report xterm window position.  Result is CSI 3
//     ; x ; y t
//     Ps = 1 4  -> Report xterm window in pixels.  Result is CSI
//     4  ;  height ;  width t
//     Ps = 1 8  -> Report the size of the text area in characters.
//     Result is CSI  8  ;  height ;  width t
//     Ps = 1 9  -> Report the size of the screen in characters.
//     Result is CSI  9  ;  height ;  width t
//     Ps = 2 0  -> Report xterm window's icon label.  Result is
//     OSC  L  label ST
//     Ps = 2 1  -> Report xterm window's title.  Result is OSC  l
//     label ST
//     Ps = 2 2  ;  0  -> Save xterm icon and window title on
//     stack.
//     Ps = 2 2  ;  1  -> Save xterm icon title on stack.
//     Ps = 2 2  ;  2  -> Save xterm window title on stack.
//     Ps = 2 3  ;  0  -> Restore xterm icon and window title from
//     stack.
//     Ps = 2 3  ;  1  -> Restore xterm icon title from stack.
//     Ps = 2 3  ;  2  -> Restore xterm window title from stack.
//     Ps >= 2 4  -> Resize to Ps lines (DECSLPP).
Terminal.prototype.manipulateWindow = function(params) {
  ;
};

// CSI Pt; Pl; Pb; Pr; Ps$ t
//   Reverse Attributes in Rectangular Area (DECRARA), VT400 and
//   up.
//     Pt; Pl; Pb; Pr denotes the rectangle.
//     Ps denotes the attributes to reverse, i.e.,  1, 4, 5, 7.
// NOTE: xterm doesn't enable this code by default.
Terminal.prototype.reverseAttrInRectangle = function(params) {
  ;
};

// CSI > Ps; Ps t
//   Set one or more features of the title modes.  Each parameter
//   enables a single feature.
//     Ps = 0  -> Set window/icon labels using hexadecimal.
//     Ps = 1  -> Query window/icon labels using hexadecimal.
//     Ps = 2  -> Set window/icon labels using UTF-8.
//     Ps = 3  -> Query window/icon labels using UTF-8.  (See dis-
//     cussion of "Title Modes")
Terminal.prototype.setTitleModeFeature = function(params) {
  ;
};

// CSI Ps SP t
//   Set warning-bell volume (DECSWBV, VT520).
//     Ps = 0  or 1  -> off.
//     Ps = 2 , 3  or 4  -> low.
//     Ps = 5 , 6 , 7 , or 8  -> high.
Terminal.prototype.setWarningBellVolume = function(params) {
  ;
};

// CSI Ps SP u
//   Set margin-bell volume (DECSMBV, VT520).
//     Ps = 1  -> off.
//     Ps = 2 , 3  or 4  -> low.
//     Ps = 0 , 5 , 6 , 7 , or 8  -> high.
Terminal.prototype.setMarginBellVolume = function(params) {
  ;
};

// CSI Pt; Pl; Pb; Pr; Pp; Pt; Pl; Pp$ v
//   Copy Rectangular Area (DECCRA, VT400 and up).
//     Pt; Pl; Pb; Pr denotes the rectangle.
//     Pp denotes the source page.
//     Pt; Pl denotes the target location.
//     Pp denotes the target page.
// NOTE: xterm doesn't enable this code by default.
Terminal.prototype.copyRectangle = function(params) {
  ;
};

// CSI Pt ; Pl ; Pb ; Pr ' w
//   Enable Filter Rectangle (DECEFR), VT420 and up.
//   Parameters are [top;left;bottom;right].
//   Defines the coordinates of a filter rectangle and activates
//   it.  Anytime the locator is detected outside of the filter
//   rectangle, an outside rectangle event is generated and the
//   rectangle is disabled.  Filter rectangles are always treated
//   as "one-shot" events.  Any parameters that are omitted default
//   to the current locator position.  If all parameters are omit-
//   ted, any locator motion will be reported.  DECELR always can-
//   cels any prevous rectangle definition.
Terminal.prototype.enableFilterRectangle = function(params) {
  ;
};

// CSI Ps x  Request Terminal Parameters (DECREQTPARM).
//   if Ps is a "0" (default) or "1", and xterm is emulating VT100,
//   the control sequence elicits a response of the same form whose
//   parameters describe the terminal:
//     Ps -> the given Ps incremented by 2.
//     Pn = 1  <- no parity.
//     Pn = 1  <- eight bits.
//     Pn = 1  <- 2  8  transmit 38.4k baud.
//     Pn = 1  <- 2  8  receive 38.4k baud.
//     Pn = 1  <- clock multiplier.
//     Pn = 0  <- STP flags.
Terminal.prototype.requestParameters = function(params) {
  ;
};

// CSI Ps x  Select Attribute Change Extent (DECSACE).
//     Ps = 0  -> from start to end position, wrapped.
//     Ps = 1  -> from start to end position, wrapped.
//     Ps = 2  -> rectangle (exact).
Terminal.prototype.selectChangeExtent = function(params) {
  ;
};

// CSI Pc; Pt; Pl; Pb; Pr$ x
//   Fill Rectangular Area (DECFRA), VT420 and up.
//     Pc is the character to use.
//     Pt; Pl; Pb; Pr denotes the rectangle.
// NOTE: xterm doesn't enable this code by default.
Terminal.prototype.fillRectangle = function(params) {
  var ch = params[0]
    , t = params[1]
    , l = params[2]
    , b = params[3]
    , r = params[4];

  var line
    , i;

  for (; t < b + 1; t++) {
    line = this.lines[this.ybase + t];
    for (i = l; i < r; i++) {
      line[i] = [line[i][0], String.fromCharCode(ch)];
    }
  }

  // this.maxRange();
  this.updateRange(params[1]);
  this.updateRange(params[3]);
};

// CSI Ps ; Pu ' z
//   Enable Locator Reporting (DECELR).
//   Valid values for the first parameter:
//     Ps = 0  -> Locator disabled (default).
//     Ps = 1  -> Locator enabled.
//     Ps = 2  -> Locator enabled for one report, then disabled.
//   The second parameter specifies the coordinate unit for locator
//   reports.
//   Valid values for the second parameter:
//     Pu = 0  <- or omitted -> default to character cells.
//     Pu = 1  <- device physical pixels.
//     Pu = 2  <- character cells.
Terminal.prototype.enableLocatorReporting = function(params) {
  var val = params[0] > 0;
  //this.mouseEvents = val;
  //this.decLocator = val;
};

// CSI Pt; Pl; Pb; Pr$ z
//   Erase Rectangular Area (DECERA), VT400 and up.
//     Pt; Pl; Pb; Pr denotes the rectangle.
// NOTE: xterm doesn't enable this code by default.
Terminal.prototype.eraseRectangle = function(params) {
  var t = params[0]
    , l = params[1]
    , b = params[2]
    , r = params[3];

  var line
    , i
    , ch;

  ch = [this.eraseAttr(), ' ']; // xterm?

  for (; t < b + 1; t++) {
    line = this.lines[this.ybase + t];
    for (i = l; i < r; i++) {
      line[i] = ch;
    }
  }

  // this.maxRange();
  this.updateRange(params[0]);
  this.updateRange(params[2]);
};

// CSI Pm ' {
//   Select Locator Events (DECSLE).
//   Valid values for the first (and any additional parameters)
//   are:
//     Ps = 0  -> only respond to explicit host requests (DECRQLP).
//                (This is default).  It also cancels any filter
//   rectangle.
//     Ps = 1  -> report button down transitions.
//     Ps = 2  -> do not report button down transitions.
//     Ps = 3  -> report button up transitions.
//     Ps = 4  -> do not report button up transitions.
Terminal.prototype.setLocatorEvents = function(params) {
  ;
};

// CSI Pt; Pl; Pb; Pr$ {
//   Selective Erase Rectangular Area (DECSERA), VT400 and up.
//     Pt; Pl; Pb; Pr denotes the rectangle.
Terminal.prototype.selectiveEraseRectangle = function(params) {
  ;
};

// CSI Ps ' |
//   Request Locator Position (DECRQLP).
//   Valid values for the parameter are:
//     Ps = 0 , 1 or omitted -> transmit a single DECLRP locator
//     report.

//   If Locator Reporting has been enabled by a DECELR, xterm will
//   respond with a DECLRP Locator Report.  This report is also
//   generated on button up and down events if they have been
//   enabled with a DECSLE, or when the locator is detected outside
//   of a filter rectangle, if filter rectangles have been enabled
//   with a DECEFR.

//     -> CSI Pe ; Pb ; Pr ; Pc ; Pp &  w

//   Parameters are [event;button;row;column;page].
//   Valid values for the event:
//     Pe = 0  -> locator unavailable - no other parameters sent.
//     Pe = 1  -> request - xterm received a DECRQLP.
//     Pe = 2  -> left button down.
//     Pe = 3  -> left button up.
//     Pe = 4  -> middle button down.
//     Pe = 5  -> middle button up.
//     Pe = 6  -> right button down.
//     Pe = 7  -> right button up.
//     Pe = 8  -> M4 button down.
//     Pe = 9  -> M4 button up.
//     Pe = 1 0  -> locator outside filter rectangle.
//   ``button'' parameter is a bitmask indicating which buttons are
//     pressed:
//     Pb = 0  <- no buttons down.
//     Pb & 1  <- right button down.
//     Pb & 2  <- middle button down.
//     Pb & 4  <- left button down.
//     Pb & 8  <- M4 button down.
//   ``row'' and ``column'' parameters are the coordinates of the
//     locator position in the xterm window, encoded as ASCII deci-
//     mal.
//   The ``page'' parameter is not used by xterm, and will be omit-
//   ted.
Terminal.prototype.requestLocatorPosition = function(params) {
  ;
};

// CSI P m SP }
// Insert P s Column(s) (default = 1) (DECIC), VT420 and up.
// NOTE: xterm doesn't enable this code by default.
Terminal.prototype.insertColumns = function() {
  var param = params[0]
    , l = this.ybase + this.rows
    , ch = [this.eraseAttr(), ' '] // xterm?
    , i;

  while (param--) {
    for (i = this.ybase; i < l; i++) {
      this.lines[i].splice(this.x + 1, 0, ch);
      this.lines[i].pop();
    }
  }

  this.maxRange();
};

// CSI P m SP ~
// Delete P s Column(s) (default = 1) (DECDC), VT420 and up
// NOTE: xterm doesn't enable this code by default.
Terminal.prototype.deleteColumns = function() {
  var param = params[0]
    , l = this.ybase + this.rows
    , ch = [this.eraseAttr(), ' '] // xterm?
    , i;

  while (param--) {
    for (i = this.ybase; i < l; i++) {
      this.lines[i].splice(this.x, 1);
      this.lines[i].push(ch);
    }
  }

  this.maxRange();
};

/**
 * Prefix/Select/Visual/Search Modes
 */

Terminal.prototype.enterPrefix = function() {
  this.prefixMode = true;
};

Terminal.prototype.leavePrefix = function() {
  this.prefixMode = false;
};

Terminal.prototype.enterSelect = function() {
  this._real = {
    x: this.x,
    y: this.y,
    ydisp: this.ydisp,
    ybase: this.ybase,
    cursorHidden: this.cursorHidden,
    lines: this.copyBuffer(this.lines),
    write: this.write
  };
  this.write = function() {};
  this.selectMode = true;
  this.visualMode = false;
  this.cursorHidden = false;
  this.refresh(this.y, this.y);
};

Terminal.prototype.leaveSelect = function() {
  this.x = this._real.x;
  this.y = this._real.y;
  this.ydisp = this._real.ydisp;
  this.ybase = this._real.ybase;
  this.cursorHidden = this._real.cursorHidden;
  this.lines = this._real.lines;
  this.write = this._real.write;
  delete this._real;
  this.selectMode = false;
  this.visualMode = false;
  this.refresh(0, this.rows - 1);
};

Terminal.prototype.enterVisual = function() {
  this._real.preVisual = this.copyBuffer(this.lines);
  this.selectText(this.x, this.x, this.ydisp + this.y, this.ydisp + this.y);
  this.visualMode = true;
};

Terminal.prototype.leaveVisual = function() {
  this.lines = this._real.preVisual;
  delete this._real.preVisual;
  delete this._selected;
  this.visualMode = false;
  this.refresh(0, this.rows - 1);
};

Terminal.prototype.enterSearch = function(down) {
  this.entry = '';
  this.searchMode = true;
  this.searchDown = down;
  this._real.preSearch = this.copyBuffer(this.lines);
  this._real.preSearchX = this.x;
  this._real.preSearchY = this.y;

  var bottom = this.ydisp + this.rows - 1;
  for (var i = 0; i < this.entryPrefix.length; i++) {
    //this.lines[bottom][i][0] = (this.defAttr & ~0x1ff) | 4;
    //this.lines[bottom][i][1] = this.entryPrefix[i];
    this.lines[bottom][i] = [
      (this.defAttr & ~0x1ff) | 4,
      this.entryPrefix[i]
    ];
  }

  this.y = this.rows - 1;
  this.x = this.entryPrefix.length;

  this.refresh(this.rows - 1, this.rows - 1);
};

Terminal.prototype.leaveSearch = function() {
  this.searchMode = false;

  if (this._real.preSearch) {
    this.lines = this._real.preSearch;
    this.x = this._real.preSearchX;
    this.y = this._real.preSearchY;
    delete this._real.preSearch;
    delete this._real.preSearchX;
    delete this._real.preSearchY;
  }

  this.refresh(this.rows - 1, this.rows - 1);
};

Terminal.prototype.copyBuffer = function(lines) {
  var lines = lines || this.lines
    , out = [];

  for (var y = 0; y < lines.length; y++) {
    out[y] = [];
    for (var x = 0; x < lines[y].length; x++) {
      out[y][x] = [lines[y][x][0], lines[y][x][1]];
    }
  }

  return out;
};

Terminal.prototype.getCopyTextarea = function(text) {
  var textarea = this._copyTextarea
    , document = this.document;

  if (!textarea) {
    textarea = document.createElement('textarea');
    textarea.style.position = 'absolute';
    textarea.style.left = '-32000px';
    textarea.style.top = '-32000px';
    textarea.style.width = '0px';
    textarea.style.height = '0px';
    textarea.style.opacity = '0';
    textarea.style.backgroundColor = 'transparent';
    textarea.style.borderStyle = 'none';
    textarea.style.outlineStyle = 'none';

    document.getElementsByTagName('body')[0].appendChild(textarea);

    this._copyTextarea = textarea;
  }

  return textarea;
};

// NOTE: Only works for primary selection on X11.
// Non-X11 users should use Ctrl-C instead.
Terminal.prototype.copyText = function(text) {
  var self = this
    , textarea = this.getCopyTextarea();

  this.emit('copy', text);

  textarea.focus();
  textarea.textContent = text;
  textarea.value = text;
  textarea.setSelectionRange(0, text.length);

  setTimeout(function() {
    self.element.focus();
    self.focus();
  }, 1);
};

Terminal.prototype.selectText = function(x1, x2, y1, y2) {
  var ox1
    , ox2
    , oy1
    , oy2
    , tmp
    , x
    , y
    , xl
    , attr;

  if (this._selected) {
    ox1 = this._selected.x1;
    ox2 = this._selected.x2;
    oy1 = this._selected.y1;
    oy2 = this._selected.y2;

    if (oy2 < oy1) {
      tmp = ox2;
      ox2 = ox1;
      ox1 = tmp;
      tmp = oy2;
      oy2 = oy1;
      oy1 = tmp;
    }

    if (ox2 < ox1 && oy1 === oy2) {
      tmp = ox2;
      ox2 = ox1;
      ox1 = tmp;
    }

    for (y = oy1; y <= oy2; y++) {
      x = 0;
      xl = this.cols - 1;
      if (y === oy1) {
        x = ox1;
      }
      if (y === oy2) {
        xl = ox2;
      }
      for (; x <= xl; x++) {
        if (this.lines[y][x].old != null) {
          //this.lines[y][x][0] = this.lines[y][x].old;
          //delete this.lines[y][x].old;
          attr = this.lines[y][x].old;
          delete this.lines[y][x].old;
          this.lines[y][x] = [attr, this.lines[y][x][1]];
        }
      }
    }

    y1 = this._selected.y1;
    x1 = this._selected.x1;
  }

  y1 = Math.max(y1, 0);
  y1 = Math.min(y1, this.ydisp + this.rows - 1);

  y2 = Math.max(y2, 0);
  y2 = Math.min(y2, this.ydisp + this.rows - 1);

  this._selected = { x1: x1, x2: x2, y1: y1, y2: y2 };

  if (y2 < y1) {
    tmp = x2;
    x2 = x1;
    x1 = tmp;
    tmp = y2;
    y2 = y1;
    y1 = tmp;
  }

  if (x2 < x1 && y1 === y2) {
    tmp = x2;
    x2 = x1;
    x1 = tmp;
  }

  for (y = y1; y <= y2; y++) {
    x = 0;
    xl = this.cols - 1;
    if (y === y1) {
      x = x1;
    }
    if (y === y2) {
      xl = x2;
    }
    for (; x <= xl; x++) {
      //this.lines[y][x].old = this.lines[y][x][0];
      //this.lines[y][x][0] &= ~0x1ff;
      //this.lines[y][x][0] |= (0x1ff << 9) | 4;
      attr = this.lines[y][x][0];
      this.lines[y][x] = [
        (attr & ~0x1ff) | ((0x1ff << 9) | 4),
        this.lines[y][x][1]
      ];
      this.lines[y][x].old = attr;
    }
  }

  y1 = y1 - this.ydisp;
  y2 = y2 - this.ydisp;

  y1 = Math.max(y1, 0);
  y1 = Math.min(y1, this.rows - 1);

  y2 = Math.max(y2, 0);
  y2 = Math.min(y2, this.rows - 1);

  //this.refresh(y1, y2);
  this.refresh(0, this.rows - 1);
};

Terminal.prototype.grabText = function(x1, x2, y1, y2) {
  var out = ''
    , buf = ''
    , ch
    , x
    , y
    , xl
    , tmp;

  if (y2 < y1) {
    tmp = x2;
    x2 = x1;
    x1 = tmp;
    tmp = y2;
    y2 = y1;
    y1 = tmp;
  }

  if (x2 < x1 && y1 === y2) {
    tmp = x2;
    x2 = x1;
    x1 = tmp;
  }

  for (y = y1; y <= y2; y++) {
    x = 0;
    xl = this.cols - 1;
    if (y === y1) {
      x = x1;
    }
    if (y === y2) {
      xl = x2;
    }
    for (; x <= xl; x++) {
      ch = this.lines[y][x][1];
      if (ch === ' ') {
        buf += ch;
        continue;
      }
      if (buf) {
        out += buf;
        buf = '';
      }
      out += ch;
      if (isWide(ch)) x++;
    }
    buf = '';
    out += '\n';
  }

  // If we're not at the end of the
  // line, don't add a newline.
  for (x = x2, y = y2; x < this.cols; x++) {
    if (this.lines[y][x][1] !== ' ') {
      out = out.slice(0, -1);
      break;
    }
  }

  return out;
};

Terminal.prototype.keyPrefix = function(ev, key) {
  if (key === 'k' || key === '&') {
    this.destroy();
  } else if (key === 'p' || key === ']') {
    this.emit('request paste');
  } else if (key === 'c') {
    this.emit('request create');
  } else if (key >= '0' && key <= '9') {
    key = +key - 1;
    if (!~key) key = 9;
    this.emit('request term', key);
  } else if (key === 'n') {
    this.emit('request term next');
  } else if (key === 'P') {
    this.emit('request term previous');
  } else if (key === ':') {
    this.emit('request command mode');
  } else if (key === '[') {
    this.enterSelect();
  }
};

Terminal.prototype.keySelect = function(ev, key) {
  this.showCursor();

  if (this.searchMode || key === 'n' || key === 'N') {
    return this.keySearch(ev, key);
  }

  if (key === '\x04') { // ctrl-d
    var y = this.ydisp + this.y;
    if (this.ydisp === this.ybase) {
      // Mimic vim behavior
      this.y = Math.min(this.y + (this.rows - 1) / 2 | 0, this.rows - 1);
      this.refresh(0, this.rows - 1);
    } else {
      this.scrollDisp((this.rows - 1) / 2 | 0);
    }
    if (this.visualMode) {
      this.selectText(this.x, this.x, y, this.ydisp + this.y);
    }
    return;
  }

  if (key === '\x15') { // ctrl-u
    var y = this.ydisp + this.y;
    if (this.ydisp === 0) {
      // Mimic vim behavior
      this.y = Math.max(this.y - (this.rows - 1) / 2 | 0, 0);
      this.refresh(0, this.rows - 1);
    } else {
      this.scrollDisp(-(this.rows - 1) / 2 | 0);
    }
    if (this.visualMode) {
      this.selectText(this.x, this.x, y, this.ydisp + this.y);
    }
    return;
  }

  if (key === '\x06') { // ctrl-f
    var y = this.ydisp + this.y;
    this.scrollDisp(this.rows - 1);
    if (this.visualMode) {
      this.selectText(this.x, this.x, y, this.ydisp + this.y);
    }
    return;
  }

  if (key === '\x02') { // ctrl-b
    var y = this.ydisp + this.y;
    this.scrollDisp(-(this.rows - 1));
    if (this.visualMode) {
      this.selectText(this.x, this.x, y, this.ydisp + this.y);
    }
    return;
  }

  if (key === 'k' || key === '\x1b[A') {
    var y = this.ydisp + this.y;
    this.y--;
    if (this.y < 0) {
      this.y = 0;
      this.scrollDisp(-1);
    }
    if (this.visualMode) {
      this.selectText(this.x, this.x, y, this.ydisp + this.y);
    } else {
      this.refresh(this.y, this.y + 1);
    }
    return;
  }

  if (key === 'j' || key === '\x1b[B') {
    var y = this.ydisp + this.y;
    this.y++;
    if (this.y >= this.rows) {
      this.y = this.rows - 1;
      this.scrollDisp(1);
    }
    if (this.visualMode) {
      this.selectText(this.x, this.x, y, this.ydisp + this.y);
    } else {
      this.refresh(this.y - 1, this.y);
    }
    return;
  }

  if (key === 'h' || key === '\x1b[D') {
    var x = this.x;
    this.x--;
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.visualMode) {
      this.selectText(x, this.x, this.ydisp + this.y, this.ydisp + this.y);
    } else {
      this.refresh(this.y, this.y);
    }
    return;
  }

  if (key === 'l' || key === '\x1b[C') {
    var x = this.x;
    this.x++;
    if (this.x >= this.cols) {
      this.x = this.cols - 1;
    }
    if (this.visualMode) {
      this.selectText(x, this.x, this.ydisp + this.y, this.ydisp + this.y);
    } else {
      this.refresh(this.y, this.y);
    }
    return;
  }

  if (key === 'v' || key === ' ') {
    if (!this.visualMode) {
      this.enterVisual();
    } else {
      this.leaveVisual();
    }
    return;
  }

  if (key === 'y') {
    if (this.visualMode) {
      var text = this.grabText(
        this._selected.x1, this._selected.x2,
        this._selected.y1, this._selected.y2);
      this.copyText(text);
      this.leaveVisual();
      // this.leaveSelect();
    }
    return;
  }

  if (key === 'q' || key === '\x1b') {
    if (this.visualMode) {
      this.leaveVisual();
    } else {
      this.leaveSelect();
    }
    return;
  }

  if (key === 'w' || key === 'W') {
    var ox = this.x;
    var oy = this.y;
    var oyd = this.ydisp;

    var x = this.x;
    var y = this.y;
    var yb = this.ydisp;
    var saw_space = false;

    for (;;) {
      var line = this.lines[yb + y];
      while (x < this.cols) {
        if (line[x][1] <= ' ') {
          saw_space = true;
        } else if (saw_space) {
          break;
        }
        x++;
      }
      if (x >= this.cols) x = this.cols - 1;
      if (x === this.cols - 1 && line[x][1] <= ' ') {
        x = 0;
        if (++y >= this.rows) {
          y--;
          if (++yb > this.ybase) {
            yb = this.ybase;
            x = this.x;
            break;
          }
        }
        continue;
      }
      break;
    }

    this.x = x, this.y = y;
    this.scrollDisp(-this.ydisp + yb);

    if (this.visualMode) {
      this.selectText(ox, this.x, oy + oyd, this.ydisp + this.y);
    }
    return;
  }

  if (key === 'b' || key === 'B') {
    var ox = this.x;
    var oy = this.y;
    var oyd = this.ydisp;

    var x = this.x;
    var y = this.y;
    var yb = this.ydisp;

    for (;;) {
      var line = this.lines[yb + y];
      var saw_space = x > 0 && line[x][1] > ' ' && line[x - 1][1] > ' ';
      while (x >= 0) {
        if (line[x][1] <= ' ') {
          if (saw_space && (x + 1 < this.cols && line[x + 1][1] > ' ')) {
            x++;
            break;
          } else {
            saw_space = true;
          }
        }
        x--;
      }
      if (x < 0) x = 0;
      if (x === 0 && (line[x][1] <= ' ' || !saw_space)) {
        x = this.cols - 1;
        if (--y < 0) {
          y++;
          if (--yb < 0) {
            yb++;
            x = 0;
            break;
          }
        }
        continue;
      }
      break;
    }

    this.x = x, this.y = y;
    this.scrollDisp(-this.ydisp + yb);

    if (this.visualMode) {
      this.selectText(ox, this.x, oy + oyd, this.ydisp + this.y);
    }
    return;
  }

  if (key === 'e' || key === 'E') {
    var x = this.x + 1;
    var y = this.y;
    var yb = this.ydisp;
    if (x >= this.cols) x--;

    for (;;) {
      var line = this.lines[yb + y];
      while (x < this.cols) {
        if (line[x][1] <= ' ') {
          x++;
        } else {
          break;
        }
      }
      while (x < this.cols) {
        if (line[x][1] <= ' ') {
          if (x - 1 >= 0 && line[x - 1][1] > ' ') {
            x--;
            break;
          }
        }
        x++;
      }
      if (x >= this.cols) x = this.cols - 1;
      if (x === this.cols - 1 && line[x][1] <= ' ') {
        x = 0;
        if (++y >= this.rows) {
          y--;
          if (++yb > this.ybase) {
            yb = this.ybase;
            break;
          }
        }
        continue;
      }
      break;
    }

    this.x = x, this.y = y;
    this.scrollDisp(-this.ydisp + yb);

    if (this.visualMode) {
      this.selectText(ox, this.x, oy + oyd, this.ydisp + this.y);
    }
    return;
  }

  if (key === '^' || key === '0') {
    var ox = this.x;

    if (key === '0') {
      this.x = 0;
    } else if (key === '^') {
      var line = this.lines[this.ydisp + this.y];
      var x = 0;
      while (x < this.cols) {
        if (line[x][1] > ' ') {
          break;
        }
        x++;
      }
      if (x >= this.cols) x = this.cols - 1;
      this.x = x;
    }

    if (this.visualMode) {
      this.selectText(ox, this.x, this.ydisp + this.y, this.ydisp + this.y);
    } else {
      this.refresh(this.y, this.y);
    }
    return;
  }

  if (key === '$') {
    var ox = this.x;
    var line = this.lines[this.ydisp + this.y];
    var x = this.cols - 1;
    while (x >= 0) {
      if (line[x][1] > ' ') {
        if (this.visualMode && x < this.cols - 1) x++;
        break;
      }
      x--;
    }
    if (x < 0) x = 0;
    this.x = x;
    if (this.visualMode) {
      this.selectText(ox, this.x, this.ydisp + this.y, this.ydisp + this.y);
    } else {
      this.refresh(this.y, this.y);
    }
    return;
  }

  if (key === 'g' || key === 'G') {
    var ox = this.x;
    var oy = this.y;
    var oyd = this.ydisp;
    if (key === 'g') {
      this.x = 0, this.y = 0;
      this.scrollDisp(-this.ydisp);
    } else if (key === 'G') {
      this.x = 0, this.y = this.rows - 1;
      this.scrollDisp(this.ybase);
    }
    if (this.visualMode) {
      this.selectText(ox, this.x, oy + oyd, this.ydisp + this.y);
    }
    return;
  }

  if (key === 'H' || key === 'M' || key === 'L') {
    var ox = this.x;
    var oy = this.y;
    if (key === 'H') {
      this.x = 0, this.y = 0;
    } else if (key === 'M') {
      this.x = 0, this.y = this.rows / 2 | 0;
    } else if (key === 'L') {
      this.x = 0, this.y = this.rows - 1;
    }
    if (this.visualMode) {
      this.selectText(ox, this.x, this.ydisp + oy, this.ydisp + this.y);
    } else {
      this.refresh(oy, oy);
      this.refresh(this.y, this.y);
    }
    return;
  }

  if (key === '{' || key === '}') {
    var ox = this.x;
    var oy = this.y;
    var oyd = this.ydisp;

    var line;
    var saw_full = false;
    var found = false;
    var first_is_space = -1;
    var y = this.y + (key === '{' ? -1 : 1);
    var yb = this.ydisp;
    var i;

    if (key === '{') {
      if (y < 0) {
        y++;
        if (yb > 0) yb--;
      }
    } else if (key === '}') {
      if (y >= this.rows) {
        y--;
        if (yb < this.ybase) yb++;
      }
    }

    for (;;) {
      line = this.lines[yb + y];

      for (i = 0; i < this.cols; i++) {
        if (line[i][1] > ' ') {
          if (first_is_space === -1) {
            first_is_space = 0;
          }
          saw_full = true;
          break;
        } else if (i === this.cols - 1) {
          if (first_is_space === -1) {
            first_is_space = 1;
          } else if (first_is_space === 0) {
            found = true;
          } else if (first_is_space === 1) {
            if (saw_full) found = true;
          }
          break;
        }
      }

      if (found) break;

      if (key === '{') {
        y--;
        if (y < 0) {
          y++;
          if (yb > 0) yb--;
          else break;
        }
      } else if (key === '}') {
        y++;
        if (y >= this.rows) {
          y--;
          if (yb < this.ybase) yb++;
          else break;
        }
      }
    }

    if (!found) {
      if (key === '{') {
        y = 0;
        yb = 0;
      } else if (key === '}') {
        y = this.rows - 1;
        yb = this.ybase;
      }
    }

    this.x = 0, this.y = y;
    this.scrollDisp(-this.ydisp + yb);

    if (this.visualMode) {
      this.selectText(ox, this.x, oy + oyd, this.ydisp + this.y);
    }
    return;
  }

  if (key === '/' || key === '?') {
    if (!this.visualMode) {
      this.enterSearch(key === '/');
    }
    return;
  }

  return false;
};

Terminal.prototype.keySearch = function(ev, key) {
  if (key === '\x1b') {
    this.leaveSearch();
    return;
  }

  if (key === '\r' || (!this.searchMode && (key === 'n' || key === 'N'))) {
    this.leaveSearch();

    var entry = this.entry;

    if (!entry) {
      this.refresh(0, this.rows - 1);
      return;
    }

    var ox = this.x;
    var oy = this.y;
    var oyd = this.ydisp;

    var line;
    var found = false;
    var wrapped = false;
    var x = this.x + 1;
    var y = this.ydisp + this.y;
    var yb, i;
    var up = key === 'N'
      ? this.searchDown
      : !this.searchDown;

    for (;;) {
      line = this.lines[y];

      while (x < this.cols) {
        for (i = 0; i < entry.length; i++) {
          if (x + i >= this.cols) break;
          if (line[x + i][1] !== entry[i]) {
            break;
          } else if (line[x + i][1] === entry[i] && i === entry.length - 1) {
            found = true;
            break;
          }
        }
        if (found) break;
        x += i + 1;
      }
      if (found) break;

      x = 0;

      if (!up) {
        y++;
        if (y > this.ybase + this.rows - 1) {
          if (wrapped) break;
          // this.setMessage('Search wrapped. Continuing at TOP.');
          wrapped = true;
          y = 0;
        }
      } else {
        y--;
        if (y < 0) {
          if (wrapped) break;
          // this.setMessage('Search wrapped. Continuing at BOTTOM.');
          wrapped = true;
          y = this.ybase + this.rows - 1;
        }
      }
    }

    if (found) {
      if (y - this.ybase < 0) {
        yb = y;
        y = 0;
        if (yb > this.ybase) {
          y = yb - this.ybase;
          yb = this.ybase;
        }
      } else {
        yb = this.ybase;
        y -= this.ybase;
      }

      this.x = x, this.y = y;
      this.scrollDisp(-this.ydisp + yb);

      if (this.visualMode) {
        this.selectText(ox, this.x, oy + oyd, this.ydisp + this.y);
      }
      return;
    }

    // this.setMessage("No matches found.");
    this.refresh(0, this.rows - 1);

    return;
  }

  if (key === '\b' || key === '\x7f') {
    if (this.entry.length === 0) return;
    var bottom = this.ydisp + this.rows - 1;
    this.entry = this.entry.slice(0, -1);
    var i = this.entryPrefix.length + this.entry.length;
    //this.lines[bottom][i][1] = ' ';
    this.lines[bottom][i] = [
      this.lines[bottom][i][0],
      ' '
    ];
    this.x--;
    this.refresh(this.rows - 1, this.rows - 1);
    this.refresh(this.y, this.y);
    return;
  }

  if (key.length === 1 && key >= ' ' && key <= '~') {
    var bottom = this.ydisp + this.rows - 1;
    this.entry += key;
    var i = this.entryPrefix.length + this.entry.length - 1;
    //this.lines[bottom][i][0] = (this.defAttr & ~0x1ff) | 4;
    //this.lines[bottom][i][1] = key;
    this.lines[bottom][i] = [
      (this.defAttr & ~0x1ff) | 4,
      key
    ];
    this.x++;
    this.refresh(this.rows - 1, this.rows - 1);
    this.refresh(this.y, this.y);
    return;
  }

  return false;
};

/**
 * Character Sets
 */

Terminal.charsets = {};

// DEC Special Character and Line Drawing Set.
// http://vt100.net/docs/vt102-ug/table5-13.html
// A lot of curses apps use this if they see TERM=xterm.
// testing: echo -e '\e(0a\e(B'
// The xterm output sometimes seems to conflict with the
// reference above. xterm seems in line with the reference
// when running vttest however.
// The table below now uses xterm's output from vttest.
Terminal.charsets.SCLD = { // (0
  '`': '\u25c6', // '◆'
  'a': '\u2592', // '▒'
  'b': '\u0009', // '\t'
  'c': '\u000c', // '\f'
  'd': '\u000d', // '\r'
  'e': '\u000a', // '\n'
  'f': '\u00b0', // '°'
  'g': '\u00b1', // '±'
  'h': '\u2424', // '\u2424' (NL)
  'i': '\u000b', // '\v'
  'j': '\u2518', // '┘'
  'k': '\u2510', // '┐'
  'l': '\u250c', // '┌'
  'm': '\u2514', // '└'
  'n': '\u253c', // '┼'
  'o': '\u23ba', // '⎺'
  'p': '\u23bb', // '⎻'
  'q': '\u2500', // '─'
  'r': '\u23bc', // '⎼'
  's': '\u23bd', // '⎽'
  't': '\u251c', // '├'
  'u': '\u2524', // '┤'
  'v': '\u2534', // '┴'
  'w': '\u252c', // '┬'
  'x': '\u2502', // '│'
  'y': '\u2264', // '≤'
  'z': '\u2265', // '≥'
  '{': '\u03c0', // 'π'
  '|': '\u2260', // '≠'
  '}': '\u00a3', // '£'
  '~': '\u00b7'  // '·'
};

Terminal.charsets.UK = null; // (A
Terminal.charsets.US = null; // (B (USASCII)
Terminal.charsets.Dutch = null; // (4
Terminal.charsets.Finnish = null; // (C or (5
Terminal.charsets.French = null; // (R
Terminal.charsets.FrenchCanadian = null; // (Q
Terminal.charsets.German = null; // (K
Terminal.charsets.Italian = null; // (Y
Terminal.charsets.NorwegianDanish = null; // (E or (6
Terminal.charsets.Spanish = null; // (Z
Terminal.charsets.Swedish = null; // (H or (7
Terminal.charsets.Swiss = null; // (=
Terminal.charsets.ISOLatin = null; // /A

/**
 * Helpers
 */

function on(el, type, handler, capture) {
  el.addEventListener(type, handler, capture || false);
}

function off(el, type, handler, capture) {
  el.removeEventListener(type, handler, capture || false);
}

function cancel(ev) {
  if (ev.preventDefault) ev.preventDefault();
  ev.returnValue = false;
  if (ev.stopPropagation) ev.stopPropagation();
  ev.cancelBubble = true;
  return false;
}

function inherits(child, parent) {
  function f() {
    this.constructor = child;
  }
  f.prototype = parent.prototype;
  child.prototype = new f;
}

// if bold is broken, we can't
// use it in the terminal.
function isBoldBroken(document) {
  var body = document.getElementsByTagName('body')[0];
  var el = document.createElement('span');
  el.innerHTML = 'hello world';
  body.appendChild(el);
  var w1 = el.scrollWidth;
  el.style.fontWeight = 'bold';
  var w2 = el.scrollWidth;
  body.removeChild(el);
  return w1 !== w2;
}

var String = this.String;
var setTimeout = this.setTimeout;
var setInterval = this.setInterval;

function indexOf(obj, el) {
  var i = obj.length;
  while (i--) {
    if (obj[i] === el) return i;
  }
  return -1;
}

function isWide(ch) {
  if (ch <= '\uff00') return false;
  return (ch >= '\uff01' && ch <= '\uffbe')
      || (ch >= '\uffc2' && ch <= '\uffc7')
      || (ch >= '\uffca' && ch <= '\uffcf')
      || (ch >= '\uffd2' && ch <= '\uffd7')
      || (ch >= '\uffda' && ch <= '\uffdc')
      || (ch >= '\uffe0' && ch <= '\uffe6')
      || (ch >= '\uffe8' && ch <= '\uffee');
}

function matchColor(r1, g1, b1) {
  var hash = (r1 << 16) | (g1 << 8) | b1;

  if (matchColor._cache[hash] != null) {
    return matchColor._cache[hash];
  }

  var ldiff = Infinity
    , li = -1
    , i = 0
    , c
    , r2
    , g2
    , b2
    , diff;

  for (; i < Terminal.vcolors.length; i++) {
    c = Terminal.vcolors[i];
    r2 = c[0];
    g2 = c[1];
    b2 = c[2];

    diff = matchColor.distance(r1, g1, b1, r2, g2, b2);

    if (diff === 0) {
      li = i;
      break;
    }

    if (diff < ldiff) {
      ldiff = diff;
      li = i;
    }
  }

  return matchColor._cache[hash] = li;
}

matchColor._cache = {};

// http://stackoverflow.com/questions/1633828
matchColor.distance = function(r1, g1, b1, r2, g2, b2) {
  return Math.pow(30 * (r1 - r2), 2)
    + Math.pow(59 * (g1 - g2), 2)
    + Math.pow(11 * (b1 - b2), 2);
};

function each(obj, iter, con) {
  if (obj.forEach) return obj.forEach(iter, con);
  for (var i = 0; i < obj.length; i++) {
    iter.call(con, obj[i], i, obj);
  }
}

function keys(obj) {
  if (Object.keys) return Object.keys(obj);
  var key, keys = [];
  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      keys.push(key);
    }
  }
  return keys;
}

/**
 * Expose
 */

Terminal.EventEmitter = EventEmitter;
Terminal.inherits = inherits;
Terminal.on = on;
Terminal.off = off;
Terminal.cancel = cancel;

if (typeof module !== 'undefined') {
  module.exports = Terminal;
} else {
  this.Terminal = Terminal;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());

define("term", function(){});

define('experiments/controllers/TerminalController',['sockjs', 'stomp', 'term'], function($__0,$__1,$__2) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {default: $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  $__0;
  $__1;
  $__2;
  var TerminalController = function TerminalController($scope, $stateParams, $eventBus) {
    var $__3 = this;
    this.term = new Terminal({
      cols: 150,
      rows: 35,
      useStyle: true,
      screenKeys: true,
      cursorBlink: true
    });
    this.term.on('title', function(title) {
      document.title = title;
    });
    var divTerminal = document.getElementById('terminal');
    this.term.open(divTerminal);
    this.term.write('\x1b[31mWelcome to term.js!\x1b[m\r\n');
    this.term.on('data', (function(data) {
      $eventBus.publish(("/app/terminal/input/" + $stateParams.containerId), data);
    }));
    var onLogMessage = (function(log) {
      $__3.term.write(JSON.parse(log.body) + '\r\n');
    });
    var onLogError = (function(log) {
      $__3.term.write('\x1b[31m' + JSON.parse(log.body) + '\x1b[m\r\n');
    });
    var onKeyStroke = (function(log) {
      $__3.term.write(JSON.parse(log.body));
    });
    $eventBus.registerHandler('/topic/terminal/log', onLogMessage);
    $eventBus.registerHandler('/topic/terminal/error', onLogError);
    $eventBus.registerHandler(("/user/queue/terminal/input/" + $stateParams.containerId), onKeyStroke);
    $scope.$on('$destroy', (function() {
      $eventBus.unregisterHandler('/topic/terminal/log');
      $eventBus.unregisterHandler('/topic/terminal/error');
      $eventBus.unregisterHandler('/user/queue/terminal/input');
      $__3.term.destroy();
    }));
  };
  ($traceurRuntime.createClass)(TerminalController, {}, {});
  var $__default = TerminalController;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

//# sourceMappingURL=../../experiments/controllers/TerminalController.js.map;
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

//# sourceMappingURL=../../experiments/services/PrimeGenerator.js.map;
define('experiments/controllers/ExperimentController',['diary/diary', '../services/PrimeGenerator'], function($__0,$__2) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  var Diary = $__0.Diary;
  var $__3 = $__2,
      take = $__3.take,
      primes = $__3.primes;
  var ExperimentController = function ExperimentController($http, $q, $scope, EmailService, UserService, DrugRestangular) {
    var $__4 = this;
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
      for (var $__6 = take(max, primes())[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__7; !($__7 = $__6.next()).done; ) {
        var prime = $__7.value;
        {
          $scope.output += ', ' + prime;
        }
      }
    });
    $scope.currentUser = (function() {
      UserService.currentUser().then((function(user) {
        $scope.output = user;
      })).catch((function(err) {
        $__4.logger.error(err);
        $scope.output = err;
      }));
    });
    $scope.clearUser = function() {
      UserService.clear();
    };
  };
  ($traceurRuntime.createClass)(ExperimentController, {}, {});
  var $__default = ExperimentController;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

//# sourceMappingURL=../../experiments/controllers/ExperimentController.js.map;
define('experiments/controllers/ElementsController',[], function() {
  
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
  ($traceurRuntime.createClass)(ElementsController, {
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
  var $__default = ElementsController;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

//# sourceMappingURL=../../experiments/controllers/ElementsController.js.map;
define('experiments/controllers/GrowlTranslateDemoController',['diary/diary'], function($__0) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var Diary = $__0.Diary;
  var GrowlTranslateDemoController = function GrowlTranslateDemoController($scope, growl, $translate, AuthorizationService) {
    var $__2 = this;
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
        $__2.logger.info(("User has ROLE_USER role? " + isAuthz));
      }));
    });
    $scope.addSuccessMessage = (function() {
      growl.success('This adds a success message');
    });
  };
  ($traceurRuntime.createClass)(GrowlTranslateDemoController, {}, {});
  var $__default = GrowlTranslateDemoController;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

//# sourceMappingURL=../../experiments/controllers/GrowlTranslateDemoController.js.map;
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

//# sourceMappingURL=../../common/utils/util.js.map;
define('experiments/elements/myElement/MyElement',['../../../common/utils/util', 'diary/diary'], function($__0,$__2) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  var $__1 = $__0,
      loadDOMFromString = $__1.loadDOMFromString,
      loadDOMFromLink = $__1.loadDOMFromLink;
  var Diary = $__2.Diary;
  var _count = Symbol('count', true);
  var _max = Symbol('max', true);
  var MyElement = function MyElement() {
    $traceurRuntime.defaultSuperCall(this, $MyElement.prototype, arguments);
  };
  var $MyElement = MyElement;
  ($traceurRuntime.createClass)(MyElement, {
    createdCallback: function() {
      var max = arguments[0] !== (void 0) ? arguments[0] : 10;
      var startCount = arguments[1] !== (void 0) ? arguments[1] : 0;
      var $__4 = this;
      this.logger = Diary.logger('MyElement');
      this.max = this.getAttribute('max') || max;
      $traceurRuntime.setProperty(this, _count, this.getAttribute('startCount') || startCount);
      this.innerHTML = ("Using StartCount:<b>" + this[$traceurRuntime.toProperty(_count)] + "</b> and Max: <b>" + this[$traceurRuntime.toProperty(_max)] + "</b><br/>");
      this.addEventListener('click', (function(e) {
        $__4[$traceurRuntime.toProperty(_count)]++;
        $__4.logger.info(("_count: " + $__4[$traceurRuntime.toProperty(_count)]));
      }));
      this.addEventListener('dblclick', (function(e) {
        $__4.logger.info(("isMax: " + $__4.isMax));
      }));
      var root = this.createShadowRoot();
      var templatePromise = loadDOMFromLink('scripts/experiments/elements/myElement/myElementTemplate.html');
      templatePromise.then((function(importedDoc) {
        var myElementTemplate = importedDoc.querySelector('#my-element-template');
        {
          try {
            throw undefined;
          } catch (clone) {
            {
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
  }, {}, HTMLElement);
  var $__default = MyElement;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

//# sourceMappingURL=../../../experiments/elements/myElement/MyElement.js.map;
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

//# sourceMappingURL=../../../experiments/elements/customButton/CustomButton.js.map;
define('experiments/elements/myNews/MyNews',['../../../common/utils/util'], function($__0) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var $__1 = $__0,
      loadDOMFromString = $__1.loadDOMFromString,
      loadDOMFromLink = $__1.loadDOMFromLink;
  var MyNews = function MyNews() {
    $traceurRuntime.defaultSuperCall(this, $MyNews.prototype, arguments);
  };
  var $MyNews = MyNews;
  ($traceurRuntime.createClass)(MyNews, {createdCallback: function() {
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
    }}, {}, HTMLElement);
  var $__default = MyNews;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

//# sourceMappingURL=../../../experiments/elements/myNews/MyNews.js.map;
define('experiments/elements/highlighter',[], function() {
  
  
  function highlighter($animate) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.$watch(attrs.highlighter, function(nv, ov) {
          if (nv !== ov) {
            try {
              throw undefined;
            } catch (remove) {
              try {
                throw undefined;
              } catch (add) {
                {
                  add = nv > ov ? attrs.upClass : attrs.downClass;
                  remove = nv > ov ? attrs.downClass : attrs.upClass;
                  $animate.removeClass(element, remove, function() {
                    $animate.addClass(element, add);
                  });
                }
              }
            }
          }
        });
      }
    };
  }
  var $__default = highlighter;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

//# sourceMappingURL=../../experiments/elements/highlighter.js.map;
define('experiments/index',['./routes', './services/EmailService', './controllers/TodoController', './controllers/MessagingController', './controllers/TerminalController', './controllers/ExperimentController', './controllers/ElementsController', './controllers/GrowlTranslateDemoController', './elements/myElement/MyElement', './elements/customButton/CustomButton', './elements/myNews/MyNews', './elements/highlighter'], function($__0,$__2,$__4,$__6,$__8,$__10,$__12,$__14,$__16,$__18,$__20,$__22) {
  
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
  if (!$__10 || !$__10.__esModule)
    $__10 = {default: $__10};
  if (!$__12 || !$__12.__esModule)
    $__12 = {default: $__12};
  if (!$__14 || !$__14.__esModule)
    $__14 = {default: $__14};
  if (!$__16 || !$__16.__esModule)
    $__16 = {default: $__16};
  if (!$__18 || !$__18.__esModule)
    $__18 = {default: $__18};
  if (!$__20 || !$__20.__esModule)
    $__20 = {default: $__20};
  if (!$__22 || !$__22.__esModule)
    $__22 = {default: $__22};
  var routes = $__0.default;
  var EmailService = $__2.default;
  var TodoController = $__4.default;
  var MessagingController = $__6.default;
  var TerminalController = $__8.default;
  var ExperimentController = $__10.default;
  var ElementsController = $__12.default;
  var GrowlTranslateDemoController = $__14.default;
  var MyElement = $__16.default;
  var CustomButton = $__18.default;
  var MyNews = $__20.default;
  var highlighter = $__22.default;
  var moduleName = 'spaApp.experiments';
  var experimentsModule = angular.module(moduleName, []);
  experimentsModule.service('EmailService', EmailService);
  experimentsModule.directive('highlighter', highlighter);
  experimentsModule.controller('TodoController', TodoController);
  experimentsModule.controller('MessagingController', MessagingController);
  experimentsModule.controller('TerminalController', TerminalController);
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

//# sourceMappingURL=../experiments/index.js.map;
