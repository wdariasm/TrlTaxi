app.service("servicioService", function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/servicio/' + id);
        return req;
    };

    this.post = function (servicio) {
        var req = $http.post(uri+'/api/servicio',servicio);
        return req;
    };

    this.put = function (id,servicio) {
        var req = $http.put(uri+'/api/servicio/' + id, servicio);
        return req;
    };

    this.cancelarCliente = function (id,Obj) {
        var req = $http.put(uri+'/api/cliente/' + id + '/cancelarServicio', Obj);
        return req;
    };


    this.getCategoria = function () {
        var req = $http.get(uri+'/api/categoria');
        return req;
    };

    this.getServicios = function (id) {
        var req = $http.get(uri+'/api/cliente/' + id + '/servicios');
        return req;
    };

    this.getTaxiLibre = function (param) {
        var req = $http.get(uri+'/api/servicio/taxisLibre/'+param);
        return req;
    };

});
