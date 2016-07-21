app.controller("marcaController", ["$scope", "marcaService","toaster",
 function ($scope, marcaService,toaster) {
   $scope.Marca = {};
   $scope.Marcas = [];
   $scope.IdMarcaGlobal="";
   $scope.editMode = false;
   
   $scope.$parent.SetTitulo("MARCA");

   
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
    
   $scope.VerDesactivar = function(maCodigo,  maEstado) {
        $scope.maEstado =maEstado;
        $scope.IdMarcaGlobal = maCodigo;
        $('#mdConfirmacion').modal('show');         
    };
    
    //Funcion que elimina
     $scope.Desactivar = function() {
         var objetc = {
            maEstado :$scope.maEstado
        };
            $('#mdConfirmacion').modal('hide'); 
            var promisePut  = marcaService.updateEstado($scope.IdMarcaGlobal, objetc);        
                promisePut.then(function (d) {                
                 toaster.pop('success', "Control de Información", d.data.message);                 
                loadMarca();
            }, function (err) {                              
                     toaster.pop('error', "Error", "ERROR AL PROCESAR SOLICITUD"); ;
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
                
    };
   
    loadMarca();
}]);


