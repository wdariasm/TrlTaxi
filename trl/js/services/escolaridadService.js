app.service("escolaridadService",[ '$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/escolaridad/' + id);
        return req;
    };
       
    this.getAll = function () {
        var req = $http.get(uri+'/api/escolaridad');
        return req;
    };                
        
    this.post = function (escolaridad) { 
        var req = $http.post(uri+'/api/escolaridad',escolaridad); 
        return req; 
    };
          
    this.put = function (id,escolaridad) {        
        var req = $http.put(uri+'/api/escolaridad/' + id, escolaridad);
        return req;        
    };
        
    this.updateEstado=function(id, object){
        var req = $http.put(uri+'/api/escolaridad/updateEstado/' + id, object);
        return req;
    };      
    
    this.getByNombre = function () {
        var req = $http.get(uri+'/api/escolaridades');
        return req;
    };
}]);

