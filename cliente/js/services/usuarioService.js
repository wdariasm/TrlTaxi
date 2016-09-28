app.service("usuarioService", ['$http', function ($http) {

    this.get = function (id) {
        var req = $http.get(uri+'/api/usuario/' + id);
        return req;
    };        
            
    this.post = function (usuario) {
        var req = $http.post(uri+'/api/usuario', usuario);
        return req;       
    };
   
    this.put = function (id,usuario) {        
        var req = $http.put(uri+'/api/usuario/' + id, usuario);
        return req;        
    };
    
    this.getUsers = function (id){
        var req = $http.get(uri+'/api/cliente/' + id +'/usuarios');
        return req;
    };
    
    this.getPermisos = function (id) {
        var req = $http.get(uri+'/api/usuario/'+id+'/permisos');        
        return req;
    };
                
     //Cambiar Contraseña     
    this.udpatePass = function (usuario) {        
        var req = $http.post(uri+'/api/usuario/cambiar', usuario);
        return req;        
    };
    
    this.cerrarSesion = function (usuario) {
        var req = $http.delete(uri+'/api/usuario/'+usuario+'/cerrar');
        return req;
    };
    
    
    this.validar = function (user) {
        var req = $http.get(uri+'/api/usuario/' + user + '/validar');
        return req;
    };
    
    this.refrescar = function(){
        var req = $http.get(uri+'/api/usuario/token');
        return req;
    };
            
}]);

