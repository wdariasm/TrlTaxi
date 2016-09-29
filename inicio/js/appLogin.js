var uri = "../public";
var app;
(function(){
    app = angular.module("trlLogin", ['ngRoute','ng-currency', 'toaster', 'satellizer']);    
    
    app.config(['$routeProvider', '$locationProvider', '$authProvider', function AppConfig($routeProvider, $locationProvider, $authProvider){           
        
        //$authProvider.loginUrl =  '/public/api/usuario/autenticar';        
        $authProvider.loginUrl =  '/TrlTaxi/public/api/usuario/autenticar';        
        $authProvider.tokenName = "token";
        $authProvider.tokenPrefix = "trl";
        $authProvider.storageType = 'sessionStorage';   
                        
        $routeProvider 
            .when("/login",{
                templateUrl: 'views/inicio/login.html'
            })
          
            .when("/recuperar",{
                templateUrl: 'views/inicio/recuperar.html'
            })
            
            .when('/confirmar/:idCliente/:haskey', {
                templateUrl: 'views/inicio/confirmar.html'                
            }) 
            
            .when('/cambiarClave/:id/:idUser/:haskey', {
                templateUrl: 'views/inicio/cambiarClave.html'                
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
