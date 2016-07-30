app.service("departamentoService", ['$http', function ($http) {

    this.get = function (id) {
        var req = $http.get(uri+'/api/departamento/' + id);
        return req;
    };
            
    this.getAll = function () {
        var req = $http.get(uri+'/api/departamento');
        return req;
    };   
        
    this.post = function (departamento) {
        var req = $http.post(uri+'/api/departamento', departamento);
        return req;       
    };
    
    this.put = function (id,departamento) {        
        var req = $http.put(uri+'/api/departamento/' + id, departamento);
        return req;        
    };

}]);