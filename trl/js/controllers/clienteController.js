app.controller("clienteController", ["$scope", "clienteService", "tipoDocumentoService","toaster", "ngTableParams",
function ($scope, clienteService, tipoDocumentoService,toaster,ngTableParams) {
   $scope.Cliente = {};
   $scope.Clientes = [];
   $scope.TablaCliente = {};
   $scope.TipoDocumentos=[];
   
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
            Estado: "ACTIVO",
            DigitoVerificacion:"",
            TipoDocumento:"" 
        };         
    }
    initialize();
    function loadCliente (){
        var promise = clienteService.getAll();
        promise.then(function(d) {                        
            $scope.Clientes = d.data;
            $scope.TablaCliente.reload();
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
    function loadTipoDocumentos (){
        var promise = tipoDocumentoService.getAll();
        promise.then(function(d) {                        
            $scope.TipoDocumentos = d.data;
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
   loadTipoDocumentos ();
   
   function initTabla() {
        $scope.TablaCliente = new ngTableParams({
            page: 1,
            count: 10,
            sorting: undefined
        }, {
            filterDelay: 50,
            total: 1000,
            counts : [],
            getData: function (a, b) {
                var c = b.filter().filtro;
                f = [];
                c ? (c = c.toLowerCase(), f = $scope.Clientes.filter(function (a) {
                    return a.Identificacion.toLowerCase().indexOf(c) > -1 ||
                           a.Nombres.toLowerCase().indexOf(c) > -1 ||
                           a.MovilPpal.toLowerCase().indexOf(c) > -1 ||
                           a.Estado.toLowerCase().indexOf(c) > -1                                                       
                })) : f = $scope.Clientes, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
            }
        });
    };
    
    initTabla();
  
   
   $scope.Guardar = function (){
       
        $scope.Cliente.Nombres = $scope.Cliente.Nombres.toUpperCase();
        $scope.Cliente.Estado=$scope.Cliente.Estado.toUpperCase();
        $scope.Cliente.Direccion = $scope.Cliente.Direccion.toUpperCase();
        $scope.Cliente.DigitoVerificacion = $scope.Cliente.DigitoVerificacion.toUpperCase();
        $scope.Cliente.TipoDocumento = $scope.Cliente.TipoDocumento.toUpperCase();
        
          if ($scope.valIdent){
           toaster.pop('error','¡Error!', 'N° de Cedula ya existe'); 
            return;
             }
        
        var promise;
        if($scope.editMode){            
            promise = clienteService.put($scope.Cliente.IdCliente ,$scope.Cliente);
        }else {
            promise = clienteService.post($scope.Cliente);            
        }
        
        promise.then(function(d) {                        
            loadCliente();
           toaster.pop('success', "Control de Información", d.data.message); 
             
        }, function(err) {           
                 toaster.pop('error', "Error", "ERROR AL PROCESAR SOLICITUD");            
                console.log("Some Error Occured " + JSON.stringify(err));
        });       
   };
   
   //edita la Cliente
    $scope.get = function(item) {
        $scope.Cliente=item;
        $scope.editMode = true;
        $scope.title = "EDITAR CLIENTE"; 
        $scope.active = "active";
       console.log(item);        
       
     $('#tabPanels a[href="#tabRegistro"]').tab('show');

    };
    
     //Funcion que elimina
         $scope.VerDesactivar = function(IdCliente,  Estado) {
        $scope.Estado =Estado;
        $scope.IdClienteGlobal = IdCliente;
        $('#mdConfirmacion').modal('show');         
    };
    
   
     $scope.Desactivar = function() {
         var objetc = {
            Estado :$scope.Estado
        };
            $('#mdConfirmacion').modal('hide'); 
            var promisePut  = clienteService.updateEstado($scope.IdClienteGlobal, objetc);        
                promisePut.then(function (d) {                
                 toaster.pop('success', "Control de Información", d.data.message);                 
                loadCliente(); 
            }, function (err) {                              
                     toaster.pop('error', "Error", "ERROR AL PROCESAR SOLICITUD"); ;
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
   
     };
  
  
      $scope.validarIdentificacion = function () {
        $scope.valIdent = false;
        if (!$scope.Cliente.Identificacion) {
            return;
        }        
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
    
   
    loadCliente();
}]);







