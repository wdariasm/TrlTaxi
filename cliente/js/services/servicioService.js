app.service("servicioService",[ '$http', function ($http) {
        
    this.get = function (id){
        var req = $http.get(uri+'/api/servicio/'+id);
        return req;
    };
    
    this.post = function (servicio) {
        var req = $http.post(uri+'/api/servicio',servicio); 
        return req; 
    };                 
    
     this.getAll = function (id, rol, user) {
        var req = $http.get(uri+'/api/cliente/' + id + "/servicios/" + rol + "/" + user );
        return req;
    }; 
    
    this.getConductor = function (id) {
        var req = $http.get(uri+'/api/conductor/' + id + "/vehiculo");
        return req;
    }; 
    
    this.cancelar = function (id,objeto) {        
        var req = $http.put(uri+'/api/servicio/' + id + '/cancelar', objeto);
        return req;                
    };
    
    this.getMotivos = function (modulo) {
        var req = $http.get(uri+'/api/motivo/' + modulo);
        return req;
    };
    
       
    this.eliminarContacto = function (id) {
        var req = $http.delete(uri+'/api/contacto/' + id);
        return req;
    };
    
    
    this.getContactos = function (servicio) {
        var req = $http.get(uri+'/api/contacto/' + servicio);
        return req;
    };        
    
    this.agregarContacto = function (contacto) {
        var req = $http.post(uri+'/api/contacto',contacto); 
        return req; 
    };
        
    this.agregarParada = function (parada) {
        var req = $http.post(uri+'/api/parada',parada); 
        return req; 
    };
    
    this.eliminarParada = function (id) {
        var req = $http.delete(uri+'/api/parada/' + id);
        return req;
    };
    
    this.getParadas = function (servicio) {
        var req = $http.get(uri+'/api/parada/' + servicio);
        return req;
    }; 
    
}]);


