app.service("clienteService",[ '$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/cliente/' + id);
        return req;
    };
       
    this.getAll = function () {
        var req = $http.get(uri+'/api/cliente');
        return req;
    };                
        
    this.post = function (cliente) { 
        var req = $http.post(uri+'/api/cliente',cliente); 
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
    
    this.getByNombre = function () {
        var req = $http.get(uri+'/api/clientes');
        return req;
    };
    
     this.validarIdentificacion = function(Identificacion){
        var req = $http.get(uri+'/api/cliente/' + Identificacion +'/validar');
        return req;	
    };
}]);





