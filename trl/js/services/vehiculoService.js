app.service("vehiculoService",[ '$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/vehiculo/' + id);
        return req;
    };
       
    this.getAll = function () {
        var req = $http.get(uri+'/api/vehiculo');
        return req;
    };  
    
    this.getNovedad = function (id){
        var req = $http.get(uri+'/api/vehiculo/'+ id + '/novedades' );
        return req;
    };
        
    this.post = function (vehiculo) { 
        var req = $http.post(uri+'/api/vehiculo',vehiculo); 
        return req; 
    };
          
    this.put = function (id,vehiculo) {        
        var req = $http.put(uri+'/api/vehiculo/' + id, vehiculo);
        return req;        
    };
        
    this.updateEstado=function(id, object){
        var req = $http.put(uri+'/api/vehiculo/updateEstado/' + id, object);
        return req;
    };      
    
    
}]);




