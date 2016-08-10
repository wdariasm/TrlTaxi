app.controller("mantenimientoController", ["$scope", "mantenimientoService","toaster","ngTableParams","vehiculoService","tipoMantenimientoService",
function ($scope,mantenimientoService,toaster,ngTableParams,vehiculoService,tipoMantenimientoService) {
    $scope.Mantenimiento= {};
    $scope.Mantenimientos= [];
    $scope.Vehiculos=[];
    $scope.TipoMantenimientos=[];
    $scope.editMode = false;
    
    $scope.Detalle= {};
    $scope.DetalleMantenimientos= [];
    $scope.editDetalle=false;
    
  
    $scope.title = "Nuevo Mantenimiento"; 
    $scope.VehiculoSelect ={}; 
    $scope.TipoSelect={};
    $scope.TablaMantenimiento = {};
   
    $scope.$parent.SetTitulo("GESTIONAR  MANTENIMIENTO DE VEHÍCULOS");
    loadMantenimiento();
    loadTipoMantenimiento();
    initMantenimiento();  
    
    function initMantenimiento() {
        $scope.Mantenimiento = {            
            IdMantenimiento:"",
            Descripcion:"",
            TotalFactura:"0",
            mtVehiculo: 0,
            Placa : "",
            mtTipoMantenimiento:'',
            Fecha:moment().format('L')
        };   
       
    }    
    
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
    
 
   $scope.Guardar = function (){
       if($scope.Mantenimiento.mtVehiculo === 0){
           toaster.pop("error","¡Error!", "Placa no existe en el sistema.")
           return;
       };
       $scope.Mantenimiento.mtTipoMantenimiento = $scope.TipoSelect.tmCodigo;
       $scope.Mantenimiento.Descripcion= $scope.Mantenimiento.Descripcion.toUpperCase();
        
        if($scope.DetalleMantenimientos.length === 0){
            toaster.pop('warning','¡Alerta!', 'Ingrese el detalle del manteniemto');
            return;
        }
        
        $scope.Mantenimiento.DetalleMantenimientos=$scope.DetalleMantenimientos;
        
      
        var promise;
        if($scope.editMode){            
            promise = mantenimientoService.put($scope.Mantenimiento.IdMantenimiento, $scope.Mantenimiento);
        }else {                       
            promise = mantenimientoService.post($scope.Mantenimiento);                              
       }
        
        promise.then(function(d) {                        
            
            toaster.pop('success', "Control de Información", d.data.message); 
            $scope.nuevo();
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
        $('#tabPanels a[href="#tabMantenimiento"]').tab('show');
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
        $scope.Detalle = {
            detCodigo:"",
            detActividad:"",
            detValor:"0"
        };   
       
    }
    
     $scope.getDetalle = function(item) {
        $scope.Detalle=item;
        $scope.editDetalle= true;
        $scope.active = "active";    
    };
    
    initDetalleMantenimiento();
    
     function loadDetalleMantenimiento (id){
        var promise = mantenimientoService.getDetalle(id);
        promise.then(function(d) {                        
            $scope.DetalleMantenimientos = d.data; 
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar Detalle Mantenimiento");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
    
    $scope.AgregarDetalle = function (){
       if (!$scope.Detalle.detActividad){
           toaster.pop('warning', "Ingresa el detalle"); 
           return;
       } 
       
       if (!$scope.Detalle.detValor){
           toaster.pop('warning', "Ingresa el valor");
           return;
       }  
       $scope.Detalle.detActividad = $scope.Detalle.detActividad.toUpperCase();
       $scope.DetalleMantenimientos.push($scope.Detalle);
       $scope.Detalle={};
   };
   
    $scope.ValidarPlaca = function () {
        $scope.Mantenimiento.mtVehiculo = 0;
        if (!$scope.Mantenimiento.Placa) {
            return;
        }
        var promiseGet = vehiculoService.validarPlaca($scope.Mantenimiento.Placa);
        promiseGet.then(function (d) {            
            if (!d.data) {                
                toaster.pop('error', '¡Error!', 'Placa no se encuentra registrada en el sistema.');
            }else{
                $scope.Mantenimiento.mtVehiculo = d.data.IdVehiculo;
            }
            
        }, function (err) {
            toaster.pop('error', '¡Error!', 'Error al validar placa.');
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };
    
    loadMantenimiento();
}]);


