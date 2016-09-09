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
        
    this.post = function (zona) { 
        var req = $http.post(uri+'/api/zona',zona); 
        return req; 
    };
          
    this.put = function (id,zona) {        
        var req = $http.put(uri+'/api/zona/' + id, zona);
        return req;        
    };
    
    this.delete = function (id,zona) {        
        var req = $http.delete(uri+'/api/zona/' + id, zona);
        return req;        
    };               
}]);

