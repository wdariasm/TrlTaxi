app.controller('ConfirmarController', function ($scope, $routeParams, registroService) {
    $scope.idCliente = $routeParams.idCliente;
    $scope.haskey = $routeParams.haskey;
    $scope.msjError = "";
    verificarUser();
    function verificarUser(){
        var promiseGet = registroService.confirmar($scope.idCliente,$scope.haskey);
        promiseGet.then(function (d) {
            if (d.data.message =="Correcto"){
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
    }
});

app.controller('recordarClaveController', function ($scope, registroService) {

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

        var promisePost = registroService.recuperar(object);
        promisePost.then(function (d) {
            $scope.msjError = d.data.request;
        }, function (err) {
            alert("ERROR AL ENVIAR SOLICITUD");
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };

});

app.controller('cambiarClaveController', function ($scope, $routeParams, registroService) {

    $scope.id = $routeParams.id;
    $scope.idCliente = $routeParams.idCliente;
    $scope.haskey = $routeParams.haskey;
    $scope.msjError = "";
    $scope.msjKey = "Espere.. Verificando Información...."
    $scope.editMode = false;
    $scope.User  = {};

    verificarKey();
    function verificarKey(){
        var promiseGet = registroService.verificarKey($scope.idCliente,$scope.id, $scope.haskey);
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

        var promisePut = registroService.udpatePass($scope.idCliente,object);
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
