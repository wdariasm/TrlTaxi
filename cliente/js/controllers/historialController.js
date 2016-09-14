app.controller("historialController", ["$scope",  "toaster",  "servicioService","ngTableParams",
    function ($scope,toaster, servicioService, ngTableParams) {
        
    
    $scope.Servicios = [];
    $scope.TablaServicio = {};
    $scope.VerDetalle =false;
    $scope.ServicioDto = {};
    $scope.Conductor = {};
    
    $scope.$parent.SetTitulo("HISTORIAL DE SERVICIOS");        
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
        
    $scope.Get =  function (contrato){
        $scope.VerDetalle =  true;
        $scope.Contrato.ctNumeroContrato = contrato;
        toaster.pop('wait','Consulta', 'Consultando informacioón....', 0);        
        var promise = contratoService.getPorNumeroCto(contrato);
        promise.then(function(d) {
            if(d.data){
                toaster.clear();
                $scope.Contrato = d.data;
                $scope.Contrato.FormaPago = JSON.parse($scope.Contrato.ctFormaPago);
                console.log($scope.Contrato.FormaPago);
            }else{
                toaster.pop('error', "Número de contrato no existe");
            }

        }, function(err) {
                toaster.pop('error','¡Error!',err, 0);
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    };    
    
    $scope.GetServicios = function (){
         var promise = servicioService.getAll($scope.$parent.Login.ClienteId,
         $scope.$parent.Login.TipoAcceso, $scope.$parent.Login.Login);
        promise.then(function(d) {                        
            $scope.Servicios = d.data;
            $scope.TablaServicio.reload();             
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar Clientes");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    };
    
    $scope.VerConductor = function (item){
        $('#mdConductor').modal({
            backdrop: 'static',
            keyboard: false,
            show: true
        });
        $scope.ServicioDto = item;
        getConductor(item.ConductorId);        
    };
    
    function getConductor (id){
        $scope.Conductor = {};
        var promise = servicioService.getConductor(id);        
        promise.then(function(d) {  
            if (d.data){
                $scope.Conductor = d.data[0];
            }
            
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar conductor del servicio",0);           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
        
    }
    
    $scope.GetServicios();
}]);


