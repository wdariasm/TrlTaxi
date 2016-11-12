app.service("servicioService",[ '$http', function ($http) {
        
    this.get = function (id) {        
        var req = $http.get(uri+'/api/servicio/' + id + "/calificacion");
        return req;                
    };
    
    this.calificar = function (id, objeto) { 
        var req = $http.put(uri+'/api/servicio/calificar/' + id, objeto);    
        return req; 
    };
    
       
}]);


