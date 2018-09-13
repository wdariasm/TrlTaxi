app.controller('nuevoservicioController',['$scope', 'zonaService',  'toaster', "contratoService","funcionService",
    "servicioService", '$filter', '$routeParams', 'tipoVehiculoService', 'rutaService',   function ($scope, 
    zonaService, toaster, contratoService,
    funcionService, servicioService,  $filter, $routeParams, tipoVehiculoService, rutaService) {
                
    $scope.Parada = {};    
    $scope.Contacto = {};
    $scope.Contrato = {};
    $scope.Contratos = [];
    $scope.ContratoSelect = {};
    $scope.Boton = {"Cargando":true};
    $scope.$parent.SetTitulo("SOLICITAR SERVICIO");    
    
    $scope.Asignacion = {  Manual : false,  Marcador : "Origen" , Ruta : "ida"   };

    $scope.Servicio  = {};
    $scope.TipoSelect = {}; // Select de tipo de Vehiculo;
    $scope.Plantilla = {};
    $scope.Puntos = [];
    $scope.Editar = false;
    $scope.RutaSelect = {};
    $scope.TrasladoSelect = {};
    $scope.TrasladoSelect = {};
    $scope.LstRutas = [];
    $scope.LstTraslados = [];
    $scope.EditTipoVehiculo = true;
    $scope.EditModoServicio = true;

    $scope.mapServicio;
    var markerOrigen = null;
    var markerDestino = null;
    //var infowindow = new google.maps.InfoWindow();
    var options = {  componentRestrictions: {country: 'co'} };
    var mapa=null;

    var origenPlaceId = null;
    var destinoPlaceId = null;
    var travelMode = google.maps.TravelMode.DRIVING;
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;


    $scope.vecPoligono = new Array(); /// Vector de Poligonos
    $scope.poly = null;    

    $scope.title = "Nuevo Servicio";    
    $scope.Posicion = {
        Latitud : config.getLatitud(),
        Longitud : config.getLongitud()
    };
    
    //    
    $scope.AutocompleteOrigen=null;
    $scope.AutocompleteDestino =null;    
    geolocate();
    iniciarMapaZ();     
    initAutocomplete();
    initAutocompleteDestino();   
    init();
    
    $scope.AceptarCondicion = false;
   
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
            Hora: moment().format("hh:mm a"),
            Valor : 0,
            ValorCliente : 0,
            NumHoras : "0",
            NumPasajeros : "",
            ClienteId : "",
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
            Parada : "NO",
            ValorTotal :0,
            Nota :"",
            ModoServicio :"PROGRAMADO",
            Contactos : [],
            ValorParadaProveedor : 0,
            ValorParadaCliente : 0,
            ValorParadas : 0,
            DetallePlantillaId : 0,
            IdUsuario : $scope.$parent.Login.IdUsuario
        };
        
        $scope.Parada = {
            prDireccion : "",
            prLatiud : "",
            prLongitud : "",
            prValor : 0,
            prFecha : "",
            prValorCliente :0
        }; 
        $scope.ContratoSelect = {};
        $scope.Subtotal = 0;
        
        $scope.Contacto = {
            scNombre  :"",
            scTelefono : "",
            scNota : ""
        };        
        
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
                       
            $scope.Servicio.LatOrigen = place.geometry.location.lat();
            $scope.Servicio.LngOrigen  = place.geometry.location.lng();            
            $scope.Servicio.DireccionOrigen =  place.formatted_address;            

            if($scope.Servicio.Tipo.csTipoServicioId == 1){
                buscarZona($scope.Servicio.LatOrigen, $scope.Servicio.LngOrigen,"ZonaOrigen");
                origenPlaceId = place.place_id;
                route(origenPlaceId, destinoPlaceId, travelMode, directionsService, directionsDisplay);
            } else if($scope.Servicio.Tipo.csTipoServicioId == 4){
                origenPlaceId = place.place_id;
                route(origenPlaceId, destinoPlaceId, travelMode, directionsService, directionsDisplay);
            } else {                                  
                var coordenada = new google.maps.LatLng($scope.Servicio.LatOrigen, $scope.Servicio.LngOrigen);
                $scope.markerOrigen = new google.maps.Marker({position: coordenada, map: mapa,
                    animation: google.maps.Animation.DROP, title:"Posición Cliente"                         
                });                                                         
                $scope.markerOrigen.setIcon("images/origen.png");              
                $scope.markerOrigen.setVisible(true);            
            }            

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
            $scope.Servicio.DireccionDestino =  place.formatted_address;
                      
            if($scope.Servicio.Tipo.csTipoServicioId == 1){
                buscarZona($scope.Servicio.LatDestino, $scope.Servicio.LngDestino, 'ZonaDestino');                
            }
            
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
        
        directionsDisplay.set('directions', null);

        mapa= new google.maps.Map(document.getElementById("dvMapaServicio"), mapOptions);
        directionsDisplay.setMap(mapa);

        google.maps.event.addListener(mapa, "click", function(evento) {
            var latitud = evento.latLng.lat();
            var longitud = evento.latLng.lng();                
            if($scope.Asignacion.Manual){
                var coordenadas = new google.maps.LatLng(latitud, longitud); 
                switch ($scope.Asignacion.Marcador) {
                    case "Origen":     
                        if(markerOrigen !== null){
                            markerOrigen.setMap(null);
                        }
                        markerOrigen = new google.maps.Marker({
                            position: coordenadas, map: mapa ,
                            animation: google.maps.Animation.DROP, title:"Posición de Origen",
                            icon:'images/origen.png'
                        });                        
                        $scope.Servicio.LatOrigen = latitud;
                        $scope.Servicio.LngOrigen = longitud;
                        buscarZona($scope.Servicio.LatOrigen, $scope.Servicio.LngOrigen,"ZonaOrigen");
                        break;                        
                    case "Destino":     
                        if(markerDestino !== null){
                            markerDestino.setMap(null);
                        }
                        markerDestino = new google.maps.Marker({
                            position: coordenadas, map: mapa ,
                            animation: google.maps.Animation.DROP, title:"Posición de Destino",
                            icon:'images/destino.png'
                        });                        
                        $scope.Servicio.LatDestino = latitud;
                        $scope.Servicio.LngDestino = longitud;
                        buscarZona($scope.Servicio.LatDestino, $scope.Servicio.LngDestino, 'ZonaDestino');
                        break; 
                    default:
                        toaster.pop("info", "¡Información!","Por favor seleccione la posicion a establecer Origen o Destino.");
                        break;
                }
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'latLng': coordenadas }, getGeocoder);     
            }    
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
    
    function routePosicion(origen, destino, travel_mode, directionsService, directionsDisplay) {
        if (!origen || !destino) {
          return;
        }
        directionsService.route({
          origin: origen,
          destination:  destino,
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
        $scope.Servicio.ValorCliente = 0;

        var promise = contratoService.getTransfert($scope.Plantilla.plCodigo, $scope.TipoSelect.tvCodigo,
        $scope.Servicio.ZonaOrigen, $scope.Servicio.ZonaDestino);
        promise.then(function(d) {
            if(d.data){
                $scope.Servicio.Valor = d.data.tfValor;
                $scope.Servicio.ValorCliente = d.data.tfValorCliente;
                $scope.Servicio.ValorTotal = parseInt(d.data.tfValorCliente);
                $scope.Servicio.Codigo = d.data.tfCodigo;
                $scope.Servicio.DetallePlantillaId = d.data.tfCodigo;
                toaster.pop("info", "Valor del Servicio.", "$ "+ $scope.Servicio.ValorCliente)      ;
            }else{
               toaster.pop('info','¡Alerta!',"Estimado Usuario(a), no se encontró el precio con estos " +
                            "parametros de ubicación y tipo de vehículo", 0);
            }
        }, function(err) {
                toaster.pop('error','¡Error!',"Error al buscar precios ",0);
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    }
    
    function buscarDisponibilidad(){
        if(!$scope.TipoSelect.tvCodigo){
            toaster.pop('info','¡Alerta!','Seleccione el tipo de vehículo');
            return;
        }      

        $scope.Servicio.Valor = 0;
        $scope.Servicio.ValorCliente = 0;

        var promise = contratoService.getDisponibilidad($scope.Plantilla.plCodigo, $scope.TipoSelect.tvCodigo);
        promise.then(function(d) {
            if(d.data){
                $scope.Servicio.Valor = d.data.dpValorHora;
                $scope.Servicio.ValorCliente = d.data.dpValorCliente;
                $scope.Servicio.ValorTotal = parseInt(d.data.dpValorCliente);
                $scope.Servicio.Codigo = d.data.dpCodigo;
                $scope.Servicio.DetallePlantillaId = d.data.dpCodigo;
                toaster.pop("info", "Valor del Servicio.", "$ "+ $scope.Servicio.ValorCliente)      ;
            }else{
               toaster.pop('info','¡Alerta!',"Estimado Usuario(a), no se encontró el precio con los " +
                            "parametros ingresados", 0);
            }
        }, function(err) {
                toaster.pop('error','¡Error!',"Error al buscar precios disponibilidad",0);
                console.log("Some Error Occured Dispobilidad " + JSON.stringify(err));
        });
    }


    function buscarValorParada () {
        var promise = contratoService.getValorParada($scope.Plantilla.plCodigo);
        promise.then(function(d) {
            if(d.data){
                $scope.Servicio.ValorParadaProveedor = parseInt(d.data.plValorProveedor);
                $scope.Servicio.ValorParadaCliente = parseInt(d.data.plValorCliente);
            }else{
                toaster.pop('info','¡Alerta!',"Estimado Usuario(a), no se encontró el valor de parada para esta plantilla", 0);
            }
        }, function(err) {
            toaster.pop('error','¡Error!',"Error al buscar parada ",0);
            console.log("Some Error Occured " + JSON.stringify(err));
        });

    }

    function getTipoVehiculo(id, tipo){
        var promise = contratoService.getTipoVehiculo(id, tipo);
        promise.then(function(d) {
            $scope.Contrato.TipoVehiculo = d.data;
            if(d.data){                                
                $scope.TipoSelect = d.data[0];
            }
            
            if($scope.Editar){                
                var pos = funcionService.arrayObjectIndexOf($scope.Contrato.TipoVehiculo, $scope.Servicio.TipoVehiculoId, 'tfTipoVehiculo');        
                if(pos >=0){                            
                    $scope.TipoSelect = $scope.Contrato.TipoVehiculo[pos];
                }                 
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
        $scope.Servicio.ValorCliente = 0;
        $scope.Servicio.ValorTotal= parseInt ($scope.Servicio.ValorCliente) +  parseInt($scope.Subtotal);
    };

    $scope.Nuevo = function() {
        
        if($scope.Editar){
            location.href = "#/0/servicio";
        }
        
        $scope.Editar = false;
        $scope.EditTipoVehiculo =true;
        $scope.EditModoServicio = true;
        $scope.title = "Nuevo Servicio";
        init();
        iniciarMapaZ();
        $scope.Asignacion = {  Manual : false,  Marcador : "Origen" , Ruta : "ida"   };
    };

   
    $scope.BuscarContrato =  function (opcion, modifarServicio){
        if(modifarServicio) $scope.Servicio.ContratoId =0;
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
        $scope.Servicio.Tipo = {};
        var promise = contratoService.getPorNumeroCto(numero);
        promise.then(function(d) {
            if(d.data){
                toaster.clear();
                                                               
                $scope.Contrato.Nombre = d.data.ctContratante;                
                $scope.Contrato.FormaPago =  angular.copy(JSON.parse(d.data.ctFormaPago));
               // $scope.Contrato.FechaFin = new Date(d.data.ctFechaFinal).toLocaleDateString('en-GB');
                $scope.Contrato.TipoServicio = d.data.TipoServicio;
                $scope.Contrato.Plantilla = d.data.Plantilla;                                     
                
                if($scope.Contrato.TipoServicio === 0){
                    toaster.pop('error', 'No se encontraron servicios asociados a este contrato', 0);
                }
                if($scope.Editar){ 
                    setDatosServicio(); 
                }
                if(modifarServicio){
                    $scope.Servicio.ClienteId = d.data.ctClienteId;
                    $scope.Servicio.ContratoId = d.data.IdContrato;
                    $scope.Servicio.Nit = d.data.ctNitCliente;
                    $scope.Servicio.Telefono =  d.data.ctTelefono;                    
                    $scope.Servicio.Responsable = $scope.Contrato.Nombre;                             
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
        
        if($scope.Servicio.Tipo.csTipoServicioId != 3){                               
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
            $scope.EditModoServicio = true;
            $scope.EditTipoVehiculo = true;
            $scope.Servicio.ModoServicio = "PROGRAMADO";
            $scope.Plantilla = $scope.Contrato.Plantilla[pos];            
            if($scope.Servicio.Tipo.csTipoServicioId == 1){                 
                buscarValorParada();
                getTipoVehiculo($scope.Plantilla.plCodigo, $scope.Servicio.Tipo.csTipoServicioId );
                $scope.EditTipoVehiculo = false;
                $scope.EditModoServicio = false;
            } else if($scope.Servicio.Tipo.csTipoServicioId == 2) {                
                getTipoVehiculo($scope.Plantilla.plCodigo, $scope.Servicio.Tipo.csTipoServicioId );
                $scope.EditTipoVehiculo = false;
                $scope.EditModoServicio = false;
            } else if($scope.Servicio.Tipo.csTipoServicioId == 3){ //ruta
                getRutas($scope.Plantilla.plCodigo);
                getTiposVehiculos();
            }else { //traslado                
                getTraslados($scope.Plantilla.plCodigo);
                getTiposVehiculos();
            }
        }       
    };

    $scope.ConsultarPrecio = function (){
        var codigo = parseInt($scope.Servicio.Tipo.csTipoServicioId);
        switch (codigo) {
            case 1:
                    buscarTransfert();
                break;

            case 2:
                buscarDisponibilidad();
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
        
        if(!$scope.Editar){                  
            init();
        }        
        
        var promise = contratoService.getByCliente($scope.Servicio.ClienteId, "ACTIVO");
        promise.then(function(d) {
            
            if(d.data.length  == 0){                
                toaster.pop('info','¡Información!',"No se encontraron contratos asociados a este usuario. ");
                return;
            }
            
            if ($scope.$parent.Login.TipoAcceso == 5){               
                $scope.Contratos = $filter('filter')( d.data, { ctNumeroContrato: $scope.$parent.Login.Contrato });
            } else {
                $scope.Contratos = d.data;
            }                        
                        
            $scope.ContratoSelect ={};
                        
            if ($scope.Editar){                                
                var pos = funcionService.arrayObjectIndexOf($scope.Contratos, parseInt($scope.Servicio.ContratoId), 'IdContrato');
                if(pos >=0){                        
                    $scope.ContratoSelect = $scope.Contratos[pos];
                    $scope.BuscarContrato('COMBO', false);                    
                }
            }
        }, function(err) {
                toaster.pop('error','¡Error!',"Error al cargar contratos");
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    };  
      
    
    $scope.Validar = function (){
        
        if(!$scope.frmServicio.$valid){
            toaster.pop('error','¡Error!', 'Por favor ingrese los datos requeridos (*).');
            return;
        }
        
        $scope.AceptarCondicion = false;
        if(!$scope.Servicio.Tipo.csTipoServicioId){
            toaster.pop('info','¡Alerta!','Seleccione el tipo de servicio');
            return;
        }
        if(!$scope.TipoSelect.tvCodigo){
            toaster.pop('info','¡Alerta!','Seleccione el tipo de vehículo');
            return;
        }
        
        if($scope.Servicio.NumPasajeros == 0){
            toaster.pop('info','¡Alerta!','Seleccione el número de pasajeros');
            return;
        }
        
        if(parseInt($scope.Servicio.NumPasajeros) > $scope.TipoSelect.tvNumPasajero){
            toaster.pop('info','¡Alerta!','Estimado Usuario(a), el número de pasajeros supera el limite permitido'+
                    " para el tipo de vehículo seleccionado ("+$scope.TipoSelect.tvDescripcion + ")",7000);
            return;
        }
        if($scope.Servicio.ValorCliente === 0){
            toaster.pop('info', '¡Alerta!', "Valor del servicio no puede ser cero(0)."+
                            " Por favor hacer click en consultar precio");
            return;
        }
        
        if($scope.Servicio.Contactos.length === 0){
            toaster.pop('info', '¡Alerta!', "Por favor ingrese al menos un responsable del servicio.");
            return;
        }
        
        $scope.Servicio.Responsable = $scope.Servicio.Contactos[0].scNombre;
        $scope.Servicio.Telefono = $scope.Servicio.Contactos[0].scTelefono;
        $scope.Servicio.Nota = $scope.Servicio.Contactos[0].scNota;
        
        if($scope.Servicio.FormaPago ===""){
            toaster.pop('info', '¡Alerta!', "Estimado Usuario(a), por favor seleccione la forma de Pago");
            return;
        }
        
        var tipo=  parseInt($scope.Servicio.Tipo.csTipoServicioId);
        switch (tipo) {
            case 1:
            case 4:
                
                if(!$scope.Servicio.LatOrigen || $scope.Servicio.LngOrigen ===""){
                    toaster.pop('info', '¡Alerta!', "Estimado Usuario(a), por favor seleccione la posicion de Origen.");
                    return;
                }
                
                if(!$scope.Servicio.DireccionOrigen || $scope.Servicio.DireccionOrigen===""){
                    toaster.pop('info', '¡Alerta!', "Estimado Usuario(a), por favor ingrese la dirección  de Origen.");
                    return;
                }
                
                
                if(!$scope.Servicio.LatDestino || $scope.Servicio.LngDestino ===""){
                    toaster.pop('info', '¡Alerta!', "Estimado Usuario(a), por favor seleccione la posicion de Destino.");
                    return;
                }
                
                if(!$scope.Servicio.DireccionDestino || $scope.Servicio.DireccionDestino===""){
                    toaster.pop('info', '¡Alerta!', "Estimado Usuario(a), por favor ingrese la dirección  de Destino.");
                    return;
                }                             

                break;
                
            case 2: 
                
                if(!$scope.Servicio.LatOrigen || $scope.Servicio.LngOrigen ===""){
                    toaster.pop('info', '¡Alerta!', "Estimado Usuario(a), por favor seleccione la posicion de Origen.");
                    return;
                }
                
                if(!$scope.Servicio.DireccionOrigen || $scope.Servicio.DireccionOrigen===""){
                    toaster.pop('info', '¡Alerta!', "Estimado Usuario(a), por favor ingrese la dirección  de Origen.");
                    return;
                }
                                
                break;
                
             case 3: 
                if(!$scope.RutaSelect){
                    toaster.pop('info', '¡Alerta!', "Estimado Usuario(a), por favor seleccione la ruta.");
                    return;
                }
                break;

            default:

                break;
        }
           
        if($scope.Editar){
            $scope.Servicio.Parada = $scope.Servicio.Paradas.length > 0 ? "SI" : "NO";
            actualizarServicio();
        } else {        
            $("#mdConfirmacion").modal('show');
        }
    };
    
    
    $scope.Guardar = function (){ 
        
        if(!$scope.AceptarCondicion){
            toaster.pop("info", "¡Alerta!", "Estimado Usuario(a), por favor acepte las condiciones de servicio.");
            return;
        }
        $scope.enviando = true;
        
        $scope.Servicio.TipoVehiculoId = $scope.TipoSelect.tvCodigo;
        $scope.Servicio.DescVehiculo = $scope.TipoSelect.tvDescripcion;        
        $scope.Servicio.TipoServicidoId = $scope.Servicio.Tipo.csTipoServicioId;
        $scope.Servicio.PlantillaId= $scope.Plantilla.plCodigo;        
        $scope.Servicio.Parada = $scope.Servicio.Paradas.length > 0 ? "SI" : "NO";                
                        
        var promise = servicioService.post($scope.Servicio);
        promise.then(function(d) {
            $scope.enviando = false;
            $("#mdConfirmacion").modal('hide');
            toaster.pop('success','¡Información!', d.data.message);
            $scope.ContratoSelect = {};
            $scope.Nuevo();
            
        }, function(err) {            
            toaster.pop('error','¡Error!',err.data, 0);
            console.log("Some Error Occured " + JSON.stringify(err));
        });
        
    };
    
   
    
    // FUNCIONES DE PARADAS
    
    $scope.AgregarParada = function (){
        if (!$scope.Parada.prDireccion){
            toaster.pop("info","¡Alerta!", "Por favor ingrese la dirección de parada");
            return;
        }

        if( $scope.Servicio.ValorParadaCliente ==0){
            toaster.pop("info","¡Alerta!", "No se ha definido el valor de la parada para esta plantilla");
            return;
        }        

        $scope.Parada.prLatiud = 0;
        $scope.Parada.prLongitud  = 0;                  
        $scope.Parada.prValor = $scope.Servicio.ValorParadaProveedor;
        $scope.Parada.prValorCliente = $scope.Servicio.ValorParadaCliente;
        $scope.Parada.prFecha = $scope.Servicio.FechaServicio;
        
         if($scope.Editar){
            
            $scope.Parada.prServicio = $scope.Servicio.IdServicio;
            
            var promise = servicioService.agregarParada($scope.Parada);
            promise.then(function(d) {                
                consultarParadas($scope.Servicio.IdServicio);                
                toaster.pop('success','¡Información!',"Parada guardada correctamente");
            }, function(err) {
                toaster.pop('error','¡Error!',"Error al guardar parada");
                console.log("Some Error Occured " + JSON.stringify(err));
            });                         
        }else {                
            $scope.Servicio.Paradas.push($scope.Parada);
        }
        
        $scope.Parada = {};
    };
    
    $scope.QuitarParada =  function (index){        
        $scope.Servicio.Paradas.splice(index,1);        
    };
    
    $scope.EliminarParada =  function (item){        
        var promise = servicioService.eliminarParada(item.IdParada);
        promise.then(function(d) {
            toaster.pop('success','¡Información!', "Parada eliminada correctamente");                                                
            consultarParadas(item.prServicio);
        }, function(err) {
                toaster.pop('error','¡Error!',"Error al eliminar parada");
                console.log("Some Error Occured " + JSON.stringify(err));
        });         
    };
    
    $scope.TotalParada =  function (){
        var total = 0;
        var totalProveedor= 0;
        for (var i=0; i<$scope.Servicio.Paradas.length; i++) {            
            total += parseInt($scope.Servicio.Paradas[i].prValorCliente);
            totalProveedor += parseInt($scope.Servicio.Paradas[i].prValor);
        }
        $scope.Subtotal = total;
        $scope.Servicio.ValorParadas = totalProveedor;
        $scope.Servicio.ValorTotal =  parseFloat($scope.Subtotal) + parseFloat($scope.Servicio.ValorCliente);
        return total;
    };      
    
    function consultarParadas (id){
         var promise = servicioService.getParadas(id);
        promise.then(function(d) {
            $scope.Servicio.Paradas = d.data;            
        }, function(err) {
                toaster.pop('error','¡Error!',"Error al consultar paradas");
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
    
    // FUNCIONES DE CONTACTOS
    
    $scope.AgregarContacto = function (){
        if (!$scope.Contacto.scNombre){
            toaster.pop("info","¡Alerta!", "Por favor ingrese el nombre del Responsable");
            return;
        }        
        
        if(!$scope.Contacto.scTelefono){
            toaster.pop("info","¡Alerta!", "Por favor ingrese el número de teléfono.");
            return;
        }        
        if($scope.Editar){
            
            $scope.Contacto.scIdServicio = $scope.Servicio.IdServicio;
            
            var promise = servicioService.agregarContacto($scope.Contacto);
            promise.then(function(d) {                
                consultarContactos($scope.Servicio.IdServicio);                
                toaster.pop('success','¡Información!',"Contacto guardado correctamente");
            }, function(err) {
                toaster.pop('error','¡Error!',"Error al guardar contacto");
                console.log("Some Error Occured " + JSON.stringify(err));
            });                         
        }else {
            $scope.Servicio.Contactos.push($scope.Contacto);
        }
        
        $scope.Contacto = {};
    };
    
    $scope.QuitarContacto =  function (index){        
        $scope.Servicio.Contactos.splice(index,1);        
    };
    
    $scope.UbicacionAutomatica= function (){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                function(posicion){
                    $scope.Servicio.LatOrigen = posicion.coords.latitude;
                    $scope.Servicio.LngOrigen = posicion.coords.longitude;
                    posicionCliente();
                },
                function(PosicionError){                    
                    switch (PosicionError.code)
			{
                            case PosicionError.PERMISSION_DENIED:
                                toaster.pop("error", "¡Permiso denegado!", "Estimado Usuario(a) para el correcto funcionamiento de la aplicación, " +
                                            " se requiere el permiso para acceder a su ubicación.",5000);
                                break;
                            case PosicionError.POSITION_UNAVAILABLE:
                                toaster.pop("error","No se ha podido acceder a la información de su posición.");
				break;
                            case PosicionError.TIMEOUT:
                                toaster.pop("error","El servicio ha tardado demasiado tiempo en responder.");
				break;
                            default:
                                toaster.pop("error","Error desconocido.");
                        }
                },{
			maximumAge: 75000,
			timeout: 15000
		}

                );
        } else {
            toaster.pop("error","Su navegador no soporta la API de geolocalización.", 4000, 'rounded');
        }
        
    };
    
    function posicionCliente(){
        
        $scope.Asignacion.Marcador="Origen";   
        
        if (!$scope.Servicio.LatOrigen  || !$scope.Servicio.LngOrigen){
            return;
        }
        var limits = new google.maps.LatLngBounds();
        var coordenada = new google.maps.LatLng($scope.Servicio.LatOrigen, $scope.Servicio.LngOrigen);
        if(markerOrigen !== null){
            markerOrigen.setMap(null);
        }
        markerOrigen = new google.maps.Marker({
            position: coordenada, map: mapa ,
            animation: google.maps.Animation.DROP, title:"Posición de Origen",
            icon:'images/origen.png'
        });
        
        limits.extend(coordenada);
        mapa.fitBounds(limits);
        mapa.setZoom(16);
        
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'latLng': coordenada }, getGeocoder);              

    }
    
    function getGeocoder(results, status){       
        var direccion ="";
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {                             
                direccion = results[0].formatted_address.split(" a ",1);                 
            } else {
                console.log('Google no retorno resultado alguno.');
            }
        } else {
           console.log("Geocoding fallo debido a : " + status);
        }
                        
        if($scope.Asignacion.Marcador == "Destino"){
            $scope.Servicio.DireccionDestino = direccion[0];           
        }else{
            $scope.Servicio.DireccionOrigen = direccion[0];
        }
        $scope.$apply();
    }
    
    if(parseInt($routeParams.id) !== 0){       
       //toaster.pop('wait','¡Espere ...!',"Cargando información.....");
       //setTimeout(function (){getServicio($routeParams.id);},1000) ;
    }
        
    
    function getServicio(idServicio){
        $scope.Editar = true;
        $scope.EditTipoVehiculo =  $scope.Editar;
        var promise = servicioService.get(idServicio);
        promise.then(function(d) {             
            $scope.Servicio = d.data;
            if(d.data != null){                                
                if( parseInt($scope.Servicio.TipoServicidoId) === 1){
                    var origen  = new google.maps.LatLng(parseFloat($scope.Servicio.LatOrigen), parseFloat($scope.Servicio.LngOrigen));
                    var destino = new google.maps.LatLng(parseFloat($scope.Servicio.LatDestino),parseFloat($scope.Servicio.LngDestino));
                    routePosicion(origen, destino,travelMode, directionsService, directionsDisplay);
                }
            }                       
            
            toaster.pop('info','¡Información!',"Datos cargados correctamente. Ahora es posible realizar las\n\
                         modificación de su ruta, contactos  y  paradas",6000);
            
        }, function(err) {
                toaster.pop('error','¡Error!',"Error al consultar servicio");
                console.log("Some Error Occured " + JSON.stringify(err));
        });                
    }
    
    function setDatosServicio(){               
        var pos = funcionService.arrayObjectIndexOf($scope.Contrato.TipoServicio, $scope.Servicio.TipoServicidoId, 'csTipoServicioId');        
        if(pos >=0){                            
            $scope.Servicio.Tipo = $scope.Contrato.TipoServicio[pos];
            $scope.TipoServicioCheck();
        }                
    }
    
    $scope.EliminarContacto = function (item){
        var promise = servicioService.eliminarContacto(item.scIdContacto);
        promise.then(function(d) {
            toaster.pop('success','¡Información!', "Contacto eliminado correctamente");                                                
            consultarContactos(item.scIdServicio);
        }, function(err) {
                toaster.pop('error','¡Error!',"Error al consultar servicio");
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    };
    
    function consultarContactos(id){
        var promise = servicioService.getContactos(id);
        promise.then(function(d) {
            $scope.Servicio.Contactos = d.data;            
        }, function(err) {
                toaster.pop('error','¡Error!',"Error al consultar servicio");
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    }
    
    function actualizarServicio  (){
        toaster.pop('wait','Actualizando servicio ....');
        var promise = servicioService.put($scope.Servicio.IdServicio, $scope.Servicio);
        promise.then(function(d) {                        
            toaster.pop('success','¡Información!', d.data.message);
            $scope.ContratoSelect = {};
            $scope.Nuevo();
            
        }, function(err) {            
            toaster.pop('error','¡Error!',err.data, 0);
            console.log("Some Error Occured " + JSON.stringify(err));
        });
    };
    
    function getRutas(idPlantilla) {
        
        var promise = rutaService.getAll(idPlantilla);
        promise.then(function(d) {
            $scope.LstRutas = d.data;            
            if($scope.Editar){                
                
                var pos1 = funcionService.arrayObjectIndexOf($scope.LstRutas, $scope.Servicio.DetallePlantillaId, 'rtCodigo');        
                if(pos1 >=0){                            
                    $scope.RutaSelect = $scope.LstRutas[pos1];                    
                    if( parseFloat($scope.Servicio.ValorCliente) >  parseFloat($scope.RutaSelect.rtValorCliente) ){
                        $scope.Asignacion.Ruta = "doble";
                    }
                }                                                                
            }
            
        }, function(err) {
                toaster.pop('error','¡Error!',"Error al cargar rutas",0);
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    }
    
    function getTraslados(idPlantilla) {
        
        var promise = contratoService.getTraslados(idPlantilla);
        promise.then(function(d) {
            $scope.LstTraslados = d.data;            
            if($scope.Editar){                                
                var pos1 = funcionService.arrayObjectIndexOf($scope.LstTraslados, $scope.Servicio.DetallePlantillaId, 'tlCodigo');        
                if(pos1 >=0){                            
                    $scope.TrasladoSelect = $scope.LstTraslados[pos1];                    
                }                                                                
            }
            
        }, function(err) {
                toaster.pop('error','¡Error!',"Error al cargar traslados",0);
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    }
    
    function getTiposVehiculos() {        
        var promise = tipoVehiculoService.getAll();
        promise.then(function(d) {
            $scope.Contrato.TipoVehiculo = d.data;  
            
            if($scope.Editar){
                var pos = funcionService.arrayObjectIndexOf($scope.Contrato.TipoVehiculo, parseInt($scope.Servicio.TipoVehiculoId), 'tvCodigo');        
                if(pos >=0){                            
                    $scope.TipoSelect = $scope.Contrato.TipoVehiculo[pos];
                } 
            }
                        
        }, function(err) {
                toaster.pop('error','¡Error!',"Error al cargar tipos de vehículo",0);
                console.log("Some Error Occured " + JSON.stringify(err));
        });
    }
    
    $scope.CambiarPrecioRuta =  function (){
        if(!$scope.RutaSelect){
            return;
        }
        
        $scope.Servicio.ValorCliente = parseFloat($scope.RutaSelect.rtValorCliente);
        $scope.Servicio.Valor = parseFloat($scope.RutaSelect.rtValor);
        $scope.Servicio.DetallePlantillaId = $scope.RutaSelect.rtCodigo;
        $scope.Servicio.DireccionOrigen = $scope.RutaSelect.rtNombre;
        $scope.Servicio.DireccionDestino = $scope.RutaSelect.rtDescripcion;
        
        if($scope.Asignacion.Ruta =="doble"){
            $scope.Servicio.ValorCliente += parseFloat($scope.Servicio.ValorCliente);
            $scope.Servicio.Valor += parseFloat($scope.Servicio.Valor);
        };
        
        toaster.pop("info", "Valor del Servicio.", "$ "+ $scope.Servicio.ValorCliente);
        
        var pos = funcionService.arrayObjectIndexOf($scope.Contrato.TipoVehiculo, parseInt($scope.RutaSelect.rtTipoVehiculo), 'tvCodigo');        
        if(pos >=0){                            
            $scope.TipoSelect = $scope.Contrato.TipoVehiculo[pos];
        }  
    };   
    
    $scope.CambiarPrecioTraslado =  function (){
        if(!$scope.TrasladoSelect){
            return;
        }
        
        $scope.Servicio.ValorCliente = parseFloat($scope.TrasladoSelect.tlValorCliente);
        $scope.Servicio.Valor = parseFloat($scope.TrasladoSelect.tlValor);
        $scope.Servicio.DetallePlantillaId = $scope.TrasladoSelect.tlCodigo;
        
        toaster.pop("info", "Valor del Servicio.", "$ "+ $scope.Servicio.ValorCliente);
        
        var pos = funcionService.arrayObjectIndexOf($scope.Contrato.TipoVehiculo, parseInt($scope.TrasladoSelect.tlTipoVehiculo), 'tvCodigo');
        if(pos >=0){                            
            $scope.TipoSelect = $scope.Contrato.TipoVehiculo[pos];
        }  
    };   
    
}]);



