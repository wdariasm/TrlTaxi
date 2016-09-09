app.controller('serviciosController',['$scope', 'zonaService', 'ngTableParams', 'toaster', "contratoService","funcionService","servicioService",
    function ($scope,  zonaService, ngTableParams, toaster, contratoService, funcionService, servicioService) {
    $scope.Zonas = [];
    $scope.Zona = {};
    $scope.Parada = {};    
    $scope.Contrato = {};
    $scope.Contratos = [];
    $scope.ContratoSelect = {};
    $scope.Boton = {"Cargando":true};
    $scope.$parent.SetTitulo("SOLICITAR SERVICIOS");

    $scope.Servicio  = {};
    $scope.TipoSelect = {}; // Select de tipo de Vehiculo;
    $scope.Plantilla = {};
    $scope.Puntos = [];
    $scope.editMode = false;

    $scope.mapServicio;
    $scope.markerOrigen = null;
    var markerDestino = null;
    var infowindow = new google.maps.InfoWindow();
    var options = {  componentRestrictions: {country: 'co'} };
    var mapa=null;

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
        Latitud : config.getLatitud(),
        Longitud : config.getLongitud()
    };

    $scope.$parent.SetTitulo("GESTIÓN DE SERVICIOS");    

    //    
    $scope.AutocompleteOrigen=null;
    $scope.AutocompleteDestino =null;    
    geolocate();
    iniciarMapaZ();     
    initAutocomplete();
    initAutocompleteDestino();
    initAutocompleteParada();
    init();

    function Poligono() {
        this.coordenadas = null;
        this.marcador = null;
    }


    function init(){
        $scope.Contrato = {
            TipoServicio :[],
            Plantilla: [],
            TipoVehiculo : [],
            FechaInicio : "",
            FechaFin : "",
            Estado : "",
            Nombre: "",
            FormaPago : []
        };

        $scope.Servicio = {
            DireccionOrigen : "",
            DireccionDestino : "",
            ContratoId : 0,
            NumeroContrato:"",
            Nit : "",
            Telefono : "",
            Tipo : {},
            Responsable : "",
            FechaServicio: moment().format('L'),
            Hora:"",
            Valor : 0,
            NumHoras : "0",
            NumPasajeros : "0",
            ClienteId : $scope.$parent.Login.ClienteId,
            ZonaOrigen :"",
            ZonaDestino : "",
            LatOrigen :"",
            LngOrigen: "",
            LatDestino : "",
            LngDestino :"" ,
            UserReg : $scope.$parent.Login.Login,
            FormaPago :"",
            EnviarEmail : config.getEnviarEmail(),
            ParEmail : config.getEmail(),
            Paradas : [],
            Parada : "NO"
        };
        
        $scope.Parada = {
           prDireccion : "",
           prLatiud : "",
           prLongitud : "",
           prValor : 0,
           prFecha : ""
        }; 
        $scope.ContratoSelect = {};
        $scope.Subtotal = 0;
        $scope.Total = 0;
    }

    function initAutocomplete (){
        var input = document.getElementById('txtOrigen');
        $scope.AutocompleteOrigen = new google.maps.places.Autocomplete(input, options);
        $scope.AutocompleteOrigen.bindTo('bounds', mapa);

        $scope.AutocompleteOrigen.addListener('place_changed', function() {
            //infowindow.close();
            //$scope.markerOrigen.setVisible(false);
            var place = $scope.AutocompleteOrigen.getPlace();
            if (!place.geometry) {
                toaster.pop('error','¡Error!','No pudo resolver la  posición');
                return;
            }
            expandViewportToFitPlace(mapa, place);
            //$scope.markerOrigen.setIcon("images/origen.png");
            //$scope.markerOrigen.setPosition(place.geometry.location);
            //$scope.markerOrigen.setVisible(true);
                if(!$scope.popup){
                    $scope.popup = new google.maps.InfoWindow();
                }

            $scope.Servicio.LatOrigen = place.geometry.location.lat();
            $scope.Servicio.LngOrigen  = place.geometry.location.lng();
            buscarZona($scope.Servicio.LatOrigen, $scope.Servicio.LngOrigen,"ZonaOrigen");
            $scope.Servicio.DireccionOrigen =  place.formatted_address;            
//            var address = '';
//            if (place.address_components) {
//              address = [
//                (place.address_components[0] && place.address_components[0].short_name || ''),
//                (place.address_components[1] && place.address_components[1].short_name || ''),
//                (place.address_components[2] && place.address_components[2].short_name || '')
//              ].join(' ');
//            }

//            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
//            infowindow.open($scope.mapServicio, $scope.markerOrigen);

            origenPlaceId = place.place_id;
            route(origenPlaceId, destinoPlaceId, travelMode, directionsService, directionsDisplay);

        });
    }

    function initAutocompleteDestino (){
        var input = document.getElementById('txtDestino');

        $scope.AutocompleteDestino = new google.maps.places.Autocomplete(input, options);
        $scope.AutocompleteDestino.bindTo('bounds', mapa);

        $scope.AutocompleteDestino.addListener('place_changed', function() {            
            var place = $scope.AutocompleteDestino.getPlace();
            if (!place.geometry) {
                toaster.pop('error','¡Error!','No pudo resolver la  posición');
                return;
            }
            expandViewportToFitPlace(mapa, place);
            $scope.Servicio.LatDestino = place.geometry.location.lat();
            $scope.Servicio.LngDestino  = place.geometry.location.lng();
            buscarZona($scope.Servicio.LatDestino, $scope.Servicio.LngDestino, 'ZonaDestino');
            $scope.Servicio.DireccionDestino =  place.formatted_address;
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
            $scope.AutocompleteDestino.setBounds(circle.getBounds());
          });
        }
    }

    function iniciarMapaZ  () {        
        var mapOptions = {
            zoom: 16,          
            center: new google.maps.LatLng($scope.Posicion.Latitud, $scope.Posicion.Longitud),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        mapa= new google.maps.Map(document.getElementById("dvMapaServicio"), mapOptions);
        directionsDisplay.setMap(mapa);

//        google.maps.event.addListener($scope.mapServicio, "click", function(evento) {
//            var latitud = evento.latLng.lat();
//            var longitud = evento.latLng.lng();
//            var coordenadas = new google.maps.LatLng(latitud, longitud);
//            var marcador = new google.maps.Marker(
//             {
//                 position: coordenadas,
//                map: $scope.mapServicio,
//                 animation: google.maps.Animation.DROP,
//                 title:"Marcador"
//             }
//            );
//
//            var po = new Poligono();
//                po.coordenadas = coordenadas;
//                po.marcador = marcador;
//            $scope.vecPoligono.push(po);
//            dibujarPoligono();
//        });

//        $scope.markerOrigen = new google.maps.Marker({
//             map: $scope.mapServicio
//        });
//        markerDestino = new google.maps.Marker({
//             map: mapa
//        });        
                
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

    function buscarZona(lat, lng, opcion){
        var promise = zonaService.getZona(lat, lng);
        promise.then(function(d) {            
            if(d.data !== 0){                
                $scope.Servicio[opcion] = d.data;
            }else {
                $scope.Servicio[opcion] = "";
                toaster.pop('error','No se encontro la zona');
                return;
            }
        }, function(err) {
                toaster.pop('error','¡Error!',"Error al buscar zona ",0);
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    }
    
    function initAutocompleteParada (){
        var input = document.getElementById('txtParada');

        var autocompleteParada = new google.maps.places.Autocomplete(input, options);        
        autocompleteParada.addListener('place_changed', function() {                        
            var place = autocompleteParada.getPlace();
            if (!place.geometry) {
                toaster.pop('error','¡Error!','No pudo resolver la  posición');
                return;
            }
            $scope.Parada.prLatiud = place.geometry.location.lat();
            $scope.Parada.prLongitud  = place.geometry.location.lng();            
            $scope.Parada.prDireccion =  place.formatted_address;
           
        });
    }

    function buscarTransfert(){
        if(!$scope.TipoSelect.tvCodigo){
            toaster.pop('info','¡Alerta!','Seleccione el tipo de vehículo');
            return;
        }

        if($scope.Servicio.ZonaOrigen ===""){
            toaster.pop('info','¡Alerta!','Por favor ingrese la dirección de origen correctamente');
            return;
        }

        if($scope.Servicio.ZonaDestino ===""){
            toaster.pop('info','¡Alerta!','Por favor ingrese la dirección de destino correctamente');
            return;
        }

        $scope.Servicio.Valor = 0;

        var promise = contratoService.getTransfert($scope.Plantilla.plCodigo, $scope.TipoSelect.tvCodigo,
        $scope.Servicio.ZonaOrigen, $scope.Servicio.ZonaDestino);
        promise.then(function(d) {
            if(d.data){
                $scope.Servicio.Valor = d.data.tfValor;
                $scope.Total = parseInt(d.data.tfValor);
                $scope.Servicio.Codigo = d.data.tfCodigo;
            }else{
               toaster.pop('info','¡Alerta!',"Estimado Usuario(a), no se encontró el precio con estos " +
                            "parametros de ubicación y tipo de vehículo", 0);
            }
        }, function(err) {
                toaster.pop('error','¡Error!',"Error al buscar precios ",0);
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    }


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
        $scope.poly.setMap(mapa);
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

    function getTipoVehiculo(id){
        var promise = contratoService.getTipoVehiculo(id);
        promise.then(function(d) {
            $scope.Contrato.TipoVehiculo = d.data;
            if(d.data){
                $scope.TipoSelect = d.data[0];
            }
        }, function(err) {
                toaster.pop('error','¡Error!',"Error al cargar tipos de vehículo",0);
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    }           
    
    $scope.CambiarFormato=function (variable){
        $scope.Servicio[variable] = funcionService.FormatFecha($scope.Servicio[variable],5);        
        $scope.Servicio[variable] = moment($scope.Servicio[variable]).format('L');        
    };
    
    $scope.CambiarPrecio =  function(){
        $scope.Servicio.Valor = 0;
        $scope.Total= parseInt ($scope.Servicio.Valor) +  parseInt($scope.Subtotal);
    };

    $scope.Nuevo = function() {
        $scope.editMode = false;
        $scope.title = "Nuevo Servicio";
        init();
        iniciarMapaZ();
    };

    $scope.get = function(item) {

        $scope.editMode = true;
        $scope.title = "EDITAR ZONA";
        $scope.Zona = item;
        getPuntos(item.znCodigo);
    };

    $scope.BuscarContrato =  function (opcion){
        $scope.Servicio.ContratoId =0;
        var numero ="";

        if(opcion ==="COMBO"){
            numero = $scope.ContratoSelect.ctNumeroContrato;
        }else{
            if (!$scope.Servicio.NumeroContrato){
                toaster.pop('info', "Estimado usuario(a), por favor ingrese el número de contrato");
                return;
            }
            numero = $scope.Servicio.NumeroContrato;
        }

        toaster.pop('wait','Consulta', 'Consultando informacioón....', 0);
        $scope.Servicio.Tipo = [];
        var promise = contratoService.getPorNumeroCto(numero);
        promise.then(function(d) {
            if(d.data){
                toaster.clear();
                $scope.Servicio.ContratoId = d.data.IdContrato;
                $scope.Contrato.Nombre = d.data.ctContratante;                
                $scope.Servicio.Nit = d.data.ctNitCliente;
                $scope.Servicio.Telefono =  d.data.ctTelefono;
                $scope.Servicio.NumeroContrato = $scope.ContratoSelect.ctNumeroContrato;
                $scope.Contrato.FormaPago =  angular.copy(JSON.parse(d.data.ctFormaPago));
                $scope.Contrato.FechaFin = new Date(d.data.ctFechaFinal).toLocaleDateString('en-GB');
                $scope.Contrato.FechaInicio =   new Date(d.data.ctFechaInicio).toLocaleDateString('en-GB');
                $scope.Contrato.Estado = d.data.ctEstado;
                $scope.Contrato.TipoServicio = d.data.TipoServicio;
                $scope.Contrato.Plantilla = d.data.Plantilla;
                if($scope.Contrato.TipoServicio === 0){
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

    $scope.TipoServicioCheck = function() {
        //console.log($scope.Servicio.Tipo);
        if($scope.Servicio.Tipo.csPlantilla==="SI"){
            
            if($scope.Servicio.Tipo.csTipoServicioId == 1){                               
                var div1 = document.getElementById('dvMapaServicio');                
                div1.classList.remove('hidden');
                div1.classList.add('visible');                                  
                setTimeout(function (){ iniciarMapaZ();},200);                
            }

            $scope.titlePlantilla = "Plantillas " + $scope.Servicio.Tipo.csDescripcion;
            if($scope.Contrato.Plantilla.length ===0){
                toaster.pop('error','¡Error!', "No se definieron plantillas para este contrato");
                return;
            }

            var pos = funcionService.arrayObjectIndexOf($scope.Contrato.Plantilla,$scope.Servicio.Tipo.csTipoServicioId, 'pcTipoServicio');
            if(pos >=0){
                $scope.Plantilla = $scope.Contrato.Plantilla[pos];
                getTipoVehiculo($scope.Plantilla.plCodigo);
            }
        }else{
            $scope.titlePlantilla = "Dispobilidad ";
           // loadDisponibilidad();
            $scope.VerPlantilla = false;
        }

    };

    $scope.ConsultarPrecio = function (){
        var codigo = parseInt($scope.Servicio.Tipo.csTipoServicioId);
        switch (codigo) {
            case 1:
                    buscarTransfert();
                break;

            case 2:
                break;

            case 3:
                break;

            case 4:
                break;

            default:
                toaster.pop("error","¡Alerta!", "Seleccione un tipo de servicio");
                break;
        }
    };



    $scope.GetContratos = function  (){
        init();
        var promise = contratoService.getByCliente($scope.Servicio.ClienteId, "ACTIVO");
        promise.then(function(d) {
            $scope.Contratos = d.data;
            $scope.ContratoSelect ={};
        }, function(err) {
                toaster.pop('error','¡Error!',"Error al cargar contratos");
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    };   
    
    $scope.Guardar = function (){
                
        if(!$scope.Servicio.Tipo.csTipoServicioId){
            toaster.pop('info','¡Alerta!','Seleccione el tipo de servicio');
            return;
        }
        if(!$scope.TipoSelect.tvCodigo){
            toaster.pop('info','¡Alerta!','Seleccione el tipo de vehículo');
            return;
        }
        
        if($scope.Servicio.NumPasajeros > $scope.TipoSelect.tvNumPasajero){
            toaster.pop('info','¡Alerta!','Estimado Usuario(a), el número de pasajeros supera el limite permitido'+
                    " para el tipo de vehículo seleccionado ("+$scope.TipoSelect.tvDescripcion + ")",7000);
            return;
        }
        if($scope.Servicio.Valor === 0){
            toaster.pop('info', '¡Alerta!', "Valor del servicio no puede ser cero(0)."+
                            " Por favor hacer click en consultar precio");
            return;
        }
        
        if($scope.Servicio.FormaPago ===""){
            toaster.pop('info', '¡Alerta!', "Estimado Usuario(a), por favor seleccione la forma de Pago");
            return;
        }
        
        $scope.Servicio.TipoVehiculoId = $scope.TipoSelect.tvCodigo;
        $scope.Servicio.DescVehiculo = $scope.TipoSelect.tvDescripcion;
        $scope.Servicio.NumeroContrato = $scope.ContratoSelect.ctNumeroContrato;
        $scope.Servicio.TipoServicidoId = $scope.Servicio.Tipo.csTipoServicioId;
        $scope.Servicio.PlantillaId= $scope.Plantilla.plCodigo;        
        $scope.Servicio.Parada = $scope.Servicio.Paradas.length > 0 ? "SI" : "NO";                
                        
        var promise = servicioService.post($scope.Servicio);
        promise.then(function(d) {
            toaster.pop('success','¡Información!', d.data.message);
            $scope.ContratoSelect = {};
            $scope.Nuevo();
        }, function(err) {
                toaster.pop('error','¡Error!',err.data.request, 0);
                console.log("Some Error Occured " + JSON.stringify(err));
        });
        
    };
    
    $scope.GetContratos();
    
    // FUNCIONES DE PARADAS
    
    $scope.AgregarParada = function (){
        if (!$scope.Parada.prDireccion){
            toaster.pop("info","¡Alerta!", "Por favor ingrese la dirección de parada");
            return;
        }        
        
        if(!$scope.Servicio.Tipo.csValor){
            toaster.pop("info","¡Alerta!", "Seleccione el tipo de servicio.");
            return;
        }
        
        $scope.Parada.prValor = $scope.Servicio.Tipo.csValor;
        $scope.Parada.prFecha = $scope.Servicio.FechaServicio;
        $scope.Servicio.Paradas.push($scope.Parada);
        $scope.Parada = {};
    };
    
    $scope.QuitarParada =  function (index){        
        $scope.Servicio.Paradas.splice(index,1);        
    };
    
    $scope.TotalParada =  function (){
        var total = 0;
        for (var i=0; i<$scope.Servicio.Paradas.length; i++) {            
            total += parseInt($scope.Servicio.Paradas[i].prValor);
        }          
        $scope.Subtotal = total;
        $scope.Total =  parseFloat($scope.Subtotal) + parseFloat($scope.Servicio.Valor);
        return total;
    };
    
    
    //DETERMINAR SI UN PUNTO ESTA DENTRO DE UN POLIGONO
    
    function loadZona() {
        var promiseGet = zonaService.getPuntosAll(); //The Method Call from service
        promiseGet.then(function(pl) {
            $scope.Zonas = pl.data;               
        },
        function(errorPl) {
            toaster.pop("error","¡Error!", "Eror al cargar zonas");
            console.log('failure loading Zona', errorPl);
        });
    }
    
    loadZona();
    
    function buscarZonaLocal (lat, lont){
        
    };

}]);
