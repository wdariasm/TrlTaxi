app.controller("contratoController", ["$scope", 'tipoVehiculoService', "toaster", "clienteService",  "tiposervicioService", "plantillaService", "funcionService", "contratoService","ngTableParams","disponibilidadService",
    function ($scope, tipoVehiculoService,toaster, clienteService, tiposervicioService, plantillaService, funcionService, contratoService, ngTableParams, disponibilidadService) {
        
    $scope.Contrato = {};   
    $scope.Contatos = [];
    $scope.TablaContrato = {};
    $scope.title = "Nuevo Contrato";
    $scope.editMode = false;               
    $scope.TipoServicio = [];    
    $scope.TipoContrato = [];
                    
    $scope.EditPlantilla = { sv1 : false, sv2 : false, sv3 : false, sv4 : false};
    $scope.PlantillaTipo = {}; 
    
    $scope.Boton = { Guardar:false, Imprimir : true};
    $scope.IdContratoGlobal = "";
    $scope.NumeroCtoTemp  = "";
    
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
                toaster.pop('error','¡Error al cargar tipos de servicio!', err.data, 0);
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    }
    
    function loadContratos(){
        var promise = contratoService.getAll();
        promise.then(function(d) {                        
            $scope.Contatos = d.data;
            $scope.TablaContrato.reload();
        }, function(err) {             
            toaster.pop('error','¡ Error al cargar contratos!', err.data , 0);
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    }
    
    function initTabla() {
        $scope.TablaContrato = new ngTableParams({
            page: 1,
            count: 15,
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
            toaster.pop('error','¡ Error al cargar tipos de contrato!', JSON.stringify(err.data), 0);
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
            ctFormaPago : [],
            ctTipoContrato :"",   
            ctRecorridos : "",
            Validar : "0"
        };       
        $scope.EditPlantilla = { sv1 : false, sv2 : false, sv3 : false, sv4 : false};
        $scope.PlantillaTipo = {};
    }               
    
    function loadPlantillas(id, campo, valor) {
        var promiseGet = plantillaService.get(id); //The Method Call from service
        promiseGet.then(function(pl) {            
            $scope[campo] = pl.data;                    
            if(valor != null){                
                var pos = funcionService.arrayObjectIndexOf($scope[campo], valor, 'plCodigo');
                if(pos >=0){                                          
                    $scope.PlantillaTipo[campo] = $scope[campo][pos];                                        
                }               
            }
        },
        function(errorPl) {
            toaster.pop("error","¡Error!", "Eror al cargar plantillas de transfert");
            console.log('failure loading Zona', errorPl);
        });
    }
    
    
    $scope.TipoServicioCheck = function(value) {           
        var campo = value.svCampo;                                
        $scope.EditPlantilla[campo] = $("#ts"+value.svCodigo).prop('checked');
        
        if($scope.EditPlantilla[campo]){                    
            loadPlantillas(value.svCodigo, campo, null);                    
        }  else {
            $scope.PlantillaTipo[campo] = null;
        }  
        
    };
    
    function validar(){
        
        
        if(!$scope.frmContrato.$valid){
            toaster.pop('error','¡Error!', 'Por favor ingrese los datos requeridos (*).');
            return;
        }
        
        if($scope.Contrato.ctClienteId ===0){
            toaster.pop("info","¡Alerta!", "Cliente no registrado");
            return false;
        }
        
        if($scope.Contrato.TipoServicio.length===0){
            toaster.pop("info","¡Alerta!", "Seleccione los servicios");
            return false;
        }
        $scope.Contrato.Plantillas = [];        
        var mensaje = "";
        
        $.each($scope.Contrato.TipoServicio, function( key, value ) {              
            var objPlantilla = $scope.PlantillaTipo[value.svCampo];                        
            if(objPlantilla == undefined || objPlantilla == null){                                
                mensaje += "Seleccione la plantilla para el servicio de " + value.svDescripcion + "\n";                                
                return false;                
            } else {
                $scope.Contrato.Plantillas.push(objPlantilla);               
            }                                                           
        });
        
        if(mensaje.length  > 0){
            toaster.pop("info","¡Alerta!", mensaje);
            return false;
        }
                
        if( $scope.Contrato.Plantillas.length === 0){
            toaster.pop("info","¡Alerta!", "Seleccione al menos una plantilla");
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
        $scope.Contrato[variable] = moment($scope.Contrato[variable]).format("L"); 
        calcularDias();                      
    };
    
    
    function calcularDias (){             
        var diferencia = funcionService.diferenciaDias($scope.Contrato.ctFechaInicio, $scope.Contrato.ctFechaFinal);
        if (diferencia < 0) {            
            toaster.pop("error","¡Validación!","Estimado Usuario(a), la fecha de finalización del contrato debe ser posterior" +
                " a la fecha de inicia.");           
        }
         $scope.Contrato.ctDuracion = diferencia + " DÍAS";
    }
        
    $scope.NuevoContrato = function (){
        $scope.title = "Nuevo Contrato";
        $scope.editMode = false;
        init();
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
            init();
              
        }, function(err) {           
            toaster.pop('error', "¡Error!", err.data.request, 0);   
            console.log("Some Error Occured " + JSON.stringify(err));
        });                  
    };
    
    $scope.get =  function (item){
        $scope.title = "Editando Contrato";
        $scope.editMode = true;
        init();        
        $scope.Contrato =  item;        
        $scope.Contrato.ctFechaInicio = moment($scope.Contrato.ctFechaInicio).format('L');         
        $scope.Contrato.ctFechaFinal = moment($scope.Contrato.ctFechaFinal).format('L'); 
        $scope.Contrato.Validar = "0";                        
        $('#tabPanels a[href="#tabRegistroCto"]').tab('show');
        var pos  =  funcionService.arrayObjectIndexOf($scope.TipoContrato, $scope.Contrato.ctTipoContrato, "tpDescripcion");
        if(pos !== -1){
            $scope.TipoContratoSelect = $scope.TipoContrato[pos];
        }
        getContrato($scope.Contrato.ctNumeroContrato);
        $scope.Contrato.TipoServicio = [];
        $scope.Contrato.Plantillas = [];
        $scope.Contrato.Disponibilidad = [];
    };
    
    $scope.Actualizar =  function (){
         $scope.Contrato.ctTipoContrato = $scope.TipoContratoSelect.tpDescripcion;
        if(!validar()) return;
         var promise = contratoService.put($scope.Contrato.IdContrato, $scope.Contrato);                                                            
        promise.then(function(d) {            
            toaster.pop('success','¡Información!', d.data.message);
            $scope.Contrato.Validar ="";
            $scope.Boton.Guardar =true;
            //$scope.Boton.Imprimir = false;
            $scope.NuevoContrato();
              
        }, function(err) {           
            toaster.pop('error', "¡Error!", err.data, 0);   
            console.log("Some Error Occured " + JSON.stringify(err));
        });   
        
    };
    
    function getContrato(numero){
        var promise = contratoService.getPorNumeroCto(numero);
        promise.then(function(d) {
            if(d.data){                              
                $scope.Contrato.ctFormaPago =  angular.copy(JSON.parse(d.data.ctFormaPago));
                               
                var plantillas = d.data.Plantilla;                                
                
                $.each(plantillas, function( key, value ) {                      
                    var pos = funcionService.arrayObjectIndexOf($scope.TipoServicio, value.pcTipoServicio, 'svCodigo');
                    if(pos >=0){                        
                        var tipo = $scope.TipoServicio[pos];
                        $scope.Contrato.TipoServicio.push(tipo);     
                        $scope.EditPlantilla[tipo.svCampo] = true;
                        loadPlantillas(tipo.svCodigo, tipo.svCampo, value.plCodigo);
                    }
                });                                                                
                
                if($scope.Contrato.TipoServicio === 0){
                    toaster.pop('error', 'No se encontraón servicios asociados a este contrato', 0);
                }      

            }else{
                toaster.pop('error', "Número de contrato no existe");
            }

        }, function(err) {
                toaster.pop('error','¡Error!',err, 0);
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    }
        
        
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
    
    $scope.GetAllContratos = function (){
        loadContratos();
    };
    
    $scope.VerCancelarContrato = function(item) {
        $scope.IdContratoGlobal = item.IdContrato;
        $scope.NumeroCtoTemp = item.ctNumeroContrato;
        $('#mdConfirmacion').modal('show');
    };
    $scope.CancelarCto = function (){
            $('#mdConfirmacion').modal('hide');
            var promisePut  = contratoService.delete($scope.IdContratoGlobal);
                promisePut.then(function (d) {
                    toaster.pop('success', "Control de Información", d.data.message);
                    loadContratos();
            }, function (err) {
                    toaster.pop('error', "¡Error!", err.data.request);
                    console.log("Some Error Occured "+ JSON.stringify(err));
            });
    };
    
}]);


