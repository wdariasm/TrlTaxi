app.service("localizacionService",  [ '$http', function ($http) {

    this.get = function (placa, estado) {
        var req = $http.get(uri+'/api/localizacion/' + placa +'/' +estado);
        return req;
    };
}]);
