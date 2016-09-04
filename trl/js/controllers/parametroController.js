app.controller('parametroController',[ '$scope', 'parametroService', 'toaster',
    function ($scope, parametroService,toaster) {
    
    $scope.$parent.SetTitulo("CONFIGURACIÓN DE LA APLICACIÓN");
    
    $scope.latitud = "10.464939512630135";
    $scope.longitud = "-73.25228405068628";
    $scope.active ="active";
    $scope.mapConfig = null;
    $scope.marker = null;
    
    $scope.Parametro = {};
  
    init();
    initialize();
    permisoPosicion();
   
        
    function init(){
        
        if (!$scope.$parent.Configuracion){
            $scope.Parametro  = $scope.$parent.Configuracion;
        } else {            
            $scope.Parametro = config.getConfig();            
        }

    }
    
    function permisoPosicion(){
        if(navigator.geolocation){
               navigator.geolocation.getCurrentPosition(
                function(posicion){
                    $scope.latitud = posicion.coords.latitude;
                    $scope.longitud = posicion.coords.longitude;                        
                    initialize();                   
                }, 
               
                function(PosicionError){                    
                    switch (PosicionError.code)
			{
                            case PosicionError.PERMISSION_DENIED:                                
                                toaster.pop("No se ha permitido el acceso a la posición del usuario.",4000, 'rounded');
                                break;
                            case PosicionError.POSITION_UNAVAILABLE:
                                toaster.pop("No se ha podido acceder a la información de su posición.", 4000, 'rounded');													
				break;
                            case PosicionError.TIMEOUT:
                                toaster.pop("El servicio ha tardado demasiado tiempo en responder.", 4000, 'rounded');                                
				break;
                            default:
                                toaster.pop("Error desconocido.", 4000, 'rounded');					
                        }                  
               }, 
                {
			maximumAge: 75000,
			timeout: 15000
		}
                       
                );
            } else {               
               toaster.pop("Su navegador no soporta la API de geolocalización.", 4000, 'rounded');                
            }
    }
    
    function initialize (){        
        var mapOptions = { zoom: 14,  center: new google.maps.LatLng($scope.latitud,$scope.longitud),mapTypeId: google.maps.MapTypeId.ROADMAP};    
        $scope.mapConfig = new google.maps.Map(document.getElementById("mapaSetting"), mapOptions);     
           google.maps.event.addListener($scope.mapConfig, "click", function(evento) {
              var latitud = evento.latLng.lat();
              var longitud = evento.latLng.lng();   
                $scope.Parametro.parLatitud = latitud;
                $scope.Parametro.parLongitud = longitud;
                $("#txtLatitud").val(latitud);
                $("#txtLongitud").val(longitud);                    
            var coordenada = new google.maps.LatLng(latitud, longitud); 
            if($scope.marker !== null){
               $scope.marker.setMap(null);
            }
             $scope.marker = new google.maps.Marker({position: coordenada,map: $scope.mapConfig, animation: google.maps.Animation.DROP, title:"Posicion A Guardar"});     
        });    
    };
    
    function validarEmail(email) {
        var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return expr.test(email);         
    }
    
    $scope.guardar = function (){
              
        if($scope.Parametro.parEnviarEmail ==="SI" && !$scope.Parametro.parEmail){
            toaster.pop("info", "¡Alerta!", "Estimado Usuario(a), por favor ingrese el E-mail \n\
                            donde se enviara las notificaciones de servicios.");
            return;
        }
        
        if($scope.Parametro.parEnviarEmail ==="SI"){
            if(!validarEmail($scope.Parametro.parEmail)){
                toaster.pop("info", "¡Alerta!", "Estimado Usuario(a), el email ingresado es incorrecto.");
                return;
            }
               
        }
        
        var promise  = parametroService.put(1,$scope.Parametro);            
                                                            
        promise.then(function(d) { 
            toaster.pop('success', "Control de Información", d.data.message, 4000);            
            $scope.$parent.getConfiguracion();
        }, function(err) {           
                toaster.pop('error','Error!',err.data.request,0);           
                console.log("Some Error Occured " + JSON.stringify(err));
        });  
    };
    
    
}]);

