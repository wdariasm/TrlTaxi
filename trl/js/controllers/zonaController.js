app.controller('zonaController',['$scope', 'zonaService', 'ngTableParams', 'toaster', function ($scope,  zonaService, ngTableParams, toaster) {
    $scope.Zonas = [];       
    $scope.Zona = {};
    $scope.funcion = null;
    var ZonasTodas = [];
    
    $scope.Puntos = [];    
    $scope.editMode = false;
    $scope.mapZona;
    $scope.markerZ = null;        
    $scope.vecPoligono = new Array(); /// Vector de Poligonos
    $scope.poly = null;
    $scope.tbZona = {}; // Para Paginacion
    
    $scope.title = "NUEVA ZONA";                    
            
    $scope.$parent.SetTitulo("GESTIÓN DE ZONAS");    
    crearFn();    
    loadZona();
    loadTodasZonas("");
    iniciarMapaZ();
    $scope.funcion.init();
    //setTimeout(function (){DibujarZonas(0);},2000); 
    
    function Poligono() {
        this.coordenadas = null;
        this.marcador = null;
    }
        
    /// Crear funcion ///
    function crearFn(){
        $scope.funcion = {           
            init:function (){                
                $scope.Zona = {
                    znCodigo : '',
                    znNombre: "",                    
                    znEstado : "ACTIVO"            
                };      
                borrarPuntos();                         
            }
        };
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
    
    initTablaZona();
          
    function iniciarMapaZ  () {        
        var mapOptions = { 
            zoom: 16,                        
            center: new google.maps.LatLng(config.getLatitud(), config.getLongitud()),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.mapZona= new google.maps.Map(document.getElementById("dvMapaZona"), mapOptions);                    
        google.maps.event.addListener($scope.mapZona, "click", function(evento) {         
            var latitud = evento.latLng.lat();
            var longitud = evento.latLng.lng();
            var coordenadas = new google.maps.LatLng(latitud, longitud);
            var marcador = new google.maps.Marker(
             {
                 position: coordenadas,
                 map: $scope.mapZona, 
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
        $scope.poly.setMap($scope.mapZona);        
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
        iniciarMapaZ();
        $scope.funcion.init();
        DibujarZonas(0);
    };
    
    $scope.get = function(item) {         
        $scope.funcion.init();
        $scope.editMode = true;
        $scope.title = "EDITAR ZONA";         
        $scope.Zona = item;        
            iniciarMapaZ();
        getPuntos(item.znCodigo);  
        DibujarZonas(item.znCodigo);
        
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
                            map: $scope.mapZona, 
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
              $scope.mapZona.fitBounds(limits);  
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
    
    $scope.VerZonas =function (){
        $("#mdZonas").modal('show');
        setTimeout(function (){
            iniciarMapaTodos();
        }, 200);        
        loadTodasZonas("Todas");
    };
    
    var mapaTodos=null;
    var polyTodos = null;
    
    function iniciarMapaTodos  () {        
        var mapOptions = { 
            zoom: 16,                        
            center: new google.maps.LatLng(config.getLatitud(), config.getLongitud()),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        mapaTodos= new google.maps.Map(document.getElementById("dvMapaTodos"), mapOptions);        
    };
    
    function procesarZonas (){  
        
        if(polyTodos !== null){
            polyTodos.setMap(null);
        }
        var limites = new google.maps.LatLngBounds();
        $.each(ZonasTodas, function(i, zn){
            var puntos = [];            
            $.each(zn.Puntos, function(i, item){                     
                var coordenadas = new google.maps.LatLng( item.latitud, item.longitud);                                    
                puntos.push(coordenadas); 
                limites.extend(coordenadas);
                if (i === 0){
                    var marker = new google.maps.Marker({
                        position: coordenadas,
                        map: mapaTodos,
                        title: "Marcador " + zn.Nombre
                    });
                }
            }); 
            var color = getRandomColor();
            var polyTodos = new google.maps.Polygon({
                paths: puntos,     
                strokeColor: color,
                strokeOpacity: 0.8,
                strokeWeight: 3,
                fillColor: color,
                fillOpacity: 0.5
            });                               
            polyTodos.setMap(mapaTodos);                                                        
        });
        mapaTodos.fitBounds(limites);
        mapaTodos.setZoom(13);
        
    };
    
     function DibujarZonas (opcion){     
       
        if(polyTodos !== null){
            polyTodos.setMap(null);
        }       
        $.each(ZonasTodas, function(i, zn){
            
            if( parseInt(zn.Zona) != parseInt(opcion)){            
                var puntos = [];       
                $.each(zn.Puntos, function(i, item){                     
                    var coordenadas = new google.maps.LatLng( item.latitud, item.longitud);                                    
                    puntos.push(coordenadas);                                
                }); 
                var color = getRandomColor();
                var polyTodos = new google.maps.Polygon({
                    paths: puntos,     
                    strokeColor: color,
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                    fillColor: color,
                    fillOpacity: 0.5
                });                               
                polyTodos.setMap($scope.mapZona);  
            }
                                                                  
        });      
        
    };


    function loadTodasZonas(opcion) {
        var promiseGet = zonaService.getPuntosAll(); //The Method Call from service
        promiseGet.then(function(pl) {
            ZonasTodas = pl.data;
            if(opcion ==="Todas"){
                procesarZonas();
            }
            
        },
        function(errorPl) {
            toaster.pop("error","¡Error!", "Error al cargar zonas");
            console.log('failure loading Zona', errorPl);
        });
    }
    
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
 
}]);


