app.service("servicioService",[ '$http', function ($http) {
        
    this.post = function (servicio) {
        var req = $http.post(uri+'/api/servicio',servicio); 
        return req; 
    };
    
     this.getAll = function (id, rol, user) {
        var req = $http.get(uri+'/api/cliente/' + id + "/servicios/" + rol + "/" + user );
        return req;
    };   
    
}]);


