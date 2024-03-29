app.controller("conductorController", ["$scope", "conductorService", "tipoDocumentoService", "escolaridadService","toaster", "ngTableParams", "vehiculoService", "funcionService",
   function ($scope, conductorService,tipoDocumentoService,escolaridadService,toaster,ngTableParams,vehiculoService, funcionService) {
   $scope.Conductor = {};
   $scope.Conductores = [];
   $scope.Novedad={};
   $scope.Novedades=[];
   $scope.TipoDocumentos=[];
   $scope.Escolaridades=[];
   $scope.LicenciaConduccion={};
   $scope.Licencias=[];
   $scope.valCedula = false;
   $scope.valNumero=false;
   $scope.editModeLic = false;

   $scope.title="Nuevo Conductor";
   $scope.IdConductorGlobal = "";
   $scope.IdLicenciaG="";
   $scope.TablaConductor = {};
   $scope.TablaNovedad = {};
   $scope.editMode = false;
   $scope.editNovedad = false;

   $scope.SelEscolaridad = {};
   $scope.$parent.SetTitulo("GESTION DE CONDUCTOR");

    initialize();
    initLicencia();
    loadEscolaridades();

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
            Escolaridad:"",
            VehiculoId : 0,
            Novedades : [],
            RutaImg : "",
            Imagen : ""
        };

    }

    $scope.Cambiarformato= function (variable){
        $scope.Conductor[variable] = moment($scope.Conductor[variable]).format('L');
    };


    $scope.loadConductor =  function  (){
        var promise = conductorService.getAll();
        promise.then(function(d) {
            $scope.Conductores = d.data;
            $scope.TablaConductor.reload();
        }, function(err) {
                toaster.pop('error','¡Error!',"Error al cargar Conductores");
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    };

    function  getConductor(id){
        var promise = conductorService.get(id);
        promise.then(function(d) {
            $scope.Conductor = d.data;
            $scope.Conductor.FechaNacimiento = moment($scope.Conductor.FechaNacimiento).format("L");
            $scope.Conductor.FechaIngreso = moment($scope.Conductor.FechaIngreso).format("L");
            var pos = funcionService.arrayObjectIndexOf($scope.Escolaridades,d.data.Escolaridad, 'esCodigo');
            $scope.SelEscolaridad =$scope.Escolaridades[pos];

        }, function(err) {
                toaster.pop('error','¡Error!',"Error al cargar Conductores");
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    }

    function loadEscolaridades (){
        var promise = escolaridadService.getAll();
        promise.then(function(d) {
            $scope.Escolaridades = d.data;
            if(d.data){
                $scope.SelEscolaridad = d.data[0];
            }
        }, function(err) {
                toaster.pop('error','¡Error!',"Error al cargar Escolaridad");
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    }




     function loadTipoDocumentos (){
        var promise = tipoDocumentoService.getAll();
        promise.then(function(d) {
            $scope.TipoDocumentos = d.data;
        }, function(err) {
               toaster.pop('error','¡Error!',"Error al cargar Tipo Documento");
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    }

   loadTipoDocumentos ();


    function initTabla() {
        $scope.TablaConductor = new ngTableParams({
            page: 1,
            count: 11,
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

        if(!$scope.frmConductor.$valid){
            toaster.pop('error','¡Error!', 'Por favor ingrese los datos requeridos (*).');
            return;
        }

        $scope.Conductor.Nombre = $scope.Conductor.Nombre.toUpperCase();
        $scope.Conductor.Direccion = $scope.Conductor.Direccion.toUpperCase();
        $scope.Conductor.Observacion = $scope.Conductor.Observacion.toUpperCase();
        $scope.Conductor.CdPlaca = $scope.Conductor.CdPlaca.toUpperCase();
        $scope.Conductor.Escolaridad = $scope.SelEscolaridad.esCodigo;

        if ($scope.valCedula){
            toaster.pop('error','¡Error!', 'N° de Cedula ya existe');
            return;
        }

        if($scope.Conductor.VehiculoId === 0){
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

        var formData=new FormData();
        formData.append('Cedula', $scope.Conductor.Cedula);
        formData.append('RutaImg', $scope.Conductor.RutaImg);

        toaster.pop("wait", "Procesando información", "Por favor espere....");

        promise.then(function(d) {

            if($scope.editMode){
                $scope.Nuevo();
                toaster.pop('success', "Control de Información", d.data.message);
            }else {
                formData.append('IdConductor', d.data.request);
                guardarImagen(formData, true);
            }
            $scope.loadConductor();

        }, function(err) {
                toaster.pop('error', "Error", "Error al guardar Conductor");
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    };

    function guardarImagen (objetoForm, limpiar){
        var promise = conductorService.postImagen(objetoForm);
        promise.then(function(d) {
            toaster.pop('success', "Control de Información", d.data.message);
            if(limpiar){
                $scope.Nuevo();
            }else {
                $("#mdImagenConductor").modal("hide");
                actualizarRutaImagen();
            }


        }, function(err) {
            toaster.pop('error', "¡Error!", "Error al guardar imagen del conductor");
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    }

    function actualizarRutaImagen(){
        $('#imgPerfil').attr('src', '');
        var promise = conductorService.get($scope.Conductor.IdConductor);
        promise.then(function(d) {
            $scope.Conductor.RutaImg = d.data.RutaImg;
             $('#imgPerfil').attr('src', $scope.Conductor.RutaImg);

        }, function(err) {
                toaster.pop('error','¡Error!',"Error al cargar Conductores");
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    }

    //Editar Conductor
    $scope.get = function(item) {
        initialize();
        $scope.InitNovedad();
        initLicencia();
        getConductor(item.IdConductor);
        $scope.editMode = true;
        $scope.title = "Editar Conductor";
        loadNovedad(item.IdConductor);
        loadLicenciaConduccion(item.IdConductor);
        $('#tabPanels a[href="#tabRegistro"]').tab('show');
    };
    $scope.Nuevo = function (){
        initialize();
        $scope.InitNovedad();
        initLicencia();
        $scope.Novedades=[];
        $scope.editMode = false;
        $scope.title = "Nuevo Conductor";
    };

    $scope.ActualizarImagen = function (){

        if(!$scope.Conductor.Imagen){
             toaster.pop('error', "¡Error!", "Por favor seleccione la imagen.");
            return;
        }

        var formData=new FormData();
        formData.append('Cedula', $scope.Conductor.Cedula);
        formData.append('RutaImg', $scope.Conductor.Imagen);
        formData.append('IdConductor', $scope.Conductor.IdConductor);
        guardarImagen(formData, false);

    };


   // NOVEDADES

    $scope.InitNovedad = function() {
        $scope.Novedad = {
            nvDescripcion:"",
            nvTipo:"CONTRALORIA"
        };
        $scope.editNovedad = false;
    };

    $scope.InitNovedad();

    function loadNovedad (id){
        $scope.Novedades=[];
        var promise = conductorService.getNovedad(id);
        promise.then(function(d) {
            $scope.Novedades = d.data;
        }, function(err) {
            toaster.pop('error','Error en cargar novedad.',err.data.error);
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


       //Editar Novedad
    $scope.getNovedad = function(item) {
        $scope.Novedad=item;
        $scope.editNovedad = true;
        $scope.TituloNov = "Editando novedad -> ";
        $("#mdNovedades").modal("show");
    };

    //Funcion que elimina
     $scope.VerDesactivar = function(IdConductor,  Estado) {
        $scope.Estado =Estado;
        $scope.IdConductorGlobal = IdConductor;
        $('#mdConfirmacion').modal('show');
    };

    //Funcion que elimina
     $scope.Desactivar = function() {
         var objetc = {
            Estado :$scope.Estado
        };
            $('#mdConfirmacion').modal('hide');
            var promisePut  = conductorService.updateEstado($scope.IdConductorGlobal, objetc);
                promisePut.then(function (d) {
                 toaster.pop('success', "Control de Información", d.data.message);
                $scope.loadConductor();
            }, function (err) {
                     toaster.pop('error', "Error", "Error al descativar Conductor"); ;
                    console.log("Some Error Occured "+ JSON.stringify(err));
            });
     };

   //Valida si  ya existe la Cedula en la base de datos

      $scope.validarIdentificacion = function () {
        $scope.valCedula = false;
        if (!$scope.Conductor.Cedula || $scope.editMode) {
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
            if($scope.editNovedad){
                $("#mdNovedades").modal("hide");
            }

        }, function(err) {
                toaster.pop('error', "Error", "ERROR AL PROCESAR SOLICITUD");
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    };

    $scope.ValidarPlaca = function () {
        $scope.Conductor.VehiculoId = 0;
        if (!$scope.Conductor.CdPlaca) {
            toaster.pop('info',"¡Información!", "Ingrese la placa");
            return;
        }
        var promiseGet = vehiculoService.validarPlaca($scope.Conductor.CdPlaca);
        promiseGet.then(function (d) {
            if (!d.data.Placa) {
                toaster.pop('info', '¡Alerta!', 'Esta placa no existe');
            }else{
                $scope.Conductor.VehiculoId  = d.data.IdVehiculo;
            }
        }, function (err) {
            toaster.pop('error', '¡Error!', err);
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };


    $scope.VerModalNovedad = function (){
        $("#mdNovedades").modal("show");
        $scope.TituloNov = "Agregar Novedad ";
        $scope.InitNovedad();
    };


    //LICENCIA DE CONDUCCION
    $scope.VerModalLicencias = function (){
        $scope.editModeLic = false;
        $scope.TituloNov = "Nueva licencia -> ";
        initLicencia();
        $("#mdLicencia").modal("show");
    };


     function initLicencia() {
        $scope.LicenciaConduccion = {
            IdLicencia:"",
            Numero: "",
            OTLicencia: "",
            FechaExpedicion:moment().format('L'),
            FechaVencimiento: moment().format('L'),
            Estado: "ACTIVA",
            Categoria:"C1",
            FechaReg:"",
            lcConductor:""
        };
        $scope.LicenciaConduccion.Identificacion = $scope.Conductor.Cedula;
    }

    $scope.getLicencia = function(item) {
        $scope.LicenciaConduccion=item;
        $scope.editModeLic = true;
        $scope.TituloNov = "Editando licencia -> ";
        $("#mdLicencia").modal("show");
    };

    function loadLicenciaConduccion (Id){
        $scope.Licencias=[];
        var promise = conductorService.getLicencia(Id);
        promise.then(function(d) {
            $scope.Licencias = d.data;
        }, function(err) {
                toaster.pop('error','Error','No se pudo procesar la solicitud');
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    }


    $scope.GuardarLicencia = function (){

         if (!$scope.LicenciaConduccion.Numero){
           toaster.pop('warning', "Ingresa el Numero");
           return;
         }

         if (!$scope.LicenciaConduccion.OTLicencia){
           toaster.pop('warning', "Ingresa el O.T Licencia");
           return;
         }

        if (!$scope.LicenciaConduccion.Categoria){
           toaster.pop('warning', "Ingresa La Categoria");
           return;
         }

         if(!$scope.Conductor.IdConductor){
            toaster.pop("warning",'Validación','No existe un conductor seleccionado');
            return;
         }

          if ($scope.valNumero){
           toaster.pop('error','¡Error!', 'N° de licencia ya existe');
            return;
             }

        $scope.LicenciaConduccion.lcConductor=$scope.Conductor.IdConductor;

        $scope.LicenciaConduccion.OTLicencia = $scope.LicenciaConduccion.OTLicencia.toUpperCase();
        $scope.LicenciaConduccion.Categoria = $scope.LicenciaConduccion.Categoria.toUpperCase();

        var promise;
        if($scope.editModeLic){
            promise = conductorService.putLicencia($scope.LicenciaConduccion.IdLicencia, $scope.LicenciaConduccion);
        }else {
            promise = conductorService.postLicencia($scope.LicenciaConduccion);
        }

        promise.then(function(d) {
            loadLicenciaConduccion($scope.Conductor.IdConductor);
             initLicencia();
           toaster.pop('success', "Control de Información", d.data.message);

           if($scope.editModeLic){
               $("#mdLicencia").modal("hide");
           }

        }, function(err) {
                toaster.pop('error', "Error", "ERROR AL PROCESAR SOLICITUD");
                console.log("Some Error Occured " + JSON.stringify(err));
        });

   };

   //cambia el formato de fecha licencia
    $scope.formatoLicencia= function (variable){
        $scope.LicenciaConduccion[variable] = moment($scope.LicenciaConduccion[variable]).format('L');
    };    

     $scope.validarNumero = function () {
        $scope.valNumero = false;
        if (!$scope.LicenciaConduccion.Numero) {
            return;
        }
        var promisePost = conductorService.validarNumero($scope.LicenciaConduccion.Numero);
        promisePost.then(function (d) {
            if (d.data.Numero) {
                $scope.valNumero = true;
                toaster.pop('info','Licencia!!', "N° de licencia ya existe");
             //   Materialize.toast('N° de Identificacion, Ya Existe.. !!', 4000, 'rounded');
            }
        }, function (err) {
           toaster.pop('error', "Error", "Error al validar Número de Licencia");
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };

     $scope.VerDesactivarLicencia = function(IdLicencia,  Estado) {
        $scope.Estado =Estado;
        $scope.IdLicenciaG = IdLicencia;
        $('#mdConfirmacion').modal('show');
    };

    //Funcion que elimina
     $scope.DesactivarLicencia = function() {
         var objetc = {
            Estado :$scope.Estado
        };
            $('#mdConfirmacion').modal('hide');
            var promisePut  = conductorService.updateEstadoLicencia($scope.IdLicenciaG, objetc);
                promisePut.then(function (d) {
                 toaster.pop('success', "Control de Información", d.data.message);

            }, function (err) {
                     toaster.pop('error', "Error", "Error al procesar Solicitud"); ;
                    console.log("Some Error Occured "+ JSON.stringify(err));
            });

     };

     // CAMBIAR IMAGEN CONDUCTOR

    $scope.VerModalCambiarImagen = function (){
        $('#flImagen').fileinput('clear');
        $("#mdImagenConductor").modal("show");
    };

    $scope.loadConductor();

}]);
