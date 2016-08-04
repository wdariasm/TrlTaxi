app.controller('serviciosController',['$scope', 'zonaService', 'ngTableParams', 'toaster', function ($scope,  zonaService, ngTableParams, toaster) {
    $scope.Zonas = [];       
    $scope.Zona = {};
    $scope.funcion = null;
    
    $scope.Servicio  = {};
    
    $scope.Puntos = [];    
    $scope.editMode = false;
    
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
    
    function Poligono() {
        this.coordenadas = null;
        this.marcador = null;
    }
    
    
    function init(){
        $scope.Servicio = {
            Origen : "",
            Destino : ""
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
    
        
       
    function loadZona() {
        var promiseGet = zonaService.getAll(); //The Method Call from service
        promiseGet.then(function(pl) {
            $scope.Zonas = pl.data;
            $scope.tbZona.reload();
        },
        function(errorPl) {
            toaster.pop("error","¡Error!", "Eror al cargar zonas");
            console.log('failure loading Zona', errorPl);
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
    
    function getPuntos(codigo){        
        var promiseGet = zonaService.getPuntos(codigo); //The Method Call from service
        promiseGet.then(function(pl) {
            $scope.Puntos = pl.data;
            if ($scope.Puntos){
                var limits = new google.maps.LatLngBounds();
                var contP=0;
                $.each($scope.Puntos, function(i, item){
                    contP +=1;                                       
                    var coordenadas = new google.maps.LatLng(item.ptLatitud, item.ptLongitud);                    
                    var marcador = new google.maps.Marker(
                        {
                            position: coordenadas,
                            map: $scope.mapServicio, 
                            animation: google.maps.Animation.DROP, 
                            title:"Punto # "+ contP
                        }
                    );
                    limits.extend(marcador.position);
                    var po = new Poligono();
                    po.coordenadas = coordenadas;
                    po.marcador = marcador;

                    $scope.vecPoligono.push(po);
              });          
              dibujarPoligono();
              $scope.mapServicio.fitBounds(limits);  
            }  
        },
        function(errorPl) {
            toaster.pop('error', "¡Error!", errorPl.data.request);  
            console.log('failure loading Zona', errorPl);
        });                               
                
    }
   

    $scope.guardar = function (){
        
        if($scope.vecPoligono.length < 3){
            toaster.pop('info', '¡Alerta!', 'Es necesario por lo menos 3 puntos en la región.. Verifique !!');
            return;
        }
        
        var inicial = "";
        var vecTemp = [];
        var spuntos = "";
        for(var i = 0; i < $scope.vecPoligono.length ; i++){
            if (i===0){
                inicial += $scope.vecPoligono[i].coordenadas.lat() + " ";
                inicial += $scope.vecPoligono[i].coordenadas.lng();
            }
            spuntos += $scope.vecPoligono[i].coordenadas.lat() + " ";
            spuntos += $scope.vecPoligono[i].coordenadas.lng() + ", ";           
            var object = {
                lt : $scope.vecPoligono[i].coordenadas.lat(),
                lg : $scope.vecPoligono[i].coordenadas.lng()
            };
            vecTemp.push(object);
        }
        spuntos += inicial;  
        
        var object = {            
            znNombre: $scope.Zona.znNombre.toUpperCase(),            
            znArea: spuntos,
            znEstado : $scope.Zona.znEstado,
            puntos : vecTemp           
        };          
        
        var promise;
        if($scope.editMode){            
            promise = zonaService.put($scope.Zona.znCodigo, object);
        }else {
            promise = zonaService.post(object);            
        }
                                                    
        promise.then(function(d) {            
            toaster.pop('success','¡Información!', d.data.message);
            $scope.nuevo();
            loadZona();           
        }, function(err) {           
            toaster.pop('error', "¡Error!", err.data.request);   
            console.log("Some Error Occured " + JSON.stringify(err));
        });  
    };
    
     $scope.VerEliminar= function(znCodigo) {
        $scope.znCodigo =znCodigo;
        
        $('#mdConfirmacion').modal('show');         
    };
    
    //Funcion que elimina
     $scope.eliminar = function() {
         var objetc = {
            znCodigo :$scope.znCodigo
        };
            $('#mdConfirmacion').modal('hide'); 
            var promiseDel  = zonaService.delete($scope.znCodigo, objetc);        
                promiseDel.then(function (d) {                
                 toaster.pop('success', "Control de Información", d.data.message);                 
                 loadZona();
            }, function (err) {                              
                     toaster.pop('error', "¡Error!", err.data.request);
                    console.log("Some Error Occured "+ JSON.stringify(err));
            }); 
                
    };
           
}]);


