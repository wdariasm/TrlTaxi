app.controller("bancoController", ["$scope", "bancoService","toaster", "ngTableParams",
   function ($scope, bancoService,toaster,ngTableParams) {
   $scope.Banco = {};
   $scope.Bancos = [];
  
   $scope.Franquicia={};
   $scope.Franquicias=[];
   $scope.title="Nuevo Banco";
   $scope.Titulo="Nueva Franquicia";
   $scope.IdFranquiciaGlobal = "";
  
   $scope.TablaBanco = {};
   $scope.TablaFranquicia = {};
   $scope.editMode = false;
   $scope.editFranquicia=false;
  
   $scope.$parent.SetTitulo("GESTION DE BANCO Y FRANQUICIAS");

   
    initBanco();
    initFranquicia();
    
   function initBanco() {
        $scope.Banco = {
          bcCodigo:"",
          bcNombre:""       
        };        
    }

    function loadBanco (){
        var promise = bancoService.getAll();
        promise.then(function(d) {                        
            $scope.Bancos = d.data;
            $scope.TablaBanco.reload();
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar Bancos");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
    
    function initTabla() {
        $scope.TablaBanco = new ngTableParams({
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
                c ? (c = c.toLowerCase(), f = $scope.Bancos.filter(function (a) {
                    return a.bcCodigo.toLowerCase().indexOf(c) > -1 ||
                           a.bcNombre.toLowerCase().indexOf(c) > -1         
                })) : f = $scope.Bancos, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
            }
        });
    };
    
    initTabla();
   
   
   
    $scope.GuardarBanco = function (){
        
        $scope.Banco.bcNombre = $scope.Banco.bcNombre.toUpperCase();	   
        var promise;
        if($scope.editMode){            
            promise = bancoService.put($scope.Banco.bcCodigo, $scope.Banco);
        }else {
            promise = bancoService.post($scope.Banco);            
        }
        
        promise.then(function(d) {                        
           loadBanco();
           toaster.pop('success', "Control de Información", d.data.message); 
             
        }, function(err) {           
                toaster.pop('error', "Error", "Error al guardar Banco");         
                console.log("Some Error Occured " + JSON.stringify(err));
        });       
   };
   
   
    $scope.getBanco = function(item) {
        $scope.Banco=item;
        $scope.editMode = true;
        $scope.title = "Editar Banco"; 
        $scope.active = "active";
    };

    $scope.NuevoBanco = function (){
        initBanco();
        $scope.editMode = false;
        $scope.title = "Nuevo Banco";
    };
    
    
    //FRANQUICIAS
     function initFranquicia() {
        $scope.Franquicia = {
            frCodigo:"",
            frDescripcion: "",
            frEstado: "ACTIVO"
            
        };         
    }
    
    $scope.NuevaFranquicia = function (){
        initFranquicia();
        $scope.editFranquicia = false;
        $scope.Titulo = "Nueva Franquicia";
    };
    
     $scope.getFranquicia = function(item) {
        $scope.Franquicia=item;
        $scope.Titulo = "Editar Franquicia";
        $scope.editFranquicia = true;
        $scope.active = "active";
    };
    
    function loadFranquicia (){
        var promise = bancoService.getAllFranquicia();
        promise.then(function(d) {                        
            $scope.Franquicias = d.data;
            $scope.TablaFranquicia.reload();
        }, function(err) {           
                toaster.pop('error','Error','No se pudo cargar franquicias');
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
    
    
     $scope.GuardarFranquicia = function (){

        $scope.Franquicia.frDescripcion = $scope.Franquicia.frDescripcion.toUpperCase();
      
        var promise;
        if($scope.editFranquicia){            
            promise = bancoService.putFranquicia($scope.Franquicia.frCodigo, $scope.Franquicia);
        }else {
            promise = bancoService.postFranquicia($scope.Franquicia);            
        }
        
        promise.then(function(d) {  
            loadFranquicia ();
            initFranquicia();
           toaster.pop('success', "Control de Información", d.data.message); 
             
        }, function(err) {           
                toaster.pop('error', "Error", "Error al guardar Franquicia");         
                console.log("Some Error Occured " + JSON.stringify(err));
        });   
       
   };
    
     $scope.VerDesactivarFranq = function(frCodigo,  frEstado) {
        $scope.frEstado =frEstado;
        $scope.frCodigo = frCodigo;
        $('#mdConfirmacion').modal('show');         
    };
    
    //Funcion que elimina
     $scope.DesactivarFranq = function() {
         var objetc = {
            frEstado :$scope.frEstado
        };
            $('#mdConfirmacion').modal('hide'); 
            var promisePut  = bancoService.updateEstado($scope.frCodigo, objetc);        
                promisePut.then(function (d) {                
                 toaster.pop('success', "Control de Información", d.data.message);                 
                loadFranquicia(); 
            }, function (err) {                              
                     toaster.pop('error', "Error", "Error al procesar Solicitud"); ;
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
   
     };
     
     function initTablaFranq() {
        $scope.TablaFranquicia = new ngTableParams({
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
                c ? (c = c.toLowerCase(), f = $scope.Franquicias.filter(function (a) {
                    return a.frDescripcion.toLowerCase().indexOf(c) > -1 ||
                           a.frEstado.toLowerCase().indexOf(c) > -1         
                })) : f = $scope.Franquicias, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
            }
        });
    };
    
     initTablaFranq();
     
    loadFranquicia(); 
    loadBanco(); 
    
}]);





