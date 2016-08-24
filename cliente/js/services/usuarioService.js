app.service("usuarioService", ['$http', function ($http) {

    this.get = function (id) {
        var req = $http.get(uri+'/api/usuario/' + id);
        return req;
    };
            
   
    this.put = function (id,usuario) {        
        var req = $http.put(uri+'/api/usuario/' + id, usuario);
        return req;        
    };
         
       
     //Cambiar Contraseña
    this.udpatePass = function (id,usuario) {        
        var req = $http.put(uri+'/api/usuario/updatePassword/' + id, usuario);
        return req;        
    };
    
    this.cerrarSesion = function (usuario) {
        var req = $http.delete(uri+'/api/usuario/'+usuario+'/cerrar');
        return req;
    };
    
    
    
}]);

