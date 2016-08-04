app.controller("contratoController", ["$scope", 'tipoVehiculoService', "toaster", "clienteService",
    function ($scope, tipoVehiculoService,toaster, clienteService) {
        
    $scope.Contrato = {};   
    $scope.Contatos = [];
    $scope.title = "Nuevo Contrato";
    $scope.editMode = false;
        
    init();
        
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
            ctUsuarReg : $scope.$parent.Login.Login
        };      
    }
        
        
    $scope.validarIdentificacion = function () {
        $scope.valCedula = false;
        if (!$scope.Cliente.Identificacion) {
            return;
        }        
        var promisePost = clienteService.validarIdentificacion($scope.Cliente.Identificacion);
        promisePost.then(function (d) {
            if (d.data.Identificacion) {
                $scope.valCedula = true;                
            }else{
                toaster.pop('error', "Error", "Cliente no registrado"); 
            }
        }, function (err) {
           toaster.pop('error', "Error", "Error al validar Identificación"); 
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };
    
}]);


