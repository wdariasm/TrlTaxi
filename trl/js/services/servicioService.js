app.service("servicioService",[ '$http', function ($http) {
        
    this.post = function (servicio) {
        var req = $http.post(uri+'/api/servicio',servicio); 
        return req; 
    };
    
    this.getAll = function () {
        var req = $http.get(uri+'/api/servicio');
        return req;
    };   
    
    this.getSolicitados = function () {
        var req = $http.get(uri+'/api/servicio/solicitados');
        return req;
    };   
    
    this.getDisponible = function (tipo){
        var req = $http.get(uri+'/api/servicio/tipo/'+tipo+'/conductores');
        return req;
    };
    
    this.asignar =  function (servicio){
        var req = $http.post(uri+'/api/servicio/asignar',servicio); 
        return req;
    };
    
    this.getPorFecha = function (fecha) {
        var req = $http.post(uri+'/api/servicio/fecha', fecha);
        return req;
    };                  
    
    this.cancelar = function (id,objeto) {        
        var req = $http.put(uri+'/api/servicio/' + id + '/cancelar', objeto);
        return req;                
    };
    
}]);


