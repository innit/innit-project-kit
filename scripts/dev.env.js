define(['./common/services/AuthenticationService', './drug/services/DrugService', './provider/services/ProviderService'], function($__0,$__1,$__2) {
  
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  var AUTH_CONFIG = $traceurRuntime.assertObject($__0).AUTH_CONFIG;
  var DRUG_SEARCH_CONFIG = $traceurRuntime.assertObject($__1).DRUG_SEARCH_CONFIG;
  var PROVIDER_SEARCH_CONFIG = $traceurRuntime.assertObject($__2).PROVIDER_SEARCH_CONFIG;
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
  }));
  var $__default = moduleName;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});
