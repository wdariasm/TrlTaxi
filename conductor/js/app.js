var uri = "../public";
var app;
(function(){
    app = angular.module("trlConductor", ['ngRoute','ng-currency','ngTable','toaster', 'ngAnimate', 'checklist-model',
    'dynamicNumber', 'satellizer' ]);
    
    app.config(['$routeProvider', '$locationProvider', '$authProvider','$httpProvider', function AppConfig($routeProvider, $locationProvider, $authProvider, $httpProvider){                        
         
        $authProvider.tokenName = "token";
        $authProvider.tokenPrefix = "trl";
        $authProvider.storageType = 'sessionStorage';
            
        $routeProvider                                                
                                 
            .when("/1/servicio",{
                templateUrl: 'views/servicio/servicio.html'
            })                       
            
            .when("/1/historial",{
                templateUrl: 'views/servicio/historial.html'
            })
            
            .when("/1/cartera",{
                templateUrl: 'views/servicio/cartera.html'
            }) 
            
            .when("/1/reporte",{
                templateUrl: 'views/servicio/reporte.html'
            }) 
            
            .when("/2/usuario/clave",{
                templateUrl: 'views/conductor/cambiarClave.html'
            })
            
            .when("/2/conductor/perfil",{
                templateUrl: 'views/conductor/perfil.html'
            })
                                   
            .when("/2/salir",{
                templateUrl: 'views/conductor/salir.html'
            })
            
            .when("/iniciando",{
                templateUrl: 'views/conductor/inicio.html'                        
            })
            
            .otherwise({
                redirectTo:"/iniciando"               
            });
            
            $httpProvider.interceptors.push('authInterceptor');
                          
    }]);

    app.factory('authInterceptor', function ($rootScope, $q, $window, $location) {
        return {
          request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.trl_token) {
              config.headers.Authorization = 'Bearer ' + $window.sessionStorage.trl_token;
            }
            return config;
          },
            response: function (response) {
              if (response.status === 401  || response.status === 403) {
                  $location.path('../inicio/index.html#/login');
              }
              return response || $q.when(response);
            },
            
            responseError: function(rejection) {
                var errorl = rejection.data.error;
                if(!errorl){
                    errorl =rejection.data;
                }
                sessionStorage.setItem("trlError", btoa(errorl));

                if(rejection.status == 401){               
                    setTimeout( function () {$rootScope.globalMsj("error", "Error de Sesión", "Su sesión ha caducado por inactividad " +
                        " Por seguridad debe iniciar nuevamente sesión.", 0);},10);            
                    setTimeout(function (){ location.href = "../inicio/index.html#/login"; }, 8000);

                }
                return $q.reject(rejection);
            }
        };
    });
    
    app.run(['$rootScope','$location', '$routeParams', function($rootScope, $location, $routeParams) {
        $rootScope.$on('$routeChangeSuccess', function(e, current, pre) { 
            sessionStorage.setItem("trlRuta", btoa($location.path()));        
        });
    }]);
        
    app.directive('ngEnter', function () {
        return function (scope, elements, attrs) {
            elements.bind('keydown keypress', function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    });
    
    app.directive('soloLetras', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^a-zA-Z]/g, '');

                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }            
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    });
    
    app.directive('letrasNumeros', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^0-9a-zA-Z\s]/g, '');
                        //var transformedInput = text.replace(/^([A-Za-z0-9 _])*$/g, '');
                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }            
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    });
    
    app.directive('soloNumeros', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^0-9]/g, '');

                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }            
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    });
    
    app.filter('ifEmpty', function() {
        return function(input, defaultValue) {
            if (angular.isUndefined(input) || input === null || input === '') {
                return defaultValue;
            }

            return input;
        };
    });
    
    app.filter('sumByKey', function () {
        return function (data, key) {
            if (typeof (data) === 'undefined' || typeof (key) === 'undefined') {
                return 0;
            }

            var sum = 0;
            for (var i = data.length - 1; i >= 0; i--) {
                sum += parseInt(data[i][key]);
            }

            return sum;
        };
    });
    
    app.directive('uploaderModel',['$parse',function($parse){
        return{
            restrict: 'A',
            link: function(scope,iElement,iAttrs){
                iElement.on('change',function(e)
                {
                    $parse(iAttrs.uploaderModel).assign(scope,iElement[0].files[0]);
                });
            }
        };

    }]);
    
    app.config(['$provide', function($provide) {
        $provide.decorator('$locale', ['$delegate', function($delegate) {
          if($delegate.id == 'en-us') {
            $delegate.NUMBER_FORMATS.PATTERNS[1].negPre = '-\u00A4';
            $delegate.NUMBER_FORMATS.PATTERNS[1].negSuf = '';
          }
          return $delegate;
        }]);
     }]);   
 
      app.filter('rango', function() {
        return function(input, total) {
          total = parseInt(total);
            for (var i=1; i<=total; i++) {
                input.push(i);
            }
         return input;
        };
    });

})();

