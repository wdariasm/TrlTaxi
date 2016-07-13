app.service("novedadService",['$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/novedad/' + id);
        return req;
    };                      
        
    this.post = function (novedad) { 
        var req = $http.post(uri+'/api/novedad',novedad); 
        return req; 
    };
          
    this.put = function (id,novedad) {        
        var req = $http.put(uri+'/api/novedad/' + id, novedad);
        return req;        
    };
           
}]);




