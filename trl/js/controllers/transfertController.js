function  transfertController($scope, zonaService, ngTableParams, toaster, transfertService, tipoVehiculoService, 
        plantillaService,  $rootScope, serverData, funcionService) {
            
    $scope.Zonas = [];           
    $scope.Transferts = [];
    $scope.Transfert = {};
    $scope.ClaseVehiculo = [];
    $scope.Plantillas = [];
        
    $scope.editMode = false;                    
    $scope.title = "NUEVA TARIFA TRANSFERT"; 
    $scope.tbTransfert = {};
    
    //COMBOS SELECCIONADOS
    $scope.ZonaOrigen = {};
    $scope.ZonaDestino = {};
    $scope.ClaseSelect = {};
    $scope.PlantillaSelect = {};
    $scope.Mensaje = {};
            
    $scope.$parent.SetTitulo("GESTIÓN DE TARIFAS TRANSFERT");          
    loadZona();        
    getClaseVehiculo();
    
    loadPlantillas();
    init();            
    initTabla();   
    
    $rootScope.$on("cargueTransfert", function (event, data) {        
        loadTransfert(serverData.data.plCodigo);
        
        var pos = funcionService.arrayObjectIndexOf($scope.Plantillas,serverData.data.plCodigo , "plCodigo");
        if(pos != "-1"){
            $scope.PlantillaSelect =  $scope.Plantillas[pos];
        }
        
    });
      
    function loadZona() {
        var promiseGet = zonaService.getAll(); //The Method Call from service
        promiseGet.then(function(pl) {
            $scope.Zonas = pl.data;
            if(pl.data){
                $scope.ZonaOrigen = pl.data[0];
                $scope.ZonaDestino = pl.data[1];
            }
        },
        function(errorPl) {
            toaster.pop("error","¡Error!", "Error al cargar zonas");
            console.log('failure loading Zona', errorPl);
        });
    }
    
    function loadPlantillas() {
        var promiseGet = plantillaService.get(1); //The Method Call from service
        promiseGet.then(function(pl) {
            $scope.Plantillas = pl.data;
            if(pl.data){
                $scope.PlantillaSelect = pl.data[0];                
            }
        },
        function(errorPl) {
            toaster.pop("error","¡Error!", "Error al cargar plantillas de transfert");
            console.log('failure loading Zona', errorPl);
        });
    }
           
    function getClaseVehiculo (){
        var promise = tipoVehiculoService.getAll();
        promise.then(function(d) {                        
            $scope.ClaseVehiculo = d.data;
            if(d.data){
                $scope.ClaseSelect = d.data[0];
            }
        }, function(err) {           
            toaster.pop("error","¡Error!", "Error al cargar tipos de vehículo");         
            console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
    
    function loadTransfert(idPlantilla) {
        $scope.Mensaje.Cargando = true;
        var promiseGet = transfertService.getAll(idPlantilla); //The Method Call from service
        promiseGet.then(function(pl) {
            $scope.Mensaje.Cargando = false;
            $scope.Transferts = pl.data;       
            $scope.tbTransfert.reload();
        },
        function(errorPl) {
            $scope.Mensaje.Cargando = false;
            toaster.pop("error","¡Error!", "Error al cargar tarifas");
            console.log('failure loading Zona', errorPl);
        });
    }
    
    function init(){
        $scope.Transfert = {
            tfCodigo : 0,
            tfNombre : "",
            tfOrigen : "",
            tfDestino : "",
            tfTipoVehiculo : "",
            tfValor : 0,
            tfEstado : "ACTIVO",
            tfUserReg : "",
            tfUserMod : "",
            tfPlantilla : ""
        };
    }
    
    
    function initTabla() {
        $scope.tbTransfert = new ngTableParams({
            page: 1,
            count: 15,
            sorting: undefined
        }, {
            filterDelay: 50,
            total: 1000,
            counts : [],
            getData: function (a, b) {
                var c = b.filter().busqueda;
                f = [];
                c ? (c = c.toLowerCase(), f = $scope.Transferts.filter(function (a) {
                    return a.tfNombre.toLowerCase().indexOf(c) > -1 ||
                           a.tvDescripcion.toLowerCase().indexOf(c) > -1 ||
                            a.znNombre.toLowerCase().indexOf(c) > -1
                })) : f = $scope.Transferts, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
            }
        });
    };                           
       
    $scope.Nuevo = function() {
        init();
        $scope.editMode = false;
        $scope.title = "NUEVA TARIFA TRANSFERT";      
    };
    
    $scope.get = function(item) {                 
        $scope.editMode = true;
        $scope.title = "EDITANDO  TARIFA TRANSFERT";            
        $scope.Transfert = item;                        
    };      

    $scope.Guardar = function (){
        
        if(!$scope.ZonaOrigen){
            toaster.pop('info','¡Alerta!', 'Seleccione la zona origen');
            return;
        }
        
        if(!$scope.ZonaDestino){
            toaster.pop('info','¡Alerta!', 'Seleccione la zona  destino');
            return;
        }               
        
        if(!$scope.ClaseSelect){
            toaster.pop('info','¡Alerta!', 'Seleccione el tipo de vehículo');
            return;
        }                
        
        $scope.Transfert.tfNombre = $scope.Transfert.tfNombre.toUpperCase();
        $scope.Transfert.tfOrigen =$scope.ZonaOrigen.znCodigo;
        $scope.Transfert.tfDestino =$scope.ZonaDestino.znCodigo;
        $scope.Transfert.tfTipoVehiculo = $scope.ClaseSelect.tvCodigo;
        $scope.Transfert.tfUserReg = $scope.$parent.Login.Login;  
        $scope.Transfert.tfPlantilla = $scope.PlantillaSelect.plCodigo;
        
        var promise;
        if($scope.editMode){            
            promise = transfertService.put($scope.Transfert.tfCodigo, $scope.Transfert);
            $scope.Transfert.tfUserMod = $scope.$parent.Login.Login;
        }else {
            promise = transfertService.post($scope.Transfert);            
        }
                                                    
        promise.then(function(d) {            
            toaster.pop('success','¡Información!', d.data.message);
            $scope.Nuevo();
            loadTransfert(serverData.data.plCodigo);
              
        }, function(err) {           
            toaster.pop('error', "¡Error!", err.data);   
            console.log("Some Error Occured " + JSON.stringify(err));
        });  
    };
    
     $scope.VerDesactivar = function(id,  estado) {
        $scope.Estado =estado;
        $scope.IdTranferGlobal = id;
        $('#mdConfirmacion').modal('show');         
    };
    $scope.Desactivar = function (){
         var objetc = {
                estado : $scope.Estado
            };
            $('#mdConfirmacion').modal('hide');   
            var promisePut  = transfertService.updateEstado($scope.IdTranferGlobal, objetc);
                promisePut.then(function (d) {
                    toaster.pop('success', "Control de Información", d.data.message);                 
                    loadTransfert();
            }, function (err) {
                    toaster.pop('error', "¡Error!", err.data.request); 
                    console.log("Some Error Occured "+ JSON.stringify(err));
            });
    };            
};

transfertController.$inject = ['$scope', 'zonaService', 'ngTableParams', 'toaster',"transfertService", 
        "tipoVehiculoService","plantillaService", "$rootScope","serverData", "funcionService"];

app.controller('transfertController', transfertController);