app.controller('soporteController',['$scope', 'soporteService', 'ngTableParams', 'toaster', function ($scope,  soporteService, ngTableParams, toaster) {
    $scope.Soportes = [];
    $scope.$parent.SetTitulo("LISTADO DE SOPORTE"); 
    $scope.TbSoporte = {};
    $scope.EstadoConsulta =false;
    $scope.VerDetalle = false;
    $scope.Soporte = {};
   
    initTabla();
    
    function initTabla() {
        $scope.TbSoporte = new ngTableParams({
            page: 1,
            count: 10,
            sorting: undefined
        }, {
            filterDelay: 50,
            total: 1000,
            counts : [],
            getData: function (a, b) {
                var c = b.filter().busqueda;
                f = [];
                c ? (c = c.toLowerCase(), f = $scope.Soportes.filter(function (a) {
                    return a.spUsuario.toLowerCase().indexOf(c) > -1 ||
                           a.spNombre.toLowerCase().indexOf(c) > -1 ||
                           a.spAsunto.toLowerCase().indexOf(c) > -1 ||
                           a.spEstado.toLowerCase().indexOf(c) > -1                            
                })) : f = $scope.Soportes, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
            }
        });
    };
    
    $scope.GetSoporte = function (){
        $scope.EstadoConsulta =true;
        var promiseGet = soporteService.getAll($scope.$parent.Login.Login);
        promiseGet.then(function(pl) {
            $scope.Soportes = pl.data;
            $scope.EstadoConsulta =false;
            $scope.TbSoporte.reload();
        },
        function(errorPl) {
            toaster.pop("error","¡Error al cargar soporte!", errorPl.data);
            console.log('failure loading Zona', errorPl);
        });
    };
    
    $scope.GetSoporte();
    
    $scope.get= function (item){
        $scope.VerDetalle = true;
        $scope.Soporte = item;
    };
   
}]);