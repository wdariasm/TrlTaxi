app.controller("servicioController", ["$scope", "servicioService", "toaster",function ($scope, servicioService,toaster) {
   $scope.Servicio = {};
   $scope.Servicios = [];
   $scope.IdServicioGlobal="";
   $scope.editMode = false;
   
   
      initServicio();
    function initServicio() {
        $scope.Servicio = {
	    svDescripcion:"",
            svEstado:"ACTIVO"
        };          
    }
   
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
       
       $scope.Servicio.svDescripcion = $scope.Servicio.svDescripcion.toUpperCase();
       $scope.Servicio.svEstado=$scope.Servicio.svEstado.toUpperCase();
       
       
        var promise;
        if($scope.editMode){            
            promise = servicioService.put($scope.Servicio.svCodigo, $scope.Servicio);
        }else {
            promise = servicioService.post($scope.Servicio);            
        }
        
        promise.then(function(d) {                        
            loadServicio();
             toaster.pop('success', "Control de Información", d.data.message);
             
        }, function(err) {           
                toaster.pop('error', "Error", "ERROR AL PROCESAR SOLICITUD");         
                console.log("Some Error Occured " + JSON.stringify(err));
        });  
         initServicio();
   };
   //edita la marca
    $scope.get = function(item) {
        $scope.Servicio=item;
        $scope.editMode = true;
        $scope.title = "EDITAR SERVICIO"; 
        $scope.active = "active";
       console.log(item);        
    };
    
    //Funcion que elimina
     $scope.VerDesactivar = function(svCodigo,  svEstado) {
        $scope.svEstado =svEstado;
        $scope.IdServicioGlobal = svCodigo;
        $('#mdConfirmacion').modal('show');         
    };
    
    //Funcion que elimina
     $scope.Desactivar = function() {
         var objetc = {
            svEstado : svEstado
        };
            $('#mdConfirmacion').modal('hide'); 
            var promisePut  = servicioService.updateEstado($scope.IdServicioGlobal, objetc);        
                promisePut.then(function (d) {                
                 toaster.pop('success', "Control de Información", d.data.message);                 
                 loadServicio();
            }, function (err) {                              
                     toaster.pop('error', "Error", "ERROR AL PROCESAR SOLICITUD"); ;
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
                
    };
   
    loadServicio();
}]);



