app.service("conductorService",[ '$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/conductor/' + id);
        return req;
    };
       
    this.getAll = function () {
        var req = $http.get(uri+'/api/conductor');
        return req;
    };                
        
    this.post = function (conductor) { 
        var req = $http.post(uri+'/api/conductor',conductor); 
        return req; 
    };
          
    this.put = function (id,conductor) {        
        var req = $http.put(uri+'/api/conductor/' + id, conductor);
        return req;        
    };
        
    this.updateEstado=function(id, object){
        var req = $http.put(uri+'/api/conductor/updateEstado/' + id, object);
        return req;
    };      
    
    this.getByNombre = function () {
        var req = $http.get(uri+'/api/conductores');
        return req;
    };
    
     this.validarIdentificacion = function(Cedula){
        var req = $http.get(uri+'/api/conductor/' + Cedula +'/validar');
        return req;	
    };
}]);


