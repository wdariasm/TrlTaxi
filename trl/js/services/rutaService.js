app.service("rutaService",[ '$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/ruta/' + id);
        return req;
    };
       
    this.getAll = function () {
        var req = $http.get(uri+'/api/ruta');
        return req;
    };                
        
    this.post = function (ruta) { 
        var req = $http.post(uri+'/api/ruta',ruta); 
        return req; 
    };
          
    this.put = function (id,ruta) {        
        var req = $http.put(uri+'/api/ruta/' + id, ruta);
        return req;        
    };
        
    this.updateEstado=function(id, object){
        var req = $http.put(uri+'/api/ruta/updateEstado/' + id, object);
        return req;
    };      
    
    this.getByNombre = function () {
        var req = $http.get(uri+'/api/rutas');
        return req;
    };
}]);


