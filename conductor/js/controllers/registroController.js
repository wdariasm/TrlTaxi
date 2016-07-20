app.controller('registroController', function ($scope, registroService) {

    $scope.valEmail = false;
    $scope.msjError = "";
    $scope.Cliente = {};

    inicialize();

    function inicialize (){
        $scope.Cliente = {
            nombre: "",
            telefono: "",
            email: "",
            clave: ""
        };
    }

    $scope.registrar = function (){
        $scope.msjError="";
        if ($scope.valEmail){
            $scope.msjError = "Email ya se encuentra registrado, Verifique";
            return;
        }

        var object = {
            nombre: $scope.Cliente.nombres.toUpperCase(),
            telefono: $scope.Cliente.telefono,
            email: $scope.Cliente.email.toUpperCase(),
            clave: $scope.Cliente.clave,
            latitud : "0",
            longitud : "0",
            direccion : "",
            dir0 : "",
            dir1 : "",
            dir2 : "",
            dir3 : "",
            dir4 : "",
            dir5 : "",
            direccionOp : "",
            estado : 'ESPERA'
        };

        var promise = registroService.post(object);
        promise.then(function(d) {
            $scope.msjError = d.data.message + ', por Favor, Confirme su Cuenta';
            setTimeout ("location.href = '../cliente/index.html#/login/cliente'", 3500);
            inicialize();
        }, function(err) {
                alert("ERROR AL PROCESAR SOLICITUD");
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    };

    $scope.validarEmail = function () {
        $scope.msjError = "";
        $scope.valEmail = false;
        if (!$scope.Cliente.email) {
            return;
        }
        var promisePost = registroService.validarEmail($scope.Cliente.email.toUpperCase());
        promisePost.then(function (d) {
            if (d.data.Email) {
                $scope.valEmail = true;
            }
        }, function (err) {
            alert("ERROR AL PROCESAR VERIFICAR EMAIL");
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };

});


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
