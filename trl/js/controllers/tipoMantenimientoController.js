app.controller("tipoMantenimientoController", ["$scope", "tipoMantenimientoService", "toaster",
function ($scope, tipoMantenimientoService,toaster) {
    $scope.TipoMantenimiento= {};
    $scope.TipoMantenimientos = [];
    $scope.IdTipoGlobal="";
    $scope.editMode = false;
    $scope.title = "Nuevo Tipo de Mantenimiento"; 
   
    $scope.$parent.SetTitulo("TIPO DE MANTENIMIENTO");
       
    function initTipoMantenimiento() {
        $scope.TipoMantenimiento = {
            tmDescripcion:"",
            tmEstado:"ACTIVO",
            tmCodigo : 0
        };           
    }
    initTipoMantenimiento();

    function loadTipoMantenimiento (){
        var promise = tipoMantenimientoService.getAll();
        promise.then(function(d) {                        
            $scope.TipoMantenimientos = d.data;
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar Tipo de Mantenimiento");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
   
   $scope.Guardar = function (){
       
       $scope.TipoMantenimiento.tmDescripcion = $scope.TipoMantenimiento.tmDescripcion.toUpperCase();                           
       
        var promise;
        if($scope.editMode){            
            promise = tipoMantenimientoService.put($scope.TipoMantenimiento.tmCodigo, $scope.TipoMantenimiento);
        }else {
            promise = tipoMantenimientoService.post($scope.TipoMantenimiento);            
        }
        
        promise.then(function(d) {                        
            loadTipoMantenimiento();
            toaster.pop('success', "Control de Información", d.data.message); 
            initTipoMantenimiento();
        }, function(err) {           
                toaster.pop('error', "¡Error!", "Error al guardar tipo de Vehículo");         
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
       
   };
   
   $scope.nuevo = function (){
       initTipoMantenimiento();
       $scope.editMode =false;
        $scope.title = "Nuevo Tipoo de Mantenimiento"; 
   };
   
    //edita la Tipo vehiculo
    $scope.get = function(item) {
        $scope.TipoMantenimiento=item;
        $scope.editMode = true;
        $scope.title = "Editar Tipo de Mantenimiento"; 
        $scope.active = "active";            
    };
    
    //Funcion que elimina
      $scope.VerDesactivar = function(tmCodigo,  tmEstado) {
        $scope.tmEstado =tmEstado;
        $scope.IdTipoGlobal = tmCodigo;
        $('#mdConfirmacion').modal('show');         
    };
    
    //Funcion que elimina
     $scope.Desactivar = function() {
         var objetc = {
            tmEstado : $scope.tmEstado
        };
            $('#mdConfirmacion').modal('hide'); 
            var promisePut  = tipoMantenimientoService.updateEstado($scope.IdTipoGlobal, objetc);        
                promisePut.then(function (d) {                
                 toaster.pop('success', "Control de Información", d.data.message);                 
                loadTipoMantenimiento();
            }, function (err) {                              
                     toaster.pop('error', "Error", "Error al Desactivar tipo de Mantenimiento"); ;
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
   
     };

    loadTipoMantenimiento();
}]);





