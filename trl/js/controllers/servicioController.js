app.controller("servicioController", ["$scope", "servicioService", function ($scope, servicioService) {
   $scope.Servicio = {};
   $scope.Servicios = [];
   $scope.editMode = false;
   
    function loadServicio (){
        var promise = servicioService.getAll();
        promise.then(function(d) {                        
            $scope.Servicios = d.data;
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
   
   $scope.Guardar = function (){
       
        var promise;
        if($scope.editMode){            
            promise = servicioService.put($scope.Servicio.svCodigo, $scope.Servicio);
        }else {
            promise = servicioService.post($scope.Servicio);            
        }
        
        promise.then(function(d) {                        
            loadServicio();
            alert(d.data.message);
             
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        });       
   };
   
    loadServicio();
}]);



