app.controller('sesionController', function ($scope, sesionService) {
    $scope.usuario = {};
    $scope.msjError = "";

    $scope.autenticar = function (){
        
        $scope.msjError = "Espere, por favor ... ";
        
        var object = {
            email: $scope.usuario.email,
            clave: $scope.usuario.clave
        };
       var promise = sesionService.post(object);
        promise.then(function(d) {
            if (d.data.message === "Correcto") {
                sessionStorage.setItem("cliente","");
                session.setCliente(d.data.request);
                if (session.getCliente()) {
                    location.href = "./home.html";
                }
            } else{
                sessionStorage.clear();
                $scope.msjError = d.data.request;
            }
        }, function(err) {
                alert("ERROR AL PROCESAR SOLICITUD");
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    };

    $scope.recodarClave = function() {
        var promise = sesionService.postEmail($scope.usuario.email);
        promise.then(function(d) {
            Materialize.toast(d.data.message+'..!!', 4000, 'rounded');
        }, function(err) {
                alert("ERROR AL PROCESAR SOLICITUD");
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    };
    
    $scope.Iniciar = function (){
        
        $scope.msjError = "Espere, por favor ... ";
        
        if (!$scope.usuario.user){
            $scope.msjError = "Ingrese el Usuario";
            return;
        }
        
        if (!$scope.usuario.clave){
            $scope.msjError = "Ingrese la Contraseña";
            return;
        }        
        
        var object = {
            username: $scope.usuario.user,
            clave: $scope.usuario.clave
        };
       var promise = sesionService.login(object);
        promise.then(function(d) {
            if (d.data.message === "Correcto") {
                sessionStorage.setItem("usuario","");
                sessionStorage.setItem("usuario",d.data.request);                
                location.href = "../taxi/index.html";
                
            } else{
                sessionStorage.clear();
                $scope.msjError = d.data.request;
            }
        }, function(err) {
                alert("ERROR AL PROCESAR SOLICITUD");
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    };

});
