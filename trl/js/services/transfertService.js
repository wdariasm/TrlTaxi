app.service("transfertService", ['$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/transfert/' + id);
        return req;
    };            
       
    this.getAll = function () {
        var req = $http.get(uri+'/api/transfert');
        return req;
    };                
        
    this.post = function (transfert) { 
        var req = $http.post(uri+'/api/transfert',transfert); 
        return req; 
    };
          
    this.put = function (id,transfert) {        
        var req = $http.put(uri+'/api/transfert/' + id, transfert);
        return req;        
    };
    
    this.delete = function (id,transfert) {        
        var req = $http.delete(uri+'/api/transfert/' + id, transfert);
        return req;        
    };
            
    this.getByNombre = function () {
        var req = $http.get(uri+'/api/transferts');
        return req;
    };
}]);

