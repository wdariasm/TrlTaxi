app.controller("detalleMantenimientoController", ["$scope", "detalleMantenimientoService","mantenimientoService", "toaster","ngTableParams",
function ($scope,detalleMantenimientoService, mantenimientoService, toaster,ngTableParams) {
    $scope.DetalleMantenimiento= {};
    $scope.DetalleMantenimientos= [];
    
    $scope.Mantenimientos= [];
    $scope.IdDetManGlobal="";
    $scope.editMode = false;
  
    $scope.title = "Nuevo Detalle Mantenimiento"; 
    $scope.MantSelect ={}; 
    $scope.TablaDetalleMantenimiento = {};
   
    $scope.$parent.SetTitulo("DETALLE MANTENIMIENTO");
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
        var promise = detalleMantenimientoService.getAll();
        promise.then(function(d) {                        
            $scope.DetalleMantenimientos = d.data;
            $scope.TablaDetalleMantenimiento.reload();
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar Detalle Mantenimiento");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
   
    function loadMantenimiento(){
        var promise = mantenimientoService.getAll();
        promise.then(function(d) {                        
            $scope.Mantenimientos = d.data;
             if(d.data){
               $scope.MantSelect = d.data[0];
            }
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar Mantenimiento");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
    loadMantenimiento();
 
   $scope.Guardar = function (){
       $scope.DetalleMantenimiento.detMantenimiento = $scope.MantSelect.IdMantenimiento;
       $scope.DetalleMantenimiento.detActividad= $scope.DetalleMantenimiento.detActividad.toUpperCase();   
      
        var promise;
        if($scope.editMode){            
            promise = detalleMantenimientoService.put($scope.DetalleMantenimiento.detCodigo, $scope.DetalleMantenimiento);
        }else {
            promise = detalleMantenimientoService.post($scope.DetalleMantenimiento);            
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
   
   
   $scope.nuevo = function (){
       initDetalleMantenimiento();
       $scope.editMode =false;
       $scope.title = "Nuevo Detalle Mantenimiento"; 
   };
   
    //edita la DetalleMantenimiento
    $scope.get = function(item) {
        $scope.DetalleMantenimiento=item;
        $scope.editMode = true;
        $scope.title = "Editar Detalle Mantenimiento"; 
        $scope.active = "active";    
        
    };
     
   
   
      function initTabla() {
        $scope.TablaDetalleMantenimiento = new ngTableParams({
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
                c ? (c = c.toLowerCase(), f = $scope.DetalleMantenimientos.filter(function (a) {
                    return a.detCodigo.toLowerCase().indexOf(c) > -1 ||
                           a.detActividad.toLowerCase().indexOf(c) > -1  
                })) : f = $scope.DetalleMantenimientos, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
            }
        });
    };
    initTabla();
    loadDetalleMantenimiento();
}]);











