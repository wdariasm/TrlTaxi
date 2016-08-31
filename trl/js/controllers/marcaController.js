app.controller("marcaController", ["$scope", "marcaService","toaster", "ngTableParams",
 function ($scope, marcaService,toaster, ngTableParams) {
   $scope.Marca = {};
   $scope.Marcas = [];
   $scope.IdMarcaGlobal="";
   $scope.editMode = false;
   $scope.title="NUEVA MARCA";
   
   $scope.TablaMarca = {};
      
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
            $scope.TablaMarca.reload();
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar Marcas");             
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
   
    $scope.nuevo = function (){
       initMarca();
       $scope.editMode =false;
       $scope.title = "NUEVA MARCA"; 
   };
   
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
                 toaster.pop('error', "Error", "Error al guardar Marca");           
                console.log("Some Error Occured " + JSON.stringify(err));
        });  
        initMarca();
   };
   
   function initTabla() {
        $scope.TablaMarca = new ngTableParams({
            page: 1,
            count: 12,
            sorting: undefined
        }, {
            filterDelay: 50,
            total: 1000,
            counts : [],
            getData: function (a, b) {
                var c = b.filter().busqueda;
                f = [];
                c ? (c = c.toLowerCase(), f = $scope.Marcas.filter(function (a) {
                    return a.maDescripcion.toLowerCase().indexOf(c) > -1 ||                          
                           a.maEstado.toLowerCase().indexOf(c) > -1                                                       
                })) : f = $scope.Marcas, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
            }
        });
    };
    
    initTabla();
   
   
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
                     toaster.pop('error', "Error", "Error  al desactivar Marca"); ;
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
                
    };
   
    loadMarca();
}]);


