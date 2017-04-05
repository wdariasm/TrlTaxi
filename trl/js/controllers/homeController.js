app.controller("homeController", ["$scope", "parametroService", "usuarioService", '$auth', '$rootScope', "toaster",
     function ($scope, parametroService, usuarioService, $auth, $rootScope, toaster) {
        
    $scope.Titulo = "BIENVENIDO"; 
    $scope.Login = {};
    $scope.Configuracion = {};
    
    $scope.Cargando = true;
    $scope.Mensajeh = "Espere por favor, cargando configuración ...";
     
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
            $scope.Cargando = false;
            $scope.Mensajeh = "Error al cargar configuración comuniquese con el administrador.";
            console.log('error al cargar configuracion ', errorPl.data.error);
        });
        
    };
    
    
    $scope.mostrarOcultarMenu = function(){    
        if(click===1){               
//            var div  =  document.getElementById("sidebar");
//                div.classList.remove('open');   
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
        $scope.Login =  session.getUser();   
        getUser();
    }
    
    function validarVista(){
        if($scope.Login){
            if($scope.Login.ValidarClave ==="SI"){
                location.href = "#/2/usuario/clave";                
            }else{
                var ru = ruta.get();
                if(ru === "/iniciando"){                   
                    location.href = "#/1/servicios";                     
                }else{
                   location.href = "#"+ru;  
                }
                 
            }
        }
    };
    
    $rootScope.refresToken = function (opcion){
//        $('#mdAsignar').modal({
//            backdrop: 'static',
//            keyboard: false,
//            show: true
//        });
        var promiseGet = usuarioService.refrescar(); 
        promiseGet.then(function(pl) {              
            $auth.setToken(pl.data.token);            
        },
        function(err) {
            toaster.pop("error", "Error de seguridad.", err.data);
            console.log('Error al validar session', err);
        });
    };
    
    validarUser();        
    setInterval(function(){ $rootScope.refresToken("false");},1200000);       
    
    $rootScope.globalMsj = function (tipo, titulo, mensaje){        
        toaster.pop(tipo, titulo, mensaje, 0);
    };
    
    
     //ESTABLECER TITULO PRINCIPAL
    $rootScope.SetTituloPpal = function (title){
        $scope.Titulo = title;
    };
    
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
            sessionStorage.removeItem("trlRuta");             
            $scope.mensaje = "Su sesión ha finalizado correctamente";
            toaster.pop('success','¡Información!',"Su sesión ha terminado.");
            setTimeout ('location.href = "../inicio/index.html#/login"', 2000);
        },
        function(errorPl) {
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
