app.controller('serviciosController',['$scope', 'zonaService', 'ngTableParams', 'toaster', "contratoService", "servicioService",
    function ($scope,  zonaService, ngTableParams, toaster, contratoService, servicioService) {
    $scope.Zonas = [];       
    $scope.Zona = {};
    $scope.funcion = null;
    
    $scope.Servicio  = {};
    $scope.AsigServicio =  {};
    $scope.Conductores = [];
    
    $scope.Puntos = [];    
    $scope.editMode = false;
    $scope.Servicios = [];
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
    
    geolocate();   
    iniciarMapaZ(); 
    initAutocomplete();    
    initAutocompleteDestino();
    initTablaZona();
    init();
    initTabla();
    
    function Poligono() {
        this.coordenadas = null;
        this.marcador = null;
    }
    
    
    function init(){
        $scope.Servicio = {
            Origen : "",
            Destino : "",
            ContratoId : 0,
            NumeroContrato:"",
            ClienteId : 0,
            Nit : "",
            Nombre: "",
            Telefono : "", 
            TipoServicio : [],
            FechaInicio : "", 
            FechaFin : "",
            Estado : "",
            Tipo : {},
            Responsable : ""
        };
    }
        
    
    function initAutocomplete (){       
        var input = document.getElementById('txtOrigen');           
        $scope.AutocompleteOrigen = new google.maps.places.Autocomplete(input, options);                        
        $scope.AutocompleteOrigen.bindTo('bounds', $scope.mapServicio);

        $scope.AutocompleteOrigen.addListener('place_changed', function() {
            infowindow.close();
            $scope.markerOrigen.setVisible(false);                               
            var place = $scope.AutocompleteOrigen.getPlace();
            if (!place.geometry) {
                toaster.pop('error','¡Error!','No pudo resolver la  posición');
                return;
            }
            expandViewportToFitPlace($scope.mapServicio, place);                        
            $scope.markerOrigen.setIcon("images/origen.png");
            $scope.markerOrigen.setPosition(place.geometry.location);
            $scope.markerOrigen.setVisible(true);
                if(!$scope.popup){
                    $scope.popup = new google.maps.InfoWindow();
                }

            var address = '';
            if (place.address_components) {
              address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
              ].join(' ');
            }

            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
            infowindow.open($scope.mapServicio, $scope.markerOrigen);
                         
            origenPlaceId = place.place_id;
            route(origenPlaceId, destinoPlaceId, travelMode, directionsService, directionsDisplay);
            
        });
    }
    
    function initAutocompleteDestino (){       
        var input = document.getElementById('txtDestino');    
                 
        $scope.AutocompleteDestino = new google.maps.places.Autocomplete(input, options);                        
        $scope.AutocompleteDestino.bindTo('bounds', $scope.mapServicio);

        $scope.AutocompleteDestino.addListener('place_changed', function() {
            infowindow.close();
            markerDestino.setVisible(false);                               
            var place = $scope.AutocompleteDestino.getPlace();
            if (!place.geometry) {
                toaster.pop('error','¡Error!','No pudo resolver la  posición');
                return;
            }
            
            expandViewportToFitPlace($scope.mapServicio, place);  
            markerDestino.setIcon("images/destino.png");
            markerDestino.setPosition(place.geometry.location);
            markerDestino.setVisible(true);
                if(!$scope.popup){
                    $scope.popup = new google.maps.InfoWindow();
                }

            var address = '';
            if (place.address_components) {
              address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
              ].join(' ');
            }

            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
            infowindow.open($scope.mapServicio, markerDestino);
            
            destinoPlaceId = place.place_id;
            route(origenPlaceId, destinoPlaceId, travelMode,directionsService, directionsDisplay);
        });
    }                      
    
    function geolocate() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude              
            };
            
            $scope.Posicion.Latitud =  position.coords.latitude;
            $scope.Posicion.Longitud = position.coords.longitude;
            
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            $scope.AutocompleteOrigen.setBounds(circle.getBounds());
          });
        }
    }           
          
    function iniciarMapaZ  () {        
        var mapOptions = { 
            zoom: 16,
            
            //center: new google.maps.LatLng(config.getLatitud(), config.getLongitud()),
            center: new google.maps.LatLng($scope.Posicion.Latitud, $scope.Posicion.Longitud),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.mapServicio= new google.maps.Map(document.getElementById("dvMapaServicio"), mapOptions);                         
        directionsDisplay.setMap($scope.mapServicio);
        
        google.maps.event.addListener($scope.mapServicio, "click", function(evento) {         
            var latitud = evento.latLng.lat();
            var longitud = evento.latLng.lng();
            var coordenadas = new google.maps.LatLng(latitud, longitud);
            var marcador = new google.maps.Marker(
             {
                 position: coordenadas,
                 map: $scope.mapServicio, 
                 animation: google.maps.Animation.DROP, 
                 title:"Marcador"
             }
            );
        
            var po = new Poligono();
                po.coordenadas = coordenadas;
                po.marcador = marcador;                
            $scope.vecPoligono.push(po);            
            dibujarPoligono();
        }); 
        
        $scope.markerOrigen = new google.maps.Marker({
             map: $scope.mapServicio            
        }); 
        markerDestino = new google.maps.Marker({
             map: $scope.mapServicio            
        }); 
    };
    
    function route(origin_place_id, destination_place_id, travel_mode, directionsService, directionsDisplay) {
        if (!origin_place_id || !destination_place_id) {
          return;
        }
        directionsService.route({
          origin: {'placeId': origin_place_id},
          destination: {'placeId': destination_place_id},
          travelMode: travel_mode
        }, function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          } else {
              toaster.pop('error','¡Error!', 'Error al resolver dirección');
          }
        });
    }
    
    function expandViewportToFitPlace(map, place) {
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
  }
    
       
    function initTablaZona() {
        $scope.tbZona = new ngTableParams({
            page: 1,
            count: 5,
            sorting: undefined
        }, {
            filterDelay: 50,
            total: 1000,
            counts : [],
            getData: function (a, b) {
                var c = b.filter().filtroT;
                f = [];
                c ? (c = c.toLowerCase(), f = $scope.Zonas.filter(function (a) {
                    return a.placa.toLowerCase().indexOf(c) > -1 ||
                           a.identificacion.toLowerCase().indexOf(c) > -1 ||
                           a.Nombre.toLowerCase().indexOf(c) > -1 ||
                           a.Apellidos.toLowerCase().indexOf(c) > -1                            
                })) : f = $scope.Zonas, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
            }
        });
    };
    
    // GESTIONAR POLYGONOS ///
    
    function dibujarPoligono (){
        var punto = [];
        for(var i = 0; i < $scope.vecPoligono.length; i++){
            punto.push($scope.vecPoligono[i].coordenadas);
        }

        if($scope.poly !== null){
            $scope.poly.setMap(null);
        }

        $scope.poly = new google.maps.Polygon({
            paths: punto,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.25            
        });
        $scope.poly.setMap($scope.mapServicio);        
    }
    
    $scope.eliminarUltimoPunto = function (){       
        if ($scope.vecPoligono.length > 0){
            $scope.vecPoligono[$scope.vecPoligono.length-1].marcador.setMap(null);
            $scope.vecPoligono.pop();
            dibujarPoligono();
        }      
    };
    
    function borrarPuntos(){        
        while($scope.vecPoligono.length > 0) {
            $scope.vecPoligono[$scope.vecPoligono.length-1].marcador.setMap(null);
            $scope.vecPoligono.pop();
        }
        dibujarPoligono();
    };
    
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
                var c = b.filter().filtro;
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
       
    $scope.nuevo = function() {       
        $scope.editMode = false;
        $scope.title = "NUEVA ZONA";
    };
    
    $scope.get = function(item) {         
        
        $scope.editMode = true;
        $scope.title = "EDITAR ZONA";         
        $scope.Zona = item;        
        getPuntos(item.znCodigo);        
    };
           
    $scope.BuscarContrato =  function (){
        $scope.Servicio.ContratoId =0;
        if (!$scope.Servicio.NumeroContrato){
            toaster.pop('info', "Estimado usuario(a), por favor ingrese el número de contrato");
            return;
        }
        
        toaster.pop('wait','Consultando informacioón....', 0);
        
        var promise = contratoService.getPorNumeroCto($scope.Servicio.NumeroContrato);
        promise.then(function(d) {                
            if(d.data){
                toaster.clear();
                $scope.Servicio.ContratoId = d.data.IdContrato;
                $scope.Servicio.Nombre = d.data.ctContratante;
                $scope.Servicio.ClienteId = d.data.ctClienteId;
                $scope.Servicio.Nit = d.data.ctNitCliente;
                $scope.Servicio.Telefono =  d.data.ctTelefono;
                $scope.Servicio.FechaFin = new Date(d.data.ctFechaFinal).toLocaleDateString('en-GB'); 
                $scope.Servicio.FechaInicio =   new Date(d.data.ctFechaInicio).toLocaleDateString('en-GB');               
                $scope.Servicio.Estado = d.data.ctEstado;
                $scope.Servicio.TipoServicio = d.data.TipoServicio;
                if($scope.Servicio.TipoServicio === 0){
                    toaster.pop('error', 'No se encontraón servicios asociados a este contrato', 0);
                }
                
            }else{
                toaster.pop('error', "Número de contrato no existe");
            }
            
        }, function(err) {           
                toaster.pop('error','¡Error!',err, 0);
                console.log("Some Error Occured " + JSON.stringify(err));
        });                
    };
    
    $scope.TipoServicioCheck = function(value) {
        console.log($scope.Servicio.Tipo);     
        if($scope.Servicio.Tipo.csPlantilla==="SI"){
            $scope.titlePlantilla = "Plantillas " + $scope.Servicio.Tipo.csDescripcion;
            //loadPlantillas(value.svCodigo);
            $scope.VerPlantilla = true;
        }else{
            $scope.titlePlantilla = "Dispobilidad ";
           // loadDisponibilidad();
            $scope.VerPlantilla = false;
        }
        
    };
    
    $scope.GetServicios = function (){
         var promise = servicioService.getAll();
        promise.then(function(d) {                        
            $scope.Servicios = d.data;
            $scope.TablaServicio.reload();             
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar servicios");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    };
    
    $scope.GetServicios();
    
    $scope.VerAsignarServicio = function (item){
        $scope.AsigServicio = item;
        $scope.AsigServicio.Conductor = {};
        $('#mdAsignar').modal('show');   
        getConductores(item.TipoVehiculoId);
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
            Email : $scope.AsigServicio.Conductor.Email
        };
        
        var promise = servicioService.asignar(obj);
        promise.then(function(d) {         
            toaster.pop('success', '¡Información', d.data.message);
            $scope.GetServicios();
            $('#mdAsignar').modal('hide');   
        }, function(err) {           
                toaster.pop('error','¡Error!',err.data.request);           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
        
    };
                       
}]);


