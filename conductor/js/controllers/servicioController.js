app.controller('servicioController', function ($scope, servicioService, direccionService) {

    $scope.Servicio = {};
    $scope.vecMarkador = [];  // Vector de marcadores

    $scope.mapa;
    $scope.markerServ = null;
    $scope.popup=null;

    initialize();
    setTimeout (initMapa, 1000);

    function initialize(){
        $scope.Servicio = {
            idCliente:  "",
            dir0:       "",
            dir1:       "",
            dir2:       "",
            dir3:       "",
            dir4:       "",
            dir5:       "",
            descripcion:"",
            latitud:    session.getLatitud(),
            longitud:   session.getLongitud(),
            categoria : "Todas",
            ubicacion : "actual",
            guardarDir : false,
            lugar : ""
        };
    }

    function initMapa(){
      var mapOptions = {
            zoom: 14,
            center: new google.maps.LatLng($scope.$parent.Configuracion.LatitudIni,$scope.$parent.Configuracion.LongitudIni),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        $scope.mapa = new google.maps.Map(document.getElementById("map"), mapOptions);

        google.maps.event.addListener($scope.mapa, "click", function(evento) {
            var latitud = evento.latLng.lat();
            var longitud = evento.latLng.lng();
            $scope.Servicio.latitud = latitud;
            $scope.Servicio.longitud = longitud;
            var coordenada = new google.maps.LatLng(latitud, longitud);
            if($scope.markerServ !== null){
                $scope.markerServ.setMap(null);
            }
            $scope.markerServ = new google.maps.Marker({position: coordenada, map: $scope.mapa ,
                animation: google.maps.Animation.DROP, title:"Posicion Cliente",
                icon:'../taxi/images/clienteIcon.png'
            });

            var yourPosicion = new google.maps.LatLng($scope.Servicio.latitud, $scope.Servicio.longitud);
            var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'latLng': yourPosicion }, getGeocoder);

            getTaxisLibres(latitud, longitud);
        });
        $scope.ubicacionAutomatica();
    };

    $scope.ubicacionAutomatica= function (){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                function(posicion){
                    $scope.Servicio.latitud = posicion.coords.latitude;
                    $scope.Servicio.longitud = posicion.coords.longitude;
                },
                function(PosicionError){
                    $scope.Servicio.ubicacion= "global";
                    $scope.Servicio.latitud =    session.getLatitud();
                    $scope.Servicio.longitud =   session.getLongitud();
                    switch (PosicionError.code)
			{
                            case PosicionError.PERMISSION_DENIED:
                                Materialize.toast("No se ha permitido el acceso a la posición del usuario.",4000, 'rounded');
                                break;
                            case PosicionError.POSITION_UNAVAILABLE:
                                Materialize.toast("No se ha podido acceder a la información de su posición.", 4000, 'rounded');
				break;
                            case PosicionError.TIMEOUT:
                                Materialize.toast("El servicio ha tardado demasiado tiempo en responder.", 4000, 'rounded');
				break;
                            default:
                                Materialize.toast("Error desconocido.", 4000, 'rounded');
                        }
                },
                {
			maximumAge: 75000,
			timeout: 15000
		}

                );
        } else {
            Materialize.toast("Su navegador no soporta la API de geolocalización.", 4000, 'rounded');
        }
        posicionCliente();
    };

    // Codigo Relacionado con Marcadores //
    function setmarcadores(){
        this.marcador = null;
    }

    //Borrar Marcadores
    $scope.borrarMarcadores = function(){
        for (var i = 0; i < $scope.vecMarkador.length; i++) {
            $scope.vecMarkador[i].marcador.setMap(null);
        }
        $scope.vecMarkador.length = 0;
    };

    $scope.limpiarMarcador = function (){
        if($scope.markerServ !== null){
            $scope.markerServ.setMap(null);
        }
    };

    //************ ////
    function posicionCliente(){
        $scope.limpiarMarcador();
        if ($scope.Servicio.latitud === "0" || $scope.Servicio.longitud ==="0"){
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': $scope.Servicio.direccion + " "+ $scope.Servicio.ciudad}, geocodeResult);
        } else {
            var limits = new google.maps.LatLngBounds();
            var coordenada = new google.maps.LatLng($scope.Servicio.latitud, $scope.Servicio.longitud);
                $scope.markerServ = new google.maps.Marker({position: coordenada, map: $scope.mapa,
                            animation: google.maps.Animation.DROP, title:"Posicion Cliente",
                            icon:'../taxi/images/clienteIcon.png'
                    });
            limits.extend(coordenada);
            $scope.mapa.fitBounds(limits);
            $scope.mapa.setZoom(14);

            var yourPosicion = new google.maps.LatLng($scope.Servicio.latitud, $scope.Servicio.longitud);
            var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'latLng': yourPosicion }, getGeocoder);

            getTaxisLibres($scope.Servicio.latitud, $scope.Servicio.longitud);
        }

    }

    function getGeocoder(results, status){
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                var dir0 = results[0].address_components[1].long_name.split(" ");
                var dir1 = "";
                for (var i = 1; i <= dir0.length-1; i++) {
                    dir1 += dir0[i] + " ";
                }
                $scope.Servicio.ciudad = results[0].address_components[2].long_name;
                $scope.Servicio.dir1 = dir1;
                var dir2 = results[0].formatted_address.split(" a ",1);
                var dir3 = dir2[0].split("#",2);
                var dir4 = dir3[1].split("-");
                $scope.Servicio.dir2 = dir4[0];
                $scope.Servicio.dir3 = dir4[1];
                $scope.Servicio.dir0 = dir0[0];
                $scope.direccion();
            } else {
                error('Google no retorno resultado alguno.');
            }
        } else {
            error("Geocoding fallo debido a : " + status);
        }
    }

    function getTaxisLibres(latitud, longitud){
        var Object= JSON.stringify({
            latitud: latitud,
            longitud: longitud,
            categoria: "Todas",
            radio: $scope.$parent.Configuracion.prRadio,
            limite: "8",
            movil : ""
        });
        $scope.borrarMarcadores();
        var promiseGet = servicioService.getTaxiLibre(Object);
        promiseGet.then(function(pl) {
            if (pl.data){
                $.each(pl.data, function(i, item){
                    var icono = "";
                    if (item.Disposicion === 'Libre'){
                        icono = '../taxi/images/estadoTaxi1.png';
                    } else if (item.Disposicion === 'En Turno') {
                       icono = '../taxi/images/estadoTaxi2.png';
                    }

                    var marcadorGPS = new setmarcadores();

                    marcadorGPS.marcador = new google.maps.Marker({
                        position : new google.maps.LatLng(item.latitud,item.longitud)
                        , map : $scope.mapa
                        , title: 'Movil N°' + item.movil +  '  Distancia: ' + item.distancia  + ' Km'
                        , icon: icono
                    });

                    $scope.vecMarkador.push(marcadorGPS);
                    google.maps.event.addListener(marcadorGPS.marcador, 'click', function(){
                        if(!$scope.popup){
                            $scope.popup = new google.maps.InfoWindow();
                        }
                        var note = "";
                        note += '<label> Nombre: </label>'+ item.taxista + '<br/>';
                        note += '<label> Placa: </label>'+ item.placa + '<br/>';
                        note += '<label> Movil: </label>'+ item.movil + '<br/>';
                        note += '<label> Categoria: </label>'+ item.ncategoria + '<br/>';
                        note += '<label> Estado: </label>'+ item.Disposicion + '<br/>';
                        note += '<label> Distancia: </label>'+ item.distancia + '<br/>';
                        //note += '<a id="'+i+'" class="urlManual" href="javascript:registrarManual();" rel="'+item.idPersona+'-'+item.Disposicion+'">Solicitar </a>';

                        $scope.popup.setContent(note);
                        $scope.popup.open($scope.mapa, this);
                    });
                });
            }
        },
        function(errorPl) {
            console.log('failure loading usuarios', errorPl);
        });
    };


     // CAPTURAR DIRECCIONES
    $scope.direccion = function(){
        if (!$scope.Servicio.dir1 || !$scope.Servicio.dir2 || !$scope.Servicio.dir3 ){
            return;
        }
        var _direccion = $scope.Servicio.dir0 + " " + $scope.Servicio.dir1.trim().toUpperCase() + " # " +
                        $scope.Servicio.dir2.trim().toUpperCase() + "-" + $scope.Servicio.dir3.trim();
        $scope.Servicio.direccion = _direccion;
        $scope.Servicio.direccionOP = _direccion;
    };

    $scope.direccionOP = function(){
        if (!$scope.Servicio.dir1 || !$scope.Servicio.dir2 || !$scope.Servicio.dir3 ){
            return;
        }
        var _direccion = $scope.Servicio.dir0 + " " + $scope.Servicio.dir1.trim().toUpperCase() + " # " +
                        $scope.Servicio.dir2.trim().toUpperCase() + "-" + $scope.Servicio.dir3.trim() + " " +
                        $scope.Servicio.dir4 +  " " + $scope.Servicio.dir5.trim().toUpperCase();
        $scope.Servicio.direccionOP = _direccion;
    };


    $scope.registrar = function (){
        var objServicio = {
            idCliente : session.getidCliente(),
            latitud : $scope.Servicio.latitud,
            longitud: $scope.Servicio.longitud,
            direccion : $scope.Servicio.direccion,
            descripcion: ($scope.Servicio.descripcion) ? $scope.Servicio.descripcion.toUpperCase() : "",
            dir0 : $scope.Servicio.dir0,
            dir1 : $scope.Servicio.dir1.trim().toUpperCase(),
            dir2 : $scope.Servicio.dir2.trim().toUpperCase(),
            dir3 : $scope.Servicio.dir3.trim(),
            dir4 : $scope.Servicio.dir4.trim(),
            dir5 : $scope.Servicio.dir5.trim(),
            direccionOp : $scope.Servicio.direccionOP,
            radio: $scope.$parent.Configuracion.prRadio,
            categoria : 'Todas',
            modulo : 'Web Cliente'
        };

        if ($scope.Servicio.guardarDir){
            if($scope.Servicio.lugar === ""){
                Materialize.toast('Ingrese el Nombre del Lugar', 4000, 'rounded');
                return;
            }
            var objDireccion = {
                nombre : $scope.Servicio.lugar.toUpperCase(),
                direccion : $scope.Servicio.direccion,
                latitud : $scope.Servicio.latitud,
                longitud: $scope.Servicio.longitud,
                idCliente : session.getidCliente()
            };

            var promisePost = direccionService.post(objDireccion);
            promisePost.then(function(d) {
                Materialize.toast(d.data.message, 4000, 'rounded');
            }, function(err) {
                Materialize.toast("ERROR AL GUARDAR DIRECCION");
                console.log("Some Error Occured " + JSON.stringify(err));
            });
        }

        var promise = servicioService.post(objServicio);
        promise.then(function(d) {
            Materialize.toast(d.data.message, 4000, 'rounded');
            initialize();
            $scope.borrarMarcadores();
        }, function(err) {
                alert("ERROR AL GUARDAR SERVICIO");
                console.log("Some Error Occured " + JSON.stringify(err));
        });

    };
});

