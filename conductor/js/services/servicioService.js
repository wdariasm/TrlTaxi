app.service("servicioService",[ '$http', function ($http) {
        
    this.post = function (servicio) {
        var req = $http.post(uri+'/api/servicio',servicio); 
        return req; 
    };
    
    this.getAll = function (id, opcion) {
        var req = $http.get(uri+'/api/conductor/' + id + "/servicios/" + opcion);
        return req;
    };   
    
    this.put = function (id,objeto) {        
        var req = $http.put(uri+'/api/servicio/' + id, objeto);
        return req;                
    };
    
    this.get = function (id) {        
        var req = $http.get(uri+'/api/servicio/' + id);
        return req;                
    };
    
}]);


