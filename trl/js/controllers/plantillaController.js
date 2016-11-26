app.controller('plantillaController',['$scope',  'ngTableParams', 'toaster',"plantillaService", "$routeParams", "serverData",
    function ($scope, ngTableParams, toaster, plantillaService, $routeParams, serverData) {
    
    var opcion =["1","3","4"];
    
    $scope.Plantillas = [];
    $scope.Plantilla = {};
            
    $scope.editMode = false;                    
    $scope.title = "Nueva Plantilla"; 
    $scope.tbPlantilla = {};
    $scope.PlantillaGlobal =  {};
    $scope.TipoId = $routeParams.tipo;   
    $scope.Mensaje = {};
    
    if(opcion.indexOf($scope.TipoId) === -1){
        toaster.pop("error","¡Error!", "Ruta no valida");
        setTimeout(function (){location.href ="#/";},2000) ;        
    }
        
    loadPlantilla();
    init();            
    initTabla();             
           
    function loadPlantilla() {
        var promiseGet = plantillaService.getPorTipo($scope.TipoId); //The Method Call from service
        promiseGet.then(function(pl) {
            $scope.Plantillas = pl.data;       
            $scope.tbPlantilla.reload();
        },
        function(errorPl) {
            toaster.pop("error","¡Error!", "Eror al cargar plantillas");
            console.log('failure loading Zona', errorPl);
        });
    }
    
    function init(){
        $scope.Plantilla = {
            plCodigo : 0,
            plDescripcion : "",            
            plEstado : "ACTIVO",
            plTipoServicio : $scope.TipoId
        };
    }
    
    
    function initTabla() {
        $scope.tbPlantilla = new ngTableParams({
            page: 1,
            count: 15,
            sorting: undefined
        }, {
            filterDelay: 50,
            total: 1000,
            counts : [],
            getData: function (a, b) {
                var c = b.filter().busqueda;
                f = [];
                c ? (c = c.toLowerCase(), f = $scope.Plantillas.filter(function (a) {
                    return a.plDescripcion.toLowerCase().indexOf(c) > -1 ||
                           a.plEstado.toLowerCase().indexOf(c) > -1                                                       
                })) : f = $scope.Plantillas, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
            }
        });
    };                           
       
    $scope.Nuevo = function() {
        init();
        $scope.editMode = false;
        $scope.title = "Nueva Plantilla";      
    };
    
    $scope.Get = function(item) {                 
        $scope.editMode = true;
        $scope.title = "Editando Plantilla";            
        $scope.Plantilla = item;                        
    };      

    $scope.Guardar = function (){
        
        if(!$scope.TipoId){
            toaster.pop('error','¡Error!', 'No existe tipo de servicio');
            return;
        }
        
        if(!$scope.Plantilla.plDescripcion){
            toaster.pop('info','¡Alerta!', 'Ingrese la descripción');
            return;
        }
                                
        $scope.Plantilla.plDescripcion =$scope.Plantilla.plDescripcion.toUpperCase();        
        var promise;
        if($scope.editMode){            
            promise = plantillaService.put($scope.Plantilla.plCodigo, $scope.Plantilla);            
        }else {
            promise = plantillaService.post($scope.Plantilla);            
        }
                                                    
        promise.then(function(d) {            
            toaster.pop('success','¡Información!', d.data.message);
            $scope.Nuevo();
            loadPlantilla();
              
        }, function(err) {           
            toaster.pop('error', "¡Error!", err.data);   
            console.log("Some Error Occured " + JSON.stringify(err));
        });  
    };
    
  
    $scope.VerDesactivarPlantilla = function (item){
        $scope.PlantillaGlobal = item;
        $scope.Mensaje.Boton = false;
        $('#mdConfirmacionPlantilla').modal('show'); 
    };
    
    $scope.EliminarDatos = function (){
        if(!$scope.PlantillaGlobal.plCodigo){
            $scope.Mensaje.Texto =  "ID de plantilla no valido";
            return;
        }
        var objeto = {
            PlantillaId : $scope.PlantillaGlobal.plCodigo,
            Usuario : $scope.$parent.Login.Login,
            Tipo : $scope.TipoId, 
            Descripcion : $scope.PlantillaGlobal.plDescripcion
        };
        
        $scope.Mensaje.Texto = "Espere por favor. Este proceso puede tardar algunos minutos.";
        $scope.Mensaje.Boton = true;
        $scope.Mensaje.Cargando = true;
        
        var promise = plantillaService.delete(objeto);            
        
        promise.then(function(d) {            
            toaster.pop('success','¡Información!', d.data.message);
            $('#mdConfirmacionPlantilla').modal('hide');
            loadPlantilla();
              
        }, function(err) {           
            toaster.pop('error', "¡Error!", err.data);   
            console.log("Some Error Occured " + JSON.stringify(err));
        });  
        
    };
    
    $scope.AgregarDatos = function (item){
        serverData.data = angular.copy(item);
                
        var div1 = document.getElementById('liVistaDatos');                
                div1.classList.remove('hidden');
                div1.classList.add('visible');                                                  
        $('#tabPanels a[href="#tabRegistro"]').tab('show');                
        
        switch ($scope.TipoId){
            case "1":                
                $scope.$emit("cargueTransfert", "iniciando cargue");
                break;
            case "3":
                $scope.$emit("cargueRuta", "iniciando cargue");
                break;
            case "4":
                $scope.$emit("cargueTraslado", "iniciando cargue");
                break;
        }
                
    };
}]);


