app.controller("escolaridadController", ["$scope", "escolaridadService","toaster", function ($scope, escolaridadService, toaster) {
   $scope.Escolaridad = {};
   $scope.Escolaridades = [];
   $scope.editMode = false;
   
   initEscolaridad();
    function initEscolaridad() {
        $scope.Escolaridad = {
            esCodigo:"",
            esDescripcion:"",
            esEstado:"ACTIVO"
        };          
    }
  
   
   
    function loadEscolaridad (){
        var promise = escolaridadService.getAll();
        promise.then(function(d) {                        
            $scope.Escolaridades = d.data;
        }, function(err) {           
                alert("ERROR AL PROCESAR SOLICITUD");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
   
   $scope.Guardar = function (){
       
        $scope.Escolaridad.esDescripcion = $scope.Escolaridad.esDescripcion.toUpperCase();
        $scope.Escolaridad.esEstado=$scope.Escolaridad.esEstado.toUpperCase();

        var promise;
        if($scope.editMode){            
            promise = escolaridadService.put($scope.Escolaridad.esCodigo, $scope.Escolaridad);
        }else {
            promise = escolaridadService.post($scope.Escolaridad);            
        }
        
        promise.then(function(d) {                        
            loadEscolaridad();
            toaster.pop('success', "Control de Información", d.data.message); 
             
        }, function(err) {           
                toaster.pop('error', "Error", "ERROR AL PROCESAR SOLICITUD");         
                console.log("Some Error Occured " + JSON.stringify(err));
        });    
        initEscolaridad();
   }; 
   
   //edita la escolaridad
    $scope.get = function(item) {
        $scope.Escolaridad=item;
        $scope.editMode = true;
        $scope.title = "EDITAR ESCOLARIDAD"; 
        $scope.active = "active";
       console.log(item);        
    };
    
    //Funcion que elimina
     $scope.Desactivar = function(esCodigo,  esEstado) {
        
        var r = confirm("¿Está seguro de Ejecutar esta Acción? ("+esEstado+")");
        if (r == true) {
            var objetc = {
            esEstado : esEstado
        };
            var promisePut  = escolaridadService.updateEstado(esCodigo, objetc);        
                promisePut.then(function (d) {                
               // Materialize.toast(d.data.message, 4000, 'rounded');                
                loadEscolaridad();
            }, function (err) {                              
                    alert("ERROR AL PROCESAR DESACTIVAR / ACTIVAR");
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
        }        
    };
   
   
    loadEscolaridad();
}]);



