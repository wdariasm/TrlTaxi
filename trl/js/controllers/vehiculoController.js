app.controller("vehiculoController", ["$scope", "vehiculoService", "marcaService", "tipoVehiculoService",
    "ngTableParams", "toaster", "novedadService","funcionService", "serverData",
    function ($scope, vehiculoService, marcaService, tipoVehiculoService, ngTableParams, toaster, 
    novedadService, funcionService, serverData) {
   $scope.Vehiculo = {};
   $scope.Vehiculos = [];
   $scope.Marcas = [];
   $scope.editMode = false;
   $scope.editNovedad = false;
   $scope.valPlaca = false;
   $scope.ClaseVehiculo = [];
   $scope.Documentos = [];
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
   
   $scope.$parent.SetTitulo("GESTION DE VEHÍCULOS");
   
   function init (){
        $scope.Vehiculo = {            
            IdVehiculo : 0,
            Placa : "",
            Modelo :"",
            Color : "",
            Cilindraje : "",
            Movil : "",
            Estado : "ACTIVO", 
            Propiedad : "PROPIO",            
            FechaArriendo :  moment().format('L'),            
            ClaseVehiculo : 1,
            Tipo : "",
            Runt : "", 
            FProxMantenimiento : moment().format('L'),
            Marca : "",
            NumMotor : "",
            NumSerie : "", 
            NumVin  :"",
            Linea: "",
            TipoContrato : "",
            Empresa: ""            
        };        
    } 
    
    $scope.InitNovedad = function  (){
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
        $scope.editNovedad=false;
    };
   
    $scope.LoadVehiculo = function (){
        var promise = vehiculoService.getAll();
        promise.then(function(d) {                        
            $scope.Vehiculos = d.data;
              $scope.TablaVehiculo.reload();
        }, function(err) {                        
                toaster.pop('error', '¡Error load vehículos!', err.data.error);
                console.log("Some Error Occured " + JSON.stringify(err));
        });             
    };
    $scope.LoadVehiculo();
    
    function loadMarcas (){
        var promise = marcaService.getAll();
        promise.then(function(d) {                        
            $scope.Marcas = d.data; 
            if ($scope.Marcas){                
                $scope.MarcaSelect = d.data[0];
            }           
        }, function(err) {           
                toaster.pop('error', '¡Error!', err.data.error);
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
            toaster.pop('error', '¡Error load tipo vehículo !', err.data.error);                
        }); 
    }
    
    loadMarcas();
    getClaseVehiculo();
    
    function initTabla() {
        $scope.TablaVehiculo = new ngTableParams({
            page: 1,
            count: 12,
            sorting: undefined
        }, {
            filterDelay: 50,
            total: 1000,
            counts : [],
            getData: function (a, b) {
                var c = b.filter().busqueda;
                f = [];
                c ? (c = c.toLowerCase(), f = $scope.Vehiculos.filter(function (a) {
                    return a.Placa.toLowerCase().indexOf(c) > -1 ||
                           a.Movil.toLowerCase().indexOf(c) > -1 ||
                           a.Tipo.toLowerCase().indexOf(c) > -1 ||
                           a.Estado.toLowerCase().indexOf(c) > -1                                                       
                })) : f = $scope.Vehiculos, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
            }
        });
    };
    
    initTabla();
    
    $scope.get = function(item){
        loadNovedad(item.IdVehiculo);
        getDocumentos(item.IdVehiculo);
        $scope.Vehiculo = item;
        $scope.Vehiculo.FechaArriendo = moment($scope.Vehiculo.FechaArriendo).format("L");
        $scope.Vehiculo.FProxMantenimiento = moment($scope.Vehiculo.FProxMantenimiento).format("L");
        $scope.editMode = true;
        $scope.Titulo = "Editando ";
        var pos = funcionService.arrayObjectIndexOf($scope.ClaseVehiculo, parseInt($scope.Vehiculo.ClaseVehiculo), 'tvCodigo');            
            $scope.ClaseSelect =$scope.ClaseVehiculo[pos];
            
        var pos1 = funcionService.arrayObjectIndexOf($scope.Marcas, parseInt($scope.Vehiculo.Marca), 'maCodigo');            
            $scope.MarcaSelect =$scope.Marcas[pos1];            
        $('#tabPanels a[href="#tabRegistro"]').tab('show');
    };
    
    $scope.Nuevo = function (){
        init();
        $('#txtPlaca').focus();
        $scope.editMode = false;
        $scope.Titulo = "Nuevo ";
    };       
   
    $scope.Guardar = function (){                                        
        $scope.Vehiculo.Marca = $scope.MarcaSelect.maCodigo;
        $scope.Vehiculo.Placa = $scope.Vehiculo.Placa.toUpperCase();
        
        if($scope.valPlaca){
            toaster.pop('error','¡Error!', 'Placa ya se encuentra registrada.');
            return;
        }
                
        toaster.pop("wait", "Espere..", "Guardando información");      
        var promise;
        if($scope.editMode){            
            promise = vehiculoService.put($scope.Vehiculo.IdVehiculo, $scope.Vehiculo);
        }else {
            promise = vehiculoService.post($scope.Vehiculo);            
        }
        
        promise.then(function(d) {     
            toaster.clear();
            $scope.LoadVehiculo();
            toaster.pop('success', "Control de Información", d.data.message);     
            $scope.Nuevo();
            if($scope.editMode){
                $('#tabPanels a[href="#tabListado"]').tab('show');
            }
             
        }, function(err) {          
            toaster.pop('error', "¡Error!",  err.data, 0);                
            console.log("Some Error Occured " + JSON.stringify(err));
        });       
   };
 
    init();
    
    // FUNCIONES CARGUE DE IMAGENES 
    
    $scope.VerModalImagenes = function (){
        $("#mdImagenes").modal("show");        
        serverData.data = $scope.Vehiculo;   
        serverData.data.IdMantenimiento =  null;
        $scope.$emit("ImagenVehiculo", "Cargue de documento Vehículo: ");             
    };
    
    
    // FUNCIONES PARA  NOVEDADES 
    
    $scope.VerModalNovedad = function (){        
        $("#mdNovedades").modal("show");
        $scope.TituloNov = "Agregar Novedad ";
        $scope.InitNovedad();        
    };
    
    $scope.GetNovedad = function (item){
        $scope.Novedad = angular.copy(item);                
        $scope.TituloNov = "Editando Novedad "; 
        $scope.Novedad.FechaInicioVigencia =  $scope.ConvertirFecha(item.FechaInicioVigencia);
        $scope.Novedad.FechaExpedicion = $scope.ConvertirFecha(item.FechaExpedicion);        
        $scope.Novedad.FechaVencimiento = $scope.ConvertirFecha(item.FechaVencimiento);        
        $scope.editNovedad = true;
        $("#mdNovedades").modal("show");
    };
        
    
    
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
    
    function getDocumentos(id){
        var promise = vehiculoService.getDocumentos(id);
        promise.then(function(d) {                                                                  
            $scope.Documentos = d.data;            
        }, function(err) {           
                toaster.pop('error','Error','Cargar documentos vehiculo');
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
    
    
            
     function initTablaNovedad() {
        $scope.TablaNovedad = new ngTableParams({
            page: 1,
            count: 10,
            sorting: undefined
        });
    };
    
    initTablaNovedad();
    
    $scope.AgregarNovedad = function (){                
        //$scope.Novedades.push($scope.Novedad);
        if(!$scope.Vehiculo.IdVehiculo){
            toaster.pop("warning",'Validación','No existe un vehículo seleccionado');
            return;
        }
        $scope.Novedad.Entidad =$scope.Novedad.Entidad.toUpperCase();
        $scope.Novedad.Vehiculo =$scope.Vehiculo.IdVehiculo;
        var promise;
        if($scope.editNovedad){            
            promise = novedadService.put($scope.Novedad.IdNovedad, $scope.Novedad);
        }else {
            promise = novedadService.post($scope.Novedad);            
        }
        
        promise.then(function(d) {                        
            loadNovedad($scope.Vehiculo.IdVehiculo);
            toaster.pop('success', "Control de Información", d.data.message);   
            if($scope.editNovedad){
                $("#mdNovedades").modal("hide");
            }
            $scope.InitNovedad();
        }, function(err) {          
            toaster.pop('error', "Error", err.data,0);                
            console.log("Some Error Occured " + JSON.stringify(err));
        });                          
    };
    
    $scope.CambiarFormato=function (variable){
        $scope.Vehiculo[variable] = moment($scope.Vehiculo[variable]).format('L');
    };
        
    $scope.CambiarFormato2=function (variable){
        $scope.Novedad[variable] = moment($scope.Novedad[variable]).format('L');
    };    
    
    $scope.ConvertirFecha =  function (fecha){
        var f = new Date(fecha);       
        return f.toLocaleDateString('en-GB');
    };
    
    $scope.ValidarPlaca = function () {
        $scope.valPlaca = false;
        if (!$scope.Vehiculo.Placa || $scope.editMode) {
            return;
        }
        var promiseGet = vehiculoService.validarPlaca($scope.Vehiculo.Placa);
        promiseGet.then(function (d) {
            if (d.data.Placa) {
                $scope.valPlaca = true;
                toaster.pop('info', '¡Alerta!', 'Placa ya se encuentra registrada.');
            }
        }, function (err) {
            toaster.pop('error', '¡Error!', 'Error al validar placa.');
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };
    
     $scope.VerDesactivar = function(id,  estado) {
        $scope.Estado =estado;
        $scope.IdVehiculoGlobal = id;
        $('#mdConfirmacion').modal('show');         
    };
    $scope.Desactivar = function (){
         var objetc = {
                estado : $scope.Estado
            };
            $('#mdConfirmacion').modal('hide');   
            var promisePut  = vehiculoService.updateEstado($scope.IdVehiculoGlobal, objetc);
                promisePut.then(function (d) {
                    toaster.pop('success', "Control de Información", d.data.message);                 
                    $scope.LoadVehiculo();
            }, function (err) {
                    toaster.pop('error', "¡Error!", err.data.request); 
                    console.log("Some Error Occured "+ JSON.stringify(err));
            });
    };
    
        
   
}]);





