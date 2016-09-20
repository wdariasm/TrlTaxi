app.controller("motivoController", ["$scope", "motivoService", "toaster",
function ($scope, motivoService,toaster) {
    $scope.Motivo= {};
    $scope.Motivos = [];    
    $scope.editMode = false;
    $scope.title = "Nuevo Motivo"; 
   
    $scope.$parent.SetTitulo("MOTIVOS DE CANCELACION DE SERIVICIOS");
       
    function initMotivo() {
        $scope.Motivo = {
            mtDescripcion:"",
            mtEstado:"ACTIVO",
            IdMotivo : 0,
            mtModulo : "",
            mtDejarServicio : "NO"
        };           
    }
    initMotivo();

    function loadMotivo (){
        var promise = motivoService.getAll();
        promise.then(function(d) {                        
            $scope.Motivos = d.data;
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar motivos de cancelación");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
   
   $scope.Guardar = function (){
       
       $scope.Motivo.mtDescripcion = $scope.Motivo.mtDescripcion.toUpperCase();                           
       
        var promise;
        if($scope.editMode){            
            promise = motivoService.put($scope.Motivo.IdMotivo, $scope.Motivo);
        }else {
            promise = motivoService.post($scope.Motivo);            
        }
        
        promise.then(function(d) {                        
            loadMotivo();
            toaster.pop('success', "Control de Información", d.data.message); 
            initMotivo();
        }, function(err) {           
                toaster.pop('error', "¡Error al guardar!",  err.request,0);         
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
       
   };
   
   $scope.nuevo = function (){
       initMotivo();
       $scope.editMode =false;
        $scope.title = "Nuevo Motivo"; 
   };
   
    //edita Motivo
    $scope.get = function(item) {
        $scope.Motivo=item;
        $scope.editMode = true;
        $scope.title = "Editar Motivo"; 
        $scope.active = "active";            
    };        

    loadMotivo();
}]);










