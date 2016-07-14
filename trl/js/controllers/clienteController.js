app.controller("clienteController", ["$scope", "clienteService", "tipoDocumentoService","toaster", 
function ($scope, clienteService, tipoDocumentoService,toaster) {
   $scope.Cliente = {};
   $scope.Clientes = [];
   
   $scope.TipoDocumentos=[];
   
   $scope.editMode = false;
   
    function loadCliente (){
        var promise = clienteService.getAll();
        promise.then(function(d) {                        
            $scope.Clientes = d.data;
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
    function loadTipoDocumentos (){
        var promise = tipoDocumentoService.getAll();
        promise.then(function(d) {                        
            $scope.TipoDocumentos = d.data;
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
   loadTipoDocumentos ();
   
   $scope.Guardar = function (){
        $scope.Cliente.Nombres = $scope.Cliente.Nombres.toUpperCase();
        $scope.Cliente.Estado=$scope.Cliente.Estado.toUpperCase();
        $scope.Cliente.Direccion = $scope.Cliente.Direccion.toUpperCase();
        $scope.Cliente.DigitoVerificacion = $scope.Cliente.DigitoVerificacion.toUpperCase();
        $scope.Cliente.TipoDocumento = $scope.Cliente.TipoDocumento.toUpperCase();
        

        var promise;
        if($scope.editMode){            
            promise = clienteService.put($scope.Cliente.IdCliente ,$scope.Cliente);
        }else {
            promise = clienteService.post($scope.Cliente);            
        }
        
        promise.then(function(d) {                        
            loadCliente();
           toaster.pop('success', "Control de Información", d.data.message); 
             
        }, function(err) {           
                 toaster.pop('error', "Error", "ERROR AL PROCESAR SOLICITUD");            
                console.log("Some Error Occured " + JSON.stringify(err));
        });       
   };
   
   //edita la marca
    $scope.get = function(item) {
        $scope.Cliente=item;
        $scope.editMode = true;
        $scope.title = "EDITAR CLIENTE"; 
        $scope.active = "active";
       console.log(item);        
       
     $('#tabPanels a[href="#tabRegistro"]').tab('show');

    };
    
    //Funcion que elimina
     $scope.Desactivar = function(IdCliente , Estado) {
        
        var r = confirm("¿Está seguro de Ejecutar esta Acción? ("+Estado+")");
        if (r == true) {
            var objetc = {
            Estado : Estado
        };
            var promisePut  = clienteService.updateEstado(IdCliente, objetc);        
                promisePut.then(function (d) {                
               // Materialize.toast(d.data.message, 4000, 'rounded');                
                loadCliente();
            }, function (err) {                              
                    alert("ERROR AL PROCESAR DESACTIVAR / ACTIVAR");
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
        }        
    };
  
   
    loadCliente();
}]);







