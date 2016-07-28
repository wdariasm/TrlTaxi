app.controller("escolaridadController", ["$scope", "escolaridadService","toaster", function ($scope, escolaridadService, toaster) {
   $scope.Escolaridad = {};
   $scope.Escolaridades = [];
   $scope.IdGlobal="";
   $scope.editMode = false;
   $scope.valCodigo = false;
   $scope.title="NUEVA ESCOLARIDAD";
   
   $scope.$parent.SetTitulo("ESCOLARIDAD");

   
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
               toaster.pop('error','¡Error!',"Error al cargar Escolaridad");          
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
    $scope.nuevo = function (){
       initEscolaridad();
       $scope.editMode =false;
       $scope.title = "NUEVA ESCOLARIDAD"; 
   };
   
   
   $scope.Guardar = function (){
       
        $scope.Escolaridad.esDescripcion = $scope.Escolaridad.esDescripcion.toUpperCase();
        $scope.Escolaridad.esEstado=$scope.Escolaridad.esEstado.toUpperCase();
        
        if ($scope.valCodigo){
           toaster.pop('error','¡Error!', 'El Codigo ya existe'); 
            return;
             }

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
                toaster.pop('error', "Error", "Error al guardar Escolaridad");         
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
      $scope.VerDesactivar = function(esCodigo,  esEstado) {
        $scope.esEstado =esEstado;
        $scope.IdGlobal = esCodigo;
        $('#mdConfirmacion').modal('show');         
    };
    
    //Funcion que elimina
     $scope.Desactivar = function() {
         var objetc = {
            esEstado :$scope.esEstado
        };
            $('#mdConfirmacion').modal('hide'); 
            var promisePut  = escolaridadService.updateEstado($scope.IdGlobal, objetc);        
                promisePut.then(function (d) {                
                 toaster.pop('success', "Control de Información", d.data.message);                 
                 loadEscolaridad();
            }, function (err) {                              
                     toaster.pop('error', "Error", "Error al desactivar Escolaridad"); ;
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
                
    };
   
     $scope.validarCodigo= function () {
        $scope.valCodigo = false;
        if (!$scope.Escolaridad.esCodigo) {
            return;
        }        
        var promisePost = escolaridadService.validarCodigo($scope.Escolaridad.esCodigo);
        promisePost.then(function (d) {
            if (d.data.esCodigo) {
                $scope.valCodigo = true;
                toaster.pop('info', "Codigo ya existe"); 
            }
        }, function (err) {
           toaster.pop('error', "Error", "Error al validar el Codigo"); 
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };
   
    loadEscolaridad();
}]);




