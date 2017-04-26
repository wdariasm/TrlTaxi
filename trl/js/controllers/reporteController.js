app.controller('reporteController', ['$scope', 'toaster', '$rootScope', 'zonaService', 'funcionService',
    'clienteService', 'tiposervicioService', 'tipoVehiculoService', 'conductorService', 'reporteService',
    'ngTableParams', 'excelService',
    function ($scope, toaster, $rootScope, zonaService, funcionService, clienteService, 
            tiposervicioService, tipoVehiculoService,  conductorService, reporteService, ngTableParams, excelService) {

    var vm = this;

    vm.TipoVehiculos = [];
    vm.TipoServicios = [];

    $rootScope.SetTituloPpal("REPORTES Y ESTADISTICAS");

    vm.Filtro = {};
    vm.VerConsulta = false;
    vm.Servicios = [];    
    vm.TablaServicio ={};
    vm.Seleccionar = {};
    
    loadZona();
    loadTipoServicio();
    loadTipoVehiculo();
    initTabla();    
    inicializarReporte();
    
    var fechaActual = new Date().toISOString().substr(0,10).toString();

    function inicializarReporte() {
        
        vm.Seleccionar = {
            Zona: "", 
            TipoVehiculo: "",
            TipoServicio: ""
        };
        
        vm.Filtro = {
            Placa: "",           
            Cliente: "",
            Valor: "",
            Conductor: "",
            FechaInicio: moment().subtract(7, 'day').format("L"),
            FechaFin: moment().format("L"),
            ClienteId: 0,
            PorFecha: true,            
            ConductorId : 0,
            Contrato : "",
            TipoServicioId : 0,
            TipoVehiculoId : 0,
            ZonaId : 0
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
    
    function initTabla() {
        vm.TablaServicio = new ngTableParams({
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
                c ? (c = c.toLowerCase(), f = vm.Servicios.filter(function (a) {
                    return a.Responsable.toLowerCase().indexOf(c) > -1 ||
                           a.NumeroContrato.indexOf(c) > -1 ||
                           a.svDescripcion.toLowerCase().indexOf(c) > -1 ||
                           a.Estado.toLowerCase().indexOf(c) > -1                                                       
                })) : f = vm.Servicios, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
            }
        });
    };        


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
    
    vm.ValidarConductor = function () {
        vm.Filtro.ConductorId = 0;
        if (!vm.Filtro.Conductor) {
            return;
        }        
        var promisePost = conductorService.validarIdentificacion(vm.Filtro.Conductor);
        promisePost.then(function (d) {
            if (!d.data) {                
                toaster.pop('info', "Conductor no existe en la base de datos.");              
            } else {
                vm.Filtro.ConductorId = d.data.IdConductor;
            }
        }, function (err) {
           toaster.pop('error', "Error", "Error al validar Identificación"); 
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };

    vm.Buscar = function () {
        vm.VerConsulta = false;
        if (vm.Filtro.Cliente !== "") {            
            if (vm.Filtro.ClienteId == 0) {
                toaster.pop('warning', '¡Alerta!', 'Cliente no existe en la base de datos');
                return;
            }
        }
        
        if (vm.Filtro.Conductor !== "") {            
            if (vm.Filtro.ConductorId == 0) {
                toaster.pop('warning', '¡Alerta!', 'Conductor no existe en la base de datos');
                return;
            }
        }

        if (vm.Filtro.PorFecha) {
            if (vm.Filtro.FechaInicio === "" || vm.Filtro.FechaInicio === "") {
                toaster.pop('warning', '¡Alerta!', 'Por favor seleccione un rango de fechas');
                return;
            }
        }
        
        if(vm.Seleccionar.Zona){
            vm.Filtro.ZonaId = vm.Seleccionar.Zona.znCodigo;
        }
        
        if(vm.Seleccionar.TipoVehiculo){
            vm.Filtro.TipoVehiculoId = vm.Seleccionar.TipoVehiculo.tvCodigo;
        }
        
        if(vm.Seleccionar.TipoServicio){
            vm.Filtro.TipoServicioId = vm.Seleccionar.TipoServicio.svCodigo;
        }
        
        if(vm.Filtro.PorFecha){
            var valorF1 = $('#txtFechaI').val();
            var valorF2  = $('#txtFechaF').val();                
            vm.Filtro.FechaInicio =  valorF1 === "" ? fechaActual : valorF1;
            vm.Filtro.FechaFin = valorF2 ==="" ? fechaActual : valorF2;
        }
        
        var promisePost = reporteService.postAdministrador(vm.Filtro);
        promisePost.then(function (d) {
            vm.VerConsulta = true;
            vm.Servicios =d.data;
            vm.TablaServicio.reload();   
        }, function (err) {
           toaster.pop('error', "Error", "Error al realizar consulta"); 
            console.log("Some Error Occured " + JSON.stringify(err));
        });
                
    };

    vm.Limpiar = function () {
        inicializarReporte();
    };
    
    vm.ExportarExcel=function(tableId){ 
//        var exportHref=excelService.tableToExcel(tableId,'WireWorkbenchDataExport');
//            setTimeout(function(){location.href=exportHref;},100); 

         var tmpElemento = document.createElement('a');
        // obtenemos la información desde el div que lo contiene en el html
        // Obtenemos la información de la tabla
        var data_type = 'data:application/vnd.ms-excel';
        var tabla_div = document.getElementById('tbConsulta');
        var tabla_html = tabla_div.outerHTML.replace(/ /g, '%20');
        tmpElemento.href = data_type + ', ' + tabla_html;
        //Asignamos el nombre a nuestro EXCEL
        tmpElemento.download = 'Nombre_De_Mi_Excel.xls';
        // Simulamos el click al elemento creado para descargarlo
        tmpElemento.click();
    };

}]);




