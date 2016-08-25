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
                
                if(sesion.TipoAcceso == "1" || sesion.TipoAcceso == "2"){
                    location.href = "../trl/index.html";                        
                }else if (sesion.TipoAcceso == "3"){
                    location.href = "../conductor/index.html";                        
                }else if (sesion.TipoAcceso == "4" || sesion.TipoAcceso == "5"){
                    location.href = "../cliente/index.html";                                                                      
                }else{
                    toaster.pop('error', '¡Error!', "Tipo de acceso no permitido");                        
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
