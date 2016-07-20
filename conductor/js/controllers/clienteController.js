app.controller('clienteController', function ($scope, clienteService, direccionService) {
    $scope.Cliente = {};
    $scope.Direcciones = [];
    $scope.User = {};
    $scope.active = "active";
    inicialize();
    getDireccion();

    function inicialize (){
        $scope.Cliente =   {
            Nombre : session.getNombre(),
            Email : session.getEmail(),
            Telefono : session.getTelefono(),
            Direccion : session.getDireccion()
        };
    }

    function getCliente (){
        var promiseGet = clienteService.get(session.getidCliente());
        promiseGet.then(function (pl) {
            $scope.Cliente = pl.data;
            session.setCliente(JSON.stringify($scope.Cliente));
            $scope.$parent.setNombre($scope.Cliente.Nombre);
            $scope.$parent.setTelefono($scope.Cliente.Telefono);
        },
        function (errorPl) {
            console.log('failure loading Departamentos', errorPl);
        });
    }
    
    function getDireccion (){
        var promiseGet = direccionService.getAll(session.getidCliente());
        promiseGet.then(function (pl) {
            $scope.Direcciones = pl.data;
        },
        function (errorPl) {
            console.log('failure loading Departamentos', errorPl);
        });
    }

    $scope.actualizar = function (){
        var object = {
            nombre: $scope.Cliente.Nombre.toUpperCase(),
            telefono: $scope.Cliente.Telefono,
            email: $scope.Cliente.Email.toUpperCase(),
            direccion : $scope.Cliente.Direccion.toUpperCase(),
            opcion : ""
        };

        var promise = clienteService.put(session.getidCliente(), object);
        promise.then(function(d) {
            Materialize.toast(d.data.message+'..!!', 4000, 'rounded');
            getCliente();

        }, function(err) {
                alert("ERROR AL PROCESAR SOLICITUD");
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    };

    $scope.cambiarClave = function (){

        $scope.valPass = false;
        if ($scope.User.clave != $scope.User.claveConf){
            $scope.valPass = true;
            return;
        }

        var object = {
            clave:$scope.User.clave,
            verificar : "NO"         
        };

        var promise = clienteService.udpatePass(session.getidCliente(), object);
        promise.then(function(d) {
            if (d.data.message == "Correcto"){
                Materialize.toast(d.data.request+'..!!', 4000, 'rounded');
                sessionStorage.setItem("cliente","");
                sessionStorage.removeItem("cliente");
                setTimeout('location.href = "../cliente/index.html#/login/cliente"', 5000);
                Materialize.toast("Debes Iniciar Sesión Nuevamente", 4000, 'rounded');
            }
        }, function(err) {
                alert("ERROR AL CAMBIAR CONTRASEÑA");
                console.log("Some Error Occured " + JSON.stringify(err));
        });

    };
    
    // ELIMINAR DIRECCION 
    $scope.eliminar = function (id){
        
        var r = confirm("¿Está seguro de Eliminar la Dirección ? ");
        if (r == true) {                    
            var promise = direccionService.delete(id);
            promise.then(function (d) {
                Materialize.toast(d.data.message+'..!!', 4000, 'rounded');
                getDireccion();
            },
            function (errorPl) {
                console.log('failure loading Departamentos', errorPl);
            });
        }
    };

});
