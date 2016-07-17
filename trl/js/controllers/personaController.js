app.controller('personaController', ['$scope', 'personaService', 'tipoDocumentoService', function($scope, personaService, tipoDocumentoService) {
           
    $scope.Personas = [];        
    $scope.Persona = {};    
    
    $scope.title = "NUEVO USUARIO";
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
        
    
    $scope.$parent.SetTitulo("GESTION DE USUARIOS");
    initialize();
    
    function initialize() {
        $scope.Persona = {
            IdPersona : "",
            Cedula: "",
            Nombres: "",            
            Direccion: "",
            MovilPpal: "",
            MovilDos : "",
            Correo: "",           
            Estado:'ACTIVO',           
            TipoDocumento :'',
            Usuario :"",
            Clave: ""
        };  
    }
    
    

    function loadPersonas() {
        var promiseGet = personaService.getAll(); //The Method Call from service
        promiseGet.then(function(pl) {
            $scope.Personas = pl.data;
        },
        function(errorPl) {
            console.log('failure loading usuarios', errorPl);
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
    
    function loadPerfil(){         
        var promiseGet = personaService.perfil();
        promiseGet.then(function (item) {
            $scope.Perfil = item.data;
        },
        function (errorPl) {
            console.log('failure loading Paises', errorPl);
        });
    }   
    
    function loadBahia(){         
        var promiseGet = personaService.Bahias();
        promiseGet.then(function (item) {
            $scope.Bahias = item.data;
        },
        function (errorPl) {
            console.log('failure loading Paises', errorPl);
        });
    }                            

    $scope.nuevo = function() {
        initialize();
        $scope.editMode = false;
        $scope.title = "NUEVO USUARIO";
        $scope.active = "";        
    };

    $scope.get = function(usuario) {
        $scope.editMode = true;
        $scope.title = "EDITAR USUARIO";
        $scope.active = "active";
        $scope.Persona = usuario;                
        
        $('ul.tabs').tabs('select_tab', 'tabPersona2');        
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
    
    
    $scope.guardar = function() {  
        
        var bahiaSel = "0";
        
        
        
        var object = {
            Cedula: $scope.Persona.Cedula,            
            Nombres: $scope.Persona.Nombres.toUpperCase(),
            MovilPpal: $scope.Persona.MovilPpal,
            Clave: $scope.Persona.Clave,
            Direccion: (!$scope.Persona.Direccion) ? '' : $scope.Persona.Direccion,
            Estado: $scope.Persona.Estado,                                    
            Correo : (!$scope.Persona.Correo) ? '' :  $scope.Persona.Correo,             
           
        };
        
        var promise;
        if($scope.editMode){            
            promise = personaService.put($scope.Persona.Cedula, object);
        }else {
            
            if (!$scope.Persona.Clave){
                Materialize.toast('Contraseña es Requerida', 4000, 'rounded');
                return;
            }            
            promise = personaService.post(object);            
        }
        
        promise.then(function(d) {            
            Materialize.toast(d.data.message+'..!!', 4000, 'rounded');
            $scope.nuevo();
            loadPersonas();
            $('ul.tabs').tabs('select_tab', 'tabPersona1');
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        });        
    };
    
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


