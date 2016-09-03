app.controller('usuarioController', ['$scope', 'usuarioService', 'toaster', "ngTableParams","funcionService", "clienteService","contratoService",
function($scope, usuarioService,toaster,ngTableParams ,  funcionService, clienteService, contratoService) {
    $scope.Usuario = {};  
    $scope.Usuarios = [];
    $scope.Perfiles = [];
    $scope.Permisos = [];
    
    $scope.title = "Nuevo Usuario";    
    $scope.editMode = false;  
        
    $scope.valPass =false;
    $scope.ValLogin = false;
    $scope.IdUsuarioGlobal="";
    
    
    $scope.TablaUsuario = {};    
    $scope.User = {};
    $scope.ContratoSelect = {};
        
    $scope.$parent.SetTitulo("GESTION DE USUARIOS");

    loadUsuarios();        
    initialize();    
    initTabla();
           
    function initialize() {
        $scope.Usuario = {
            IdUsuario:"",
            Login: "",            
            Nombre: "",
            Estado: "ACTIVO",
            Modulo: "",
            Sesion : 'CERRADA',            
            DirIp: "",
            ClienteId: $scope.$parent.Login.ClienteId,
            PersonaId: null,
            ConductorId:null,
            TipoAcceso: "5",            
            ValidarClave : "SI",
            Email : "",
            Contrato : "",
            Permisos : [],
            Identificacion :""
        };  
    }
         
    function loadUsuarios() {
        var promiseGet = usuarioService.getUsers($scope.$parent.Login.ClienteId); //The Method Call from service
        promiseGet.then(function(pl) {
            $scope.Usuarios = pl.data;
            $scope.TablaUsuario.reload();
        },
        function(errorPl) {
            toaster.pop('error','¡Error!', "Error al cargar usuarios");  
            console.log('failure loading usuarios', errorPl);
        });
    } 
              
    
    function permisosByUsuario (id){         
        $scope.Usuario.Permisos = [];       
        var promiseGet = usuarioService.getPermisos(id); 
        promiseGet.then(function (d) {                             
            if(d.data.length){                
                $scope.Usuario.Permisos = angular.copy(d.data);
            }
        },
        function (errorPl) {
            toaster.pop('error','¡Error!', "Error al cargar permisos del usuario seleccionado");  
            console.log('error al cargar permisos', errorPl);
        });
    };          
            
    $scope.Nuevo = function() {
        initialize();        
        $scope.editMode = false;
        $scope.title = "Nuevo Usuario";        
    };

    $scope.get = function(usuario) {
        $scope.editMode = true;
        $scope.title = "Editar Usuario";        
        $scope.Usuario = usuario;              
        $scope.Usuario.TipoAcceso = usuario.TipoAcceso.toString();
        
        permisosByUsuario(usuario.IdUsuario);
        $('#tabPanels a[href="#tabRegistro"]').tab('show');       
    };    
            
    $scope.Guardar = function (){
       
        if($scope.ValLogin){
            toaster.pop('error', '¡Error!', 'Nombre de usuario ya existe');
            return;
        }
        
        if($scope.Usuario.TipoAcceso === "5" && !$scope.ContratoSelect){
            toaster.pop('info', '¡Alerta!', 'El tipo de usuario es SUBCLIENTE, por favor indique el contrato.');
            return;
        } 
        $scope.Usuario.Contrato = $scope.ContratoSelect.ctNumeroContrato ? $scope.ContratoSelect.ctNumeroContrato : 0;                   
        $scope.Usuario.Modulo = "01000";
        $scope.Usuario.Nombre = $scope.Usuario.Nombre.toUpperCase();               
                              
        var promise;
        if($scope.editMode){
            promise = usuarioService.put($scope.Usuario.IdUsuario, $scope.Usuario);
        }else {                              
            promise = usuarioService.post($scope.Usuario);          
            $scope.Usuario.Permisos = funcionService.PermisoCliente();
        }
        
        promise.then(function(d) {            
            toaster.pop('success', "Control de Información", d.data.message);
            $scope.Nuevo();
            loadUsuarios();
            $('#tabPanels a[href="#tabListado"]').tab('show');	    
        }, function(err) {           
               toaster.pop('error', "¡Error!", err.data.request);          
               console.log("Some Error Occured " + JSON.stringify(err));
        });        
    };      
    
    $scope.BuscarIdentificacion = function (){
        if(!$scope.Usuario.Identificacion){
            toaster.pop('info','¡Alerta!', 'Por favor ingrese el número de identificación');
            return;
        }                
    };
    
    $scope.ValidarLogin = function () {
        $scope.ValLogin = false;
        if($scope.editMode) return;
        if (!$scope.Usuario.Login) {
            toaster.pop('info','¡Alerta!', 'Por favor ingrese el Login');
            return;
        }        
        var promisePost = usuarioService.validar($scope.Usuario.Login);
        promisePost.then(function (d) {
            if (d.data.Login) {
                $scope.ValLogin = true;
                toaster.pop('info',  "Nombre de usuario ya existe"); 
            }
        }, function (err) {
           toaster.pop('error', "Error", "Error al validar login"); 
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };
        
    
     $scope.CambiarPass = function(id, nombre, login) {         
        $scope.User = {
            IdUsuario : id, 
            Nombre : nombre,
            Login : login,
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
            Login : "",
            Clave : "", 
            claveConf : ""
        };
        $('#tabPanels a[href="#tabListado"]').tab('show');
    };
    
    $scope.guardarPass = function (){
        $scope.valPass = false;
        
        if(!$scope.User.IdUsuario){
            toaster.pop('info', "¡Alerta!", "Seleccione un usuario para realizar este procedimiento.");
            return;
        }
                
        if ($scope.User.Clave !== $scope.User.claveConf){
            $scope.valPass = true;
             toaster.pop('info', "¡Alerta!", "Contraseñas no coinciden.. verifique");
            return;
        }
                            
        var object = { 
            Id : $scope.User.IdUsuario,
            Clave:$scope.User.Clave            
        };
        
        var promise = usuarioService.udpatePass(object);       
        promise.then(function(d) {            
            if (d.data.message === "Correcto"){
                toaster.pop('success', "¡Información!", d.data.request);
                $scope.cancelar();            
            }else{
                toaster.pop('error', "¡Error!", d.data.request);
            }
            
        }, function(err) {           
                 toaster.pop('error', "¡Error!", err.request,0);         
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
     
    
    $scope.GetContratos = function  (){        
        var promise = contratoService.getByCliente($scope.Usuario.ClienteId, "ACTIVO");
        promise.then(function(d) {
            $scope.Contratos = d.data;
        }, function(err) {
                toaster.pop('error','¡Error!',"Error al cargar contratos");
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    };   
    
    $scope.GetContratos();
     
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

app.controller('cambiarClaveController', ['$scope', 'usuarioService', 'toaster', function($scope, usuarioService,toaster) { 
    
    $scope.User = {};    
    initUser();
    
    function initUser(){
        $scope.User = {
            IdUsuario : $scope.$parent.Login.IdUsuario, 
            Nombre : $scope.$parent.Login.Nombre,
            Login : $scope.$parent.Login.Login,
            Clave : "", 
            claveConf : ""
        };
    } 
    
    $scope.cancelar = function (){        
        initUser();
    };
    
    $scope.guardarPass = function (){
        $scope.valPass = false;
        
        if(!$scope.User.IdUsuario){
            toaster.pop('info', "¡Alerta!", "Seleccione un usuario para realizar este procedimiento.");
            return;
        }
                
        if ($scope.User.Clave !== $scope.User.claveConf){
            $scope.valPass = true;
             toaster.pop('info', "¡Alerta!", "Contraseñas no coinciden.. verifique");
            return;
        }
                            
        var object = { 
            Id : $scope.User.IdUsuario,
            Clave:$scope.User.Clave            
        };
        
        var promise = usuarioService.udpatePass(object);       
        promise.then(function(d) {            
            if (d.data.message === "Correcto"){
                toaster.pop('success', "¡Información!", d.data.request + "\
                 en segundos sera redireccionado al inicio de sesion, para que ingrese con sus nuevos datos.",0);  
                 sessionStorage.setItem("usuario","");
                sessionStorage.removeItem("usuario");                 
                setTimeout ('location.href = "../inicio/index.html#/login"', 5000);
            }else{
                toaster.pop('error', "¡Error!", d.data.request);
            }
            
        }, function(err) {           
                 toaster.pop('error', "¡Error!", err.request,0);         
                console.log("Some Error Occured " + JSON.stringify(err));
        });     
        
    };

}]);



