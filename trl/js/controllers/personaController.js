app.controller('personaController', ['$scope', 'personaService', 'tipoDocumentoService', 'perfilService', 'toaster', 'usuarioService',
    function($scope, personaService, tipoDocumentoService, perfilService, toaster, usuarioService) {
           
    $scope.Personas = [];        
    $scope.Persona = {};    
    $scope.Permisos =  [];
    $scope.title = "Nuevo Registro";
    $scope.active = "";
    $scope.editMode = false;
    
    $scope.Perfil= []; // Roles o Perfiles
    $scope.Bahias = [];
    $scope.valUser = false; // Validar si el Persona Existe    
    $scope.valPass =false; // Validar Contraseña Iguales
       
    $scope.TipoDocumentos =[];
    $scope.TipoSelect ={};        
       
    $scope.User = {};
    
    loadPersonas();        
        
    
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
            Clave: ""
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
    loadTipoDocumentos();
    
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
    
    loadPermisos();
           
    $scope.permisosByPerfil= function(){
        $("input[name='misPermisos[]']").prop('checked', false);
        if ($scope.editMode){
            return;
        }
        var promiseGet = perfilService.getPermisoByPerfil(2); 
        promiseGet.then(function (item) {                 
            $.each(item.data, function(i, item){                        
                $('input[name="misPermisos[]"]').each(function() {                            
                    if (this.id==item.IdPermiso){
                        document.getElementById(this.id).checked = true;
                        return;
                    }
                });
            });
        },
        function (errorPl) {
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
        $scope.title = "EDITAR USUARIO";
        $scope.active = "active";
        $scope.Persona = usuario;                        
       $('#tabPanels a[href="#tabRegistro"]').tab('show');   
    };
    
    $scope.CambiarPass = function(id, nombre, apellido) {         
        $scope.User = {
            Cedula : id, 
            apellido : apellido,
            nombre : nombre,
            Clave : "", 
            ClaveConf : ""
        };
        $('ul.tabs').tabs('select_tab', 'tabPersona3');        
    };
    
    $scope.cancelar = function (){        
        $scope.valPass = false;
        $scope.User = {
            Cedula : "", 
            apellido : "",
            nombre : "",
            Clave : "", 
            ClaveConf : ""
        };
        $('ul.tabs').tabs('select_tab', 'tabPersona1');
    };
    
    $scope.guardarPass = function (){
        $scope.valPass = false;
        if ($scope.User.Clave != $scope.User.ClaveConf){
            $scope.valPass = true;
            return;
        }
        
        var object = {            
            Clave:$scope.User.Clave            
        };
        
        var promise = personaService.udpatePass($scope.User.Cedula, object);       
        promise.then(function(d) {            
            Materialize.toast(d.data.message+'..!!', 4000, 'rounded');
            $scope.cancelar();            
        }, function(err) {           
                alert("ERROR AL CAMBIAR CONTRASEÑA");           
                console.log("Some Error Occured " + JSON.stringify(err));
        });     
        
    };
    
    
    $scope.Guardar = function() {       
        if(!$scope.Persona.Cedula || $scope.Persona.Cedula === ""){
            toaster.pop('warning', '¡Alerta!', 'Por favor ingrese la identificación');
            return;
        }
        
        var Npermisos = $('input[name="misPermisos[]"]:checked').length;        
        if (Npermisos === 0){
            toaster.pop('warning', '¡Alerta!', 'Por favor seleccione uno de los permisos');
            return;
        }        
                
        $scope.Persona.MovilDos  =  (!$scope.Persona.MovilDos) ? "" : $scope.Persona.MovilDos;                        
        $scope.Persona.Nombre = $scope.Persona.Nombre.toUpperCase();
        $scope.Persona.Login = $scope.Persona.Login.toUpperCase();        
        $scope.Persona.TipoDocumento = $scope.TipoSelect.tdCodigo;
        
        var promise;
        if($scope.editMode){            
            promise = personaService.put($scope.Persona.IdPersona, $scope.Persona);
        }else {
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
        var modC="0",  modV="0", modCo="0" , modR="0",  modCc="0", modP="0";
        var vecPermiso = [];
        $('input[name="misPermisos[]"]:checked').each(function() { 
            var modulo= document.getElementById("hd"+this.id).value;
            switch (modulo) {
                case "CONFIGURACION": 
                    modC="1";
                    break;                
                case "VEHICULOS":  
                    modV="1";
                    break;                    
                case "CONDUCTORES":
                    modCo="1";
                    break;                    
                case "REPORTES":
                    modR="1";
                    break; 
                case "CONTRATOS":
                    modCc="1";
                    break;
                case "PERSONAL":
                    modP="1";
                    break;                
            }            
            var ObjPermiso = {
                "idPermiso" : this.id
            };
            vecPermiso.push(ObjPermiso);
        });         
        $scope.Persona.Permisos = vecPermiso;
        $scope.Persona.Modulo = modC + modCo + modCc + modP + modR + modV;                
        item.ClienteId = null;
        item.ConductorId = null;
        item.TipoAcceso =2;
        item.Contrato = 0;
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
}]);


