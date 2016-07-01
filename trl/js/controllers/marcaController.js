app.controller("marcaController", ["$scope", "marcaService", function ($scope, marcaService) {
   $scope.Marca = {};
   $scope.Marcas = [];
   $scope.editMode = false;
   
    function loadMarca (){
        var promise = marcaService.getAll();
        promise.then(function(d) {                        
            $scope.Marcas = d.data;
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
   
   $scope.Guardar = function (){
       
        var promise;
        if($scope.editMode){            
            promise = marcaService.put($scope.Marca.maCodigo, $scope.Marca);
        }else {
            promise = marcaService.post($scope.Marca);            
        }
        
        promise.then(function(d) {                        
            loadMarca();
            alert(d.data.message);
             
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        });       
   };
   
    loadMarca();
}]);


