app.service("servicioService",[ '$http', function ($http) {
        
    this.post = function (servicio) {
        var req = $http.post(uri+'/api/servicio',servicio); 
        return req; 
    };
    
     this.getAll = function (id, rol, user) {
        var req = $http.get(uri+'/api/cliente/' + id + "/servicios/" + rol + "/" + user );
        return req;
    }; 
    
    this.getConductor = function (id) {
        var req = $http.get(uri+'/api/conductor/' + id + "/vehiculo");
        return req;
    }; 
    
    this.cancelar = function (id,objeto) {        
        var req = $http.put(uri+'/api/servicio/' + id + '/cancelar', objeto);
        return req;                
    };
    
    this.getMotivos = function (modulo) {
        var req = $http.get(uri+'/api/motivo/' + modulo);
        return req;
    };
    
}]);


