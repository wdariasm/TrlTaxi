app.controller('cambiarClaveController', ['$scope', 'usuarioService', 'toaster', function($scope, usuarioService,toaster) { 
    
    $scope.User = {};    
    initUser();
    $scope.$parent.SetTitulo("CAMBIAR CONTRASEÑA");
    function initUser(){
        $scope.User = {
            IdUsuario : $scope.$parent.Login.IdUsuario, 
            Nombre : $scope.$parent.Login.Nombre,
            Login : $scope.$parent.Login.Login,
            Clave : "", 
            claveConf : ""
        };
    } 
    
    $scope.cancelar = function (){        
        initUser();
    };
    
    $scope.guardarPass = function (){
        $scope.valPass = false;
        
        if(!$scope.User.IdUsuario){
            toaster.pop('info', "¡Alerta!", "Seleccione un usuario para realizar este procedimiento.");
            return;
        }
                
        if ($scope.User.Clave !== $scope.User.claveConf){
            $scope.valPass = true;
             toaster.pop('info', "¡Alerta!", "Contraseñas no coinciden.. verifique");
            return;
        }
                            
        var object = { 
            Id : $scope.User.IdUsuario,
            Clave:$scope.User.Clave            
        };
        
        var promise = usuarioService.udpatePass(object);       
        promise.then(function(d) {            
            if (d.data.message === "Correcto"){
                toaster.pop('success', "¡Información!", d.data.request + "\
                 en segundos sera redireccionado al inicio de sesion, para que ingrese con sus nuevos datos.",0);  
                 sessionStorage.setItem("usuario","");
                sessionStorage.removeItem("usuario");                 
                setTimeout ('location.href = "../inicio/index.html#/login"', 5000);
            }else{
                toaster.pop('error', "¡Error!", d.data.request);
            }
            
        }, function(err) {           
                 toaster.pop('error', "¡Error!", err.request,0);         
                console.log("Some Error Occured " + JSON.stringify(err));
        });     
        
    };

}]);
