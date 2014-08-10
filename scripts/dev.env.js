define(['./common/services/AuthenticationService', './drug/services/DrugService', './provider/services/ProviderService', './common/services/EventBus'], function($__0,$__2,$__4,$__6) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {'default': $__4};
  if (!$__6 || !$__6.__esModule)
    $__6 = {'default': $__6};
  var AUTH_CONFIG = $__0.AUTH_CONFIG;
  var DRUG_SEARCH_CONFIG = $__2.DRUG_SEARCH_CONFIG;
  var PROVIDER_SEARCH_CONFIG = $__4.PROVIDER_SEARCH_CONFIG;
  var EBUS_CONFIG = $__6.EBUS_CONFIG;
  var moduleName = 'spaApp.dev.env';
  var devEnvModule = angular.module(moduleName, []);
  devEnvModule.config((function() {
    
    console.log('in devEnvModule... ');
    AUTH_CONFIG.BASE_URL = 'http://localhost:8080/apiApp';
    AUTH_CONFIG.LOGIN_URL = AUTH_CONFIG.BASE_URL + '/j_spring_security_check';
    AUTH_CONFIG.LOGOUT_URL = AUTH_CONFIG.BASE_URL + '/logout';
    AUTH_CONFIG.PROFILE_URL = AUTH_CONFIG.BASE_URL + '/login/currentUser';
    DRUG_SEARCH_CONFIG.BASE_API_URL = 'http://localhost:8080/apiApp';
    PROVIDER_SEARCH_CONFIG.BASE_API_URL = 'http://ve7d00000179:8080/REST_HBS_Canonical_Resiliency/service';
    EBUS_CONFIG.BASE_URL = 'http://localhost:8080/apiApp/stomp';
  }));
  var $__default = moduleName;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});
