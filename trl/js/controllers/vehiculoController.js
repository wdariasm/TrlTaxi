app.controller("vehiculoController", ["$scope", "vehiculoService", "marcaService", "tipoVehiculoService","ngTableParams", "toaster", "novedadService",
    function ($scope, vehiculoService, marcaService, tipoVehiculoService, ngTableParams, toaster, novedadService) {
   $scope.Vehiculo = {};
   $scope.Vehiculos = [];
   $scope.Marcas = [];
   $scope.editMode = false;
   $scope.ClaseVehiculo = [];
   $scope.TablaVehiculo = {};
   $scope.Titulo ="Nuevo";
   
   $scope.Novedades = [];
   $scope.Novedad = {};
   $scope.TablaNovedad = {};
   $scope.PlacaGlobal = "";
   $scope.IdVehiculoGlobal = "";
   // Para Select
   $scope.MarcaSelect = {};
   $scope.ClaseSelect = {};
   
   function init (){
       $scope.Vehiculo = {
            Placa : "",
            IdVehiculo : 0,
            Color : "",
            Cilindraje : "",
            Movil : "",
            Estado : "ACTIVO", 
            Tipo : "PROPIO",
            FechaArriendo :  moment().format('L'),
            NumPasajeros : 4, 
            ClaseVehiculo : 1,
            Runt : "", 
            FProxMantenimiento : moment().format('L'),
            Marca : ""            
       };        
    } 
    
    function initNovedad  (){
        $scope.Novedad = {
            IdNovedad : 0,
            Codigo : "",
            FechaExpedicion : moment().format('L'),
            FechaInicioVigencia : moment().format('L'),
            FechaVencimiento : moment().add(1,'years').format('L'),
            Entidad : "",
            Estado : "VIGENTE",
            ModServicio : "",
            RadioAccion:  "",
            Vehiculo : "",
            Tipo :"SOAT"
        };        
        $scope.editMode=false;
    }
   
    function loadVehiculo (){
        var promise = vehiculoService.getAll();
        promise.then(function(d) {                        
            $scope.Vehiculos = d.data;
              $scope.TablaVehiculo.reload();
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
            
    }
      loadVehiculo();
    
    function loadMarcas (){
        var promise = marcaService.getAll();
        promise.then(function(d) {                        
            $scope.Marcas = d.data; 
            if ($scope.Marcas){                
                $scope.MarcaSelect = d.data[0];
            }           
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
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
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
    
    loadMarcas();
    getClaseVehiculo();
    
    function initTabla() {
        $scope.TablaVehiculo = new ngTableParams({
            page: 1,
            count: 20,
            sorting: undefined
        }, {
            filterDelay: 50,
            total: 1000,
            counts : [],
            getData: function (a, b) {
                var c = b.filter().busqueda;
                f = [];
                c ? (c = c.toLowerCase(), f = $scope.Taxis.filter(function (a) {
                    return a.Placa.toLowerCase().indexOf(c) > -1 ||
                           a.Movil.toLowerCase().indexOf(c) > -1 ||
                           a.Marca.toLowerCase().indexOf(c) > -1 ||
                           a.Estado.toLowerCase().indexOf(c) > -1                                                       
                })) : f = $scope.Vehiculos, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
            }
        });
    };
    
    initTabla();
    
    $scope.get = function(item){
        $scope.Vehiculo = item;
        $scope.Vehiculo.FechaArriendo = moment($scope.Vehiculo.FechaArriendo).format("L");
        $scope.Vehiculo.FProxMantenimiento = moment($scope.Vehiculo.FProxMantenimiento).format("L");
        $scope.editMode = true;
        $scope.Titulo = "Editando ";
        $('#tabPanels a[href="#tabRegistro"]').tab('show');
    };
    
    $scope.Nuevo = function (){
        init();
        $scope.editMode = false;
        $scope.Titulo = "Nuevo ";
    };
    
    $scope.VerNovedad = function (item){
        $scope.Vehiculo = item;
            loadNovedad(item.IdVehiculo);
        initNovedad();
        $('#tabPanels a[href="#tabNovedad"]').tab('show');
    };
        
   
    $scope.Guardar = function (){                                        
        $scope.Vehiculo.Marca = $scope.MarcaSelect.maCodigo;
        $scope.Vehiculo.Placa = $scope.Vehiculo.Placa.toUpperCase();
        console.log($scope.Vehiculo);
              
        var promise;
        if($scope.editMode){            
            promise = vehiculoService.put($scope.Vehiculo.IdVehiculo, $scope.Vehiculo);
        }else {
            promise = vehiculoService.post($scope.Vehiculo);            
        }
        
        promise.then(function(d) {                        
            loadVehiculo();
            toaster.pop('success', "Comtrol de Información", d.data.message);            
             
        }, function(err) {          
            toaster.pop('error', "Error", "ERROR AL PROCESAR SOLICITUD");                
            console.log("Some Error Occured " + JSON.stringify(err));
        });       
   };
 
    init();
    
    
    // FUNCIONES PARA  NOVEDADES 
    function loadNovedad (id){
        var promise = vehiculoService.getNovedad(id);
        promise.then(function(d) {                        
            $scope.Novedades = d.data;
              $scope.TablaNovedad.reload();
        }, function(err) {           
                toaster.pop('error','Error','No se pudo procesar la solicitud');
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
            
     function initTablaNovedad() {
        $scope.TablaNovedad = new ngTableParams({
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
                c ? (c = c.toLowerCase(), f = $scope.Taxis.filter(function (a) {
                    return a.Codigo.toLowerCase().indexOf(c) > -1 ||
                           a.Estado.toLowerCase().indexOf(c) > -1 ||
                           a.Tipo.toLowerCase().indexOf(c) > -1 ||
                           a.FechaVencimiento.indexOf(c) > -1                                                       
                })) : f = $scope.Novedades, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
            }
        });
    };
    
    initTablaNovedad();
    
    $scope.AgregarNovedad = function (){                
        //$scope.Novedades.push($scope.Novedad);
        if(!$scope.Vehiculo.IdVehiculo){
            toaster.pop("warning",'Validación','No existe un veículo seleccionado');
            return;
        }
        $scope.Novedad.Entidad =$scope.Novedad.Entidad.toUpperCase();
        $scope.Novedad.Vehiculo =$scope.Vehiculo.IdVehiculo;
        var promise;
        if($scope.editMode){            
            promise = novedadService.put($scope.Novedad.IdNovedad, $scope.Novedad);
        }else {
            promise = novedadService.post($scope.Novedad);            
        }
        
        promise.then(function(d) {                        
            loadNovedad($scope.Vehiculo.IdVehiculo);
            toaster.pop('success', "Control de Información", d.data.message);            
            initNovedad();
        }, function(err) {          
            toaster.pop('error', "Error", "Error al procesar solicitud");                
            console.log("Some Error Occured " + JSON.stringify(err));
        });                          
    };
        
   
}]);





