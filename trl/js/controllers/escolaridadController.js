app.controller("escolaridadController", ["$scope", "escolaridadService", function ($scope, escolaridadService) {
   $scope.Escolaridad = {};
   $scope.Escolaridades = [];
   $scope.editMode = false;
   
    function loadEscolaridad (){
        var promise = escolaridadService.getAll();
        promise.then(function(d) {                        
            $scope.Escolaridades = d.data;
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
   
   $scope.Guardar = function (){
       
        var promise;
        if($scope.editMode){            
            promise = escolaridadService.put($scope.Escolaridad.esCodigo, $scope.Escolaridad);
        }else {
            promise = escolaridadService.post($scope.Escolaridad);            
        }
        
        promise.then(function(d) {                        
            loadEscolaridad();
            alert(d.data.message);
             
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        });       
   };
   
    loadEscolaridad();
}]);




