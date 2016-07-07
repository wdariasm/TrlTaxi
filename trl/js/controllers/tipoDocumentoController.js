app.controller("tipoDocumentoController", ["$scope", "tipoDocumentoService", function ($scope, tipoDocumentoService) {
   $scope.TipoDocumento = {};
   $scope.TipoDocumentos = [];
   $scope.editMode = false;
   
    function loadTipoDocumento (){
        var promise = tipoDocumentoService.getAll();
        promise.then(function(d) {                        
            $scope.TipoDocumentos = d.data;
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
   
   $scope.Guardar = function (){
       
        var promise;
        if($scope.editMode){            
            promise = tipoDocumentoService.put($scope.TipoDocumento.tdCodigo, $scope.TipoDocumento);
        }else {
            promise = tipoDocumentoService.post($scope.TipoDocumento);            
        }
        
        promise.then(function(d) {                        
            loadTipoDocumento();
            alert(d.data.message);
             
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        });       
   };
   
    loadTipoDocumento();
}]);






