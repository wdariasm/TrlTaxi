app.controller("conductorController", ["$scope", "conductorService", function ($scope, conductorService) {
   $scope.Conductor = {};
   $scope.Conductores = [];
   $scope.editMode = false;
   
    function loadConductor (){
        var promise = conductorService.getAll();
        promise.then(function(d) {                        
            $scope.Conductores = d.data;
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
   
   $scope.Guardar = function (){
       
        var promise;
        if($scope.editMode){            
            promise = conductorService.put($scope.Conductor.IdConductor, $scope.Conductor);
        }else {
            promise = conductorService.post($scope.Conductor);            
        }
        
        promise.then(function(d) {                        
            loadConductor();
            alert(d.data.message);
             
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        });       
   };
   
    loadConductor();
}]);


