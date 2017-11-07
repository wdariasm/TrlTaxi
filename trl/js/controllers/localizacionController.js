app.controller('localizacionController',['$scope', 'localizacionService', function ($scope, localizacionService)  {
    $scope.Posicion = {};
    $scope.Taxistas = [];

    $scope.mapPosicion= null;
    $scope.markerPos = null;
    $scope.popup = null;
    $scope.vecMarkers = [];

    //CONTADORES //
    $scope.cTotal = 0;
    $scope.cLibre = 0;
    $scope.cServicio = 0;

    $scope.$parent.SetTitulo("LOCALIZACIÓN DE VEHÍCULOS");

    initMapa();
    init();


    function marcadores(){
	this.marcador = null;
    }
    function init(){
        $scope.Posicion = {
            Ver : "TODOS",
            Estado : "Libre",
            Placa : "",
        };

    }

    function initMapa(){
        var mapOptions = {
            zoom: 16,
            center: new google.maps.LatLng(config.getLatitud(),config.getLongitud()),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        $scope.mapPosicion = new google.maps.Map(document.getElementById("mapaPosicion"), mapOptions);
    };

    $scope.consultar = function (){
        $scope.cLibre = 0;
        $scope.cServicio = 0;
        if($scope.Posicion.Ver=="PLACA" && $scope.Posicion.Placa == ""){
            Materialize.toast('Ingrese la Placa !!', 4000, 'rounded');
            return;
        }
        var placa = (!$scope.Posicion.Placa) ? "NN" : $scope.Posicion.Placa.toUpperCase();

        var cont=0, contT=0, contS=0;
        var promiseGet = localizacionService.get(placa,$scope.Posicion.Estado);

        promiseGet.then(function(pl) {

            if(pl.data.message =="Error"){
                Materialize.toast(pl.data.request, 4000, 'rounded');
                return;
            }

            $scope.Taxistas = pl.data;
            for(var i = 0 ; i < $scope.vecMarkers.length ; i++){
                $scope.vecMarkers[i].marcador.setMap(null);
            }
                $scope.cTotal= $scope.Taxistas.length;
            if ($scope.Taxistas.length > 0){
              var limits = new google.maps.LatLngBounds();
              $.each($scope.Taxistas, function(i, item){                  
                 var ruta = "";
                  var icono = "";
                if (item.Disposicion === 'LIBRE'){
                    icono = 'images/origen.png';
                    $scope.cLibre +=1;
                } else if (item.Disposicion === 'EN SERVICIO'){
                   icono = 'images/destino.png';
                   $scope.cServicio += 1;
                }

                if(item.RutaImg === ""){
                  ruta = "../img/conductor/default.png";
                } else {
                  ruta = item.RutaImg;
                }

                var marcadorGPS = new marcadores();

                marcadorGPS.marcador = new google.maps.Marker({
                position : new google.maps.LatLng(item.gpLatitud,item.gpLongitud)
                , map : $scope.mapPosicion
                , title: 'Movil N°' + item.Movil
                , icon: icono
                });

                $scope.vecMarkers.push(marcadorGPS);

                 limits.extend(marcadorGPS.marcador.position);
                google.maps.event.addListener(marcadorGPS.marcador, 'click', function(){
                    if(!$scope.popup){
                        $scope.popup = new google.maps.InfoWindow();
                    }
                    var note = "";
                    note += '<label> Nombre: </label>'+ item.Nombre + '<br/>';
                    note += '<img src="'+ ruta +'" style="float: right; border-radius: 50%; width:60px; heigth:60px;" />';
                    note += '<label> Placa: </label>'+ item.CdPlaca + '<br/>';
                    note += '<label> Estado: </label>'+ item.Disposicion + '<br/>';
                    note += '<label> Fecha Actualizacion: </label>'+ item.gpFecha + '<br/>';

                $scope.popup.setContent(note);
                $scope.popup.open($scope.mapPosicion, this);
                });
            });
             $scope.mapPosicion.fitBounds(limits);
          } else {
              toaster.pop('warning','¡Información!',"No Se Encontraron Coincidencias con estos parametros");                
            }
        },
        function(errorPl) {
            console.log('failure loading usuarios', errorPl);
        });
    };
}]);
