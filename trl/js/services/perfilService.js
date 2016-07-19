app.service("perfilService", function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/perfil/' + id);
        return req;
    };
    
    this.getAll = function () {
        var req = $http.get(uri+'/api/perfil');
        return req;
    };
    
    this.getActivos = function () {
        var req = $http.get(uri+'/api/perfil/estado');
        return req;
    };
    
    this.getPermisoByPerfil = function (id) {
        var req = $http.get(uri+'/api/perfil/'+id+'/permisos');        
        return req;
    };
    
    this.post = function (perfil) {        
        var req = $http.post(uri+'/api/perfil', perfil);        
        return req;        
    };
    
    this.put = function (id,perfil) {        
        var req = $http.put(uri+'/api/perfil/' + id, perfil);
        return req;        
    };    
    
    this.delete = function  (id) {
        var req = $http.delete(uri+'/api/perfil/'+ id);
	return req;
    };
    
    //Permisos Generales
    this.getPermisos = function () {
        var req = $http.get(uri+'/api/permisos');
        return req;
    };
});


