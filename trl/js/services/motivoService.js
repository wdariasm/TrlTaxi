app.service("motivoService",[ '$http', function ($http) {
    this.get = function (modulo) {
        var req = $http.get(uri+'/api/motivo/' + modulo);
        return req;
    };
       
    this.getAll = function () {
        var req = $http.get(uri+'/api/motivo');
        return req;
    };                
        
    this.post = function (motivo) { 
        var req = $http.post(uri+'/api/motivo',motivo); 
        return req; 
    };
          
    this.put = function (id,motivo) {        
        var req = $http.put(uri+'/api/motivo/' + id, motivo);
        return req;        
    };
        
    this.updateEstado=function(id, object){
        var req = $http.put(uri+'/api/motivo/updateEstado/' + id, object);
        return req;
    };      
       
}]);