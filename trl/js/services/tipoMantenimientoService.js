app.service("tipoMantenimientoService",[ '$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/tipoMantenimiento/' + id);
        return req;
    };
       
    this.getAll = function () {
        var req = $http.get(uri+'/api/tipoMantenimiento');
        return req;
    };                
        
    this.post = function (tipoMantenimiento) { 
        var req = $http.post(uri+'/api/tipoMantenimiento',tipoMantenimiento); 
        return req; 
    };
          
    this.put = function (id,tipoMantenimiento) {        
        var req = $http.put(uri+'/api/tipoMantenimiento/' + id, tipoMantenimiento);
        return req;        
    };
        
    this.updateEstado=function(id, object){
        var req = $http.put(uri+'/api/tipoMantenimiento/updateEstado/' + id, object);
        return req;
    };              
}]);



