app.controller("tipoDocumentoController", ["$scope", "tipoDocumentoService","toaster", 
function ($scope, tipoDocumentoService,toaster) {
   $scope.TipoDocumento = {};
   $scope.TipoDocumentos = [];
   $scope.IdTipoGlobal="";
   $scope.editMode = false;
   $scope.title="NUEVO TIPO DOCUMENTO";
   
   $scope.$parent.SetTitulo("TIPO DOCUMENTO");

     initTipoDocumento();
    function initTipoDocumento() {
        $scope.TipoDocumento = {
            tdCodigo:"",
            tdDescripcion:"",
            tdEstado:"ACTIVO"
        };          
    }
   
    function loadTipoDocumento (){
        var promise = tipoDocumentoService.getAll();
        promise.then(function(d) {                        
            $scope.TipoDocumentos = d.data;
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar Tipo Documento");             
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
   
   $scope.Guardar = function (){
       $scope.TipoDocumento.tdCodigo = $scope.TipoDocumento.tdCodigo.toUpperCase();
       $scope.TipoDocumento.tdDescripcion = $scope.TipoDocumento.tdDescripcion.toUpperCase();
       $scope.TipoDocumento.tdEstado=$scope.TipoDocumento.tdEstado.toUpperCase();
       
       
       
       
        var promise;
        if($scope.editMode){            
            promise = tipoDocumentoService.put($scope.TipoDocumento.tdCodigo, $scope.TipoDocumento);
        }else {
            promise = tipoDocumentoService.post($scope.TipoDocumento);            
        }
        
        promise.then(function(d) {                        
            loadTipoDocumento();
           toaster.pop('success', "Control de Información", d.data.message); 
             
        }, function(err) {           
                toaster.pop('error', "Error", "Error al guardar Tipo Documento");       
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
        initTipoDocumento();
   };
   
    $scope.nuevo = function (){
       initTipoDocumento();
       $scope.editMode =false;
       $scope.title = "NUEVO TIPO DOCUMENTO"; 
   };
   
    //edita la tipoDocumento
    $scope.get = function(item) {
        $scope.TipoDocumento=item;
        $scope.editMode = true;
        $scope.title = "EDITAR TIPO DOCUMENTO"; 
        $scope.active = "active";
       
    };
    
    //Funcion que elimina
     $scope.VerDesactivar = function(tdCodigo,  tdEstado) {
        $scope.tdEstado =tdEstado;
        $scope.IdTipoGlobal = tdCodigo;
        $('#mdConfirmacion').modal('show');         
    };
    
    //Funcion que elimina
     $scope.Desactivar = function() {
         var objetc = {
            tdEstado : $scope.tdEstado
        };
            $('#mdConfirmacion').modal('hide'); 
            var promisePut  = tipoDocumentoService.updateEstado($scope.IdTipoGlobal, objetc);        
                promisePut.then(function (d) {                
                 toaster.pop('success', "Control de Información", d.data.message);                 
                loadTipoDocumento();
            }, function (err) {                              
                     toaster.pop('error', "Error", "Error  al desactivar Tipo Documento"); ;
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
   
     };
   
   
   
    loadTipoDocumento();
}]);






