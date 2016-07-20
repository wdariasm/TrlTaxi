app.service("clienteService", function ($http) {
    
    this.get = function (id) {
        var req = $http.get(uri+'/api/cliente/' + id);
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
    
    //Cambiar Contraseña
    this.udpatePass = function (id,cliente) {        
        var req = $http.put(uri+'/api/cliente/updatepassword/' + id, cliente);
        return req;        
    };
                     
});

