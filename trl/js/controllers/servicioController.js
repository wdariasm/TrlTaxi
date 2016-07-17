app.controller("servicioController", ["$scope", "servicioService", "toaster",function ($scope, servicioService,toaster) {
   $scope.Servicio = {};
   $scope.Servicios = [];
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
     $scope.Desactivar = function(svCodigo,  svEstado) {
        
        var r = confirm("¿Está seguro de Ejecutar esta Acción? ("+svEstado+")");
        if (r == true) {
            var objetc = {
            svEstado : svEstado
        };
            var promisePut  = servicioService.updateEstado(svCodigo, objetc);        
                promisePut.then(function (d) {                
               // Materialize.toast(d.data.message, 4000, 'rounded');                
                loadServicio();
            }, function (err) {                              
                    alert("ERROR AL PROCESAR DESACTIVAR / ACTIVAR");
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
        }        
    };
  
    loadServicio();
}]);



