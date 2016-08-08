app.controller("rutaController", ["$scope", "rutaService","tipoVehiculoService", "departamentoService", "toaster","ngTableParams","plantillaService",
function ($scope,rutaService, tipoVehiculoService,departamentoService, toaster,ngTableParams,plantillaService) {
    $scope.Ruta= {};
    $scope.Rutas= [];
    $scope.TipoVehiculos= [];
    $scope.Departamentos=[];
    $scope.Municipios=[];
    $scope.Plantillas=[];
    $scope.IdRutapGlobal="";
    $scope.editMode = false;
    $scope.estadoImg =false;
    $scope.title = "Nueva Ruta"; 
    $scope.VehiculoSelect ={}; 
    $scope.PlantillaSelect ={}; 
    $scope.DeptSelect={};
    $scope.MunSelect={};
    $scope.TablaRuta = {};
   
    $scope.$parent.SetTitulo("GESTIÓN DE RUTAS");
    initRuta();  
    loadDepartamento();
    loadPlantilla();
    loadRuta();
    function initRuta() {
        $scope.Ruta = {
            rtCodigo:"",
            rtNombre:"",
            rtDescripcion:"",
            rtTipoVehiculo:"",
            rtValor:"0",
            rtDepartamento:"",
            rtCiudad:"",
            trEstado : "ACTIVO",
            rtImagen :'',
            rtPlantilla:'0',
            Imagen : ""
        };           
        $scope.estadoImg =false;
    }
    

    function loadRuta (){
        var promise = rutaService.getAll();
        promise.then(function(d) {                        
            $scope.Rutas = d.data;
            $scope.TablaRuta.reload();
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
    
      function loadPlantilla(){
        var promise = plantillaService.get(3);
        promise.then(function(d) {                        
            $scope.Plantillas = d.data;
             if(d.data){
               $scope.PlantillaSelect = d.data[0];
            }
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar Plantillas");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }    
    
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
    
    
     function loadMunicipio(dtCodigo){
        var promise = departamentoService.getMunicipios(dtCodigo);
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
    
    $scope.CambiaDept=function(){                      
        loadMunicipio($scope.DeptSelect.dtCodigo);
    };
   
   $scope.Guardar = function (){
              
        var formData=new FormData();
        formData.append('rtTipoVehiculo', $scope.VehiculoSelect.tvCodigo);
        formData.append('rtCiudad', $scope.MunSelect.muCodigo);
        formData.append('rtPlantilla', $scope.PlantillaSelect.plCodigo);
        formData.append('rtDepartamento', $scope.DeptSelect.dtCodigo);
        formData.append('rtNombre', $scope.Ruta.rtNombre.toUpperCase());
        formData.append('rtDescripcion', $scope.Ruta.rtDescripcion.toUpperCase());
        formData.append('rtValor', $scope.Ruta.rtValor);
        formData.append('trEstado', $scope.Ruta.trEstado);
        formData.append('rtImagen', $scope.Ruta.rtImagen);
       
        var promise;
        if($scope.editMode){            
            promise = rutaService.put($scope.Ruta.rtCodigo, $scope.Ruta);
        }else {
            promise = rutaService.post(formData);            
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
        $scope.title = "Nueva Ruta"; 
   };
   
    //edita la Ruta
    $scope.get = function(item) {
        $scope.Ruta=item;
        $scope.editMode = true;
        $scope.title = "Editar Ruta"; 
        $scope.active = "active";    
        $('#tabPanels a[href="#tabRegistroRuta"]').tab('show');         
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
      function initTabla() {
        $scope.TablaRuta = new ngTableParams({
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
                c ? (c = c.toLowerCase(), f = $scope.Rutas.filter(function (a) {
                    return a.rtCodigo.toLowerCase().indexOf(c) > -1 ||
                           a.rtNombre.toLowerCase().indexOf(c) > -1 ||
                           a.rtDescripcion.toLowerCase().indexOf(c) > -1 ||
                           a.rtCiudad.toLowerCase().indexOf(c) > -1 ||  
                           a.trEstado.toLowerCase().indexOf(c) > -1 
                })) : f = $scope.Rutas, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
            }
        });
    };
    initTabla();
    
    
   $scope.modificarImagen = function(){
        var formData=new FormData();
        formData.append('imagen',$scope.Ruta.rtImagen);
        formData.append('id', $scope.Ruta.rtCodigo);
        
        if (!$scope.Ruta.rtImagen){        
            $scope.estadoImg =true;
            return;
        }
        
        var promisePost = rutaService.postImagen(formData);        
        promisePost.then(function (d) {           
           toaster.pop('success', "Imagen", "Imágen cambiada corretamente");             
            $('#tabPanels a[href="#tabListado"]').tab('show');
        }, function (err) {                                        
            toaster.pop('error', "Error!", 'Error al cambiar Imagen');                            
            console.log(JSON.stringify(err));
        });
    };   
    
}]);





