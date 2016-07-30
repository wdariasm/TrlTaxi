app.controller("rutaController", ["$scope", "rutaService","tipoVehiculoService", "departamentoService", "toaster",
function ($scope,rutaService, tipoVehiculoService,departamentoService, toaster) {
    $scope.Ruta= {};
    $scope.Rutas= [];
    $scope.TipoVehiculos= [];
    $scope.Departamentos=[];
    $scope.Municipios=[];
    $scope.IdRutapGlobal="";
    $scope.editMode = false;
    $scope.title = "NUEVA RUTA"; 
    $scope.VehiculoSelect ={}; 
    $scope.DeptSelect={};
    $scope.MunSelect={};
   
    $scope.$parent.SetTitulo("RUTA");
    initRuta();  
    function initRuta() {
        $scope.Ruta = {
            rtCodigo:"",
            rtNombre:"",
            rtDescripcion:"",
            trTipoVehiculo:"",
            trValor:"",
            trDepartamento:"",
            trCiudad:"",
            trEstado : "ACTIVO",
            trImagen :''
        };           
    }
    initRuta();

    function loadRuta (){
        var promise = rutaService.getAll();
        promise.then(function(d) {                        
            $scope.Rutas = d.data;
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar Ruta");           
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
    
     function loadDepartamento(){
        var promise = departamentoService.getAll();
        promise.then(function(d) {                        
            $scope.Departamentos = d.data;
             if(d.data){
               $scope.DeptSelect = d.data[0];
               loadMunicipio($scope.DeptSelect.dtCodigo);
            }
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar Departamentos");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
    loadDepartamento();
    
     function loadMunicipio(dtCodigo){
        var promise = departamentoService.getMunicipios(dtCodigo);
        promise.then(function(d) {                        
            $scope.Municipios = d.data;
             if(d.data){
               $scope.MunSelect = d.data[0];
            }
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar Departamentos");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
    
    $scope.CambiaDept=function(){               
       
               loadMunicipio($scope.DeptSelect.dtCodigo);
    };
   
   $scope.Guardar = function (){
       $scope.Ruta.trTipoVehiculo = $scope.VehiculoSelect.tvCodigo;
       $scope.Ruta.trCiudad = $scope.MunSelect.muCodigo;
       $scope.Ruta.trDepartamento = $scope.DeptSelect.dtCodigo;
       $scope.Ruta.rtNombre = $scope.Ruta.rtNombre.toUpperCase();   
       $scope.Ruta.rtDescripcion = $scope.Ruta.rtDescripcion.toUpperCase(); 
       
        var promise;
        if($scope.editMode){            
            promise = rutaService.put($scope.Ruta.rtCodigo, $scope.Ruta);
        }else {
            promise = rutaService.post($scope.Ruta);            
        }
        
        promise.then(function(d) {                        
            loadRuta();
            toaster.pop('success', "Control de Información", d.data.message); 
            initRuta();
        }, function(err) {           
                toaster.pop('error', "¡Error!", "Error al guardar Ruta");         
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
       
   };
   
   $scope.nuevo = function (){
       initRuta();
       $scope.editMode =false;
        $scope.title = "NUEVA RUTA"; 
   };
   
    //edita la Ruta
    $scope.get = function(item) {
        $scope.Ruta=item;
        $scope.editMode = true;
        $scope.title = "EDITAR RUTA"; 
        $scope.active = "active";            
    };
    
    //Funcion que elimina
      $scope.VerDesactivar = function(rtCodigo,  trEstado) {
        $scope.trEstado =trEstado;
        $scope.IdRutapGlobal = rtCodigo;
        $('#mdConfirmacion').modal('show');         
    };
    
    //Funcion que elimina
     $scope.Desactivar = function() {
         var objetc = {
            trEstado : $scope.trEstado
        };
            $('#mdConfirmacion').modal('hide'); 
            var promisePut  = rutaService.updateEstado($scope.IdRutapGlobal, objetc);        
                promisePut.then(function (d) {                
                 toaster.pop('success', "Control de Información", d.data.message);                 
                loadRuta();
            }, function (err) {                              
                     toaster.pop('error', "Error", "Error al Desactivar Ruta"); ;
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
   
     };

    loadRuta();
}]);





