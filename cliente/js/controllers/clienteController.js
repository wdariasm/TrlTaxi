app.controller("clienteController", ["$scope", "clienteService", "toaster", "ngTableParams", "funcionService", 
function ($scope, clienteService,toaster,ngTableParams, funcionService) {
   $scope.Cliente = {};
   $scope.Clientes = [];
   $scope.TablaCliente = {};
   $scope.TipoDocumentos=[];
   $scope.title="Nuevo Cliente";
   $scope.TipoSelect ={}; 
   
   $scope.IdClienteGlobal="";
   $scope.valIdent=false;
   $scope.editMode = false;
   
     $scope.$parent.SetTitulo("GESTION DE CLIENTE");
   
   
    function initialize() {
        $scope.Cliente = {
            IdCliente :"",
            Identificacion: "",
            Nombres: "",
            Direccion: "",
            MovilPpal: "",
            MovilDos: "",
            MovilTres: "",
            Correo: "",            
            Estado: 'ACTIVO',
            TipoPersona:'NATURAL',
            DigitoVerificacion:"",
            TipoDocumento:''
           
        };         
    }   
   
    initialize();
       
    function loadTipoDocumentos (){
        var promise = clienteService.getDocumento();
        promise.then(function(d) {                        
            $scope.TipoDocumentos = d.data;
            if(d.data){
               $scope.TipoSelect = d.data[0];
            }
            getCliente();
        }, function(err) {           
                toaster.pop('error','¡Error tipo de documentos!',err.data.error,5000);            
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
    
    function getCliente (){
        var promise = clienteService.get($scope.$parent.Login.ClienteId);
        promise.then(function(d) {                        
            $scope.Cliente = d.data;            
        }, function(err) {           
                toaster.pop('error','¡Error obtener datos del cliente!',err.data.error,5000);            
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
    loadTipoDocumentos ();
                    
   $scope.Guardar = function (){
       
        if(!$scope.frmCliente.$valid){
            toaster.pop('error','¡Error!', 'Por favor ingrese los datos requeridos (*).'); 
            return;
        }
              
        $scope.Cliente.Nombres = $scope.Cliente.Nombres.toUpperCase();        
        $scope.Cliente.Direccion = $scope.Cliente.Direccion.toUpperCase();                
        $scope.Cliente.MovilDos = (!$scope.Cliente.MovilDos) ? "" : $scope.Cliente.MovilDos;
        $scope.Cliente.MovilTres = (!$scope.Cliente.MovilTres) ? "" : $scope.Cliente.MovilTres;
        $scope.Cliente.TipoDocumento = $scope.TipoSelect.tdCodigo;
       
        var promise = clienteService.put($scope.Cliente.IdCliente ,$scope.Cliente);
                
        promise.then(function(d) {                                   
            toaster.pop('success', 'Control de información', d.data.message);                
        }, function(err) {           
            toaster.pop('error', "Error", "ERROR AL ACTUALIZAR DATOS");            
            console.log("Some Error Occured " + JSON.stringify(err));
        });       
    };
          
    $scope.validarIdentificacion = function () {
        $scope.valIdent = false;
        if (!$scope.Cliente.Identificacion) {
            return;
        }        
        $scope.Cliente.DigitoVerificacion = funcionService.DigitoVerificacion($scope.Cliente.Identificacion);
        var promisePost = clienteService.validarIdentificacion($scope.Cliente.Identificacion);
        promisePost.then(function (d) {
            if (d.data.Identificacion) {
                $scope.valIdent = true;
                toaster.pop('info', "N° de Identificación ya existe"); 
            }
        }, function (err) {
           toaster.pop('error', "Error", "Error al validar Identificación"); 
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };
   
}]);