app.controller('historialController', function ($scope, servicioService, motivoService) {
    $scope.Servicios = [];
    $scope.Motivos = [];
    $scope.Servicio = {
        motivo : null,
        idServicio : null,
        idPersona : null
    };

    getServicios();
    getMotivos();

    function getServicios(){
        var promiseGet = servicioService.getServicios(session.getidCliente());
        promiseGet.then(function(pl) {
            $scope.Servicios = pl.data;
        },
        function(errorPl) {
            console.log('failure loading usuarios', errorPl);
        });
    }

    function getMotivos(){
        var promiseGet = motivoService.get('C');
        promiseGet.then(function(pl) {
            $scope.Motivos = pl.data;
        },
        function(errorPl) {
            console.log('failure loading usuarios', errorPl);
        });
    }

    $scope.mostrarOpcion = function (idServicio, idPersona){
        $('#modalMotivo').openModal();
        $scope.Servicio.idServicio = idServicio;
        $scope.Servicio.idPersona = idPersona;
    };

    $scope.cancelar = function (){

        $('#modalMotivo').closeModal();
        var _Object = {
            idMotivo : ($scope.Servicio.motivo) ? $scope.Servicio.motivo : 0,
            idServicio :  $scope.Servicio.idServicio,
            idPersona  :  $scope.Servicio.idPersona
        };
        var promisePut = servicioService.cancelarCliente(session.getidCliente(), _Object);
        promisePut.then(function(d) {
            Materialize.toast(d.data.message, 4000, 'rounded');
            getServicios();
        }, function(err) {
            Materialize.toast("ERROR AL CANCELAR SERVICIO");
            console.log("Some Error Occured " + JSON.stringify(err));
        });


    };
});
