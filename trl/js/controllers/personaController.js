app.controller('personaController', ['$scope', 'personaService', 'tipoDocumentoService', 'perfilService', 'toaster', 'usuarioService', "funcionService",
    function($scope, personaService, tipoDocumentoService, perfilService, toaster, usuarioService, funcionService) {
           
    $scope.Personas = [];        
    $scope.Persona = {};    
    $scope.Permisos =  [];
    $scope.title = "Nuevo Registro";    
    $scope.editMode = false;        
    $scope.valUser = false; // Validar si el Persona Existe   
    $scope.ValLogin = false;
       
    $scope.TipoDocumentos =[];
    $scope.TipoSelect ={};                       
    
    loadPersonas();  
    loadTipoDocumentos();
    loadPermisos(); 
        
    $scope.$parent.SetTitulo("GESTION DE PERSONAL");
    initialize();
    
    function initialize() {
        $scope.Persona = {
            IdPersona : "",
            Cedula: "",
            Nombre: "",            
            Direccion: "",
            MovilPpal: "",
            MovilDos : "",
            Correo: "",           
            Estado:'ACTIVO',           
            TipoDocumento :'',
            Login :"",
            Clave: "",
            Permisos : []
        };  
    }
    
    

    function loadPersonas() {
        var promiseGet = personaService.getAll(); //The Method Call from service
        promiseGet.then(function(pl) {
            $scope.Personas = pl.data;
        },
        function(errorPl) {
            console.log('failure loading personal', errorPl);
        });
    }        
    
    function loadTipoDocumentos (){
        var promise = tipoDocumentoService.getAll();
        promise.then(function(d) {                        
            $scope.TipoDocumentos = d.data;                        
            if(d.data){
               $scope.TipoSelect = d.data[0];
            }
        }, function(err) {           
            toaster.pop('error','¡Error!', "Error al cargar tipos de documento");           
            console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }    
    
    function loadPermisos(){
        var promiseGet = perfilService.getPermisos(); //The Method Call from service        
        promiseGet.then(function (item) {
            $scope.Permisos = item.data;
            if(item.data){
                $scope.permisosByPerfil();
            }
        },
        function (errorPl) {
            toaster.pop('error','¡Error!', "Error al cargar permisos");  
            console.log('failure loading Paises', errorPl);
        });   
    }
                           
    $scope.permisosByPerfil= function(){        
        if($scope.editMode) return;               
        $scope.Persona.Permisos = [];       
        var promiseGet = perfilService.getPermisoByPerfil(2); 
        promiseGet.then(function (d) {                             
            if(d.data.length){                
                $scope.Persona.Permisos = angular.copy(d.data);
            }
        },
        function (errorPl) {
            toaster.pop('error','¡Error!', "Error al cargar permisos del perfil seleccionado");  
            console.log('error al cargar permisos', errorPl);
        });
    };
        
        
    $scope.Nuevo = function() {
        initialize();
        $scope.editMode = false;
        $scope.title = "Nuevo Registro";
        $scope.active = "";    
        loadPermisos();
    };

    $scope.get = function(usuario) {
        $scope.editMode = true;
        $scope.title = "Editando Empleado";
        $scope.active = "active";
        $scope.Persona = usuario;   
        console.log($scope.Persona);
       $('#tabPanels a[href="#tabRegistro"]').tab('show');   
    };
       
    $scope.Guardar = function() {       
        if(!$scope.Persona.Cedula || $scope.Persona.Cedula === ""){
            toaster.pop('warning', '¡Alerta!', 'Por favor ingrese la identificación');
            return;
        }                                       
                
        $scope.Persona.MovilDos  =  (!$scope.Persona.MovilDos) ? "" : $scope.Persona.MovilDos;                        
        $scope.Persona.Nombre = $scope.Persona.Nombre.toUpperCase();               
        $scope.Persona.TipoDocumento = $scope.TipoSelect.tdCodigo;
        
        var promise;
        if($scope.editMode){            
            promise = personaService.put($scope.Persona.IdPersona, $scope.Persona);
        }else {
            
            if(!$scope.Persona.Login){
                toaster.pop('info', '¡Alerta!', 'Ingrese el nombre de usuario');
                return;
            }
            
            if ($scope.Persona.Permisos.length === 0){
                toaster.pop('info', '¡Alerta!', 'Seleccione al menos un permiso');
                return;            
            }
            
            if($scope.ValLogin){
                toaster.pop('error', '¡Alerta!', 'Nombre de usuario ya existe en el sistema');
                return;   
            }
                        
            $scope.Persona.Login = $scope.Persona.Login.toUpperCase(); 
            promise = personaService.post($scope.Persona);            
        }
        
        promise.then(function(d) {             
            if (d.data.request > 0  && !$scope.editMode){
                $scope.Persona.PersonaId = d.data.request;
                    guardarUsuario($scope.Persona);
            }else{
                toaster.pop('success', 'Control de información', d.data.message);
                $scope.Nuevo();            
            }                                    
           $('#tabPanels a[href="#tabListado"]').tab('show');
        }, function(err) {           
            toaster.pop('error', "¡Error!", err.data.request);          
            console.log("Some Error Occured " + JSON.stringify(err));
        });        
    };
    
    function guardarUsuario (item){                  
        $scope.Persona.Modulo = funcionService.GetModuloUser($scope.Persona.Permisos);                
        item.ClienteId = null;
        item.ConductorId = null;
        item.TipoAcceso =2;
        item.Contrato = 0;
        item.Email  = $scope.Persona.Correo;
        var promise = usuarioService.post(item);                            
        promise.then(function(d) {                         
            toaster.pop('success', 'Control de información', d.data.message);
            $scope.Nuevo();                        
            $('#tabPanels a[href="#tabListado"]').tab('show');
        }, function(err) {           
            toaster.pop('error', "¡Error!", err.data.request);          
            console.log("Some Error Occured " + JSON.stringify(err));
        });        
    }
    
    $scope.Desactivar = function(idUser,  Estado) {
        
        var r = confirm("¿Está seguro de Ejecutar esta Acción? ("+Estado+")");
        if (r == true) {
            var objetc = {
            Estado : Estado
        };
            var promiseDelete  = personaService.updateEstado(idUser, objetc);        
                promiseDelete.then(function (d) {                
                Materialize.toast(d.data.message, 4000, 'rounded');                
                loadPersonas();                
            }, function (err) {                              
                    alert("ERROR AL PROCESAR DESACTIVAR / ACTIVAR");
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
        } 
        
    };    
    
    $scope.validarUser = function () {
        if (!$scope.Persona.Cedula) {
            return;
        }
        $scope.valUser = false;
        var promisePost = personaService.validarUser($scope.Persona.Cedula);
        promisePost.then(function (d) {
            if (d.data.idPersona) {
                $scope.valUser = true;
                Materialize.toast('Cedula, Ya Existe.. !!', 4000, 'rounded');
            }
        }, function (err) {
            alert("ERROR AL PROCESAR SOLICITUD");
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };
    
    $scope.ValidarLogin = function () {
        $scope.ValLogin = false;
        if($scope.editMode) return;
        if (!$scope.Persona.Login) {
            toaster.pop('info','¡Alerta!', 'Por favor ingrese el Login');
            return;
        }        
        var promisePost = usuarioService.validar($scope.Persona.Login);
        promisePost.then(function (d) {
            if (d.data.Login) {
                $scope.ValLogin = true;
                toaster.pop('info',  "Nombre de usuario ya existe"); 
            }
        }, function (err) {
           toaster.pop('error', "Error", "Error al validar nombre de usuario"); 
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };
}]);


