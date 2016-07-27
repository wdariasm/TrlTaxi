app.service("sesionService", ['$http', function ($http) {
                        
    this.login = function (user) { 
        var req = $http.post(uri+'/api/usuario/autenticar',user);         
        return req; 
    };
    
    this.recordar = function (email) { 
        var req = $http.post(uri+'/api/usuario/recordar',email);         
        return req; 
    };
    
    this.confirmar = function(id, haskey){
        var req = $http.get(uri+'/api/usuario/' + id +'/'+haskey+'/confirmar');
        return req;	
    }; 
    
    this.validarEmail = function (email) { 
        var req = $http.get(uri+'/api/usuario/'+email+'/email');         
        return req; 
    };                
    
    this.verificarKey = function(idCliente, id, haskey){
        var req = $http.get(uri+'/api/usuario/' + idCliente +'/recuperar/'+ id + '/' + haskey);
        return req;	
    }; 
   
    this.udpatePass = function (id,usuario) {        
        var req = $http.put(uri+'/api/usuario/actualizar/' + id, usuario);
        return req;        
    };      
    
    
}]);
