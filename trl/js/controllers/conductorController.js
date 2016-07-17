app.controller("conductorController", ["$scope", "conductorService", "tipoDocumentoService", "escolaridadService","toaster", "ngTableParams", "vehiculoService",
    function ($scope, conductorService,tipoDocumentoService,escolaridadService,toaster,ngTableParams,vehiculoService) {
   $scope.Conductor = {};
   $scope.Conductores = [];
   $scope.Novedad={};
   $scope.Novedades=[];
   $scope.TipoDocumentos=[];
   $scope.Escolaridades=[];
   $scope.LicenciaConduccion={};
   $scope.LicenciasConduccion=[];
   $scope.valCedula = false;
   
   $scope.title="Registro Conductor";
   $scope.TablaConductor = {};
   $scope.TablaNovedad = {};
   $scope.editMode = false;
   $scope.editNovedad = false;
   
    initialize();
    initNovedad();
    initLicencia();
   function initialize() {
        $scope.Conductor = {
            IdConductor :"",
            Cedula: "",
            Nombre: "",
            Direccion: "",
            TelefonoPpal: "",
            TelefonoDos: "",
            TelefonoTres: "",
            Email: "",            
            FechaNacimiento:"",
            FechaIngreso: moment().format('L'),
            Estado: "ACTIVO",
            FechaReg:"",
            NumeroCuenta:"",
            CdPlaca:"",
            Observacion:"",
            TipoDocumento:"",
            Escolaridad:""
        };        
        
    }
    
    $scope.Cambiarformato= function (variable){
        console.log(variable)
        $scope.Conductor[variable] = moment($scope.Conductor[variable]).format('L');
    };  
    
   
    function loadConductor (){
        var promise = conductorService.getAll();
        promise.then(function(d) {                        
            $scope.Conductores = d.data;
            $scope.TablaConductor.reload();
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
    function loadEscolaridades (){
        var promise = escolaridadService.getAll();
        promise.then(function(d) {                        
            $scope.Escolaridades = d.data;
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   loadEscolaridades();
   
   
   
     function loadTipoDocumentos (){
        var promise = tipoDocumentoService.getAll();
        promise.then(function(d) {                        
            $scope.TipoDocumentos = d.data;
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
   loadTipoDocumentos ();
   
   
    function initTabla() {
        $scope.TablaConductor = new ngTableParams({
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
                c ? (c = c.toLowerCase(), f = $scope.Conductores.filter(function (a) {
                    return a.Cedula.toLowerCase().indexOf(c) > -1 ||
                           a.Nombre.toLowerCase().indexOf(c) > -1 ||
                           a.TelefonoPpal.toLowerCase().indexOf(c) > -1 ||
                           a.Estado.toLowerCase().indexOf(c) > -1                                                       
                })) : f = $scope.Conductores, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
            }
        });
    };
    
    initTabla();
   
   
   
    $scope.Guardar = function (){
        
        $scope.Conductor.Nombre = $scope.Conductor.Nombre.toUpperCase();
        $scope.Conductor.Direccion = $scope.Conductor.Direccion.toUpperCase();
        $scope.Conductor.Observacion = $scope.Conductor.Observacion.toUpperCase();
        $scope.Conductor.Escolaridad = $scope.Conductor.Escolaridad.toUpperCase();
        $scope.Conductor.CdPlaca = $scope.Conductor.CdPlaca.toUpperCase();
           //$scope.Novedad.nvDescripcion=$scope.Novedad.nvDescripcion.toUpperCase();
		   
            if ($scope.valCedula){
           toaster.pop('error','¡Error!', 'N° de Cedula ya existe'); 
            return;
             }
             
           if($scope.valPlaca){
            toaster.pop('error','¡Error!', 'Placa no se encuentra registrada');
            return;
        }

        var promise;
        if($scope.editMode){            
            promise = conductorService.put($scope.Conductor.IdConductor, $scope.Conductor);
        }else {
            $scope.Conductor.Novedades=$scope.Novedades;
            promise = conductorService.post($scope.Conductor);            
        }
        
        promise.then(function(d) {                        
            loadConductor();
           toaster.pop('success', "Control de Información", d.data.message); 
             
        }, function(err) {           
                toaster.pop('error', "Error", "ERROR AL PROCESAR SOLICITUD");         
                console.log("Some Error Occured " + JSON.stringify(err));
        });       
   };
   
    //Editar Conductor
    $scope.get = function(item) {
        $scope.Conductor=item;
        $scope.Conductor.FechaNacimiento = moment($scope.Conductor.FechaNacimiento).format("L");
        $scope.Conductor.FechaIngreso = moment($scope.Conductor.FechaIngreso).format("L");
        $scope.editMode = true;
        $scope.title = "Editar Conductor"; 
        $scope.active = "active";
        $('#tabPanels a[href="#tabRegistro"]').tab('show');
        loadNovedad(item.IdConductor);
    };
   
   
   // NOVEDADES
   
    function initNovedad() {
        $scope.Novedad = {
            nvDescripcion:"",
            nvTipo:"CONTRALORIA"  
        };        
        
    }
   
    function loadNovedad (id){
        var promise = conductorService.getNovedad(id);
        promise.then(function(d) {                        
            $scope.Novedades = d.data;
             // $scope.TablaNovedad.reload();
        }, function(err) {           
                toaster.pop('error','Error','No se pudo procesar la solicitud');
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
   $scope.AgregarNovedad = function (){
       if (!$scope.Novedad.nvTipo){
           toaster.pop('warning', "Ingresa el tipo"); 
           return;
       } 
       
       if (!$scope.Novedad.nvDescripcion){
           toaster.pop('warning', "Ingresa la descripcion");
           return;
       }  
       $scope.Novedad.nvDescripcion = $scope.Novedad.nvDescripcion.toUpperCase();
       $scope.Novedades.push($scope.Novedad);
       $scope.Novedad={};
   };
   
    $scope.Nuevo = function (){
        initialize();
        initNovedad();
        $scope.editMode = false;
        $scope.title = "Nuevo Conductor";
    };
	
   
	//Editar Novedad
    $scope.getNovedad = function(item) {
        $scope.Novedad=item;
        $scope.editNovedad = true;
        $scope.active = "active";
    };
    
    
	
    
    //Funcion que elimina
     $scope.Desactivar = function(IdConductor,  Estado) {

        var r = confirm("¿Está seguro de Ejecutar esta Acción?");
        if (r == true) {
            var objetc = {
            Estado : Estado
        };
            var promisePut  = conductorService.updateEstado(IdConductor, objetc);        
                promisePut.then(function (d) {                
               // Materialize.toast(d.data.message, 4000, 'rounded');                
                loadConductor();
            }, function (err) {                              
                    toaster.pop('error', "Error", "ERROR AL DESACTIVAR/ACTIVAR");
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
        }        
    };
    
    

   //Valida si  ya existe la Cedula en la base de datos 
  
      $scope.validarIdentificacion = function () {
        $scope.valCedula = false;
        if (!$scope.Conductor.Cedula) {
            return;
        }        
        var promisePost = conductorService.validarIdentificacion($scope.Conductor.Cedula);
        promisePost.then(function (d) {
            if (d.data.Cedula) {
                $scope.valCedula = true;
                toaster.pop('info', "N° de Identificación ya existe"); 
             //   Materialize.toast('N° de Identificacion, Ya Existe.. !!', 4000, 'rounded');
            }
        }, function (err) {
           toaster.pop('error', "Error", "Error al validar Identificación"); 
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };
    $scope.GuardarNovedad = function (){
         if (!$scope.Novedad.nvTipo){
           toaster.pop('warning', "Ingresa el tipo"); 
           return;
       } 
       
       if (!$scope.Novedad.nvDescripcion){
           toaster.pop('warning', "Ingresa la descripción");
           return;
       }  
        $scope.Novedad.nvDescripcion = $scope.Novedad.nvDescripcion.toUpperCase();
        $scope.Novedad.nvConductor = $scope.Conductor.IdConductor;
        
        var promise;
        if($scope.editNovedad){            
            promise = conductorService.putNovedad($scope.Novedad.nvCodigo, $scope.Novedad);
        }else {           
            promise = conductorService.postNovedad($scope.Novedad);            
        }
        
        promise.then(function(d) {                        
            loadNovedad($scope.Conductor.IdConductor);
           toaster.pop('success', "Control de Información", d.data.message); 
             
        }, function(err) {           
                toaster.pop('error', "Error", "ERROR AL PROCESAR SOLICITUD");         
                console.log("Some Error Occured " + JSON.stringify(err));
        });    
    };
  
    $scope.ValidarPlaca = function () {
        $scope.valPlaca = false;
        if (!$scope.Conductor.CdPlaca|| $scope.editMode) {
            return;
        }
        var promiseGet = vehiculoService.validarPlaca($scope.Conductor.CdPlaca);
        promiseGet.then(function (d) {
            if (!d.data.Placa) {
                $scope.valPlaca = true;
                toaster.pop('info', '¡Alerta!', 'Esta placa no existe');
            }
        }, function (err) {
            toaster.pop('error', '¡Error!', 'Error al validar placa.');
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };
    
    
    //LICENCIA DE CONDUCCION
     function initLicencia() {
        $scope.LicenciaConduccion = {
            IdLicencia:"",
            Numero: "",
            OTLicencia: "",         
            FechaExpedicion:moment().format('L'),
            FechaVencimiento: moment().format('L'),
            Estado: "ACTIVA",
            Categoria:"",
            FechaReg:"",
            lcConductor:""
        };         
    }
    
     $scope.getLicencia = function(item) {
        $scope.LicenciaConduccion=item;
        $scope.editMode = true;
        $scope.active = "active";
    };
    
    function loadLicenciaConduccion (id){
        var promise = conductorService.getLicencia(id);
        promise.then(function(d) {                        
            $scope.LicenciasConduccion = d.data;
             // $scope.TablaNovedad.reload();
        }, function(err) {           
                toaster.pop('error','Error','No se pudo procesar la solicitud');
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
    
    
     $scope.GuardarLicencia = function (){
        
        $scope.LicenciaConduccion.OTLicencia = $scope.LicenciaConduccion.OTLicencia.toUpperCase();
        $scope.LicenciaConduccion.Categoria = $scope.LicenciaConduccion.Categoria.toUpperCase(); 

        var promise;
        if($scope.editMode){            
            promise = conductorService.putLicencia($scope.LicenciaConduccion.IdLicencia, $scope.LicenciaConduccion);
        }else {
            promise = conductorService.postLicencia($scope.LicenciaConduccion);            
        }
        
        promise.then(function(d) {                        
            loadLicenciaConduccion();
           toaster.pop('success', "Control de Información", d.data.message); 
             
        }, function(err) {           
                toaster.pop('error', "Error", "ERROR AL PROCESAR SOLICITUD");         
                console.log("Some Error Occured " + JSON.stringify(err));
        });       
   };
   //cambia el formato de fecha licencia 
    $scope.formatoLicencia= function (variable){
        console.log(variable)
        $scope.LicenciaConduccion[variable] = moment($scope.LicenciaConduccion[variable]).format('L');
    };
    loadConductor(); 
}]);


