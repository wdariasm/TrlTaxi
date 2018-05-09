function consultaServiciosController ($scope,  tiposervicioService, ngTableParams, toaster,
    contratoService, servicioService, funcionService, detalleService) {
    
    var vm = this;    
    var fechaActual = new Date().toISOString().substr(0,10).toString();
    vm.TipoServicio =[];
    vm.ServicioTodos = [];
    vm.Filtro = { Estado : "TODOS", FechaChk : true , TipoServicio : 0, FechaInicial: fechaActual, FechaFin :fechaActual};
    vm.TipoSelect = {};
    vm.TablaTodos ={};
    vm.Servicio = {};
    vm.Detalle = {};
    
    vm.Detalles = [];
    
    function initDetalle (){
        vm.Detalle = {
            dtServicioId  : 0,
            dtFechaInicio  :  moment().format('L'),
            dtHoraInicio :  moment().format("hh:mm a"),
            dtFechaFin  :  moment().format('L'),
            dtHoraFin :  moment().format("hh:mm a"),
            dtNumHoras : 0,
            dtValorHora : 0,
            dtValorTotal : 0,
            dtResponsable : "",
            dtObservacion : "",
            dtEstado : "ACTIVO",
            dtUser : $scope.$parent.Login.Login
        };
    }

    vm.GetServiciosTodos = function (){
        var valorF1 = $('#txtFechaI').val();
        var valorF2  = $('#txtFechaF').val();            
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
    
    vm.EditarServicio = function (item){
        initDetalle();        
        vm.Servicio = item;
        vm.Detalle.dtServicioId = vm.Servicio.IdServicio;
        consultarDetalle(vm.Servicio.IdServicio);
        $("#mdAsignarDisponibilidad").modal("show");        
    };
    
    vm.CambiarFormato=function (variable){
        vm.Detalle[variable] = funcionService.FormatFecha(vm.Detalle[variable],5);        
        vm.Detalle[variable] = moment(vm.Detalle[variable]).format('L');        
    };
    
    vm.GuardarDetalle = function (){
        
        if(!$scope.frmDetalle.$valid){
            toaster.pop('error','¡Error!', 'Por favor ingrese los datos requeridos (*).');
            return;
        }
                
        if(vm.Detalle.dtResponsable == ""){
            toaster.pop('info','¡Alerta!','Ingrese el nombre del responsable');
            return;
        }
        
        if (vm.Detalle.dtNumHoras  == 0){
            toaster.pop('info','¡Alerta!','Ingrese el número de horas');
            return;
        }
        
        if (vm.Detalle.dtValorHora  == 0){
            toaster.pop('info','¡Alerta!','Ingrese el valor de la hora');
            return;
        }
        
        if (vm.Detalle.dtValorTotal  == 0){
            toaster.pop('info','¡Alerta!','El valor total de la hora debe ser mayor a cero(0). ');
            return;
        }
        
        var promise = detalleService.post(vm.Detalle);
        
        promise.then(function(d) {                                      
            toaster.pop('success','¡Información!','Datos guardada correctamente.');    
            consultarDetalle(vm.Servicio.IdServicio);
            
        }, function(err) {           
            toaster.pop('error','¡Error al guardar disponibilidad!', err.data, 0);
            console.log("Some Error Occured " + JSON.stringify(err));
        });
        
    };
    
    vm.NuevoDetalle =  function (){
        initDetalle();
        vm.Detalle.dtServicioId = vm.Servicio.IdServicio;
        
    };
    
    function consultarDetalle(id){
        var promise = detalleService.get(id);        
        promise.then(function(d) {                        
            vm.Detalles = d.data;                       
        }, function(err) {           
                toaster.pop('error','¡Error al cargar servicios!',err.data);           
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    };
    
    vm.SubtoTotal =  function  (){        
        if(!vm.Detalle.dtNumHoras || !vm.Detalle.dtValorHora){
            vm.Detalle.dtValorTotal = 0;
            return;
        }        
        vm.Detalle.dtValorTotal  = parseInt(vm.Detalle.dtNumHoras) * parseInt(vm.Detalle.dtValorHora);
    };
    
    vm.CalcultarTotal = function (){       
        var total = 0;
        if(vm.Detalles.length > 0){                           
            for (var i=0; i< vm.Detalles.length; i++) {            
                total += parseInt(vm.Detalles[i].dtValorTotal);            
            }                                
        }
        return total;
    };

    vm.EliminarDisponibilidad =  function (item){
        var promise = detalleService.put(item.dtCodigo, item);        
        promise.then(function(d) {                        
            toaster.pop('success','¡Información!', d.data.message);    
            consultarDetalle(vm.Servicio.IdServicio);       
        }, function(err) {           
                toaster.pop('error','¡Error al cargar servicios!',err.data);           
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    }
};
 
consultaServiciosController.$inject = ['$scope', 'tiposervicioService', 'ngTableParams', 'toaster',
    "contratoService", "servicioService", "funcionService", "detalleService"];

app.controller('consultaServiciosController', consultaServiciosController);
