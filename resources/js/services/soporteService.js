app.service("soporteService",[ '$http', function ($http) {
    this.getAll = function (user) {
        var req = $http.get(uri+'/api/soporte/' + user);
        return req;
    }; 
}]);




