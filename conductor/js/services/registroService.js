app.service("registroService", function ($http) {
                    
    this.post = function (cliente) { 
        var req = $http.post(uri+'/api/cliente',cliente);         
        return req; 
    };
    
    this.confirmar = function(id, haskey){
        var req = $http.get(uri+'/api/cliente/' + id +'/'+haskey+'/confirmar');
        return req;	
    }; 
    
    this.validarEmail = function (email) { 
        var req = $http.get(uri+'/api/cliente/'+email+'/email');         
        return req; 
    };
    
    
    //Recuperar Clave
    this.recuperar= function  (object) {
        var req = $http.post(uri + '/api/cliente/recuperar',object);
        return req;
    };
    

    //Verificar Key de Cambio de Contraseña
    this.verificarKey = function(idCliente, id, haskey){
        var req = $http.get(uri+'/api/cliente/' + idCliente +'/recuperar/'+ id + '/' + haskey);
        return req;	
    }; 

   //Cambiar Contraseña
    this.udpatePass = function (id,cliente) {        
        var req = $http.put(uri+'/api/cliente/updatepassword/' + id, cliente);
        return req;        
    };      
                     
});
