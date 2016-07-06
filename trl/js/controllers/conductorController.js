app.controller("conductorController", ["$scope", "conductorService", function ($scope, conductorService) {
   $scope.Conductor = {};
   $scope.Conductores = [];
   $scope.Novedad={};
   $scope.Novedades=[];
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
            $scope.Conductor.Novedades=$scope.Novedades;
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
   
   
   
   $scope.AgregarNovedad = function (){
       if (!$scope.Novedad.nvTipo){
            alert("ERROR AL PROCESAR SOLICITUD");  
           return;
       } 
       
       if (!$scope.Novedad.nvDescripcion){
            alert("ERROR AL PROCESAR SOLICITUD");  
           return;
       }  
       
       $scope.Novedades.push($scope.Novedad);
       $scope.Novedad={};
   };
   
   
      
    loadConductor();
    
}]);


