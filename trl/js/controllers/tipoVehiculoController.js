app.controller("tipoVehiculoController", ["$scope", "tipoVehiculoService", "toaster",
function ($scope, tipoVehiculoService,toaster) {
   $scope.TipoVehiculo= {};
   $scope.TipoVehiculos = [];
   $scope.IdTipoGlobal="";
   $scope.editMode = false;
   
     initTipoVehiculo();
    function initTipoVehiculo() {
        $scope.TipoVehiculo = {
            tvDescripcion:"",
            tvEstado:"ACTIVO"
        };          
    }

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
       
       $scope.TipoVehiculo.tvDescripcion = $scope.TipoVehiculo.tvDescripcion.toUpperCase();
       $scope.TipoVehiculo.tvEstado=$scope.TipoVehiculo.tvEstado.toUpperCase();
       
       
       
       
        var promise;
        if($scope.editMode){            
            promise = tipoVehiculoService.put($scope.TipoVehiculo.tvCodigo, $scope.TipoVehiculo);
        }else {
            promise = tipoVehiculoService.post($scope.TipoVehiculo);            
        }
        
        promise.then(function(d) {                        
            loadTipoVehiculo();
            toaster.pop('success', "Control de Información", d.data.message); 
             
        }, function(err) {           
                toaster.pop('error', "Error", "ERROR AL PROCESAR SOLICITUD");         
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
        initTipoVehiculo();
   };
   
    //edita la Tipo vehiculo
    $scope.get = function(item) {
        $scope.TipoVehiculo=item;
        $scope.editMode = true;
        $scope.title = "EDITAR TIPO VEHICULO"; 
        $scope.active = "active";
       console.log(item);        
    };
    
    //Funcion que elimina
      $scope.VerDesactivar = function(tvCodigo,  tvEstado) {
        $scope.tvEstado =tvEstado;
        $scope.IdTipoGlobal = tvCodigo;
        $('#mdConfirmacion').modal('show');         
    };
    
    //Funcion que elimina
     $scope.Desactivar = function() {
         var objetc = {
            tvEstado : tvEstado
        };
            $('#mdConfirmacion').modal('hide'); 
            var promisePut  = tipoVehiculoService.updateEstado($scope.IdTipoGlobal, objetc);        
                promisePut.then(function (d) {                
                 toaster.pop('success', "Control de Información", d.data.message);                 
                loadTipoVehiculo();
            }, function (err) {                              
                     toaster.pop('error', "Error", "ERROR AL PROCESAR SOLICITUD"); ;
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
   
     };

    loadTipoVehiculo();
}]);





