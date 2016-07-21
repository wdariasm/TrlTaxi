app.controller('usuarioController', ['$scope', 'usuarioService', 'toaster',
function($scope, usuarioService,toaster) {
    $scope.Usuario = {};  
    $scope.Usuarios = [];
    
    $scope.title = "NUEVO USUARIO";
    $scope.active = "";
    $scope.editMode = false;    
    
         $scope.$parent.SetTitulo("GESTION DE USUARIO");

    
    loadUsuarios();        
    initialize();

    function initialize() {
        $scope.Usuario = {
            Login: "",
            Clave: "",
            Nombre: "",
            Estado: "",
            Modulo: "",
            DirIp: "",
            ClienteId: "",
            PersonaId: "",
            ConductorId:"",
            TipoAcceso:"",
            Sesion : 'CERRADA'
        };  
    }
    
      function loadUsuarios() {
        var promiseGet = usuarioService.getAll(); //The Method Call from service
        promiseGet.then(function(pl) {
            $scope.Usuarios = pl.data;
        },
                function(errorPl) {
                    console.log('failure loading usuarios', errorPl);
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
        $scope.Usuario = usuario;        
               
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
        TipoAcceso:$scope.Usuario.TipoAcceso
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
           // Materialize.toast(d.data.message+'..!!', 4000, 'rounded');
            $scope.nuevo();
            loadUsuarios();
            //$('ul.tabs').tabs('select_tab', 'tabUsuario1');
	       toaster.pop('success', "Control de Información", d.data.message);
        }, function(err) {           
               toaster.pop('error', "Error", "ERROR AL PROCESAR SOLICITUD");          
                console.log("Some Error Occured " + JSON.stringify(err));
        });        
    };      
   
      
        
         $scope.Desactivar = function(IdUsuario,  Estado) {
        
        var r = confirm("¿Está seguro de Ejecutar esta Acción? ("+Estado+")");
        if (r == true) {
            var objetc = {
            Estado : Estado
        };
            var promiseDelete  = usuarioService.updateEstado(IdUsuario, objetc);        
                promiseDelete.then(function (d) {                
             //  Materialize.toast(d.data.message, 4000, 'rounded');                
                loadUsuarios();                
            }, function (err) {                              
                    alert("ERROR AL PROCESAR DESACTIVAR / ACTIVAR");
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
        } 
        
    };
}]);



