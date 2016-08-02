app.service("usuarioService", ['$http', function ($http) {

    this.get = function (id) {
        var req = $http.get(uri+'/api/usuario/' + id);
        return req;
    };
            
    this.getAll = function () {
        var req = $http.get(uri+'/api/usuario');
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
         
    
    this.updateEstado=function(id, object){
        var req = $http.put(uri+'/api/usuario/updateEstado/' + id, object);
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
    
     this.getPermisos = function (id) {
        var req = $http.get(uri+'/api/usuario/'+id+'/permisos');        
        return req;
    };
    
    this.validar = function (user) {
        var req = $http.get(uri+'/api/usuario/' + user + '/validar');
        return req;
    };
    
}]);

