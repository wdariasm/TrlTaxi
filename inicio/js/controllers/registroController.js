app.controller('ConfirmarController', function ($scope, $routeParams, sesionService) {
    $scope.idCliente = $routeParams.idCliente;
    $scope.haskey = $routeParams.haskey;
    $scope.msjError = "Procesando información,  Espere.....";
    $scope.msjIcono = "fa-spinner  fa-pulse";
    function verificarUser(){
        var promiseGet = sesionService.confirmar($scope.idCliente,$scope.haskey);
        promiseGet.then(function (d) {
            if (d.data.message =="Correcto"){
                $scope.msjIcono = "fa-check";
                $scope.msjError = d.data.request;
                setTimeout( "location.href = '#/inicio/login'", 5000);
                $scope.msjError +=" .. En segundos sera redireccionado..";
                
            } else {
                $scope.msjError = d.data.request;
                $scope.msjIcono = "fa-frown-o";
            }

        }, function (err) {
                $scope.msjError = 'Error al procesar solicitud';
                console.log("Some Error Occured "+ JSON.stringify(err));
        });
    }
    verificarUser();
});

app.controller('recordarClaveController', ['$scope', 'sesionService', 'toaster',  function ($scope, sesionService, toaster) {

    $scope.Usuario = {};
    $scope.Cargando = false;
    $scope.msjError = "";
    
    function init(){
        $scope.Usuario = {
            email : ""
        };
    }
    
    init();

    $scope.Recuperar= function (){
        $scope.msjError = "Espere por favor.... ";   
        $scope.Cargando = true;
        var object = {
            email : $scope.Usuario.email.toUpperCase()
        };
        var promisePost = sesionService.recordar(object);
        promisePost.then(function (d) {
            $scope.Cargando =false;
            toaster.pop('success','TRL', d.data.request);
            $scope.msjError = d.data.request;
        }, function (err) {
            toaster.pop('error', '¡Error!', err.data.request);
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };

}]);

app.controller('cambiarClaveController', ['$scope', '$routeParams', 'sesionService', 'toaster', function ($scope, $routeParams, sesionService,toaster) {

    $scope.id = $routeParams.id;
    $scope.IdUser = $routeParams.idUser;
    $scope.haskey = $routeParams.haskey;
    $scope.msjError = "   ..";
    $scope.msjKey = "Espere.. Verificando Información....";
    $scope.Cargando = false;
    $scope.editMode = false;
    
    $scope.User  = {};
    
    function verificarKey(){
        $scope.Cargando =true;
        var promiseGet = sesionService.verificarKey($scope.IdUser,$scope.id, $scope.haskey);
        promiseGet.then(function (d) {
             $scope.Cargando = false;
            if (d.data.message === "Correcto"){               
                $scope.editMode = true;
            } else {
                $scope.msjKey = d.data.request;
            }

        }, function (err) {
            $scope.msjKey = 'Error Al procesar Solicitud';
            console.log("Some Error Occured "+ JSON.stringify(err));
        });
    }
    
    verificarKey();

    $scope.Guardar= function (){
         $scope.msjError ="";
        if ($scope.User.clave !== $scope.User.claveConf){
            toaster.pop('error', '¡Error!', "Contraseña NO son Iguales.. Verifique");
            $scope.msjError = "Contraseña NO son Iguales.. Verifique";
            return;
        }
        $scope.Cargando =true;
        var object = {
            Clave:$scope.User.clave,
            Codigo : $scope.id,
            Key : $scope.haskey,
            Verificar : "NO"
        };

        var promisePut = sesionService.udpatePass($scope.IdUser,object);
        promisePut.then(function (d) {
            $scope.Cargando =false;
            if (d.data.message === "Correcto"){
                $scope.msjError = d.data.request;
                setTimeout( "location.href = '#/inicio/login'", 5000);
                $scope.msjError +=" .. En Segundos Sera Redireccionado..";
            } else {
                $scope.msjError = d.data.request;
            }

        }, function (err) {
            $scope.msjError = 'Error Al procesar Solicitud';
            toaster.pop('error','¡Error!',err.data.request);
            console.log("Some Error Occured "+ JSON.stringify(err));
        });
    };
}]);
