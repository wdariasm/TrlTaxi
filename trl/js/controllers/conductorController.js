app.controller("conductorController", ["$scope", "conductorService", "tipoDocumentoService", "escolaridadService", function ($scope, conductorService,tipoDocumentoService,escolaridadService) {
   $scope.Conductor = {};
   $scope.Conductores = [];
   $scope.Novedad={};
   $scope.Novedades=[];
   $scope.TipoDocumentos=[];
   $scope.Escolaridades=[];
   $scope.valCedula = false;
   $scope.editMode = false;
  
  initialize();
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
            Estado: "",
            FechaReg:"",
            NumeroCuenta:"",
            CdPlaca:"",
            Observacion:"",
            TipoDocumento:"",
            Escolaridad:""
        };        
        
    }
  
   
    function loadConductor (){
        var promise = conductorService.getAll();
        promise.then(function(d) {                        
            $scope.Conductores = d.data;
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
   
   
   
   
   
   
    $scope.Guardar = function (){
        
           $scope.Conductor.Nombre = $scope.Conductor.Nombre.toUpperCase();
           $scope.Conductor.Direccion = $scope.Conductor.Direccion.toUpperCase();
           $scope.Conductor.Observacion = $scope.Conductor.Observacion.toUpperCase();
           $scope.Conductor. Escolaridad = $scope.Conductor.Escolaridad.toUpperCase();
           $scope.Conductor. CdPlaca = $scope.Conductor.CdPlaca.toUpperCase();

        var promise;
        if($scope.editMode){            
            promise = conductorService.put($scope.Conductor.IdConductor, $scope.Conductor);
        }else {
            $scope.Conductor.Novedades=$scope.Novedades;
            promise = conductorService.post($scope.Conductor);            
        }
        
        promise.then(function(d) {                        
            loadConductor();
            alert(d.data.message);
             
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        });       
   };
   
   
   
   $scope.AgregarNovedad = function (){
       if (!$scope.Novedad.nvTipo){
            alert("ERROR AL PROCESAR SOLICITUD");  
           return;
       } 
       
       if (!$scope.Novedad.nvDescripcion){
            alert("ERROR AL PROCESAR SOLICITUD");  
           return;
       }  
       
       $scope.Novedades.push($scope.Novedad);
       $scope.Novedad={};
   };
    //edita la Conductor
    $scope.get = function(item) {
        $scope.Conductor=item;
        $scope.editMode = true;
        $scope.title = "EDITAR CONDUCTOR"; 
        $scope.active = "active";
        $('#tabPanels a[href="#tabRegistro"]').tab('show');

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
                    alert("ERROR AL PROCESAR DESACTIVAR / ACTIVAR");
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
                alert("N° de Cedula, ya existe");
             //   Materialize.toast('N° de Identificacion, Ya Existe.. !!', 4000, 'rounded');
            }
        }, function (err) {
            alert("ERROR AL VALIDAR IDENTIFICACION");
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };
 
    loadConductor();
    
}]);


