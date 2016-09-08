app.service("servicioService",[ '$http', function ($http) {
        
    this.post = function (servicio) {
        var req = $http.post(uri+'/api/servicio',servicio); 
        return req; 
    };
    
     this.getAll = function (id, opcion) {
        var req = $http.get(uri+'/api/conductor/' + id + "/servicios/" + opcion);
        return req;
    };   
    
}]);


