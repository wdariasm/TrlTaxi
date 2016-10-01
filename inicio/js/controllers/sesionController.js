app.controller('sesionController', ['$scope' , 'sesionService', 'toaster','$auth', function ($scope, sesionService, toaster, $auth) {
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
            email: $scope.Usuario.Login,
            password: $scope.Usuario.Clave
        };
       var promise = sesionService.login(object);
        promise.then(function(d) {            
            if(d.data.error){
                toaster.pop('error','¡Error!', d.data.error);
                return;
            }
            var user = $auth.getPayload().user;            
            sessionStorage.setItem("usuario","");
            sessionStorage.setItem("usuario",btoa( JSON.stringify(user)));  
            
            if(user.TipoAcceso == "1" || user.TipoAcceso == "2"){
                location.href = "../trl/index.html";                        
            }else if (user.TipoAcceso == "3"){
                location.href = "../conductor/index.html";                        
            }else if (user.TipoAcceso == "4" || user.TipoAcceso == "5"){
                location.href = "../cliente/index.html";                                                                      
            }else{
                toaster.pop('error', '¡Error!', "Tipo de acceso no permitido");                        
            }               
                            
        }, function(err) {
               toaster.pop('error', '¡Error al autenticar!', err.data.error);
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    };

}]);
