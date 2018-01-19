app.controller('plantillaController',['$scope',  'ngTableParams', 'toaster',"plantillaService", "$routeParams", "serverData","$window",
    function ($scope, ngTableParams, toaster, plantillaService, $routeParams, serverData, $window) {
    
    var opcion =["1","2","3","4"];
    
    $scope.Plantillas = [];
    $scope.Plantilla = {};
    $scope.ObjPlantilla = {};
    $scope.Archivo = {};
            
    $scope.editMode = false;                    
    $scope.title = "Nueva Plantilla"; 
    $scope.tbPlantilla = {};
    $scope.PlantillaGlobal =  {};
    $scope.TipoId = $routeParams.tipo;   
    $scope.Mensaje = {};
    $scope.verDescargar = false;
    
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
            toaster.pop("error","¡Error!", "Error al cargar plantillas");
            console.log('failure loading Zona', errorPl);
        });
    }       
    
    function init(){
        $scope.Plantilla = {
            plCodigo : 0,
            plDescripcion : "",            
            plEstado : "ACTIVO",
            plTipoServicio : $scope.TipoId,
            plValorCliente : 0,
            plValorProveedor : 0
        };
        
        if($scope.TipoId == 1){
            $scope.verDescargar= true;
        }
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
        
        if(!$scope.frmPlatilla.$valid){
            toaster.pop('error','¡Error!', 'Por favor ingrese los datos requeridos (*).'); 
            return;
        }
                
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
        $scope.Mensaje.Texto = "";
        $scope.Mensaje.Cargando = false;
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

        switch ($scope.TipoId){
            case "1":
                $('#tabPanels a[href="#tabRegistro"]').tab('show');
                $scope.$emit("cargueTransfert", "iniciando cargue");
                break;
                
            case "2":
                $('#tabPanels a[href="#tabDisponibilidad"]').tab('show');
                $scope.$emit("cargueDisponibilidad", "iniciando cargue");
                break;
            
             case "3":
                $('#tabPanels a[href="#tabListado"]').tab('show');
                $scope.$emit("cargueRuta", "iniciando cargue");
                break;
                
            case "4":
                $('#tabPanels a[href="#tabListadoTraslado"]').tab('show');
                $scope.$emit("cargueTraslado", "iniciando cargue");
                break;
        }
                
    };
    
    
    $scope.VerModificar = function (item){
        $scope.PlantillaGlobal = item;
        $scope.ObjPlantilla.SelCliente = true;
        $scope.ObjPlantilla.SelProveedor = true;
        $scope.Mensaje.Boton = false;
        $('#mdModificarPlnatilla').modal('show'); 
    };
    
    
    $scope.ActualizarValores = function (){
        if (!$scope.ObjPlantilla.SelCliente && !$scope.ObjPlantilla.SelProveedor){
            toaster.pop('warning', "¡Alerta!", "Por favor seleccione una de las operaciones a realizar.");
            return;
        }
        
        if ($scope.ObjPlantilla.SelCliente){
            if(!$scope.ObjPlantilla.OperacionC){
                toaster.pop('info', "¡Alerta!", "Seleccione la operación para el Cliente.");
                return;
            }
            
            if(!$scope.ObjPlantilla.plValorCliente){
                toaster.pop('info', "¡Alerta!", "Ingrese el valor del Cliente.");
                return;
            }
        }
        
        if ($scope.ObjPlantilla.SelProveedor){
            if(!$scope.ObjPlantilla.OperacionP){
                toaster.pop('info', "¡Alerta!", "Seleccione la operación para el Proveedor.");
                return;
            }
            
            if(!$scope.ObjPlantilla.plValorProveedor){
                toaster.pop('info', "¡Alerta!", "Ingrese el valor del Proveedor.");
                return;
            }
        }
        
    };
    
    $scope.descargarPlantilla = function (){  
        
        if ($scope.TipoId == 1){
            window.open(uri+'/api/transfert/excel?code='+$window.sessionStorage.trl_token, '_blank',
            'toolbar=no,scrollbars=no,resizable=no,top=100,left=400,width=200,height=100');
        }                
    };
    
    $scope.VerCargarDatos = function (item){
        $scope.PlantillaGlobal = item;                
        $('#mdCargueDatos').modal('show'); 
    };
    
    $scope.CargarDatos=  function (){
        
        if(!$scope.frmCargue.$valid){
            toaster.pop('error','¡Error!', 'Por favor seleccione el archivo.');
            return;
        }
                
        if (!$scope.Archivo.Ruta){
            toaster.pop('info', "¡Alerta!", "Seleccione el Archivo.");
            return;
        }
        
        
        var formData=new FormData();
        formData.append('IdTipo', $scope.TipoId);
        formData.append('IdPlantilla', $scope.PlantillaGlobal.plCodigo);
        formData.append('Archivo', $scope.Archivo.Ruta);
        formData.append('Usuario', $scope.$parent.Login.Login);
        
        var promise = plantillaService.postArchivo(formData);
        promise.then(function(d) {
            $scope.Archivo.Ruta =null;
            $('#mdCargueDatos').modal('hide'); 
            toaster.pop('success', "Control de Información", d.data.message);           
        }, function(err) {
            toaster.pop('error', "¡Error!", "Error al cargar archivo.");
            console.log("Some Error Occured " + JSON.stringify(err));
        });
        
    };
                
}]);


