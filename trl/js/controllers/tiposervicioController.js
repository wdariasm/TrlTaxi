app.controller("servicioController", ["$scope", "tiposervicioService", "toaster", "tipoVehiculoService", 
    function ($scope, tiposervicioService,toaster, tipoVehiculoService) {
   $scope.Servicio = {};
   $scope.Servicios = [];
   $scope.IdServicioGlobal="";
   $scope.editMode = false;
   $scope.title = "NUEVO SERVICIO"; 
   $scope.TipoVehiculos = [];
   
   $scope.$parent.SetTitulo("GESTION DE SERVICIOS");
         
    function initServicio() {
        $scope.Servicio = {
	    svDescripcion:"",
            svEstado:"ACTIVO",
            svCodigo : 0,
            svValorParada  : 0,
            TipoVehiculo : []
        };          
    }
    
    initServicio();
   
    function loadServicio (){
        var promise = tiposervicioService.getAll();
        promise.then(function(d) {                        
            $scope.Servicios = d.data;
        }, function(err) {           
            toaster.pop('error','¡Error!',"Error al cargar Servicios");           
            console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
    
    function loadTipoVehiculo (){
        var promise = tipoVehiculoService.getAll();
        promise.then(function(d) {                        
            $scope.TipoVehiculos = d.data;
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar Tipo de Vehiculo");
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
    
    loadTipoVehiculo();
      
    $scope.Guardar = function (){
       
        if ($scope.Servicio.TipoVehiculo.length === 0){
            toaster.pop('error', '¡Error!', 'Seleccione el tipo de vehículo');
            return;
        }
        
        $scope.Servicio.svDescripcion = $scope.Servicio.svDescripcion.toUpperCase();       
        var promise;
        if($scope.editMode){            
            promise = tiposervicioService.put($scope.Servicio.svCodigo, $scope.Servicio);
        }else {
            promise = tiposervicioService.post($scope.Servicio);            
        }        
                              
        promise.then(function(d) {                        
            loadServicio();
             toaster.pop('success', "Control de Información", d.data.message);
             
        }, function(err) {           
                toaster.pop('error', "¡Error!", err.data.message,0);         
                console.log("Some Error Occured " + JSON.stringify(err));
        });  
        initServicio();
    };
   
    $scope.Nuevo = function (){
        $scope.editMode = false;
        $scope.title = "NUEVO SERVICIO"; 
        initServicio();
    };
   
   //edita la marca
    $scope.get = function(item) {
        $scope.Servicio=item;
        $scope.editMode = true;
        $scope.title = "EDITAR SERVICIO"; 
        var tipos = [];
        if(item.TipoVehiculo){            
            tipos =JSON.parse("[" + item.TipoVehiculo + "]");            
        }        
        $scope.Servicio.TipoVehiculo = angular.copy(tipos);        
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
            svEstado : $scope.svEstado
        };
        $('#mdConfirmacion').modal('hide'); 
        var promisePut  = tiposervicioService.updateEstado($scope.IdServicioGlobal, objetc);        
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



