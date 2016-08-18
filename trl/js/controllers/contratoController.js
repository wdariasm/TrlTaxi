app.controller("contratoController", ["$scope", 'tipoVehiculoService', "toaster", "clienteService",  "tiposervicioService", "plantillaService", "funcionService", "contratoService","ngTableParams","disponibilidadService",
    function ($scope, tipoVehiculoService,toaster, clienteService, tiposervicioService, plantillaService, funcionService, contratoService, ngTableParams, disponibilidadService) {
        
    $scope.Contrato = {};   
    $scope.Contatos = [];
    $scope.TablaContrato = {};
    $scope.title = "Nuevo Contrato";
    $scope.editMode = false;
    $scope.Disponibilidades = [];
    $scope.Plantillas = [];
    $scope.VerPlantilla = true;
    
    $scope.TipoServicio = [];
    $scope.titlePlantilla = "";
    $scope.TipoContrato = [];
    
    $scope.Boton = { Guardar:false, Imprimir : true};
    
    getServicios();
    getTipoContrato();
    loadContratos();
    init();
    initTabla();
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
    
    function loadContratos(){
        var promise = contratoService.getAll();
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
            ctClienteId : 0,
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
            ctTelefono :"",
            TipoServicio : [],
            Plantillas : [],
            Disponibilidad : [],
            ctFormaPago : [],
            ctTipoContrato :"",   
            ctRecorridos : "",
            Validar : "0"
        };      
    }               
    
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
    
    function loadDisponibilidad (){
        var promiseGet = disponibilidadService.getAll(); 
        promiseGet.then(function(pl) {
            $scope.Disponibilidades = pl.data;            
        },
        function(errorPl) {
            toaster.pop("error","¡Error!", "Eror al cargar disponibilidad");
            console.log('failure loading Zona', errorPl);
        });
    }
    
    $scope.TipoServicioCheck = function(value) {
        console.log(value);     
        if(value.svPlantilla==="SI"){
            $scope.titlePlantilla = "Plantillas " + value.svDescripcion;
            loadPlantillas(value.svCodigo);
            $scope.VerPlantilla = true;
        }else{
            $scope.titlePlantilla = "Dispobilidad ";
            loadDisponibilidad();
            $scope.VerPlantilla = false;
        }
        
    };
    
    function validar(){
        if($scope.Contrato.ctClienteId ===0){
            toaster.pop("info","¡Alerta!", "Cliente no registrado");
            return false;
        }
        
        if($scope.Contrato.TipoServicio.length===0){
            toaster.pop("info","¡Alerta!", "Seleccione los servcios");
            return false;
        }
        
        if($scope.Contrato.Disponibilidad.length === 0 && $scope.Contrato.Plantillas.length === 0){
            toaster.pop("info","¡Alerta!", "Seleccione una plantilla o una disponibilidad");
            return false;
        }
        
        if($scope.Contrato.ctFormaPago.length === 0){
            toaster.pop("info","¡Alerta!", "Seleccione la forma de pago");
            return false;
        }
                
        return true;
    }
    
    $scope.ConvertirFecha =  function (fecha){
        var f = new Date(fecha);       
        return f.toLocaleDateString('en-GB');
    };
    
    $scope.CambiarFormato=function (variable){
        $scope.Contrato[variable] = moment($scope.Contrato[variable]).format('L');                
        var diferencia = moment.preciseDiff($scope.Contrato.ctFechaInicio, $scope.Contrato.ctFechaFinal );
        $scope.Contrato.ctDuracion = diferencia;        
    };
    
    
    $scope.TipoPlantillaCheck = function(value,checked) {
        console.log(checked);
        console.log($scope.Contrato.Plantillas);
    };        
    
    $scope.Guardar =  function (){           
        $scope.Contrato.ctTipoContrato = $scope.TipoContratoSelect.tpDescripcion;
        if(!validar()) return;
        
        var promise = contratoService.post($scope.Contrato);                                                            
        promise.then(function(d) {            
            toaster.pop('success','¡Información!', d.data.message);
            $scope.Contrato.Validar ="";
            $scope.Boton.Guardar =true;
            $scope.Boton.Imprimir = false;
              
        }, function(err) {           
            toaster.pop('error', "¡Error!", err.data.request, 0);   
            console.log("Some Error Occured " + JSON.stringify(err));
        });                  
    };
        
        
    $scope.validarIdentificacion = function () {
        $scope.Contrato.ctClienteId = 0;
        if (!$scope.Contrato.ctNitCliente) {
            return;
        }        
        var promisePost = clienteService.validarIdentificacion($scope.Contrato.ctNitCliente);
        promisePost.then(function (d) {
            if (d.data.Identificacion) {                
                $scope.Contrato.ctContratante = d.data.Nombres;
                $scope.Contrato.ctClienteId = d.data.IdCliente;
                $scope.Contrato.ctTelefono = d.data.MovilPpal;
                
            }else{
                toaster.pop('error', "¡Error!", "Cliente no registrado"); 
            }
        }, function (err) {
           toaster.pop('error', "Error", "Error al validar Identificación"); 
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };
    
}]);


