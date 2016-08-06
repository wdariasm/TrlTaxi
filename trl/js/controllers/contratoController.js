app.controller("contratoController", ["$scope", 'tipoVehiculoService', "toaster", "clienteService",  "tiposervicioService", "plantillaService",
    function ($scope, tipoVehiculoService,toaster, clienteService, tiposervicioService, plantillaService) {
        
    $scope.Contrato = {};   
    $scope.Contatos = [];
    $scope.title = "Nuevo Contrato";
    $scope.editMode = false;
    
    $scope.TipoServicio = [];
    $scope.titlePlantilla = "";
    
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
    
    $scope.imChanged = function(){
        $scope.testValue = $scope.Contrato.TipoVehiculo.join(',');        
    };
        
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
            ctMovilPpal :"",
            TipoServicio : [],
            Plantillas : []
        };      
    }
    
    
    
    $scope.CambiarFormato=function (variable){
        $scope.Contrato[variable] = moment($scope.Contrato[variable]).format('L');
        var diferencia = moment.preciseDiff($scope.Contrato.ctFechaInicio, $scope.Contrato.ctFechaFinal);
        $scope.Contrato.ctDuracion = diferencia;
    };
    
    function loadPlantillas(id) {
        var promiseGet = plantillaService.get(id); //The Method Call from service
        promiseGet.then(function(pl) {
            $scope.Plantillas = pl.data;            
        },
        function(errorPl) {
            toaster.pop("error","¡Error!", "Eror al cargar plantillas de transfert");
            console.log('failure loading Zona', errorPl);
        });
    }
    
    $scope.TipoServicioCheck = function(value) {
        console.log(value);     
        if(value.svPlantilla==="SI"){
            $scope.titlePlantilla = "Plantillas " + value.svDescripcion;
            loadPlantillas(value.svCodigo);
        }else{
            
        }
        
    };
    
    $scope.TipoPlantillaCheck = function(value,checked) {
        console.log(checked);
        console.log($scope.Contrato.Plantillas);
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


