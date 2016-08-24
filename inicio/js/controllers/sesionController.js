app.controller('sesionController', ['$scope' , 'sesionService', 'toaster', function ($scope, sesionService, toaster) {
    $scope.Usuario = {};
    $scope.msjError = "";

    $scope.recodarClave = function() {
        var promise = sesionService.postEmail($scope.Usuario.Login);
        promise.then(function(d) {
            Materialize.toast(d.data.message+'..!!', 4000, 'rounded');
        }, function(err) {
                toaster.pop('error', '¡Error!', 'Error al procesar solicitud.');
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    };
    
    $scope.Iniciar = function (){
        
        toaster.pop('wait', '¡Espere..!', 'Procesando información .....');
        
        if (!$scope.Usuario.Login){
             toaster.pop('info', '¡Control de Información', 'Ingrese el usuario');            
            return;
        }
        
        if (!$scope.Usuario.Clave){            
            toaster.pop('info', '¡Control de Información', 'Ingrese la contraseña');
            return;
        }        
        
        var object = {
            username: $scope.Usuario.Login,
            clave: $scope.Usuario.Clave
        };
       var promise = sesionService.login(object);
        promise.then(function(d) {
            if (d.data.message === "Correcto") {
                sessionStorage.setItem("usuario","");
                
                sessionStorage.setItem("usuario",btoa(d.data.request));  
                var sesion = JSON.parse(d.data.request);                
                switch (sesion.TipoAcceso) {                     
                    case 1:                            
                        location.href = "../trl/index.html";
                        break;
                    case 3:
                        location.href = "../conductor/index.html";
                        break;
                    case 4:
                        location.href = "../cliente/index.html";
                        break;                                                
                    default:                            
                        toaster.pop('error', '¡Error!', "Tipo de acceso no permitido");
                        break;
                }               
                
            } else{
                sessionStorage.clear();
                toaster.pop('error', '¡Error!', d.data.request);
            }
        }, function(err) {
               toaster.pop('error', '¡Error!', err.data.request);
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    };

}]);
