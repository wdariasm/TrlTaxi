app.service("servicioService",[ '$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/servicio/' + id);
        return req;
    };
       
    this.getAll = function () {
        var req = $http.get(uri+'/api/servicio');
        return req;
    };                
        
    this.post = function (servicio) { 
        var req = $http.post(uri+'/api/servicio',servicio); 
        return req; 
    };
          
    this.put = function (id,servicio) {        
        var req = $http.put(uri+'/api/servicio/' + id, servicio);
        return req;        
    };
        
    this.updateEstado=function(id, object){
        var req = $http.put(uri+'/api/servicio/updateEstado/' + id, object);
        return req;
    };      
    
    this.getByNombre = function () {
        var req = $http.get(uri+'/api/servicios');
        return req;
    };
}]);





