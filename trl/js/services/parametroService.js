app.service("parametroService",[ '$http', function ($http) {
    
    this.get = function (id) {
        var req = $http.get(uri+'/api/parametro/' + id);
        return req;
    };
       
    this.getAll = function () {
        var req = $http.get(uri+'/api/parametro');
        return req;
    };                           
        
    this.put = function (id,parametro) {        
        var req = $http.put(uri+'/api/parametro/' + id, parametro);
        return req;        
    };
}]);


