var uri = "../public";
var app;
(function(){
    app = angular.module("trlLogin", ['ngRoute','ng-currency', 'toaster']);    
    
    app.config(['$routeProvider', '$locationProvider', function AppConfig($routeProvider, $locationProvider){           
        $routeProvider 
            .when("/login",{
                templateUrl: 'views/inicio/login.html'
            })
          
            .when("/recordar",{
                templateUrl: 'views/inicio/recordarPass.html'
            })
            
            .when('/confirmar/:idCliente/:haskey', {
                templateUrl: 'views/inicio/confirmar.html'                
            }) 
            
            .when('/cambiarClave/:id/:idCliente/:haskey', {
                templateUrl: 'views/cliente/cambiarClave.html'                
            }) 
            
            .otherwise({
                redirectTo:"/login"
            });                          
    }]);

    
    //if (window.location.hash === '#_=_') window.location.hash = '!'; 
    
    app.directive('ngEnter', function () {
        return function (scope, elements, attrs) {
            elements.bind('keypress', function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    });
              
})();
