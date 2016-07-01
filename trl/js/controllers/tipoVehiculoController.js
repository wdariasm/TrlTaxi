app.controller("tipoVehiculoController", ["$scope", "tipoVehiculoService", function ($scope, tipoVehiculoService) {
   $scope.TipoVehiculo= {};
   $scope.TipoVehiculos = [];
   $scope.editMode = false;
   
    function loadTipoVehiculo (){
        var promise = tipoVehiculoService.getAll();
        promise.then(function(d) {                        
            $scope.TipoVehiculos = d.data;
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
   
   $scope.Guardar = function (){
       
        var promise;
        if($scope.editMode){            
            promise = tipoVehiculoService.put($scope.TipoVehiculo.tvCodigo, $scope.TipoVehiculo);
        }else {
            promise = tipoVehiculoService.post($scope.TipoVehiculo);            
        }
        
        promise.then(function(d) {                        
            loadTipoVehiculo();
            alert(d.data.message);
             
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        });       
   };
   
    loadTipoVehiculo();
}]);





