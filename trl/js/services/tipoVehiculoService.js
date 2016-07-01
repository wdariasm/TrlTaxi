app.service("tipoVehiculoService",[ '$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/tipoVehiculo/' + id);
        return req;
    };
       
    this.getAll = function () {
        var req = $http.get(uri+'/api/tipoVehiculo');
        return req;
    };                
        
    this.post = function (tipoVehiculo) { 
        var req = $http.post(uri+'/api/tipoVehiculo',tipoVehiculo); 
        return req; 
    };
          
    this.put = function (id,tipoVehiculo) {        
        var req = $http.put(uri+'/api/tipoVehiculo/' + id, tipoVehiculo);
        return req;        
    };
        
    this.updateEstado=function(id, object){
        var req = $http.put(uri+'/api/tipoVehiculo/updateEstado/' + id, object);
        return req;
    };      
    
    this.getByNombre = function () {
        var req = $http.get(uri+'/api/tipoVehiculos');
        return req;
    };
}]);


