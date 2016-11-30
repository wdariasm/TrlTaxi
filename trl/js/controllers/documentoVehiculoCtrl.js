function documentoVehiculoCtrl($scope, $rootScope,  vehiculoService, toaster, serverData){
    var vm= this;
    
    vm.Titulo = "Adjuntos";
    vm.Archivo = {};
    
    vm.Vehiculo = {};                    
    $rootScope.$on("ImagenVehiculo", function (event, data) {        
        vm.Vehiculo = serverData.data;
        vm.Titulo =  data +  vm.Vehiculo.Placa;
        
    });
    
    vm.GuardarArchivo =  function (){
        
    };
    
}

documentoVehiculoCtrl.$inject = ["$scope", "$rootScope", "vehiculoService", "toaster", "serverData"];

app.controller("documentoVehiculoCtrl", documentoVehiculoCtrl);




