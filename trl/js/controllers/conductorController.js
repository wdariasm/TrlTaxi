app.controller("conductorController", ["$scope", "conductorService", "tipoDocumentoService", "escolaridadService","toaster", function ($scope, conductorService,tipoDocumentoService,escolaridadService,toaster) {
   $scope.Conductor = {};
   $scope.Conductores = [];
   $scope.Novedad={};
   $scope.Novedades=[];
   $scope.TipoDocumentos=[];
   $scope.Escolaridades=[];
   $scope.valCedula = false;
   
   $scope.title="Registro Conductor";
   $scope.TablaConductor = {};
   $scope.editMode = false;
   
  initialize();
  initNovedad();
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
            FechaIngreso:"",
            Estado: "ACTIVO",
            FechaReg:"",
            NumeroCuenta:"",
            CdPlaca:"",
            Observacion:"",
            TipoDocumento:"",
            Escolaridad:""
        };        
        
    }
    
    
    
      function initNovedad() {
        $scope.Novedad = {
            nvDescripcion:"",
            nvTipo:"CONTRALORIA"
            
        };        
        
    }

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
           $scope.Conductor. Escolaridad = $scope.Conductor.Escolaridad.toUpperCase();
           $scope.Conductor. CdPlaca = $scope.Conductor.CdPlaca.toUpperCase();
		   
		    if ($scope.valIdentifiacion){
            toaster.pop('info', "Info", "N° de Cédula ya existe "); 
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
   
   
   
   $scope.AgregarNovedad = function (){
       if (!$scope.Novedad.nvTipo){
           toaster.pop('error', "Error", "ERROR AL PROCESAR SOLICITUD"); 
           return;
       } 
       
       if (!$scope.Novedad.nvDescripcion){
           toaster.pop('error', "Error", "ERROR AL PROCESAR SOLICITUD");
           return;
       }  
       
       $scope.Novedades.push($scope.Novedad);
       $scope.Novedad={};
   };
   
    $scope.Nuevo = function (){
        initialize();
        $scope.editMode = false;
        $scope.title = "Nuevo Conductor";
    };
	
    //edita la Conductor
    $scope.get = function(item) {
        $scope.Conductor=item;
        $scope.editMode = true;
        $scope.title = "EDITAR CONDUCTOR"; 
        $scope.active = "active";
        $('#tabPanels a[href="#tabRegistro"]').tab('show');

    };
	
	 $scope.getNovedad = function(item) {
        $scope.Novedad=item;
        $scope.editMode = true;
        $scope.title = "Editar Novedad"; 
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
                    toaster.pop('error', "Error", "ERROR AL PROCESAR SOLICITUD");
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
                toaster.pop('Warning', "N° de Identificacion ya existe"); 
             //   Materialize.toast('N° de Identificacion, Ya Existe.. !!', 4000, 'rounded');
            }
        }, function (err) {
           toaster.pop('error', "Error", "ERROR AL VALIDAR IDENTIFICACIÓN"); 
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };
 
    loadConductor();
    
}]);


