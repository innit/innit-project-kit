define([], function() {
  
  var Immutable = function Immutable() {};
  ($traceurRuntime.createClass)(Immutable, {}, {proxify: function(obj) {
      if (!(obj instanceof Object)) {
        throw new Error('no @immutable annotation on constructor');
      }
      return new Proxy(obj, {constructor: (function(target, args) {
          console.log('in Immutable constructor');
          return Reflect.constructor(target, args);
        })});
    }});
  return {
    get Immutable() {
      return Immutable;
    },
    __esModule: true
  };
});
