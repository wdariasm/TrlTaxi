app.controller("encuestaController", ["$scope", "encuestaService", "toaster",
function ($scope, encuestaService,toaster) {
    $scope.Encuesta= {};
    $scope.Encuestas = [];
    $scope.IdTipoGlobal="";
    $scope.editMode = false;
    $scope.title = "Nueva Encuesta"; 
   
    $scope.$parent.SetTitulo("ENCUESTA");
       
    function initEncuesta() {
        $scope.Encuesta = {
            ecDescripcion:"",
            ecEstado:"ACTIVO",
            ecCodigo : 0
        };           
    }
    initEncuesta();

    function loadEncuesta (){
        var promise = encuestaService.getAll();
        promise.then(function(d) {                        
            $scope.Encuestas = d.data;
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar Encuesta");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
   
   $scope.Guardar = function (){
       
       $scope.Encuesta.ecDescripcion = $scope.Encuesta.ecDescripcion.toUpperCase();                           
       
        var promise;
        if($scope.editMode){            
            promise = encuestaService.put($scope.Encuesta.ecCodigo, $scope.Encuesta);
        }else {
            promise = encuestaService.post($scope.Encuesta);            
        }
        
        promise.then(function(d) {                        
            loadEncuesta();
            toaster.pop('success', "Control de Información", d.data.message); 
            initEncuesta();
        }, function(err) {           
                toaster.pop('error', "¡Error!", "Error al guardar encuesta");         
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
       
   };
   
   $scope.nuevo = function (){
       initEncuesta();
       $scope.editMode =false;
        $scope.title = "Nueva Encuesta"; 
   };
   
    //edita Encuesta
    $scope.get = function(item) {
        $scope.Encuesta=item;
        $scope.editMode = true;
        $scope.title = "Editar Encuesta"; 
        $scope.active = "active";            
    };
    
    //Funcion que elimina
      $scope.VerDesactivar = function(ecCodigo,  ecEstado) {
        $scope.ecEstado =ecEstado;
        $scope.IdTipoGlobal = ecCodigo;
        $('#mdConfirmacion').modal('show');         
    };
    
    //Funcion que elimina
     $scope.Desactivar = function() {
         var objetc = {
            ecEstado : $scope.ecEstado
        };
            $('#mdConfirmacion').modal('hide'); 
            var promisePut  = encuestaService.updateEstado($scope.IdTipoGlobal, objetc);        
                promisePut.then(function (d) {                
                 toaster.pop('success', "Control de Información", d.data.message);                 
                loadEncuesta();
            }, function (err) {                              
                     toaster.pop('error', "Error", "Error al Desactivar encuesta"); ;
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
   
     };

    loadEncuesta();
}]);








