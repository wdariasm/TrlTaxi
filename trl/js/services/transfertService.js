app.service("transfertService", ['$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/transfert/' + id);
        return req;
    };            
       
    this.getAll = function (idPlantilla) {
        var req = $http.get(uri+'/api/plantilla/' + idPlantilla + '/transfert');
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
            
    this.getActivos = function () {
        var req = $http.get(uri+'/api/transferts');
        return req;
    };
    
    this.updateEstado=function(id, object){
        var req = $http.put(uri+'/api/transfert/updateEstado/' + id, object);
        return req;
    };  
}]);

