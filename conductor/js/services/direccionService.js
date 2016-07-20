app.service("direccionService", function ($http) {
    
    this.get = function (id) {
        var req = $http.get(uri+'/api/direccion/' + id);
        return req;
    };
    
    this.getAll = function (id) {
        var req = $http.get(uri+'/api/cliente/' + id + '/direccion');
        return req;
    };
    
    this.post = function (direccion) { 
        var req = $http.post(uri+'/api/direccion',direccion);         
        return req; 
    };
    
    this.put = function (id,direccion) {        
        var req = $http.put(uri+'/api/direccion/' + id, direccion);
        return req;        
    };  
    
    this.delete = function (id) {        
        var req = $http.delete(uri+'/api/direccion/' + id);
        return req;        
    };  
                     
});



