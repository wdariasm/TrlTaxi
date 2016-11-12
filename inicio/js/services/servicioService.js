app.service("servicioService",[ '$http', function ($http) {
        
    this.get = function (id) {        
        var req = $http.get(uri+'/api/servicio/' + id + "/calificacion");
        return req;                
    };
       
}]);


