app.service("clienteService",[ '$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/cliente/' + id);
        return req;
    };
       
    
    this.put = function (id,cliente) {        
        var req = $http.put(uri+'/api/cliente/' + id, cliente);
        return req;        
    };
        
        
    this.updateEstado=function(id, object){
        var req = $http.put(uri+'/api/cliente/updateEstado/' + id, object);
        return req;
    };      
    
    
     this.validarIdentificacion = function(Identificacion){
        var req = $http.get(uri+'/api/cliente/' + Identificacion +'/validar');
        return req;	
    };
    
    this.getDocumento = function () {
        var req = $http.get(uri+'/api/tipoDocumento');
        return req;
    };  
}]);





