app.controller("homeController", ["$scope", function ($scope) {
        
    $scope.Titulo = "BIENVENIDOS"; 
    $scope.Login = {};
        
    var click = 1;    
        
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
        $scope.Login = session.getUser();                               
    }
    
    validarUser();        
}]);

app.controller('salirController',['$scope', 'usuarioService', 'toaster', function ($scope, usuarioService, toaster) {
        
    $scope.$parent.SetTitulo("CERRANDO SESIÓN");
    $scope.mensaje = "Cerrando sesión ....";
    function cerrarSession (){
        var promise = usuarioService.cerrarSesion($scope.$parent.Login.IdUsuario); 
        promise.then(function(pl) {                       
            sessionStorage.setItem("usuario","");
            sessionStorage.removeItem("usuario"); 
            $scope.mensaje = "Su sesión ha finalizado correctamente";
            toaster.pop('success','¡Información!',"Su sesión ha terminado.");
            setTimeout ('location.href = "../inicio/index.html#/login"', 3000);                       
        },
        function(errorPl) {
            toaster.pop('error','¡Error!',errorPl.data.request);
            console.log('failure loading usuarios', errorPl);
        });        
    }   
    
    cerrarSession();
   
}]);

