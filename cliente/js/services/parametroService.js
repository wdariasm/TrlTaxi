app.service("parametroService",[ '$http', function ($http) {
              
    this.getAll = function () {
        var req = $http.get(uri+'/api/parametro');
        return req;
    };                           
           
}]);


