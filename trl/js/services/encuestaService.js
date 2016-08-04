app.service("encuestaService",[ '$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/encuesta/' + id);
        return req;
    };
       
    this.getAll = function () {
        var req = $http.get(uri+'/api/encuesta');
        return req;
    };                
        
    this.post = function (encuesta) { 
        var req = $http.post(uri+'/api/encuesta',encuesta); 
        return req; 
    };
          
    this.put = function (id,encuesta) {        
        var req = $http.put(uri+'/api/encuesta/' + id, encuesta);
        return req;        
    };
        
    this.updateEstado=function(id, object){
        var req = $http.put(uri+'/api/encuesta/updateEstado/' + id, object);
        return req;
    };      
    
    this.getByNombre = function () {
        var req = $http.get(uri+'/api/encuestas');
        return req;
    };
}]);


