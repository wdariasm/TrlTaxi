    
    function buscarZonaLocal (lat, long){
        var punto = new google.maps.LatLng(lat, long);
        var zona = 0;
        $.each($scope.Zonas, function(i, zn){
            var puntos = [];
            $.each(zn.Puntos, function(i, item){
                var coordenadas = new google.maps.LatLng(item.latitud, item.longitud);                                    
                puntos.push(coordenadas);                
            }); 
            var poligono = new google.maps.Polygon({
                paths: puntos                
            });
             
            if(poligono.contains(punto)){
                zona = zn.Zona;
                return;
            }                       
        });
        return zona;
    };


    function loadZona() {
        var promiseGet = zonaService.getPuntosAll(); //The Method Call from service
        promiseGet.then(function(pl) {
            $scope.Zonas = pl.data;  
            console.log($scope.Zonas);
            
        },
        function(errorPl) {
            toaster.pop("error","¡Error!", "Eror al cargar zonas");
            console.log('failure loading Zona', errorPl);
        });
    }
    
    loadZona();
    
    $scope.Probando =function (){
        var zonar =buscarZonaLocal($scope.Latitud, $scope.Longitud);            
        alert(zonar);
    };



