var uri = "../public";
var app;
(function(){
    app = angular.module("trlTransporte", ['ngRoute','ng-currency','ngTable','toaster', 'ngAnimate', 'checklist-model',
    'fcsa-number', 'satellizer']);
    
    app.config(['$routeProvider', '$locationProvider', '$authProvider','$httpProvider' ,function AppConfig($routeProvider, $locationProvider, $authProvider, $httpProvider){                        

        $authProvider.loginUrl =  '/TrlTaxi/public/api/usuario/autenticar';        
        $authProvider.tokenName = "token";
        $authProvider.tokenPrefix = "trl";
        $authProvider.storageType = 'sessionStorage'; 

        $routeProvider 
            .when("/0/configuracion",{
                templateUrl: 'views/configuracion/config.html'
            })
            
            .when("/0/vehiculo",{
                templateUrl: 'views/configuracion/vehiculo.html'
            })
            
            .when("/0/marca",{
                templateUrl: 'views/configuracion/marca.html'
            })

            .when("/0/tipoVehiculo",{
                templateUrl: 'views/configuracion/tipoVehiculo.html'
            })
            
            .when("/0/servicio",{
                templateUrl: 'views/configuracion/servicio.html'
            })
            
            
            .when("/0/conductor",{
                templateUrl: 'views/configuracion/conductor.html'
            })
            
            .when("/0/novedad",{
                templateUrl: 'views/configuracion/novedad.html'
            })
            
             .when("/0/escolaridad",{
                templateUrl: 'views/configuracion/escolaridad.html'
            })
            
            
            .when("/0/tipoDocumento",{
                templateUrl: 'views/configuracion/tipoDocumento.html'
            })


            .when("/0/persona",{
                templateUrl: 'views/configuracion/persona.html'
            })
            
            
             .when("/0/cliente",{
                templateUrl: 'views/configuracion/cliente.html'
            })
            
             .when("/0/usuario",{
                templateUrl: 'views/configuracion/usuario.html'
            })
            
             .when("/0/disponibilidad",{
                templateUrl: 'views/configuracion/disponibilidad.html'
            })
            
            .when("/0/zona",{
                templateUrl: 'views/configuracion/zona.html'
            })
            
            .when("/:tipo/transfert",{
                templateUrl: 'views/configuracion/transfert.html'
            })
            
            .when("/:tipo/traslado/",{
                templateUrl: 'views/configuracion/traslado.html'
            })
            
            .when("/:tipo/ruta",{
                templateUrl: 'views/configuracion/ruta.html'
            })     
            
            .when("/0/banco",{
                templateUrl: 'views/configuracion/banco.html'
            }) 
            
            .when("/0/encuesta",{
                templateUrl: 'views/configuracion/encuesta.html'
            })
            
            .when("/0/cancelacion",{
                templateUrl: 'views/configuracion/motivo.html'
            })
            
                       
            .when("/1/servicios",{
                templateUrl: 'views/contratos/solicitarServicio.html'
            })
            
            .when("/1/contratos",{
                templateUrl: 'views/contratos/contrato.html'
            })
            
            .when("/2/mantenimiento",{
                templateUrl: 'views/proceso/mantenimiento.html'
            })
            
            .when("/0/parametro",{
                templateUrl: 'views/configuracion/parametro.html'
            })
            
            .when("/2/salir",{
                templateUrl: 'views/proceso/salir.html'
            })
            
            .when("/iniciando",{
                templateUrl: 'views/proceso/inicio.html'                        
            })
            
            .when("/2/usuario/clave",{
                templateUrl: 'views/proceso/cambiarClave.html'                        
            })
            
            .otherwise({
                redirectTo:"/iniciando"               
            });        
            
            $httpProvider.interceptors.push('authInterceptor');
                          
    }]);
    
    
    //if (window.location.hash === '#_=_') window.location.hash = '!'; 
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
          }
        };
    });

    
    
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

