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
   
    //edita la Tipo vehiculo
    $scope.get = function(item) {
        $scope.TipoVehiculo=item;
        $scope.editMode = true;
        $scope.title = "EDITAR BAHIA"; 
        $scope.active = "active";
       console.log(item);        
    };
    
    //Funcion que elimina
     $scope.Desactivar = function(tvCodigo,  tvEstado) {
        
        var r = confirm("¿Está seguro de Ejecutar esta Acción? ("+tvEstado+")");
        if (r == true) {
            var objetc = {
            tvEstado : tvEstado
        };
            var promisePut  = tipoVehiculoService.updateEstado(tvCodigo, objetc);        
                promisePut.then(function (d) {                
               // Materialize.toast(d.data.message, 4000, 'rounded');                
                loadTipoVehiculo();
            }, function (err) {                              
                    alert("ERROR AL PROCESAR DESACTIVAR / ACTIVAR");
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
        }        
    };
   
   
   
   
   
   
    loadTipoVehiculo();
}]);





