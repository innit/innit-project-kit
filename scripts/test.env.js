define(['angular-mocks', 'text!../../test/fixtures/drugs_1.json', 'text!../../test/fixtures/drugs_2.json', 'text!../../test/fixtures/drug_1.json', 'text!../../test/fixtures/drug_2.json', 'text!../../test/fixtures/drug_3.json', 'text!../../test/fixtures/providers_11.json', 'text!../../test/fixtures/providers_12.json', 'text!../../test/fixtures/providers_2.json', 'text!../../test/fixtures/specialties_A.json', 'text!../../test/fixtures/specialties_B.json', 'text!../../test/fixtures/specialties_C.json', 'text!../../test/fixtures/specialties_D.json', 'text!../../test/fixtures/specialties_E.json', 'text!../../test/fixtures/specialties_F.json', 'text!../../test/fixtures/specialties_S.json', 'text!../../test/fixtures/sumo_profile.json', 'text!../../test/fixtures/businessadmin_profile.json', 'text!../../test/fixtures/itadmin_profile.json', 'text!../../test/fixtures/dataadmin_profile.json'], function($__0,$__1,$__2,$__3,$__4,$__5,$__6,$__7,$__8,$__9,$__10,$__11,$__12,$__13,$__14,$__15,$__16,$__17,$__18,$__19) {
  
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
  if (!$__11 || !$__11.__esModule)
    $__11 = {'default': $__11};
  if (!$__12 || !$__12.__esModule)
    $__12 = {'default': $__12};
  if (!$__13 || !$__13.__esModule)
    $__13 = {'default': $__13};
  if (!$__14 || !$__14.__esModule)
    $__14 = {'default': $__14};
  if (!$__15 || !$__15.__esModule)
    $__15 = {'default': $__15};
  if (!$__16 || !$__16.__esModule)
    $__16 = {'default': $__16};
  if (!$__17 || !$__17.__esModule)
    $__17 = {'default': $__17};
  if (!$__18 || !$__18.__esModule)
    $__18 = {'default': $__18};
  if (!$__19 || !$__19.__esModule)
    $__19 = {'default': $__19};
  $__0;
  $__1;
  $__2;
  $__3;
  $__4;
  $__5;
  $__6;
  $__7;
  $__8;
  $__9;
  $__10;
  $__11;
  $__12;
  $__13;
  $__14;
  $__15;
  $__16;
  $__17;
  $__18;
  $__19;
  var moduleName = 'spaApp.test.env';
  var testEnvModule = angular.module(moduleName, ['ngMockE2E']);
  testEnvModule.run((function($httpBackend) {
    
    console.log('in testEnvModule... ');
    $httpBackend.whenPOST(/\http:\/\/ve7d00000010:8080\/apiApp\/j_spring_security_check/).respond((function(method, url, data, headers) {
      console.log('Received data', method, url, data, headers);
      if (data.contains('j_username=sumo&j_password=demo')) {
        window.username = 'sumo';
        return [200, {
          success: true,
          username: 'sumo'
        }];
      } else if (data.contains('j_username=businessadmin&j_password=businessadmin')) {
        window.username = 'businessadmin';
        return [200, {
          success: true,
          username: 'businessadmin'
        }];
      } else if (data.contains('j_username=itadmin&j_password=itadmin')) {
        window.username = 'itadmin';
        return [200, {
          success: true,
          username: 'itadmin'
        }];
      } else if (data.contains('j_username=dataadmin&j_password=dataadmin')) {
        window.username = 'dataadmin';
        return [200, {
          success: true,
          username: 'dataadmin'
        }];
      } else {
        return [200, {error: 'Sorry, we were not able to find a user with that username and password.'}];
      }
    }));
    $httpBackend.whenGET(/\http:\/\/ve7d00000010:8080\/apiApp\/login\/currentUser/).respond((function(method, url) {
      console.log('Received URL', url);
      console.log('window.username', window.username);
      if (window.username === 'sumo') {
        return [200, require('text!../../test/fixtures/sumo_profile.json')];
      } else if (window.username === 'businessadmin') {
        return [200, require('text!../../test/fixtures/businessadmin_profile.json')];
      } else if (window.username === 'itadmin') {
        return [200, require('text!../../test/fixtures/itadmin_profile.json')];
      } else if (window.username === 'dataadmin') {
        return [200, require('text!../../test/fixtures/dataadmin_profile.json')];
      } else {
        return [200, {error: 'Sorry, we were not able to find a user with that username and password.'}];
      }
    }));
    $httpBackend.whenPOST(/\http:\/\/ve7d00000010:8080\/apiApp\/logout/).respond((function() {
      window.username = undefined;
      return [200, {}];
    }));
    $httpBackend.whenGET(/\http:\/\/ve7d00000010:8080\/apiApp\/drugs\?fields*/).respond((function(method, url) {
      console.log('url', url);
      if (!window.username) {
        return [401, {message: 'authentication required'}];
      }
      if (url.contains('offset=0')) {
        return [200, require('text!../../test/fixtures/drugs_1.json')];
      } else if (url.contains('offset=100')) {
        return [200, require('text!../../test/fixtures/drugs_2.json')];
      } else {
        return [200, require('text!../../test/fixtures/drugs_1.json')];
      }
    }));
    $httpBackend.whenGET(/\http:\/\/ve7d00000010:8080\/apiApp\/drugs\/[1-9]*/).respond((function(method, url) {
      console.log('url', url);
      if (url.contains('drugs/1')) {
        return [200, require('text!../../test/fixtures/drug_1.json')];
      } else if (url.contains('drugs/2')) {
        return [200, require('text!../../test/fixtures/drug_2.json')];
      } else if (url.contains('drugs/3')) {
        return [200, require('text!../../test/fixtures/drug_3.json')];
      } else {
        return [200, require('text!../../test/fixtures/drug_1.json')];
      }
    }));
    $httpBackend.whenGET(/http:\/\/ve7d00000179:8080\/REST_HBS_Canonical_Resiliency\/service\/providers\?distance*/).respond((function(method, url) {
      console.log('url', url);
      if (url.contains('offset=0')) {
        return [200, require('text!../../test/fixtures/providers_11.json')];
      } else if (url.contains('offset=100')) {
        return [200, require('text!../../test/fixtures/providers_12.json')];
      } else {
        return [200, require('text!../../test/fixtures/providers_2.json')];
      }
    }));
    $httpBackend.whenGET(/http:\/\/ve7d00000179:8080\/REST_HBS_Canonical_Resiliency\/service\/providers\/specialties\?prefix*/).respond((function(method, url) {
      console.log('url', url);
      if (url.contains('prefix=A')) {
        return [200, require('text!../../test/fixtures/specialties_A.json')];
      } else if (url.contains('prefix=B')) {
        return [200, require('text!../../test/fixtures/specialties_B.json')];
      } else if (url.contains('prefix=C')) {
        return [200, require('text!../../test/fixtures/specialties_C.json')];
      } else if (url.contains('prefix=D')) {
        return [200, require('text!../../test/fixtures/specialties_D.json')];
      } else if (url.contains('prefix=E')) {
        return [200, require('text!../../test/fixtures/specialties_E.json')];
      } else if (url.contains('prefix=F')) {
        return [200, require('text!../../test/fixtures/specialties_F.json')];
      } else {
        return [200, require('text!../../test/fixtures/specialties_S.json')];
      }
    }));
    $httpBackend.whenGET(/views\/\w+.*/).passThrough();
    $httpBackend.whenJSONP('http://www.telize.com/geoip?callback=JSON_CALLBACK').passThrough();
    $httpBackend.whenGET(/^\w+.*/).passThrough();
    $httpBackend.whenPOST(/^\w+.*/).passThrough();
  }));
  var $__default = moduleName;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});
