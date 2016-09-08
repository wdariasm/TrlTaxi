app.controller("servicioController", ["$scope",  "toaster",  "servicioService","ngTableParams",
    function ($scope,toaster, servicioService, ngTableParams) {
        
    
    $scope.Servicios = [];
    $scope.TablaServicio = {};
    $scope.VerDetalle =false;
    
    $scope.$parent.SetTitulo("MIS SERVICIOS");        
    initTabla();                           
    
    
   
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
    
    $scope.OcultarDetalle = function() {
        $("#dvDetalle").hide();
    };       
        
           
    $scope.GetServiciosConductor = function (){
         var promise = servicioService.getAll($scope.$parent.Login.ConductorId, 'ACTIVO');
        promise.then(function(d) {                        
            $scope.Servicios = d.data;
            $scope.TablaServicio.reload();             
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar servicios");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    };
    
    $scope.CambiarEstado =  function (item, estado, enviar){
        var obj = {
            Estado : estado, 
            Email : enviar,
            ClienteId : item.ClienteId,
            Responsable : item.Responsable,
            Conductor : item.ConductorId
        };
        
        var promise = servicioService.put(item.IdServicio, obj);
        promise.then(function(d) {                        
            toaster.pop('success','¡Información!', d.data.message);
            $scope.GetServiciosConductor();
        }, function(err) {           
                toaster.pop('error','¡Error confirmar servicio!',err.data.request, 0);           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    };
    
    $scope.GetServiciosConductor();
}]);


