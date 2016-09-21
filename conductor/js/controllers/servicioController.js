app.controller("servicioController", ["$scope",  "toaster",  "servicioService","ngTableParams",
    function ($scope,toaster, servicioService, ngTableParams) {
        
    
    $scope.Servicios = [];
    $scope.TablaServicio = {};
    $scope.Motivos = [];
    $scope.VerDetalle =false;
    $scope.ServicioDto = {};   
    $scope.ServicioCancel = {};
    $scope.MotivoSel =""; // Motivo seleccionado
    $scope.ValBoton = { 
        EstAnterior : "",
        EstSiguiente: "",
        Color :""
    };
    
    $scope.$parent.SetTitulo("MIS SERVICIOS");        
    initTabla();        
    var mapa;   
    var markerConductor =null;
    var travelMode = google.maps.TravelMode.DRIVING;
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    
    $scope.Posicion = {
        Latitud : config.getLatitud(),
        Longitud : config.getLongitud()
    };
        
    
    function iniciarMapaZ  () {        
        var mapOptions = {
            zoom: 16,          
            center: new google.maps.LatLng($scope.Posicion.Latitud, $scope.Posicion.Longitud),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        directionsDisplay.set('directions', null);

        mapa= new google.maps.Map(document.getElementById("dvMapaServicio"), mapOptions);
        directionsDisplay.setMap(mapa);
    }
    
    function geolocate() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                $scope.Posicion.Latitud =  position.coords.latitude;
                $scope.Posicion.Longitud = position.coords.longitude;                      
            });   
            
            var coordenada = new google.maps.LatLng($scope.Posicion.Latitud, $scope.Posicion.Longitud);
            if(markerConductor !== null){
                markerConductor.setMap(null);
            }
            markerConductor = new google.maps.Marker({position: coordenada, map: mapa ,
                animation: google.maps.Animation.DROP, title:"Mi posición",
                icon:'images/posicion.png'
            });            
        }
    }
    
    function route(origen, destino, travel_mode, directionsService, directionsDisplay) {
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
    
   
    function initTabla() {
        $scope.TablaServicio = new ngTableParams({
            page: 1,
            count: 20,
            sorting: undefined
        }, {
            filterDelay: 50,
            total: 1000,
            counts : [],
            getData: function (a, b) {
                var c = b.filter().busqueda;
                f = [];
                c ? (c = c.toLowerCase(), f = $scope.Servicios.filter(function (a) {
                    return a.ctNitCliente.indexOf(c) > -1 ||
                           a.ctContratante.toLowerCase().indexOf(c) > -1 ||
                           a.ctNumeroContrato.indexOf(c) > -1 ||
                           a.ctEstado.toLowerCase().indexOf(c) > -1                                                       
                })) : f = $scope.Servicios, f = b.sorting() ? f : f, b.total(f.length), a.resolve(f.slice((b.page() - 1) * b.count(), b.page() * b.count()))
            }
        });
    };
    
    $scope.ConvertirFecha =  function (fecha){
        var f = new Date(fecha);       
        return f.toLocaleDateString('en-GB');
    };
               
           
    $scope.GetServiciosConductor = function (){
         var promise = servicioService.getAll($scope.$parent.Login.ConductorId, 'ACTIVO');
        promise.then(function(d) {                        
            $scope.Servicios = d.data;
            $scope.TablaServicio.reload();             
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar servicios");           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    };
    
    $scope.CambiarEstado =  function (item, estado, enviar){
        var obj = {
            Estado : estado, 
            Email : enviar,
            ClienteId : item.ClienteId,
            Responsable : item.Responsable,
            Conductor : item.ConductorId
        };
        
        var promise = servicioService.put(item.IdServicio, obj);
        promise.then(function(d) {                        
            toaster.pop('success','¡Información!', d.data.message);
            $scope.GetServiciosConductor();
        }, function(err) {           
                toaster.pop('error','¡Error confirmar servicio!',err.data.request, 0);           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    };
    
    $scope.GetServiciosConductor();
    
    $scope.RealizarServicio = function (item){
        $scope.ServicioDto = item;
        getServicio(item.IdServicio);
        
        var div1 = document.getElementById('liServicio');                
                div1.classList.remove('hidden');
                div1.classList.add('visible');                                                  
        $('#tabPanels a[href="#tabRealizar"]').tab('show');
        
        var div2 = document.getElementById('dvMapaServicio');                
            div2.classList.remove('hidden');
            div2.classList.add('visible');                                  
            setTimeout(function (){ iniciarMapaZ();  geolocate(); },200);
    };                        
   
    function getServicio (id){        
        var promise = servicioService.get(id);        
        promise.then(function(d) {  
            if (d.data){
                $scope.ServicioDto = d.data;
                estadoServicio($scope.ServicioDto.Estado);
                if( parseInt($scope.ServicioDto.TipoServicidoId) === 1){
                    var origen  = new google.maps.LatLng(parseFloat($scope.ServicioDto.LatOrigen), parseFloat($scope.ServicioDto.LngOrigen));
                    var destino = new google.maps.LatLng(parseFloat($scope.ServicioDto.LatDestino),parseFloat($scope.ServicioDto.LngDestino));
                    route(origen, destino,travelMode, directionsService, directionsDisplay);
                }                                 
            }
            
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar servicio",0);           
                console.log("Some Error Occured " + JSON.stringify(err));
        });         
    } 
    
    function estadoServicio (estado){
        switch (estado) {
            case "CONFIRMADO":
                $scope.ValBoton.EstSiguiente = "EN SITIO";
                $scope.ValBoton.EstAnterior ="CONFIRMADO";
                $scope.ValBoton.Color = " btn-success";
                break;
            case "EN SITIO":
                $scope.ValBoton.EstSiguiente = "EN RUTA";
                $scope.ValBoton.EstAnterior ="EN SITIO";
                $scope.ValBoton.Color = " btn-primary";
                break;
            case "EN RUTA":
                $scope.ValBoton.EstSiguiente = "FINALIZADO";
                $scope.ValBoton.EstAnterior ="EN RUTA";
                $scope.ValBoton.Color = " btn-info";
                break;            
        }
    }
    
    function cerrarServicio(){
        $scope.ServicioDto = {};
        $scope.ValBoton = {};                
        var div1 = document.getElementById('liServicio');                
                div1.classList.remove('visible');
                div1.classList.add('hidden');                                                  
        $('#tabPanels a[href="#tabListado"]').tab('show');
    }
    
    $scope.ActualizarServicio=  function (){
        if(!$scope.ServicioDto || !$scope.ServicioDto.IdServicio){
            toaster.pop("error", "¡Error!", "Estimado Usuario(a), por favor seleccione un servicio valido.");
            return;
        }
        
        if($scope.ValBoton.EstSiguiente ===""){
            toaster.pop("info", "¡Alerta!", "Estado del servicio no valido");
            return;
        }
        var obj = {
            Estado : $scope.ValBoton.EstSiguiente                       
        };
        
        var promise = servicioService.actualizar($scope.ServicioDto.IdServicio, obj);
        promise.then(function(d) {                        
            toaster.pop('success','¡Información!', d.data.message);            
            if($scope.ValBoton.EstSiguiente ==="FINALIZADO") {
                cerrarServicio();
            }
            estadoServicio($scope.ValBoton.EstSiguiente);
            $scope.GetServiciosConductor();
        }, function(err) {           
                toaster.pop('error','¡Error confirmar servicio!',err.data.request, 0);           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
        
    };
    
    $scope.RechazarServicio=  function (id){        
        var promise = servicioService.delete(id);
        promise.then(function(d) {                        
            toaster.pop('success','¡Información!', d.data.message);            
        }, function(err) {           
            toaster.pop('error','¡Error confirmar servicio!',err.data.request, 0);           
            console.log("Some Error Occured " + JSON.stringify(err));
        });         
    };
    
    $scope.VerCancelar =  function (item){
        $scope.MotivoSel="";    
        $scope.ServicioCancel = item;        
        getMotivos();        
        $("#modalMotivo").modal("show");
    };
    
    $scope.CancelarServicio =  function(){
        if(!$scope.ServicioCancel || !$scope.ServicioCancel.IdServicio){
            toaster.pop("error", "¡Error!", "Estimado Usuario(a), por favor seleccione un servicio valido.");
            return;
        }
        console.log($scope.MotivoSel);
        if(!$scope.MotivoSel){
            toaster.pop("info", "¡Alerta!", "Estimado Usuario(a), por favor seleccione el motivo de cancelacion del servicio.");
            return;
        }
        
        var obj = {
            Conductor  : $scope.ServicioCancel.ConductorId,
            Estado : "CANCELADO",
            Motivo : $scope.MotivoSel,
            Cliente : $scope.ServicioCancel.ClienteId
        };
        
        var promise = servicioService.cancelar($scope.ServicioCancel.IdServicio, obj);
        promise.then(function(d) {         
            toaster.pop('success', '¡Información', d.data.message);
            if($scope.ServicioDto){
                cerrarServicio();
            }  
            $scope.GetServiciosConductor();
            $('#modalMotivo').modal('hide');   
        }, function(err) {           
                toaster.pop('error','¡Error!',err.data.request);           
                console.log("Some Error Occured " + JSON.stringify(err));
        }); 
    };
    
    
    function getMotivos(){        
        var promise = servicioService.getMotivos("CONDUCTOR");        
        promise.then(function(d) {             
            $scope.Motivos = d.data;    
            
        }, function(err) {           
                toaster.pop('error','¡Error!',"Error al cargar motivos de cancelación",0);           
                console.log("Some Error Occured " + JSON.stringify(err));
        });     
    }     
    
    $scope.Ver = function (item){
        $scope.MotivoSel = item;        
    };
    
}]);


