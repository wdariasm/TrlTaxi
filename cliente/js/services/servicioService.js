app.service("servicioService",[ '$http', function ($http) {
        
    this.post = function (servicio) {
        var req = $http.post(uri+'/api/servicio',servicio); 
        return req; 
    };
    
}]);


