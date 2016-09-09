app.service("zonaService", ['$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/zona/' + id);
        return req;
    };
    
    this.getPuntos = function (id) {
        var req = $http.get(uri+'/api/zona/' + id + '/puntos');
        return req;
    };
    
    this.getZona = function (latitud, longitud) {
        var req = $http.get(uri+'/api/zona/' + latitud + '/' +longitud);
        return req;
    };
    
    this.getPuntosAll = function () {
        var req = $http.get(uri+'/api/zona/puntos');
        return req;
    };                               
            
    
}]);

