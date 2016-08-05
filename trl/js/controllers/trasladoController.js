app.controller("trasladoController", ["$scope", "trasladoService","tipoVehiculoService", "departamentoService", "toaster","ngTableParams",
function ($scope,trasladoService, tipoVehiculoService,departamentoService, toaster,ngTableParams) {
    $scope.Traslado= {};
    $scope.Traslados= [];
    $scope.TipoVehiculos= [];
    $scope.Municipios=[];
    $scope.IdTrasladopGlobal="";
    $scope.editMode = false;
  
    $scope.title = "Nuevo Traslado"; 
    $scope.VehiculoSelect ={}; 
    $scope.MunSelect={};
    $scope.TablaTraslado = {};
   
    $scope.$parent.SetTitulo("TRASLADO");
    initTraslado();  
    function initTraslado() {
        $scope.Traslado = {
            tlCodigo:"",
            tlNombre:"",
            tlTipoVehiculo:"",
            tlValor:"0",
            tlCiudadOrigen:"",
            tlCiudadDestio:"",
            tlEstado : "ACTIVO"
           
        };   
       
    }
    initTraslado();

    function loadTraslado (){
        var promise = trasladoService.getAll();
        promise.then(function(d) {                        
            $scope.Traslados = d.data;
            $scope.TablaTraslado.reload();
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar Traslado");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
   
    function loadTipoVehiculo(){
        var promise = tipoVehiculoService.getAll();
        promise.then(function(d) {                        
            $scope.TipoVehiculos = d.data;
             if(d.data){
               $scope.VehiculoSelect = d.data[0];
            }
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar Tipo de Vehiculo");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
    loadTipoVehiculo();
   
    
     function loadMunicipio(){
        var promise = departamentoService.getMunicipios();
        promise.then(function(d) {                        
            $scope.Municipios = d.data;
             if(d.data){
               $scope.MunSelect = d.data[0];
            }
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar Municipios");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
   
   $scope.Guardar = function (){
       $scope.Traslado.tlTipoVehiculo = $scope.VehiculoSelect.tvCodigo;
       $scope.Traslado.tlCiudadDestio = $scope.MunSelect.muCodigo;
       $scope.Traslado.tlCiudadOrigen= $scope.MunSelect.plCodigo;
       $scope.Traslado.tlNombre= $scope.Traslado.tlNombre.toUpperCase();   

        var promise;
        if($scope.editMode){            
            promise = trasladoService.put($scope.Traslado.tlCodigo, $scope.Traslado);
        }else {
            promise = trasladoService.post($scope.Traslado);            
        }
        
        promise.then(function(d) {                        
            loadTraslado();
            toaster.pop('success', "Control de Información", d.data.message); 
            initTraslado();
        }, function(err) {           
                toaster.pop('error', "¡Error!", "Error al guardar Traslado");         
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
       
   };
   
   $scope.nuevo = function (){
       initTraslado();
       $scope.editMode =false;
       $scope.title = "Nuevo Traslado"; 
   };
   
    //edita la Traslado
    $scope.get = function(item) {
        $scope.Traslado=item;
        $scope.editMode = true;
        $scope.title = "Editar Traslado"; 
        $scope.active = "active";    
          $('#tabPanels a[href="#tabRegistroTraslado"]').tab('show');
    };
     
    //Funcion que elimina
      $scope.VerDesactivar = function(tlCodigo,  tlEstado) {
        $scope.tlEstado =tlEstado;
        $scope.IdTrasladopGlobal = tlCodigo;
        $('#mdConfirmacion').modal('show');         
    };
    
    //Funcion que elimina
     $scope.Desactivar = function() {
         var objetc = {
            tlEstado : $scope.tlEstado
        };
            $('#mdConfirmacion').modal('hide'); 
            var promisePut  = trasladoService.updateEstado($scope.IdTrasladopGlobal, objetc);        
                promisePut.then(function (d) {                
                 toaster.pop('success', "Control de Información", d.data.message);                 
                loadTraslado();
            }, function (err) {                              
                     toaster.pop('error', "Error", "Error al Desactivar Traslado"); ;
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
   
     };
      function initTabla() {
        $scope.TablaTraslado = new ngTableParams({
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
                c ? (c = c.toLowerCase(), f = $scope.Traslados.filter(function (a) {
                    return a.tlCodigo.toLowerCase().indexOf(c) > -1 ||
                           a.tlNombre.toLowerCase().indexOf(c) > -1 ||
                           a.tlCiudadOrigen.toLowerCase().indexOf(c) > -1 ||
                           a.tlTipoVehiculo.toLowerCase().indexOf(c) > -1 ||  
                           a.tlEstado.toLowerCase().indexOf(c) > -1 
                })) : f = $scope.Traslados, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
            }
        });
    };
    initTabla();
    loadTraslado();
}]);








