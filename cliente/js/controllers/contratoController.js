app.controller("contratoController", ["$scope",  "toaster",  "contratoService","ngTableParams",
    function ($scope,toaster, contratoService, ngTableParams) {
        
    $scope.Contrato = {};   
    $scope.Contatos = [];
    $scope.TablaContrato = {};
    $scope.VerDetalle =false;
    
    $scope.$parent.SetTitulo("MIS CONTRATOS");           
    
    loadContratos();   
    initTabla();                           
    
    function loadContratos(){
        var promise = contratoService.getByCliente($scope.$parent.Login.ClienteId, "Todos");
        promise.then(function(d) {                        
            $scope.Contatos = d.data;
            $scope.TablaContrato.reload();
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar contratos");
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    }
    
    function initTabla() {
        $scope.TablaContrato = new ngTableParams({
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
                c ? (c = c.toLowerCase(), f = $scope.Contatos.filter(function (a) {
                    return a.ctNitCliente.indexOf(c) > -1 ||
                           a.ctContratante.toLowerCase().indexOf(c) > -1 ||
                           a.ctNumeroContrato.indexOf(c) > -1 ||
                           a.ctEstado.toLowerCase().indexOf(c) > -1                                                       
                })) : f = $scope.Contatos, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
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
                $("#dvDetalle").show();
                toaster.clear();
                $scope.Contrato = d.data;
                $scope.Contrato.FormaPago = JSON.parse($scope.Contrato.ctFormaPago);                
            }else{
                toaster.pop('error', "Número de contrato no existe");
            }

        }, function(err) {
                toaster.pop('error','¡Error!',err, 0);
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    };    
    
}]);




