app.controller("marcaController", ["$scope", "marcaService", function ($scope, marcaService) {
   $scope.Marca = {};
   $scope.Marcas = [];
   $scope.editMode = false;
   
    function loadMarca (){
        var promise = marcaService.getAll();
        promise.then(function(d) {                        
            $scope.Marcas = d.data;
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
   
   $scope.Guardar = function (){
       
        var promise;
        if($scope.editMode){            
            promise = marcaService.put($scope.Marca.maCodigo, $scope.Marca);
        }else {
            promise = marcaService.post($scope.Marca);            
        }
        
        promise.then(function(d) {                        
            loadMarca();
            alert(d.data.message);
             
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        });       
   };
   //edita la marca
    $scope.get = function(item) {
        $scope.Marca=item;
        $scope.editMode = true;
        $scope.title = "EDITAR BAHIA"; 
        $scope.active = "active";
       console.log(item);        
    };
    
    //Funcion que elimina
     $scope.Desactivar = function(maCodigo,  maEstado) {
        
        var r = confirm("¿Está seguro de Ejecutar esta Acción? ("+maEstado+")");
        if (r == true) {
            var objetc = {
            maEstado : maEstado
        };
            var promisePut  = marcaService.updateEstado(maCodigo, objetc);        
                promisePut.then(function (d) {                
               // Materialize.toast(d.data.message, 4000, 'rounded');                
                loadMarca();
            }, function (err) {                              
                    alert("ERROR AL PROCESAR DESACTIVAR / ACTIVAR");
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
        }        
    };
   
   
   
   
    loadMarca();
}]);


