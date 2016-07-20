app.service("sesionService", function ($http) {
                        
    this.login = function (user) { 
        var req = $http.post(uri+'/api/usuario/autenticar',user);         
        return req; 
    };
    
    this.postEmail = function (email) { 
        var req = $http.post(uri+'/api/cliente/recordar',email);         
        return req; 
    };
});
