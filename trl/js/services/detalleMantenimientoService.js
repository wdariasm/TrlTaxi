app.service("detalleMantenimientoService",[ '$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/detalleMantenimiento/' + id);
        return req;
    };
       
    this.getAll = function () {
        var req = $http.get(uri+'/api/detalleMantenimiento');
        return req;
    };                
        
    this.post = function (detalleMantenimiento) { 
        var req = $http.post(uri+'/api/detalleMantenimiento',detalleMantenimiento); 
        return req; 
    };
          
    this.put = function (id,detalleMantenimiento) {        
        var req = $http.put(uri+'/api/detalleMantenimiento/' + id, detalleMantenimiento);
        return req;        
    };
         
    
    this.getByNombre = function () {
        var req = $http.get(uri+'/api/detalleMantenimientos');
        return req;
    };
}]);


