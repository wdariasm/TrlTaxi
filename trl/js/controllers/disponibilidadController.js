app.controller("disponibilidadController", ["$scope", "disponibilidadService","tipoVehiculoService", "toaster",
function ($scope,disponibilidadService, tipoVehiculoService,toaster) {
    $scope.Disponibilidad= {};
    $scope.Disponibilidades= [];
    $scope.TipoVehiculos= [];
    $scope.IdDispGlobal="";
    $scope.editMode = false;
    $scope.title = "NUEVA DISPONIBILIDAD"; 
   
    $scope.$parent.SetTitulo("DISPONIBILIDAD");
    initDisponibilidad();  
    function initDisponibilidad() {
        $scope.Disponibilidad = {
            dpCodigo:"",
            dpNombre:"",
            dpValorHora:"",
            dpEstado : "ACTIVO",
            dpTipoVehiculo :"1"
        };           
    }
    initDisponibilidad();

    function loadDisponibilidad (){
        var promise = disponibilidadService.getAll();
        promise.then(function(d) {                        
            $scope.Disponibilidades = d.data;
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar Disponibilidad");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
   
    function loadTipoVehiculo(){
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
       
       $scope.Disponibilidad.dpNombre = $scope.Disponibilidad.dpNombre.toUpperCase();                           
       
        var promise;
        if($scope.editMode){            
            promise = disponibilidadService.put($scope.Disponibilidad.dpCodigo, $scope.Disponibilidad);
        }else {
            promise = disponibilidadService.post($scope.Disponibilidad);            
        }
        
        promise.then(function(d) {                        
            loadDisponibilidad();
            toaster.pop('success', "Control de Información", d.data.message); 
            initDisponibilidad();
        }, function(err) {           
                toaster.pop('error', "¡Error!", "Error al guardar Disponibilidad");         
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
       
   };
   
   $scope.nuevo = function (){
       initDisponibilidad();
       $scope.editMode =false;
        $scope.title = "NUEVA DISPONIBILIDAD"; 
   };
   
    //edita la Disponibilidad
    $scope.get = function(item) {
        $scope.Disponibilidad=item;
        $scope.editMode = true;
        $scope.title = "EDITAR DISPONIBILIDAD"; 
        $scope.active = "active";            
    };
    
    //Funcion que elimina
      $scope.VerDesactivar = function(dpCodigo,  dpEstado) {
        $scope.dpEstado =dpEstado;
        $scope.IdDispGlobal = dpCodigo;
        $('#mdConfirmacion').modal('show');         
    };
    
    //Funcion que elimina
     $scope.Desactivar = function() {
         var objetc = {
            dpEstado : $scope.dpEstado
        };
            $('#mdConfirmacion').modal('hide'); 
            var promisePut  = disponibilidadService.updateEstado($scope.IdDispGlobal, objetc);        
                promisePut.then(function (d) {                
                 toaster.pop('success', "Control de Información", d.data.message);                 
                loadDisponibilidad();
            }, function (err) {                              
                     toaster.pop('error', "Error", "Error al Desactivar Disponibilidad"); ;
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
   
     };

    loadDisponibilidad();
}]);


