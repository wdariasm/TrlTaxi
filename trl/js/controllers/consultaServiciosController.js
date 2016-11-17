function consultaServiciosController ($scope,  tiposervicioService, ngTableParams, toaster, contratoService, servicioService) {
    
    var vm = this;    
    var fechaActual = new Date().toISOString().substr(0,10).toString();
    vm.TipoServicio =[];
    vm.ServicioTodos = [];
    vm.Filtro = { Estado : "TODOS", FechaChk : true , TipoServicio : 0, FechaInicial: fechaActual, FechaFin :fechaActual};
    vm.TipoSelect = {};
    vm.TablaTodos ={};
    
    

    vm.GetServiciosTodos = function (){
        var valorF1 = $('#txtFechaI').val();
        var valorF2  = $('#txtFechaF').val();    
        console.log(valorF1);
        vm.Filtro.FechaInicial =  valorF1 === "" ? fechaActual : valorF1;
        vm.Filtro.FechaFin = valorF2 ==="" ? fechaActual : valorF2;   
        vm.Filtro.TipoServicio = vm.TipoSelect.svCodigo;        
        var promise = servicioService.getPorFecha(vm.Filtro);        
        promise.then(function(d) {                        
            vm.ServicioTodos = d.data;
            vm.TablaTodos.reload();              
        }, function(err) {           
                toaster.pop('error','¡Error al cargar servicios!',err.data);           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    };
    
    
    
    
    function geTipoServicios (){
        var promise = tiposervicioService.getActivos();
        vm.TipoServicio = [];
        promise.then(function(d) {  
            var cdc={svDescripcion:'TODOS', svCodigo:0, svPlantilla : "NO", svValorParada  : 0};
            vm.TipoServicio = d.data;            
            vm.TipoServicio.unshift(cdc);            
            vm.TipoSelect = vm.TipoServicio[0];
            vm.GetServiciosTodos();
        }, function(err) {           
            toaster.pop('error','¡Error al cargar tipos de servicio!', err.data, 0);
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    }
    
    function initTablaTodos() {
        vm.TablaTodos = new ngTableParams({
            page: 1,
            count: 10,
            sorting: undefined
        }, {
            filterDelay: 50,
            total: 1000,
            counts : [],
            getData: function (a, b) {
                var c = b.filter().buscadaAvanzada;
                f = [];
                c ? (c = c.toLowerCase(), f = vm.ServicioTodos.filter(function (a) {
                    return a.Responsable.toLowerCase().indexOf(c) > -1 ||
                           a.IdServicio.toString().indexOf(c) > -1 ||
                           a.NumeroContrato.indexOf(c) > -1 ||
                           a.svDescripcion.toLowerCase().indexOf(c) > -1 ||
                           a.Estado.toLowerCase().indexOf(c) > -1                                                       
                })) : f = vm.ServicioTodos, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
            }
        });
    };
    
    
    geTipoServicios();
    initTablaTodos();
};
 
consultaServiciosController.$inject = ['$scope', 'tiposervicioService', 'ngTableParams', 'toaster', "contratoService", "servicioService"];

app.controller('consultaServiciosController', consultaServiciosController);
