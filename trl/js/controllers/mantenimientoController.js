app.controller("mantenimientoController", ["$scope", "mantenimientoService","toaster","ngTableParams","vehiculoService","tipoMantenimientoService",
function ($scope,mantenimientoService,toaster,ngTableParams,vehiculoService,tipoMantenimientoService) {
    $scope.Mantenimiento= {};
    $scope.Mantenimientos= [];
    $scope.Vehiculos=[];
    $scope.TipoMantenimientos=[];
    $scope.editMode = false;
    
    $scope.DetalleMantenimiento= {};
    $scope.DetalleMantenimientos= [];
    $scope.editDetalle=false;
    
  
    $scope.title = "Nuevo Mantenimiento"; 
    $scope.VehiculoSelect ={}; 
    $scope.TipoSelect={};
    $scope.TablaMantenimiento = {};
   
    $scope.$parent.SetTitulo(" MANTENIMIENTO");
    initMantenimiento();  
    
    function initMantenimiento() {
        $scope.Mantenimiento = {
            
            IdMantenimiento:"",
            Descripcion:"",
            TotalFactura:"0",
            mtVehiculo:'',
            mtTipoMantenimiento:'',
            Fecha:moment().format('L')
        };   
       
    }
    initMantenimiento();
    
     $scope.Cambiarformato= function (variable){
        console.log(variable);
        $scope.Mantenimiento[variable] = moment($scope.Mantenimiento[variable]).format('L');
    };  
    
    function loadMantenimiento(){
        var promise = mantenimientoService.getAll();
        promise.then(function(d) {                        
            $scope.Mantenimientos = d.data;
            $scope.TablaMantenimiento.reload();
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar  Mantenimientos");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
    loadMantenimiento();
    
     function loadVehiculo (){
        var promise = vehiculoService.getAll();
        promise.then(function(d) {                        
            $scope.Vehiculos = d.data;
              if(d.data){
               $scope.VehiculoSelect= d.data[0];
            }
        }, function(err) {                        
                toaster.pop('error', '¡Error!', 'Error al cargar Vehiculos');
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
            
    }
      loadVehiculo();
      
      function loadTipoMantenimiento(){
        var promise = tipoMantenimientoService.getAll();
        promise.then(function(d) {                        
            $scope.TipoMantenimientos = d.data;
             if(d.data){
               $scope.TipoSelect= d.data[0];
            }
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar Tipo Mantenimiento");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
    loadTipoMantenimiento();
 
   $scope.Guardar = function (){
       $scope.Mantenimiento.mtVehiculo = $scope.VehiculoSelect.IdVehiculo;
       $scope.Mantenimiento.mtTipoMantenimiento = $scope.TipoSelect.tmCodigo;
       $scope.Mantenimiento.Descripcion= $scope.Mantenimiento.Descripcion.toUpperCase();
        
      
        var promise;
        if($scope.editMode){            
            promise = mantenimientoService.put($scope.Mantenimiento.IdMantenimiento, $scope.Mantenimiento);
        }else {
            promise = mantenimientoService.post($scope.Mantenimiento);            
       }
//        else {
//            $scope.Mantenimiento.DetalleMantenimientos=$scope.DetalleMantenimientos;
//            promise =mantenimientoService.post($scope.Conductor);            
//        }
        
        promise.then(function(d) {                        
            
            toaster.pop('success', "Control de Información", d.data.message); 
            initMantenimiento();
            loadMantenimiento();
        }, function(err) {           
                toaster.pop('error', "¡Error!", "Error al guardar  Mantenimiento");         
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
       
   };
   
   
   $scope.nuevo = function (){
       initMantenimiento();
       initDetalleMantenimiento();  
       $scope.editMode =false;
       $scope.title = "Nuevo Mantenimiento"; 
   };
   
    //edita la Mantenimiento
    $scope.get = function(item) {
        $scope.Mantenimiento=item;
        $scope.Mantenimiento.Fecha = moment($scope.Mantenimiento.Fecha).format("L");
        $scope.editMode = true;
        $scope.title = "Editar Mantenimiento"; 
        $scope.active = "active";    
        loadDetalleMantenimiento(item.IdMantenimiento);
    };
      function initTabla() {
        $scope.TablaMantenimiento = new ngTableParams({
            page: 1,
            count: 10,
            sorting: undefined
        }, {
            filterDelay: 50,
            total: 1000,
            counts : [],
            getData: function (a, b) {
                var c = b.filter().busqueda;
                f = [];
                c ? (c = c.toLowerCase(), f = $scope.Mantenimientos.filter(function (a) {
                    return a.IdMantenimiento.toLowerCase().indexOf(c) > -1 ||
                           a.Descripcion.toLowerCase().indexOf(c) > -1||
                           a.mtVehiculo.toLowerCase().indexOf(c) > -1||
                           a.mtTipoMantenimiento.toLowerCase().indexOf(c) > -1
                })) : f = $scope.Mantenimientos, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
            }
        });
    };
    initTabla();
    
    
    
    
    
    //DETALLE MANTENIMIENTO
    initDetalleMantenimiento();  
    function initDetalleMantenimiento() {
        $scope.DetalleMantenimiento = {
            detCodigo:"",
            detActividad:"",
            detValor:"0"
        };   
       
    }
    initDetalleMantenimiento();
    
     function loadDetalleMantenimiento (){
        var promise = mantenimientoService.getAll();
        promise.then(function(d) {                        
            $scope.DetalleMantenimientos = d.data;
            
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar Detalle Mantenimiento");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
    loadDetalleMantenimiento();
   
      $scope.GuardarDetalle = function (){
       $scope.DetalleMantenimiento.detActividad= $scope.DetalleMantenimiento.detActividad.toUpperCase();   
      
        var promise;
        if($scope.editDetalle){            
            promise = mantenimientoService.put($scope.DetalleMantenimiento.detCodigo, $scope.DetalleMantenimiento);
        }else {
            promise = mantenimientoService.post($scope.DetalleMantenimiento);            
        }
        
        promise.then(function(d) {                        
            
            toaster.pop('success', "Control de Información", d.data.message); 
            initDetalleMantenimiento();
            loadDetalleMantenimiento();
        }, function(err) {           
                toaster.pop('error', "¡Error!", "Error al guardar Detalle Mantenimiento");         
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
       
   };
    loadMantenimiento();
}]);


