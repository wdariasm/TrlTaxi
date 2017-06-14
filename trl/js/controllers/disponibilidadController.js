app.controller("disponibilidadController", ["$scope", "$rootScope", "disponibilidadService","tipoVehiculoService", "toaster",
     "serverData", "funcionService", "plantillaService",
function ($scope, $rootScope, disponibilidadService, tipoVehiculoService,toaster, serverData, funcionService, plantillaService) {
    
    $scope.Disponibilidad= {};
    $scope.Disponibilidades= [];
    $scope.TipoVehiculos= [];
    $scope.IdDispGlobal="";
    $scope.editMode = false;
    $scope.title = "NUEVA DISPONIBILIDAD"; 
    $scope.TipoSelect ={}; 
    $scope.PlantillaSelect = {};
    $scope.Plantillas = [];
   
    $scope.$parent.SetTitulo("DISPONIBILIDAD");
    
    function initDisponibilidad() {
        $scope.Disponibilidad = {
            dpCodigo:"",
            dpNombre:"",
            dpValorHora: 0,
            dpEstado : "ACTIVO",
            dpTipoVehiculo :'',
            dpValorCliente : 0
        };           
    }
    initDisponibilidad();
    
     $rootScope.$on("cargueDisponibilidad", function (event, data) {        
        loadDisponibilidad(serverData.data.plCodigo);
        
        var pos = funcionService.arrayObjectIndexOf($scope.Plantillas,serverData.data.plCodigo , "plCodigo");
        if(pos != "-1"){
            $scope.PlantillaSelect =  $scope.Plantillas[pos];
        }
        
    });

    function loadDisponibilidad (id){
        var promise = disponibilidadService.getAll(id);
        promise.then(function(d) {                        
            $scope.Disponibilidades = d.data;
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar Disponibilidad");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
    
    function loadPlantilla() {
        var promise = plantillaService.get(2);
        promise.then(function (d) {
            $scope.Plantillas = d.data;
            if (d.data) {
                $scope.PlantillaSelect = d.data[0];
            }
        }, function (err) {
            toaster.pop('error', '¡Error!', "Error al cargar Plantillas");
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    }
    
    loadPlantilla();
      
    function loadTipoVehiculo(){
        var promise = tipoVehiculoService.getAll();
        promise.then(function(d) {                        
            $scope.TipoVehiculos = d.data;
             if(d.data){
               $scope.TipoSelect = d.data[0];
            }
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar Tipo de Vehiculo");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
    
    loadTipoVehiculo();
   
   $scope.Guardar = function (){
       
        if(!$scope.frmDisponibilidad.$valid){
            toaster.pop('error','¡Error!', 'Por favor ingrese los datos requeridos (*).');
            return;
        }
        
        $scope.Disponibilidad.dpTipoVehiculo = $scope.TipoSelect.tvCodigo;
        $scope.Disponibilidad.dpNombre = $scope.Disponibilidad.dpNombre.toUpperCase();                           
        $scope.Disponibilidad.dpPlantilla= $scope.PlantillaSelect.plCodigo;
        
        var promise;
        if($scope.editMode){            
            promise = disponibilidadService.put($scope.Disponibilidad.dpCodigo, $scope.Disponibilidad);
        }else {
            promise = disponibilidadService.post($scope.Disponibilidad);            
        }
        
        promise.then(function(d) {                        
            loadDisponibilidad($scope.PlantillaSelect.plCodigo);
            toaster.pop('success', "Control de Información", d.data.message); 
            $scope.nuevo();
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
                loadDisponibilidad($scope.PlantillaSelect.plCodigo);
            }, function (err) {                              
                     toaster.pop('error', "Error", "Error al Desactivar Disponibilidad"); ;
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
   
     };
    
}]);


