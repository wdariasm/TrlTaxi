app.controller('transfertController',['$scope', 'zonaService', 'ngTableParams', 'toaster',"transfertService",
    function ($scope,  zonaService, ngTableParams, toaster, transfertService) {
    $scope.Zonas = [];           
    $scope.Transferts = [];
    $scope.Transfert = {};
    
    $scope.Puntos = [];    
    $scope.editMode = false;
    $scope.mapZona;
    $scope.markerZ = null;        
    $scope.vecPoligono = new Array(); /// Vector de Poligonos
    $scope.poly = null;
    $scope.tbZona = {}; // Para Paginacion
    
    $scope.title = "NUEVA TARIFA TRANSFERT";                    
    
    //COMBOS SELECCIONADOS
    $scope.ZonaOrigen = {};
    $scope.ZonaDestino = {};
            
    $scope.$parent.SetTitulo("GESTIÓN DE TARIFAS TRANSFERT");          
    loadZona();
    initTabla();        
      
    function loadZona() {
        var promiseGet = zonaService.getAll(); //The Method Call from service
        promiseGet.then(function(pl) {
            $scope.Zonas = pl.data;
            if(pl.data){
                $scope.ZonaOrigen = pl.data[0];
                $scope.ZonaOrigen = pl.data[1];
            }
        },
        function(errorPl) {
            toaster.pop("error","¡Error!", "Eror al cargar zonas");
            console.log('failure loading Zona', errorPl);
        });
    }
    
    
    function initTabla() {
        $scope.tbZona = new ngTableParams({
            page: 1,
            count: 15,
            sorting: undefined
        }, {
            filterDelay: 50,
            total: 1000,
            counts : [],
            getData: function (a, b) {
                var c = b.filter().filtroT;
                f = [];
                c ? (c = c.toLowerCase(), f = $scope.Transferts.filter(function (a) {
                    return a.tfNombre.toLowerCase().indexOf(c) > -1 ||
                           a.tfTipoVehiculo.toLowerCase().indexOf(c) > -1                                                       
                })) : f = $scope.Transferts, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
            }
        });
    };                           
       
    $scope.nuevo = function() {
        $scope.funcion.init();
        $scope.editMode = false;
        $scope.title = "NUEVA ZONA";
    };
    
    $scope.get = function(item) {         
        $scope.funcion.init();
        $scope.editMode = true;
        $scope.title = "EDITAR ZONA";         
        $scope.Transfert = item;        
        getPuntos(item.znCodigo);        
    };      

    $scope.guardar = function (){
        
       
        var promise;
        if($scope.editMode){            
            promise = zonaService.put($scope.Zona.znCodigo, $scope.Transfert);
        }else {
            promise = zonaService.post($scope.Transfert);            
        }
                                                    
        promise.then(function(d) {            
            toaster.pop('success','¡Información!', d.data.message);
            $scope.nuevo();
            loadZona();           
        }, function(err) {           
            toaster.pop('error', "¡Error!", err.data.request);   
            console.log("Some Error Occured " + JSON.stringify(err));
        });  
    };
    
     $scope.VerEliminar= function(znCodigo) {
        $scope.znCodigo =znCodigo;
        
        $('#mdConfirmacion').modal('show');         
    };
    
    //Funcion que elimina
     $scope.eliminar = function() {
         var objetc = {
            znCodigo :$scope.znCodigo
        };
            $('#mdConfirmacion').modal('hide'); 
            var promiseDel  = zonaService.delete($scope.znCodigo, objetc);        
                promiseDel.then(function (d) {                
                 toaster.pop('success', "Control de Información", d.data.message);                 
                 loadZona();
            }, function (err) {                              
                     toaster.pop('error', "¡Error!", err.data.request);
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
                
    };                
}]);


