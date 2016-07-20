app.service("sesionService", function ($http) {
                    
    this.post = function (cliente) { 
        var req = $http.post(uri+'/api/cliente/autenticar',cliente);         
        return req; 
    };
    
    this.login = function (user) { 
        var req = $http.post(uri+'/api/usuario/autenticar',user);         
        return req; 
    };
    
    this.postEmail = function (email) { 
        var req = $http.post(uri+'/api/cliente/recordar',email);         
        return req; 
    };
});
