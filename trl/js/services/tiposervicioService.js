app.service("tiposervicioService",[ '$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/tiposervicio/' + id);
        return req;
    };
       
    this.getAll = function () {
        var req = $http.get(uri+'/api/tiposervicio');
        return req;
    };                
        
    this.post = function (tiposervicio) { 
        var req = $http.post(uri+'/api/tiposervicio',tiposervicio); 
        return req; 
    };
          
    this.put = function (id,tiposervicio) {        
        var req = $http.put(uri+'/api/tiposervicio/' + id, tiposervicio);
        return req;        
    };
        
    this.updateEstado=function(id, object){
        var req = $http.put(uri+'/api/tiposervicio/updateEstado/' + id, object);
        return req;
    };      
    
    this.getActivos= function () {
        var req = $http.get(uri+'/api/tiposervicios');
        return req;
    };
}]);





