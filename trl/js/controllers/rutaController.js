app.controller("rutaController", ["$scope", "$rootScope", "rutaService", "tipoVehiculoService", "departamentoService",
    "toaster", "ngTableParams", "plantillaService", "serverData", "funcionService",  function ($scope, $rootScope, rutaService,
        tipoVehiculoService, departamentoService, toaster, ngTableParams, plantillaService, serverData, funcionService) {

        $scope.Ruta = {};
        $scope.Rutas = [];
        $scope.TipoVehiculos = [];
        $scope.Departamentos = [];
        $scope.Municipios = [];
        $scope.Plantillas = [];
        $scope.IdRutapGlobal = "";
        $scope.editMode = false;
        $scope.estadoImg = false;
        $scope.title = "Nueva Ruta";
        $scope.VehiculoSelect = {};
        $scope.PlantillaSelect = {};
        $scope.DeptSelect = {};
        $scope.MunSelect = {};
        $scope.TablaRuta = {};

        $scope.$parent.SetTitulo("GESTIÓN DE RUTAS");
        initRuta();
        
        setTimeout(function (){
            loadDepartamento();
            loadPlantilla();
        }, 900);
        

        $rootScope.$on("cargueRuta", function (event, data) {
            loadRuta(serverData.data.plCodigo);
            var pos = funcionService.arrayObjectIndexOf($scope.Plantillas, serverData.data.plCodigo, "plCodigo");
            if (pos != "-1") {
                $scope.PlantillaSelect = $scope.Plantillas[pos];                
            }

        });


        function initRuta() {
            $scope.Ruta = {
                rtCodigo: "",
                rtNombre: "",
                rtDescripcion: "",
                rtTipoVehiculo: "",
                rtValor: "0",
                rtDepartamento: "",
                rtCiudad: "",
                rtEstado: "ACTIVO",
                rtImagen: '',
                rtPlantilla: '0',
                Imagen: "",
                rtValorCliente : 0
            };
            $scope.estadoImg = false;            
            $scope.VehiculoSelect = {};
        }


        function loadRuta(idPlantilla) {
            var promise = rutaService.getAll(idPlantilla);
            promise.then(function (d) {
                $scope.Rutas = d.data;
                $scope.TablaRuta.reload();
            }, function (err) {
                toaster.pop('error', '¡Error!', "Error al cargar Ruta");
                console.log("Some Error Occured " + JSON.stringify(err));
            });
        }


        function loadTipoVehiculo() {
            var promise = tipoVehiculoService.getAll();
            promise.then(function (d) {
                $scope.TipoVehiculos = d.data;
                
            }, function (err) {
                toaster.pop('error', '¡Error!', "Error al cargar Tipo de Vehiculo");
                console.log("Some Error Occured " + JSON.stringify(err));
            });
        }

        loadTipoVehiculo();

        function loadPlantilla() {
            var promise = plantillaService.get(3);
            promise.then(function (d) {
                $scope.Plantillas = d.data;
                if (d.data) {
                    $scope.PlantillaSelect = d.data[0];
                }
            }, function (err) {
                toaster.pop('error', '¡Error!', "Error al cargar Plantillas");
                console.log("Some Error Occured " + JSON.stringify(err));
            });
        }

        function loadDepartamento() {
            var promise = departamentoService.getAll();
            promise.then(function (d) {
                $scope.Departamentos = d.data;
                if (d.data) {
                    $scope.DeptSelect = d.data[3];
                    loadMunicipio($scope.DeptSelect.dtCodigo);
                }
            }, function (err) {
                toaster.pop('error', '¡Error!', "Error al cargar Departamentos");
                console.log("Some Error Occured " + JSON.stringify(err));
            });
        }


        function loadMunicipio(dtCodigo) {
            var promise = departamentoService.getMunicipios(dtCodigo);
            promise.then(function (d) {
                $scope.Municipios = d.data;
                if (d.data) {
                    $scope.MunSelect = d.data[0];
                }
            }, function (err) {
                toaster.pop('error', '¡Error!', "Error al cargar Municipios");
                console.log("Some Error Occured " + JSON.stringify(err));
            });
        }

        $scope.CambiaDept = function () {
            loadMunicipio($scope.DeptSelect.dtCodigo);
        };

        $scope.Guardar = function () {
            
            
            
            if(!$scope.frmRuta.$valid){
                toaster.pop('error','¡Error!', 'Por favor ingrese los datos requeridos (*).');
                return;
            }
            
            if(!$scope.VehiculoSelect){
                toaster.pop('error','¡Error!', 'Por favor seleccione el tipo de vehículo.');
                return;
            }
            
            if(!$scope.MunSelect){
                toaster.pop('error','¡Error!', 'Por favor seleccione el municipio.');
                return;
            }        
            
            $scope.Ruta.rtTipoVehiculo = $scope.VehiculoSelect.tvCodigo;
            $scope.Ruta.rtCiudad = $scope.MunSelect.muCodigo;
            $scope.Ruta.rtDepartamento =  $scope.MunSelect.muDepartamento;

            var formData = new FormData();
            formData.append('rtTipoVehiculo', $scope.Ruta.rtTipoVehiculo);
            formData.append('rtCiudad', $scope.MunSelect.muCodigo);
            formData.append('rtPlantilla', $scope.PlantillaSelect.plCodigo);
            formData.append('rtDepartamento', $scope.MunSelect.muDepartamento);
            formData.append('rtNombre', $scope.Ruta.rtNombre.toUpperCase());
            formData.append('rtDescripcion', $scope.Ruta.rtDescripcion.toUpperCase());
            formData.append('rtValor', $scope.Ruta.rtValor);
            formData.append('trEstado', $scope.Ruta.trEstado);
            formData.append('rtImagen', $scope.Ruta.rtImagen);
            formData.append('rtValorCliente', $scope.Ruta.rtValorCliente);
            
            var promise;
            if ($scope.editMode) {
                promise = rutaService.put($scope.Ruta.rtCodigo, $scope.Ruta);
            } else {
                promise = rutaService.post(formData);
            }

            promise.then(function (d) {
                loadRuta($scope.PlantillaSelect.plCodigo);
                toaster.pop('success', "Control de Información", d.data.message);
                initRuta();
            }, function (err) {
                toaster.pop('error', "¡Error!", "Error al guardar Ruta");
                console.log("Some Error Occured " + JSON.stringify(err));
            });

        };

        $scope.nuevo = function () {
            var div1 = document.getElementById('dvNuevo');
                div1.classList.remove('hidden');
                div1.classList.add('visible');
            initRuta();
            $scope.editMode = false;
            $scope.title = "Nueva Ruta";
            $('#tabPanels a[href="#tabRegistroRuta"]').tab('show');
        };

        //edita la Ruta
        $scope.get = function (item) {            
            initRuta();
            $scope.editMode = true;
            $scope.title = "Editar Ruta";            
            
            $scope.Ruta = item;                        
            var pos = funcionService.arrayObjectIndexOf($scope.TipoVehiculos, item.rtTipoVehiculo, 'tvCodigo');
            if(pos >=0){                                          
                $scope.VehiculoSelect = $scope.TipoVehiculos[pos];                                        
            }
            
            var pos1 = funcionService.arrayObjectIndexOf($scope.Departamentos, item.rtDepartamento, 'dtCodigo');
            if(pos1 >=0){                                          
                $scope.DeptSelect = $scope.Departamentos[pos1];                                        
            }
            $scope.MunSelect = {};
            var pos2 = funcionService.arrayObjectIndexOf($scope.Municipios, item.rtCiudad, 'muCodigo');
            if(pos2 >=0){                                          
                setTimeout(function (){
                    $scope.$apply(function (){
                        $scope.MunSelect = $scope.Municipios[pos2];
                    });
                }, 2000);
            }                                    
            
           
            $('#tabPanels a[href="#tabRegistroRuta"]').tab('show');
                        
        };

        //Funcion que elimina
        $scope.VerDesactivar = function (rtCodigo, trEstado) {
            $scope.trEstado = trEstado;
            $scope.IdRutapGlobal = rtCodigo;
            $('#mdConfirmacion').modal('show');
        };

        //Funcion que elimina
        $scope.Desactivar = function () {
            var objetc = {
                trEstado: $scope.trEstado
            };
            $('#mdConfirmacion').modal('hide');
            var promisePut = rutaService.updateEstado($scope.IdRutapGlobal, objetc);
            promisePut.then(function (d) {
                toaster.pop('success', "Control de Información", d.data.message);
                loadRuta();
            }, function (err) {
                toaster.pop('error', "Error", "Error al Desactivar Ruta");
                ;
                console.log("Some Error Occured " + JSON.stringify(err));
            });

        };
        function initTabla() {
            $scope.TablaRuta = new ngTableParams({
                page: 1,
                count: 10,
                sorting: undefined
            }, {
                filterDelay: 50,
                total: 1000,
                counts: [],
                getData: function (a, b) {
                    var c = b.filter().busqueda;
                    f = [];
                    c ? (c = c.toLowerCase(), f = $scope.Rutas.filter(function (a) {
                        return a.rtCodigo.toLowerCase().indexOf(c) > -1 ||
                            a.rtNombre.toLowerCase().indexOf(c) > -1 ||
                            a.rtDescripcion.toLowerCase().indexOf(c) > -1 ||
                            a.rtCiudad.toLowerCase().indexOf(c) > -1 ||
                            a.trEstado.toLowerCase().indexOf(c) > -1
                    })) : f = $scope.Rutas, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
                }
            });
        };
        initTabla();


        $scope.modificarImagen = function () {
            var formData = new FormData();
            formData.append('imagen', $scope.Ruta.rtImagen);
            formData.append('id', $scope.Ruta.rtCodigo);

            if (!$scope.Ruta.rtImagen) {
                $scope.estadoImg = true;
                return;
            }

            var promisePost = rutaService.postImagen(formData);
            promisePost.then(function (d) {
                toaster.pop('success', "Imagen", "Imágen cambiada corretamente");
                $('#tabPanels a[href="#tabListado"]').tab('show');
            }, function (err) {
                toaster.pop('error', "Error!", 'Error al cambiar Imagen');
                console.log(JSON.stringify(err));
            });
        };

    }]);





