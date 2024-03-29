app.controller('usuarioController', ['$scope', 'usuarioService', 'toaster', "ngTableParams", "perfilService",
    "personaService", "funcionService", "clienteService", "conductorService", "contratoService",
function($scope, usuarioService,toaster,ngTableParams , perfilService, personaService, funcionService,
clienteService, conductorService , contratoService) {
    $scope.Usuario = {};
    $scope.Usuarios = [];
    $scope.Perfiles = [];
    $scope.Permisos = [];

    $scope.title = "Nuevo Usuario";
    $scope.editMode = false;

    $scope.valPass =false;
    $scope.ValLogin = false;
    $scope.IdUsuarioGlobal="";
    $scope.ExisteIdentificion =false;

    $scope.TablaUsuario = {};
    $scope.User = {};
    $scope.PerfilSelect = {};

    $scope.$parent.SetTitulo("GESTION DE USUARIOS");

    loadUsuarios();
    initialize();
    initTabla();
    loadPerfiles();
    loadPermisos();

    function initialize() {
        $scope.Usuario = {
            IdUsuario:"",
            Login: "",
            Nombre: "",
            Estado: "ACTIVO",
            Modulo: "",
            Sesion : 'CERRADA',
            DirIp: "",
            ClienteId: null,
            PersonaId: null,
            ConductorId:null,
            TipoAcceso:"",
            ValidarClave : "SI",
            Email : "",
            Contrato : "",
            Permisos : [],
            Identificacion :"",
            ContratoId : null
        };
    }

    function loadUsuarios() {
        var promiseGet = usuarioService.getAll(); //The Method Call from service
        promiseGet.then(function(pl) {
            $scope.Usuarios = pl.data;
            $scope.TablaUsuario.reload();
        },
        function(errorPl) {
            toaster.pop('error','¡Error!', "Error al cargar usuarios");
            console.log('failure loading usuarios', errorPl);
        });
    }

    function loadPerfiles(){
        var promiseGet = perfilService.getActivos(); //The Method Call from service
        promiseGet.then(function (item) {
            $scope.Perfiles = item.data;
            if(item.data){
                $scope.PerfilSelect.IdRol=2;
                $scope.permisosByPerfil();
            }
        },
        function (errorPl) {
            toaster.pop('error','¡Error!', "Error al cargar permisos");
            console.log('failure loading Paises', errorPl);
        });
    }


    function loadPermisos(){
        var promiseGet = perfilService.getPermisos(); //The Method Call from service
        promiseGet.then(function (item) {
            $scope.Permisos = item.data;
        },
        function (errorPl) {
            toaster.pop('error','¡Error!', "Error al cargar permisos");
            console.log('failure loading Paises', errorPl);
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

    function getPersona (id, nit){
        var promiseGet;
        if(id !== null){
            promiseGet= personaService.get(id);
        }else{
            promiseGet= personaService.validar(nit);
        }
        promiseGet.then(function (d) {
            if(d.data){
                $scope.Usuario.Identificacion = d.data.Cedula;
                $scope.Usuario.PersonaId =d.data.IdPersona;
                if(!$scope.editMode){
                   $scope.Usuario.Nombre = d.data.Nombre;
                   $scope.Usuario.Email = d.data.Correo;
                }
                $scope.ExisteIdentificion =true;
            }else{
                toaster.pop('error', '¡Error!','Empleado no se encuentra registrado en el sistema.');
            }
        },
        function (errorPl) {
            toaster.pop('error','¡Error!', "Error al cargar permisos del usuario seleccionado");
            console.log('error al cargar permisos', errorPl);
        });
    };

    function getCliente (id, nit){
        var promiseGet;
        if(id !== null){
            promiseGet= clienteService.get(id);
        }else{
            promiseGet= clienteService.validarIdentificacion(nit);
        }
        promiseGet.then(function (d) {
            if(d.data){
                $scope.Usuario.Identificacion = d.data.Identificacion;
                $scope.Usuario.ClienteId =d.data.IdCliente;
                if(!$scope.editMode){
                   $scope.Usuario.Nombre = d.data.Nombres;
                   $scope.Usuario.Email = d.data.Correo;
                }
                $scope.ExisteIdentificion =true;
            }else{
                toaster.pop('error', '¡Error!','Cliente no se encuentra registrado en el sistema.');
            }
        },
        function (errorPl) {
            toaster.pop('error','¡Error!', "Error al cargar permisos del usuario seleccionado");
            console.log('error al cargar permisos', errorPl);
        });
    };

    function getConductor (id, nit){
        var promiseGet;
        if(id !== null){
            promiseGet= conductorService.get(id);
        }else{
            promiseGet= conductorService.validarIdentificacion(nit);
        }
        promiseGet.then(function (d) {
            if(d.data){
                $scope.Usuario.Identificacion = d.data.Cedula;
                $scope.Usuario.ConductorId =d.data.IdConductor;
                if(!$scope.editMode){
                   $scope.Usuario.Nombre = d.data.Nombre;
                   $scope.Usuario.Email = d.data.Email;
                }
                $scope.ExisteIdentificion =true;
            }else{
                toaster.pop('error', '¡Error!','Conductor no se encuentra registrado en el sistema.');
            }
        },
        function (errorPl) {
            toaster.pop('error','¡Error!', "Error al cargar permisos del usuario seleccionado");
            console.log('error al cargar permisos', errorPl);
        });
    };

    $scope.Nuevo = function() {
        initialize();
        loadPerfiles();
        $scope.editMode = false;
        $scope.title = "Nuevo Usuario";
    };

    $scope.get = function(usuario) {
        $scope.editMode = true;
        $scope.title = "Editar Usuario";
        $scope.Usuario = usuario;
        $scope.PerfilSelect.IdRol = usuario.TipoAcceso;
        if($scope.Usuario.PersonaId){
            getPersona($scope.Usuario.PersonaId, null);
        }else if($scope.Usuario.ConductorId){
            getConductor($scope.Usuario.ConductorId, null);
        }else if($scope.Usuario.ClienteId){
            getCliente($scope.Usuario.ClienteId, null);
            if($scope.PerfilSelect.IdRol === 5){
                $scope.BuscarContrato();
            }
        }

        permisosByUsuario(usuario.IdUsuario);
        $('#tabPanels a[href="#tabRegistro"]').tab('show');
    };

    $scope.permisosByPerfil= function(){

        if($scope.editMode) return;

        $scope.Usuario.Permisos = [];
        var promiseGet = perfilService.getPermisoByPerfil($scope.PerfilSelect.IdRol);
        promiseGet.then(function (d) {
            if(d.data.length){
                $scope.Usuario.Permisos = angular.copy(d.data);
            }
        },
        function (errorPl) {
            toaster.pop('error','¡Error!', "Error al cargar permisos del perfil seleccionado");
            console.log('error al cargar permisos', errorPl);
        });
    };

    $scope.Guardar = function (){

        if(!$scope.frmUsuario.$valid){
            toaster.pop('error','¡Error!', 'Por favor ingrese los datos requeridos (*).');
            return;
        }

        if($scope.ValLogin){
            toaster.pop('error', '¡Error!', 'Nombre de usuario ya existe');
            return;
        }

        if(!$scope.ExisteIdentificion){
            toaster.pop('error', '¡Error!', 'N° Identificación no existe en el sistema');
            return;
        }

        if ($scope.Usuario.Permisos.length === 0){
            toaster.pop('info', '¡Alerta!', 'Seleccione al menos un permiso');
            return;
        }

        $scope.Usuario.Modulo = funcionService.GetModuloUser($scope.Usuario.Permisos);
        $scope.Usuario.Nombre = $scope.Usuario.Nombre.toUpperCase();
        $scope.Usuario.TipoAcceso = $scope.PerfilSelect.IdRol;

        if($scope.PerfilSelect.IdRol === 5 && !$scope.Usuario.ContratoId){
            toaster.pop('info', '¡Alerta!', 'El N° de contrato NO existe');
            return;
        }

        var promise;
        if($scope.editMode){
            promise = usuarioService.put($scope.Usuario.IdUsuario, $scope.Usuario);
        }else {
            promise = usuarioService.post($scope.Usuario);
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

        if($scope.PerfilSelect.IdRol === 3 ){
            getConductor(null, $scope.Usuario.Identificacion);
        }else if($scope.PerfilSelect.IdRol === 1 || $scope.PerfilSelect.IdRol === 2){
            getPersona(null, $scope.Usuario.Identificacion);
        }else if($scope.PerfilSelect.IdRol === 4 || $scope.PerfilSelect.IdRol === 5){
            getCliente(null, $scope.Usuario.Identificacion);
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
                $scope.IdUsuarioGlobal = d.data.IdUsuario;
                $('#mdReactivacion').modal('show');
            }
        }, function (err) {
           toaster.pop('error', "Error", "Error al validar login");
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };

    $scope.ConsultarUsuario = function (){
        $scope.ValLogin = false;
        $('#mdReactivacion').modal('hide');
        var promiseGet = usuarioService.get($scope.IdUsuarioGlobal); //The Method Call from service
        promiseGet.then(function(pl) {
            $scope.get(pl.data);
        },
        function(errorPl) {
            toaster.pop('error','¡Error!', "Error al consultar usuario");
            console.log('failure loading usuarios', errorPl);
        });
    };


    $scope.BuscarContrato =  function (){
        $scope.Usuario.ContratoId = null;
        if (!$scope.Usuario.Contrato || $scope.Usuario.Contrato  ==="" ){
            toaster.pop('info', "Estimado usuario(a), por favor ingrese el número de contrato");
            return;
        }
        toaster.pop('wait','Consultando informacioón....',"", 0);
        var promise = contratoService.getPorNumeroCto($scope.Usuario.Contrato);
        promise.then(function(d) {
            if(d.data){
                toaster.clear();
                $scope.Usuario.ContratoId = d.data.IdContrato;

            }else{
                toaster.pop('error', "Número de contrato no existe");
            }

        }, function(err) {
                toaster.pop('error','¡Error!',err.data, 0);
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

    $scope.ReenviarEmail = function (item){
        toaster.pop("wait", "Reenviando Email", "Espere por favor .... ")
         var promisePut  = usuarioService.enviarEmail(item);
            promisePut.then(function (d) {
             toaster.pop('success', "Control de Información", d.data.message);
        }, function (err) {
                toaster.pop('error', "Error", "ERROR AL REENVIAR EMAIL DE CONFIRMACIÓN"); ;
                console.log("Some Error Occured "+ JSON.stringify(err));
        });
    }

    function initTabla() {
        $scope.TablaUsuario = new ngTableParams({
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
                c ? (c = c.toLowerCase(), f = $scope.Usuarios.filter(function (a) {
                    return a.Login.toLowerCase().indexOf(c) > -1 ||
                           a.Nombre.toLowerCase().indexOf(c) > -1 ||
                           a.Descripcion.toLowerCase().indexOf(c) > -1 ||
                           a.Estado.toLowerCase().indexOf(c) > -1
                })) : f = $scope.Usuarios, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
            }
        });
    };

    initTabla();

    $scope.GetUsuarios = function (){
        loadUsuarios();
    };

}]);

app.controller('perfilController', ['$scope', 'perfilService', 'toaster',function($scope, perfilService,toaster) {
    $scope.Perfiles = [];
    $scope.Perfil = {};
    $scope.Permisos = [];
    $scope.editMode = false;
    $scope.title ="";

    loadPerfiles();
    loadPermisos();
    init();

    function init(){
        $scope.Perfil = {
            IdRol : 0,
            Descripcion : "",
            rEstado : "",
            Permisos : []
        };
    }

    function loadPerfiles(){
        var promiseGet = perfilService.getAll(); //The Method Call from service
        promiseGet.then(function (item) {
            $scope.Perfiles = item.data;
        },
        function (errorPl) {
            toaster.pop('error','¡Error!', "Error al cargar permisos");
            console.log('failure loading Paises', errorPl);
        });
    }


    function loadPermisos(){
        var promiseGet = perfilService.getPermisos(); //The Method Call from service
        promiseGet.then(function (item) {
            $scope.Permisos = item.data;
        },
        function (errorPl) {
            toaster.pop('error','¡Error!', "Error al cargar permisos");
            console.log('failure loading Paises', errorPl);
        });
    }



    //edita la marca
    $scope.get = function(item) {
        init();
        $scope.Perfil=item;
        $scope.editMode = true;
        $scope.title = "EDITANDO PERFIL";
        $scope.permisosByPerfil(item.IdRol);
    };

    $scope.Nuevo = function (){
        $scope.editMode = false;
        $scope.title="";
        init();
    };


    $scope.permisosByPerfil= function(id){
        $scope.Perfil.Permisos = [];
        var promiseGet = perfilService.getPermisoByPerfil(id);
        promiseGet.then(function (d) {
            if(d.data){
                $scope.Perfil.Permisos = angular.copy(d.data);
            }
        },
        function (errorPl) {
            toaster.pop('error','¡Error!', "Error al cargar permisos del perfil seleccionado");
            console.log('error al cargar permisos', errorPl);
        });
    };

    $scope.Guardar = function (){

        if($scope.Perfil.Descripcion ===""){
            toaster.pop('info', '¡Alerta!', 'Ingrese Descripción del perfil');
            return;
        }

        if ($scope.Perfil.Permisos.length === 0){
            toaster.pop('info', '¡Alerta!', 'Seleccione al menos un permiso');
            return;
        }

        var promise;
        if($scope.editMode){
            promise = perfilService.put($scope.Perfil.IdRol, $scope.Perfil);
        }else {
            promise = perfilService.post($scope.Perfil);
        }

        promise.then(function(d) {
            loadPerfiles();
            loadPermisos();
            toaster.pop('success', "Control de Información", d.data.message);
            init();
        }, function(err) {
            toaster.pop('error', "¡Error!", err.data.request,0);
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };

    // Function
    $scope.VerInactivo = function(id) {
        $scope.IdPerfil = id;
        $('#mdPerfil').modal('show');
    };

     $scope.Inactivar = function() {
            $('#mdPerfil').modal('hide');
            var promisePut  = perfilService.delete($scope.IdPerfil);
                promisePut.then(function (d) {
                 toaster.pop('success', "¡Información!", d.data.message);
                loadPerfiles();
            }, function (err) {
                     toaster.pop('error', '¡Error!',err.data.request); ;
                    console.log("Some Error Occured "+ JSON.stringify(err));
            });

     };

}]);

app.controller('cambiarClaveController', ['$scope', 'usuarioService', 'toaster', function($scope, usuarioService,toaster) {

    $scope.User = {};
    initUser();
    $scope.$parent.SetTitulo("CAMBIAR CONTRASEÑA");

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
