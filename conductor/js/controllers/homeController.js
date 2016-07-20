app.controller('homeController',function ($scope, configuracionService){  
    $scope.nombres = session.getNombre();
    $scope.telefono = session.getTelefono();
    
    $scope.Configuracion = {};   
    $scope.vecCiudad = [];    
            
    getConfiguracion();   
       
    function getConfiguracion(){
        var promiseGet = configuracionService.getAll(); 
        promiseGet.then(function(pl) {
            $scope.Configuracion = pl.data;            
            $scope.vecCiudad = pl.data.Ciudad.split("-");
        },
        function(errorPl) {
            console.log('failure loading usuarios', errorPl);
        });
    }
    
    $scope.setNombre= function (valor){
        $scope.nombres = valor;
    };
    
    $scope.setTelefono = function (valor){
        $scope.telefono = valor;
    };
});



