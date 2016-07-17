app.controller("marcaController", ["$scope", "marcaService","toaster",
 function ($scope, marcaService,toaster) {
   $scope.Marca = {};
   $scope.Marcas = [];
   $scope.editMode = false;
   
    initMarca();
    function initMarca() {
        $scope.Marca = {
            maDescripcion:"",
            maEstado:"ACTIVO"
        };          
    }
   
   
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
        $scope.Marca.maDescripcion = $scope.Marca.maDescripcion.toUpperCase();
        $scope.Marca.maEstado=$scope.Marca.maEstado.toUpperCase();
        var promise;
        if($scope.editMode){            
            promise = marcaService.put($scope.Marca.maCodigo, $scope.Marca);
        }else {
            promise = marcaService.post($scope.Marca);            
        }
        
        promise.then(function(d) {                        
            loadMarca();
             toaster.pop('success', "Control de Información", d.data.message);
             
        }, function(err) {           
                 toaster.pop('error', "Error", "ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        });  
        initMarca();
   };
   //edita la marca
    $scope.get = function(item) {
        $scope.Marca=item;
        $scope.editMode = true;
        $scope.title = "EDITAR MARCA"; 
        $scope.active = "active";
       
    };
    
    //Funcion que elimina
     $scope.Desactivar = function(maCodigo,  maEstado) {
            confirm("jajja");
       
        var r = confirm("¿Está seguro de Ejecutar esta Acción?");
        if (r == true) {
            var objetc = {
            maEstado : maEstado
        };
            var promisePut  = marcaService.updateEstado(maCodigo, objetc);        
                promisePut.then(function (d) {                
               // Materialize.toast(d.data.message, 4000, 'rounded');                
                loadMarca();
            }, function (err) {                              
                     toaster.pop('error', "Error", "ERROR AL PROCESAR SOLICITUD"); ;
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
        }        
    };
   
    loadMarca();
}]);


