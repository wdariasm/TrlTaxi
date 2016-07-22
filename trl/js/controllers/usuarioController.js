app.controller('usuarioController', ['$scope', 'usuarioService', 'toaster', "ngTableParams",
function($scope, usuarioService,toaster,ngTableParams) {
    $scope.Usuario = {};  
    $scope.Usuarios = [];
    
    $scope.title = "Nuevo Usuario";
    $scope.active = "";
    $scope.editMode = false;  
    
    $scope.Conductores = [];
    $scope.Personas = [];
    $scope.Clientes=[];
    $scope.valPass =false;
    $scope.IdUsuarioGlobal="";
    
     $scope.TablaUsuario = {};
    
    $scope.User = {};
    $scope.$parent.SetTitulo("GESTION DE USUARIO");

    loadUsuarios();        
    initialize();
    loadPersonas();
    loadCliente();
    loadConductor();
    initTabla();

    function initialize() {
        $scope.Usuario = {
            IdUsuario:"",
            Login: "",
            Clave: "",
            Nombre: "",
            Estado: "ACTIVO",
            Modulo: "",
            Sesion : 'CERRADA',
            FechaCnx: moment().format('L'),
            DirIp: "",
            ClienteId: "",
            PersonaId: "",
            ConductorId:"",
            TipoAcceso:"",
            ValidarClave:"SI"
        };  
    }
    
     $scope.Cambiarformato= function (variable){
        console.log(variable);
        $scope.Usuario[variable] = moment($scope.Usuario[variable]).format('L');
    };
    
       function loadUsuarios() {
        var promiseGet = usuarioService.getAll(); //The Method Call from service
        promiseGet.then(function(pl) {
            $scope.Usuarios = pl.data;
            $scope.TablaUsuario.reload();
        },
                function(errorPl) {
                    console.log('failure loading usuarios', errorPl);
                });
    }  
    
    
     function loadCliente(){
        var promise = usuarioService.cliente();
        promise.then(function(item) {                        
            $scope.Clientes = item.data;
        }, function(errCl) {           
                 console.log('failure loading Clientes', errCl);
        }); 
    }
    
    function loadConductor(){
        var promise = usuarioService.conductor();
        promise.then(function(d) {                        
            $scope.Conductores = d.data;
        }, function(err) {           
                console.log('failure loading Conductores', err);
        }); 
    }
    
    
    function loadPersonas() {
        var promiseGet = usuarioService.persona(); //The Method Call from service
        promiseGet.then(function(pl) {
            $scope.Personas = pl.data;
        },
        function(errorPl) {
            console.log('failure loading personas', errorPl);
        });
    }        
    
     $scope.nuevo = function() {
        initialize();
        $scope.editMode = false;
        $scope.title = "Nuevo Usuario";
        $scope.active = "";        
    };

    $scope.get = function(usuario) {
        $scope.editMode = true;
        $scope.title = "Editar Usuario";
        $scope.active = "active";
        $scope.Usuario = usuario;        
        $('#tabPanels a[href="#tabRegistro"]').tab('show');       
    };
    
     $scope.CambiarPass = function(id, nombre) {         
        $scope.User = {
            IdUsuario : id, 
            Nombre : nombre,
            Clave : "", 
            claveConf : ""
        };
        $('#tabPanels a[href="#tabCambiarC"]').tab('show');        
    };
    
    $scope.cancelar = function (){        
        $scope.valPass = false;
        $scope.User = {
            IdUsuario : "", 
            Nombre : "",
            Clave : "", 
            claveConf : ""
        };
        $('#tabPanels a[href="#tabListado"]').tab('show');
    };
    
    $scope.guardarPass = function (){
        $scope.valPass = false;
        if ($scope.User.Clave != $scope.User.claveConf){
            $scope.valPass = true;
            return;
        }
            
        var object = {            
            Clave:$scope.User.Clave            
        };
        
        var promise = usuarioService.udpatePass($scope.User.IdUsuario, object);       
        promise.then(function(d) {            
            $scope.cancelar();            
        }, function(err) {           
                 toaster.pop('error', "Error", "ERROR AL CAMBIAR CONTRASEÑA");         
                console.log("Some Error Occured " + JSON.stringify(err));
        });     
        
    };
    
    
    $scope.Guardar = function (){
       
        
        var object = {
        Login: $scope.Usuario.Login,       
        Clave:$scope.Usuario.Clave,
        Nombre:$scope.Usuario.Nombre.toUpperCase(),
        Estado:$scope.Usuario.Estado,
        Modulo:$scope.Usuario.Modulo,
        DirIp:$scope.Usuario.DirIp,
        ClienteId:$scope.Usuario.ClienteId,
        PersonaId:$scope.Usuario.PersonaId,
        ConductorId:$scope.Usuario.ConductorId,
        TipoAcceso:$scope.Usuario.TipoAcceso,
        ValidarClave:$scope.Usuario.ValidarClave
        };


         var promise;
        if($scope.editMode){            
            promise = usuarioService.put($scope.Usuario.IdUsuario, object);
        }else {
            
            if (!$scope.Usuario.Clave){
               alert("Contraseña es requerida");
                return;
            }            
            promise = usuarioService.post(object);            
        }
        
        promise.then(function(d) {            
            $scope.nuevo();
            loadUsuarios();
             $('#tabPanels a[href="#tabListado"]').tab('show');
	       toaster.pop('success', "Control de Información", d.data.message);
        }, function(err) {           
               toaster.pop('error', "Error", "ERROR AL PROCESAR SOLICITUD");          
                console.log("Some Error Occured " + JSON.stringify(err));
        });        
    };      
   
   
   
   // Function 
    $scope.VerDesactivar = function(IdUsuario,  Estado) {
        $scope.Estado =Estado;
        $scope.IdUsuarioGlobal = IdUsuario;
        $('#mdConfirmacion').modal('show');         
    };

     $scope.Desactivar = function() {
         var objetc = {
            Estado :$scope.Estado
        };
            $('#mdConfirmacion').modal('hide'); 
            var promisePut  = usuarioService.updateEstado($scope.IdUsuarioGlobal, objetc);        
                promisePut.then(function (d) {                
                 toaster.pop('success', "Control de Información", d.data.message);                 
               loadUsuarios();
            }, function (err) {                              
                     toaster.pop('error', "Error", "ERROR AL PROCESAR DESACTIVAR / ACTIVAR"); ;
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
   
     };
     
     function initTabla() {
        $scope.TablaUsuario = new ngTableParams({
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
                c ? (c = c.toLowerCase(), f = $scope.Usuarios.filter(function (a) {
                    return a.IdUsuario.toLowerCase().indexOf(c) > -1 ||
                           a.Nombre.toLowerCase().indexOf(c) > -1 || 
                           a.Estado.toLowerCase().indexOf(c) > -1                                                       
                })) : f = $scope.Usuarios, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
            }
        });
    };
    
    initTabla();
     

}]);



