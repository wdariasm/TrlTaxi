app.service("contratoService",[ '$http', function ($http) {

    this.get = function (id) {
        var req = $http.get(uri+'/api/contrato/' + id);
        return req;
    };

    this.getPorNumeroCto = function (numero) {
        var req = $http.get(uri+'/api/contrato/' + numero + '/tiposervicio');
        return req;
    };

    this.getByCliente = function (id) {
        var req = $http.get(uri+'/api/cliente/' + id + '/contratos');
        return req;
    };

    this.getTipoVehiculo = function (id) {
        var req = $http.get(uri+'/api/plantilla/' + id + '/tipovehiculo');
        return req;
    };

    this.getTransfert = function (plantilla, tipo, origen, destino){
        var req = $http.get(uri+'/api/transfert/' + plantilla + '/' + tipo + '/' + origen + '/'+destino);
        return req;
    };

}]);
