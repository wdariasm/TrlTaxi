app.controller("trasladoController", ["$scope", "$rootScope", "serverData", "trasladoService",
    "tipoVehiculoService", "departamentoService", "toaster","ngTableParams","plantillaService", "funcionService",
function ($scope, $rootScope, serverData, trasladoService, tipoVehiculoService,departamentoService, 
    toaster,ngTableParams,plantillaService, funcionService) {
        
    $scope.Traslado= {};
    $scope.Traslados= [];
    $scope.TipoVehiculos= [];
    $scope.DtoOrigen=[];
    $scope.DtoDestino=[];
    $scope.Municipios=[];
    $scope.MunicipiosDestino = [];
    $scope.Plantillas=[];
    $scope.IdTrasladopGlobal="";
    $scope.editMode = false;
  
    $scope.title = "Nuevo Traslado"; 
    $scope.VehiculoSelect ={}; 
    $scope.MunSelect={};
    $scope.MuniSelect={};
    $scope.DeptSelect={};
    $scope.DepDestinoSelect={};
    $scope.PlantillaSelect={};
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
            tlEstado : "ACTIVO",
            tlPlantilla:""
           
        };   
       
    }
    initTraslado();
    
    $rootScope.$on("cargueTraslado", function (event, data) {        
        loadTraslado(serverData.data.plCodigo);        
        var pos = funcionService.arrayObjectIndexOf($scope.Plantillas,serverData.data.plCodigo , "plCodigo");
        if(pos != "-1"){
            $scope.PlantillaSelect =  $scope.Plantillas[pos];
        }
        
    });

    function loadTraslado (id){
        var promise = trasladoService.getAll(id);
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
   
   
    function loadPlantilla(){
        var promise = plantillaService.get(4);
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
    
    loadPlantilla();
    
    function loadDepartamento(){
        var promise = departamentoService.getAll();
        promise.then(function(d) {                        
            $scope.DtoOrigen = d.data;
             if(d.data){
                $scope.DeptSelect = d.data[0];
                $scope.DepDestinoSelect = d.data[1];                
                loadMunicipio($scope.DeptSelect.dtCodigo, 'Municipios', 'MunSelect');
                setTimeout(function (){                    
                    loadMunicipio($scope.DepDestinoSelect.dtCodigo, 'MunicipiosDestino','MuniSelect');
                },1000);
                
            }                                                
         
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar Departamentos");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
    loadDepartamento();
    
    function loadMunicipio (dtCodigo, modelo , combo){        
        var promise = departamentoService.getMunicipios(dtCodigo);
        promise.then(function(d) {                        
            $scope[modelo] = d.data;
             if(d.data){
               $scope[combo] = d.data[0];               
            }
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar Municipios");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }    
    
      $scope.CambiaDept=function(){               
        loadMunicipio($scope.DeptSelect.dtCodigo, 'Municipios', 'MunSelect');  
    };
    
     $scope.CambiaDepto=function(){               
        loadMunicipio($scope.DepDestinoSelect.dtCodigo, 'MunicipiosDestino','MuniSelect');
    };
   
   $scope.Guardar = function (){
       
        if(!$scope.frmTraslado.$valid){
            toaster.pop('error','¡Error!', 'Por favor ingrese los datos requeridos (*).');
            return;
        }
       
       $scope.Traslado.tlTipoVehiculo = $scope.VehiculoSelect.tvCodigo;
       $scope.Traslado.tlCiudadOrigen= $scope.MunSelect.muCodigo;
       $scope.Traslado.tlCiudadDestio = $scope.MuniSelect.muCodigo;
       $scope.Traslado.tlNombre= $scope.Traslado.tlNombre.toUpperCase();   
       $scope.Traslado.tlPlantilla= $scope.PlantillaSelect.plCodigo;
        var promise;
        if($scope.editMode){            
            promise = trasladoService.put($scope.Traslado.tlCodigo, $scope.Traslado);
        }else {
            promise = trasladoService.post($scope.Traslado);            
        }
        
        promise.then(function(d) {                        
            
            toaster.pop('success', "Control de Información", d.data.message); 
            initTraslado();
            loadTraslado($scope.PlantillaSelect.plCodigo);
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
      $scope.VerDesactivarTras = function(tlCodigo,  tlEstado) {
        $scope.tlEstado =tlEstado;
        $scope.IdTrasladopGlobal = tlCodigo;
        $('#mdConfir').modal('show');         
    };
    
    //Funcion que elimina
     $scope.DesactivarTraslado = function() {
         var objetc = {
            tlEstado : $scope.tlEstado
        };
            $('#mdConfir').modal('hide'); 
            var promisePut  = trasladoService.updateEstado($scope.IdTrasladopGlobal, objetc);        
                promisePut.then(function (d) {                
                 toaster.pop('success', "Control de Información", d.data.message);                 
                loadTraslado($scope.PlantillaSelect.plCodigo);
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
}]);








