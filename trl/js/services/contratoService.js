app.service("contratoService",[ '$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/contrato/' + id);
        return req;
    };
       
    this.getAll = function () {
        var req = $http.get(uri+'/api/contrato');
        return req;
    };                
        
    this.post = function (contrato) { 
        var req = $http.post(uri+'/api/contrato',contrato); 
        return req; 
    };
          
    this.put = function (id,contrato) {        
        var req = $http.put(uri+'/api/contrato/' + id, contrato);
        return req;        
    };
         
}]);

