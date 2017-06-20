app.service("detalleService",[ '$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/detalle/' + id);
        return req;
    };
                      
    this.post = function (detalle) { 
        var req = $http.post(uri+'/api/detalle',detalle); 
        return req; 
    };
          
    this.put = function (id,detalle) {        
        var req = $http.put(uri+'/api/detalle/' + id, detalle);
        return req;        
    };
           
}]);




