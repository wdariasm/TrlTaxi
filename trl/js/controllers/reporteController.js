app.controller('reporteController', ['$scope', 'toaster', '$rootScope', 'zonaService', 'funcionService',
    'clienteService', 'tiposervicioService', 'tipoVehiculoService',
    function ($scope, toaster, $rootScope, zonaService, funcionService, clienteService,
            tiposervicioService, tipoVehiculoService) {

    var vm = this;

    vm.TipoVehiculos = [];
    vm.TipoServicios = [];

    $rootScope.SetTituloPpal("REPORTES Y ESTADISTICAS");

    vm.Filtro = {};
    vm.VerConsulta = false;
    
    loadZona();
    loadTipoServicio();
    loadTipoVehiculo();
    
    inicializarReporte();

    function inicializarReporte() {
        vm.Filtro = {
            Placa: "",
            Zona: "",
            Cliente: "",
            Valor: "",
            Conductor: "",
            FechaInicio: moment().subtract(7, 'day').format("L"),
            FechaFin: moment().format("L"),
            ClienteId: 0,
            PorFecha: true,
            TipoVehiculo: "",
            TipoServicio: ""
        };
    }

    function loadZona() {
        var promiseGet = zonaService.getAll(); //The Method Call from service
        promiseGet.then(function (pl) {
            vm.Zonas = pl.data;
        },
                function (errorPl) {
                    toaster.pop("error", "¡Error!", "Error al cargar zonas");
                    console.log('failure loading Zona', errorPl);
                });
    }

    function loadTipoServicio() {
        var promise = tiposervicioService.getAll();
        promise.then(function (d) {
            vm.TipoServicios = d.data;
        }, function (err) {
            toaster.pop('error', '¡Error!', "Error al cargar Servicios");
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    }

    function loadTipoVehiculo() {
        var promise = tipoVehiculoService.getAll();
        promise.then(function (d) {
            vm.TipoVehiculos = d.data;
        }, function (err) {
            toaster.pop('error', '¡Error!', "Error al cargar Tipo de Vehiculo");
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    }


    vm.ConvertirFecha = function (fecha) {
        var f = new Date(fecha);
        return f.toLocaleDateString('en-GB');
    };

    vm.CambiarFormato = function (variable) {
        vm.Filtro[variable] = funcionService.FormatFecha(vm.Filtro[variable], 5);
        vm.Filtro[variable] = moment(vm.Filtro[variable]).format('L');
    };

    vm.ValidarIdentificacion = function () {
        vm.Filtro.ClienteId = 0;
        if (!vm.Filtro.Cliente) {
            return;
        }
        var promisePost = clienteService.validarIdentificacion(vm.Filtro.Cliente);
        promisePost.then(function (d) {
            if (!d.data) {
                toaster.pop('info', "Cliente no existe en la base de datos");
            } else {
                vm.Filtro.ClienteId = d.data.IdCliente;
            }
        }, function (err) {
            toaster.pop('error', "Error", "Error al validar Identificación");
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };

    vm.Buscar = function () {
                
        if (vm.Filtro.Cliente !== "") {            
            if (vm.Filtro.ClienteId == 0) {
                toaster.pop('warning', '¡Alerta!', 'Cliente no existe en la base de datos');
                return;
            }
        }

        if (vm.Filtro.PorFecha) {
            if (vm.Filtro.FechaInicio === "" || vm.Filtro.FechaInicio === "") {
                toaster.pop('warning', '¡Alerta!', 'Por favor seleccione un rango de fechas');
                return;
            }
        }
                
    };

    vm.Limpiar = function () {
        inicializarReporte();
    };

}]);




