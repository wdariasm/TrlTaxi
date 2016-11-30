function documentoVehiculoCtrl($scope, vehiculoService, toaster){
    var vm= this;
    
    vm.Titulo = "Adjuntos";
    
}

documentoVehiculoCtrl.$inject = ["$scope", "vehiculoService", "toaster"];

app.controller("documentoVehiculoCtrl", documentoVehiculoCtrl);




