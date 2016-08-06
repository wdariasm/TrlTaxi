app.service("mantenimientoService",[ '$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/mantenimiento/' + id);
        return req;
    };
       
    this.getAll = function () {
        var req = $http.get(uri+'/api/mantenimiento');
        return req;
    };                
        
    this.post = function (mantenimiento) { 
        var req = $http.post(uri+'/api/mantenimiento',mantenimiento); 
        return req; 
    };
          
    this.put = function (id,mantenimiento) {        
        var req = $http.put(uri+'/api/mantenimiento/' + id, mantenimiento);
        return req;        
    };

    this.getByNombre = function () {
        var req = $http.get(uri+'/api/mantenimientos');
        return req;
    };
}]);


