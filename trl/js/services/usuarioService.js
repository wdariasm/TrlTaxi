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
    
     this.cliente = function () {
        var req = $http.get(uri+'/api/cliente');
        return req;
    };
    
    this.conductor = function () {
        var req = $http.get(uri+'/api/conductor');
        return req;
    };
    
     this.persona = function () {
        var req = $http.get(uri+'/api/persona');
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
}]);

