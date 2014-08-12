define(['sockjs', 'stomp', '../utils/Enum', '../../resiliency/Retry'], function($__0,$__1,$__2,$__4) {
  "use strict";
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
      for (var $__8 = this[$traceurRuntime.toProperty(handlers)][$traceurRuntime.toProperty(Symbol.iterator)](),
          $__9; !($__9 = $__8.next()).done; ) {
        try {
          throw undefined;
        } catch (callback) {
          try {
            throw undefined;
          } catch (address) {
            try {
              throw undefined;
            } catch ($__10) {
              {
                {
                  $__10 = $traceurRuntime.assertObject($__9.value);
                  address = $__10[0];
                  callback = $__10[1];
                }
                {
                  this[$traceurRuntime.toProperty(subscriptions)].set(address, this.stompClient.subscribe(address, callback));
                }
              }
            }
          }
        }
      }
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
