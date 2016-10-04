app.controller("carteraController", ["$scope",  "toaster",  "servicioService", "funcionService",
    function ($scope,toaster, servicioService, funcionService) {
            
    $scope.Cartera = [];
    
    $scope.$parent.SetTitulo("CARTERA");                                  
    
    $scope.Busqueda = {
        FechaInicio : moment().subtract(7,'day').format("L"),
        FechaFin : moment().format("L")
    };
       
    
    $scope.ConvertirFecha =  function (fecha){
        var f = new Date(fecha);       
        return f.toLocaleDateString('en-GB');
    };
    
    $scope.CambiarFormato=function (variable){
        $scope.Busqueda[variable] = funcionService.FormatFecha($scope.Busqueda[variable],5);        
        $scope.Busqueda[variable] = moment($scope.Busqueda[variable]).format('L');        
    };
        
    
    $scope.GetServicios = function (){
        var obj = {
            id : $scope.$parent.Login.ConductorId,
            fechafin : $scope.Busqueda.FechaFin,
            fecha : $scope.Busqueda.FechaInicio            
        };
        $scope.Cartera =[];
        var promise = servicioService.getCartera(obj);
        promise.then(function(d) {            
            if(d.data.length>0){
                $scope.Cartera = d.data;  
            }                     
        }, function(err) {           
            toaster.pop('error','¡Error Servicios!',err.data.error,0);           
            console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    };
                                      
    $scope.GetServicios();
}]);




