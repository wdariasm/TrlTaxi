app.controller("homeController",  ["$scope", "parametroService", "usuarioService", '$auth', '$rootScope', "toaster",
    function ($scope,parametroService,usuarioService, $auth , $rootScope, toaster) {
        
    $scope.Titulo = "BIENVENIDOS"; 
    $scope.Login = {};
    $scope.Configuracion = {};
        
    var click = 1;    
    
    function getUser (){
        var promiseGet = usuarioService.get($scope.Login.IdUsuario); 
        promiseGet.then(function(pl) {            
            $scope.Login = pl.data;    
            sessionStorage.setItem("usuario","");
            sessionStorage.setItem("usuario",btoa( JSON.stringify(pl.data)));             
            $scope.getConfiguracion();
        },
        function(errorPl) {
            console.log('error al cargar datos del usuario', errorPl);
        });
    }
    
     $scope.getConfiguracion= function (){
        var promiseGet = parametroService.getAll(); 
        promiseGet.then(function(pl) {            
            $scope.Configuracion = pl.data;            
            config.setConfig(btoa(JSON.stringify(pl.data)));
            validarVista();
        },
        function(errorPl) {
            console.log('failure loading usuarios', errorPl);
        });
    };
        
        
    $scope.mostrarOcultarMenu = function(){    
        if(click===1){               
            document.getElementById("cont-menu").className = "menuLeft";
            var div1  =  document.getElementById("contenido");
            div1.classList.remove('contenido-normal');   
            div1.classList.add('contenido-expandido');                
            click += 1;
        } else{                       
            var div1  =  document.getElementById("contenido");
            div1.classList.remove('contenido-expandido');   
            div1.classList.add('contenido-normal');

            document.getElementById("cont-menu").className = "menuRight";            
            click = 1;
        }
    };
    
    //ESTABLECER TITULO PRINCIPAL
    $scope.SetTitulo = function (title){
        $scope.Titulo = title;
    };
    
    function validarUser (){        
        $scope.Login = session.getUser(); 
        getUser();
    }
    
    function validarVista(){
        if($scope.Login){
            if($scope.Login.ValidarClave ==="SI"){
                location.href = "#/2/usuario/clave";                
            }else{
                var ru = ruta.get();                
                if(ru === "/iniciando"){                   
                    location.href = "#/0/servicio";
                }else{
                    var n = ru.indexOf("servicio");                    
                    if( n > 0){
                        location.href = "#/0/servicio";                       
                    }else {
                        location.href = "#"+ru;  
                    }                                       
                }                 
            }
        }
    };
    
    
    $rootScope.refresToken = function (opcion){
        var promiseGet = usuarioService.refrescar(); 
        promiseGet.then(function(pl) {              
            $auth.setToken(pl.data.token);            
        },
        function(errorPl) {            
            console.log('Error al validar session', errorPl);
        });
    };
    
    validarUser();        
    setInterval(function(){ $rootScope.refresToken();},1200000);
    
    $rootScope.globalMsj = function (tipo, titulo, mensaje){        
        toaster.pop(tipo, titulo, mensaje, 0);
    };
    
    function setVentana(){
        var mediaquery = window.matchMedia("(max-width: 600px)");
        if (mediaquery.matches) {
            $scope.mostrarOcultarMenu();
        }
    }
        setVentana();
    
}]);

app.controller('salirController',['$scope', 'usuarioService', 'toaster', function ($scope, usuarioService, toaster) {
        
    $scope.$parent.SetTitulo("CERRANDO SESIÓN");
    $scope.mensaje = "Cerrando sesión ....";
    function cerrarSession (){
        var promise = usuarioService.cerrarSesion($scope.$parent.Login.IdUsuario); 
        promise.then(function(pl) {                       
            sessionStorage.setItem("usuario","");
            sessionStorage.removeItem("usuario"); 
            sessionStorage.removeItem("trl_token"); 
            sessionStorage.removeItem("trlconfig"); 
            $scope.mensaje = "Su sesión ha finalizado correctamente";
            toaster.pop('success','¡Información!',"Su sesión ha terminado.");
            setTimeout ('location.href = "../inicio/index.html#/login"', 3000);                       
        },
        function(errorPl) {
            if(errorPl.status == 401){
                 setTimeout ('location.href = "../inicio/index.html#/login"', 3000);
            }
            toaster.pop('error','¡Error!',errorPl.data.request);
            console.log('failure loading usuarios', errorPl);
        });        
    }   
    
    cerrarSession();
   
}]);

function refrescar(){
    var elem = angular.element(document.querySelector('[ng-app]'));
    var injector = elem.injector();
    var rootScope = injector.get('$rootScope');          
    rootScope.$apply(function(){        
        setTimeout(function () { rootScope.refresToken("true");}, 7000);            
    });
}
