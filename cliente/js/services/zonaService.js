app.service("zonaService", ['$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/zona/' + id);
        return req;
    };
    
    this.getPuntos = function (id) {
        var req = $http.get(uri+'/api/zona/' + id + '/puntos');
        return req;
    };
    
    this.getNumTaxi = function (id) {
        var req = $http.get(uri+'/api/zona/' + id + '/taxis');
        return req;
    };
    
    this.getTaxistas = function (id) {
        var req = $http.get(uri+'/api/zona/' + id + '/taxistas');
        return req;
    };
       
    this.getAll = function () {
        var req = $http.get(uri+'/api/zona');
        return req;
    };                
              
            
    this.getByNombre = function () {
        var req = $http.get(uri+'/api/zonas');
        return req;
    };
}]);

