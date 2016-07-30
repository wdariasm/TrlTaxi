app.controller('transfertController',['$scope', 'zonaService', 'ngTableParams', 'toaster',"transfertService", "tipoVehiculoService",
    function ($scope,  zonaService, ngTableParams, toaster, transfertService, tipoVehiculoService) {
    $scope.Zonas = [];           
    $scope.Transferts = [];
    $scope.Transfert = {};
    $scope.ClaseVehiculo = [];
        
    $scope.editMode = false;                    
    $scope.title = "NUEVA TARIFA TRANSFERT"; 
    $scope.tbTransfert = {};
    
    //COMBOS SELECCIONADOS
    $scope.ZonaOrigen = {};
    $scope.ZonaDestino = {};
    $scope.ClaseSelect = {};
            
    $scope.$parent.SetTitulo("GESTIÓN DE TARIFAS TRANSFERT");          
    loadZona();        
    getClaseVehiculo();
    loadTransfert();
    init();        
    
    initTabla();   
      
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
            toaster.pop("error","¡Error!", "Eror al cargar zonas");
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
            toaster.pop("error","¡Error!", "Eror al cargar tipos de vehículo");         
            console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
    
    function loadTransfert() {
        var promiseGet = transfertService.getAll(); //The Method Call from service
        promiseGet.then(function(pl) {
            $scope.Transferts = pl.data;       
            $scope.tbTransfert.reload();
        },
        function(errorPl) {
            toaster.pop("error","¡Error!", "Eror al cargar tarifas");
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
            tfUserMod : ""
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
                           a.tvDescripcion.toLowerCase().indexOf(c) > -1                                                       
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
        
        if ($scope.ZonaOrigen.znCodigo === $scope.ZonaDestino.znCodigo){
            toaster.pop('info','¡Alerta!', 'Zona destino debe ser diferente a zona origen');
            return;
        }
        
        if(!$scope.ClaseSelect){
            toaster.pop('info','¡Alerta!', 'Seleccione el tipo de vehículo');
            return;
        }                
        
        $scope.Transfert.tfOrigen =$scope.ZonaOrigen.znCodigo;
        $scope.Transfert.tfDestino =$scope.ZonaDestino.znCodigo;
        $scope.Transfert.tfTipoVehiculo = $scope.ClaseSelect.tvCodigo;
        $scope.Transfert.tfUserReg = $scope.$parent.Login.Login;                
        
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
            loadTransfert();
              
        }, function(err) {           
            toaster.pop('error', "¡Error!", err.data.request);   
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
}]);


