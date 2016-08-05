app.controller("contratoController", ["$scope", 'tipoVehiculoService', "toaster", "clienteService",  "tiposervicioService",
    function ($scope, tipoVehiculoService,toaster, clienteService, tiposervicioService) {
        
    $scope.Contrato = {};   
    $scope.Contatos = [];
    $scope.title = "Nuevo Contrato";
    $scope.editMode = false;
    
    $scope.TipoServicio = [];
    
    getServicios();
    init();
    
    function getServicios (){
        var promise = tiposervicioService.getActivos();
        promise.then(function(d) {                        
            $scope.TipoServicio = d.data;
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar tipos de servicio");
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    }
        
    function init (){
        $scope.Contrato = {
            ctClienteId : "",
            IdContrato : 0,
            ctNitCliente :"",
            ctContratante : "",
            ctFechaInicio : moment().format('L'),
            ctFechaFinal : moment().format('L'),
            ctRazonSocial : "",
            ctObjeto : "",
            ctNitEmpresa : "",
            ctNumeroContrato : "",
            ctDuracion : "",
            ctNumVehiculos : "",
            ctUsuarReg : $scope.$parent.Login.Login,
            ctMovilPpal :""
        };      
    }
    
    
    
    $scope.CambiarFormato=function (variable){
        $scope.Contrato[variable] = moment($scope.Contrato[variable]).format('L');
        var diferencia = moment.preciseDiff($scope.Contrato.ctFechaInicio, $scope.Contrato.ctFechaFinal);
        $scope.Contrato.ctDuracion = diferencia;
    };
        
        
    $scope.validarIdentificacion = function () {
        $scope.valCedula = false;
        if (!$scope.Contrato.ctNitCliente) {
            return;
        }        
        var promisePost = clienteService.validarIdentificacion($scope.Contrato.ctNitCliente);
        promisePost.then(function (d) {
            if (d.data.Identificacion) {
                $scope.valCedula = true; 
                $scope.Contrato.ctContratante = d.data.Nombres;
                $scope.Contrato.ctClienteId = d.data.IdCliente;
                $scope.Contrato.ctMovilPpal = d.data.MovilPpal;
                
            }else{
                toaster.pop('error', "¡Error!", "Cliente no registrado"); 
            }
        }, function (err) {
           toaster.pop('error', "Error", "Error al validar Identificación"); 
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };
    
}]);


