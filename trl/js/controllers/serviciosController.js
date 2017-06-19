app.controller('serviciosController',['$scope',  'ngTableParams', 'toaster', "contratoService", "servicioService",
    function ($scope,  ngTableParams, toaster, contratoService, servicioService) {
    $scope.Zonas = [];       
    $scope.Zona = {};
    $scope.funcion = null;
    
    $scope.Servicio  = {};
    $scope.AsigServicio =  {};
    $scope.Conductores = [];
    $scope.VerDetalle = false;
    
    $scope.FechaBusqueda =  moment().format('L');
    
    $scope.Puntos = [];    
    $scope.editMode = false;
    $scope.Servicios = [];
    $scope.ServicioTodos = [];
    $scope.TablaServicio ={};
        
    $scope.mapServicio;      
    $scope.markerOrigen = null;    
    var markerDestino = null;    
    var infowindow = new google.maps.InfoWindow();
    var options = {  componentRestrictions: {country: 'co'} };
    
    var origenPlaceId = null;
    var destinoPlaceId = null;
    var travelMode = google.maps.TravelMode.DRIVING;
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    
    
    $scope.vecPoligono = new Array(); /// Vector de Poligonos
    $scope.poly = null;
    $scope.tbZona = {}; // Para Paginacion
    
    $scope.title = "Nuevo Servicio"; 
    $scope.Posicion = {
        Latitud : 10.4370725,
        Longitud : -75.524795
    };
            
    $scope.$parent.SetTitulo("GESTIÓN DE SERVICIOS");        
    //loadZona();
   
    //  
    
    $scope.AutocompleteOrigen=null;   
    $scope.AutocompleteDestino =null;          
    
    initTabla();           
      
    function initTabla() {
        $scope.TablaServicio = new ngTableParams({
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
                c ? (c = c.toLowerCase(), f = $scope.Servicios.filter(function (a) {
                    return a.Responsable.toLowerCase().indexOf(c) > -1 ||
                           a.NumeroContrato.indexOf(c) > -1 ||
                           a.svDescripcion.toLowerCase().indexOf(c) > -1 ||
                           a.Estado.toLowerCase().indexOf(c) > -1                                                       
                })) : f = $scope.Servicios, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
            }
        });
    };         
           
    $scope.GetServicios = function (){
              
        var promise = servicioService.getSolicitados();
        promise.then(function(d) {                        
            $scope.Servicios = d.data;
            $scope.TablaServicio.reload();              
        }, function(err) {           
                toaster.pop('error','¡Error al cargar servicios!',err.data);           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    };
    
    $scope.GetServicios();
    
    $scope.VerAsignarServicio = function (item){
        $scope.AsigServicio = item;
        $scope.VerDetalle = false;
        $scope.AsigServicio.Conductor = {};
        $('#mdAsignar').modal({
            backdrop: 'static',
            keyboard: false,
            show: true
        });

        //$('#mdAsignar').modal('show');   
         
        getConductores(item.TipoVehiculoId);
        getServicio($scope.AsigServicio.IdServicio)
    };
    
    function getConductores(tipo){
        $scope.Conductores = [];
        
        var promise = servicioService.getDisponible(tipo);
        promise.then(function(d) {                     
            $scope.Conductores = d.data;                         
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar conductores");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
        
    }
    
    function getServicio(idServicio){
        var promise = servicioService.get(idServicio);
        promise.then(function(d) {                         
            if(d.data != null){                
                $scope.AsigServicio.Contactos = d.data.Contactos;
                $scope.AsigServicio.Paradas = d.data.Paradas;
                $scope.AsigServicio.ValorParadas = d.data.ValorParadas;
            }
                       
        }, function(err) {
                toaster.pop('error','¡Error!',"Error al consultar servicio");
                console.log("Some Error Occured " + JSON.stringify(err));
        });    
    };
    
    $scope.AsigServicio = {
        Conductor : {}
    };
    
    $scope.AsignarServicio =  function (){
        
        if(!$scope.AsigServicio.Conductor){
            toaster.pop('info', '¡Alerta!', "Estimado Usuario(a), por favor seleccione un conductor");
            return;
        }
        toaster.pop('wait', '¡Espere', "Procesando información.....", 0);
        var obj = {
            IdServicio : $scope.AsigServicio.IdServicio,
            ConductorId : $scope.AsigServicio.Conductor.IdConductor,
            Email : $scope.AsigServicio.Conductor.Email,
            Responsable : $scope.AsigServicio.Responsable,
            Nombre :$scope.AsigServicio.Conductor.Nombre,
            Placa : $scope.AsigServicio.Conductor.Placa,
            ClienteId : $scope.AsigServicio.ClienteId
        };
        
        var promise = servicioService.asignar(obj);
        promise.then(function(d) {         
            toaster.pop('success', '¡Información', d.data.message);
            $scope.GetServicios();
            $('#mdAsignar').modal('hide');   
        }, function(err) {           
                toaster.pop('error','¡Error!',err.data, 0);           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
        
    };
    
     $scope.CambiarFormato=function (){
        $scope.FechaBusqueda= moment($scope.FechaBusqueda).format('L');
    };
    
    $scope.CancelarServicio = function (item){
        var obj = {
            Conductor  : item.ConductorId,
            Estado : "CANCELADO",
            Motivo : 1,
            Cliente : item.ClienteId
        };
        
        var promise = servicioService.cancelar(item.IdServicio, obj);
        promise.then(function(d) {         
            toaster.pop('success', '¡Información', d.data.message);
            $scope.GetServicios();              
        }, function(err) {           
                toaster.pop('error','¡Error!',err.data.request);           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    };        
    
    $scope.VerDetalleServicio = function (){
        $scope.VerDetalle = !$scope.VerDetalle;        
    };
                       
}]);

