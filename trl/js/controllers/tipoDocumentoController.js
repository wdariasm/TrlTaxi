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
       $scope.TipoDocumento.tdCodigo = $scope.TipoDocumento.tdCodigo.toUpperCase();
       $scope.TipoDocumento.tdDescripcion = $scope.TipoDocumento.tdDescripcion.toUpperCase();
       $scope.TipoDocumento.tdEstado=$scope.TipoDocumento.tdEstado.toUpperCase();
       
       
       
       
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
   
    //edita la tipoDocumento
    $scope.get = function(item) {
        $scope.TipoDocumento=item;
        $scope.editMode = true;
        $scope.title = "EDITAR TIPO DOCUMENTO"; 
        $scope.active = "active";
       
    };
    
    //Funcion que elimina
     $scope.Desactivar = function(tdCodigo,  tdEstado) {
            confirm("jajja");
       
        var r = confirm("¿Está seguro de Ejecutar esta Acción?");
        if (r == true) {
            var objetc = {
            tdEstado : tdEstado
        };
            var promisePut  = tipoDocumentoService.updateEstado(tdCodigo, objetc);        
                promisePut.then(function (d) {                
               // Materialize.toast(d.data.message, 4000, 'rounded');                
                loadTipoDocumento();
            }, function (err) {                              
                    alert("ERROR AL PROCESAR DESACTIVAR / ACTIVAR");
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
        }        
    };
   
   
   
   
   
    loadTipoDocumento();
}]);






