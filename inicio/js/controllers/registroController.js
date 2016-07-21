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

app.controller('recordarClaveController', function ($scope, sesionService) {

    $scope.Cliente = {};
    $scope.msjError = "";

    init();

    function init(){
        $scope.Cliente = {
            email : ""
        };
    }

    $scope.recuperar= function (){
        $scope.msjError = "";
        var object = {
            email : $scope.Cliente.email.toUpperCase()
        };

        var promisePost = sesionService.recuperar(object);
        promisePost.then(function (d) {
            $scope.msjError = d.data.request;
        }, function (err) {
            alert("ERROR AL ENVIAR SOLICITUD");
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };

});

app.controller('cambiarClaveController', function ($scope, $routeParams, sesionService) {

    $scope.id = $routeParams.id;
    $scope.idCliente = $routeParams.idCliente;
    $scope.haskey = $routeParams.haskey;
    $scope.msjError = "";
    $scope.msjKey = "Espere.. Verificando Información...."
    $scope.editMode = false;
    $scope.User  = {};

    verificarKey();
    function verificarKey(){
        var promiseGet = sesionService.verificarKey($scope.idCliente,$scope.id, $scope.haskey);
        promiseGet.then(function (d) {
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

    $scope.guardar= function (){
        if ($scope.User.clave != $scope.User.claveConf){
            $scope.msjError = "Contraseña NO son Iguales.. Verifique";
            return;
        }

        var object = {
            clave:$scope.User.clave,
            codigo : $scope.id,
            Key : $scope.haskey,
            verificar : "SI"
        };

        var promisePut = sesionService.udpatePass($scope.idCliente,object);
        promisePut.then(function (d) {
            if (d.data.message === "Correcto"){
                $scope.msjError = d.data.request;
                setTimeout( "location.href = '#/login/cliente'", 5000);
                $scope.msjError +=" .. En Segundos Sera Redireccionado..";
            } else {
                $scope.msjError = d.data.request;
            }

        }, function (err) {
            $scope.msjError = 'Error Al procesar Solicitud';
            console.log("Some Error Occured "+ JSON.stringify(err));
        });
    };
});
