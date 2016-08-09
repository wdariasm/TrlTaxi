app.controller("contratoController", ["$scope", 'tipoVehiculoService', "toaster", "clienteService",  "tiposervicioService", "plantillaService", "funcionService", "contratoService",
    function ($scope, tipoVehiculoService,toaster, clienteService, tiposervicioService, plantillaService, funcionService, contratoService) {
        
    $scope.Contrato = {};   
    $scope.Contatos = [];
    $scope.title = "Nuevo Contrato";
    $scope.editMode = false;
    
    $scope.TipoServicio = [];
    $scope.titlePlantilla = "";
    $scope.TipoContrato = [];
    
    getServicios();
    getTipoContrato();
    init();
    // select //
    $scope.TipoContratoSelect = {};
        
    $scope.FormaPago = funcionService.FormaPago();
    
    function getServicios (){
        var promise = tiposervicioService.getActivos();
        promise.then(function(d) {                        
            $scope.TipoServicio = d.data;
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar tipos de servicio");
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    }
    
    function getTipoContrato (){
        var promise = contratoService.getTipoContrato();
        promise.then(function(d) {                        
            $scope.TipoContrato = d.data;
            if(d.data){
                $scope.TipoContratoSelect = d.data[0];
            }
        }, function(err) {           
            toaster.pop('error','¡Error!',"Error al cargar tipos de contrato");
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
            ctMovilPpal :"",
            TipoServicio : [],
            Plantillas : [],
            FormaPago : [],
            ctTipoContrato :""
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
    
    $scope.Guardar =  function (){
        $scope.Contrato.ctTipoContrato = $scope.TipoContratoSelect.tpDescripcion;
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


