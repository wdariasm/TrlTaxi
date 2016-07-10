app.controller("novedadController", ["$scope", "novedadService", function ($scope, novedadService) {
   $scope.Novedad = {};
   $scope.Novedades = [];
   $scope.editMode = false;
   
    function loadNovedad (){
        var promise = novedadService.getAll();
        promise.then(function(d) {                        
            $scope.Novedades = d.data;
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
   
   $scope.Guardar = function (){
        $scope.Novedad.nvDescripcion = $scope.Novedad.nvDescripcion.toUpperCase();
        $scope.Novedad.nvTipo=$scope.Novedad.nvTipo.toUpperCase();
        $scope.Novedad.nvEstado=$scope.Novedad.nvEstado.toUpperCase();
        
        var promise;
        if($scope.editMode){            
            promise = novedadService.put($scope.Novedad.nvCodigo, $scope.Novedad);
        }else {
            promise = novedadService.post($scope.Novedad);            
        }
        
        promise.then(function(d) {                        
            loadNovedad();
            alert(d.data.message);
             
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        });       
   };
   
    loadNovedad();
}]);





