app.controller("historialController", ["$scope",  "toaster",  "servicioService","ngTableParams", "funcionService",
    function ($scope,toaster, servicioService, ngTableParams, funcionService) {
            
    $scope.Servicios = [];
    $scope.TablaServicio = {};    
    $scope.Valor = {};
    
    $scope.$parent.SetTitulo("HISTORIAL DE SERVICIOS REALIZADOS");        
    initTabla();                           
    
    $scope.Busqueda = {
        FechaInicio : moment().subtract(7,'day').format("L"),
        FechaFin : moment().format("L")
    };
   
    function initTabla() {
        $scope.TablaServicio = new ngTableParams({
            page: 1,
            count: 20,
            sorting: undefined
        }, {
            filterDelay: 50,
            total: 1000,
            counts : [],
            getData: function (a, b) {
                var c = b.filter().busqueda;
                f = [];
                c ? (c = c.toLowerCase(), f = $scope.Servicios.filter(function (a) {
                    return a.ctNitCliente.indexOf(c) > -1 ||
                           a.ctContratante.toLowerCase().indexOf(c) > -1 ||
                           a.ctNumeroContrato.indexOf(c) > -1 ||
                           a.ctEstado.toLowerCase().indexOf(c) > -1                                                       
                })) : f = $scope.Servicios, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
            }
        });
    };
    
    $scope.ConvertirFecha =  function (fecha){
        var f = new Date(fecha);       
        return f.toLocaleDateString('en-GB');
    };
    
    $scope.CambiarFormato=function (variable){
        $scope.Busqueda[variable] = funcionService.FormatFecha($scope.Busqueda[variable],5);        
        $scope.Busqueda[variable] = moment($scope.Busqueda[variable]).format('L');        
    };
    
    $scope.OcultarDetalle = function() {
        $("#dvDetalle").hide();
    };       
            
    
    $scope.GetServicios = function (){
        var obj = {
            id : $scope.$parent.Login.ConductorId,
            fechafin : $scope.Busqueda.FechaFin,
            fecha : $scope.Busqueda.FechaInicio            
        };
        var promise = servicioService.getServicios(obj);
        promise.then(function(d) {                        
            $scope.Servicios = d.data;
            $scope.TablaServicio.reload();
        }, function(err) {           
            toaster.pop('error','¡Error Servicios!',err.data.error,0);           
            console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    };
                                      
    $scope.GetServicios();
}]);


