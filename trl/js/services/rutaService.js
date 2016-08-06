app.service("rutaService",[ '$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/ruta/' + id);
        return req;
    };
       
    this.getAll = function () {
        var req = $http.get(uri+'/api/ruta');
        return req;
    };                
        
    this.post = function (formData) { 
//        var req = $http.post(uri+'/api/ruta',ruta); 
//        return req; 
        var req = $http.post(uri+'/api/ruta', formData,{transformRequest: angular.identity, 
            headers: {'Content-Type': undefined}});
        return req;
    };
    
    this.postImagen = function (formData) {        
        var req = $http.post(uri+'/api/ruta/imagen', formData,{transformRequest: angular.identity, 
            headers: {'Content-Type': undefined}});
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


