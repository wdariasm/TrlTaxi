app.service("contratoService",[ '$http', function ($http) {

    this.get = function (id) {
        var req = $http.get(uri+'/api/contrato/' + id);
        return req;
    };

    this.getPorNumeroCto = function (numero) {
        var req = $http.get(uri+'/api/contrato/' + numero + '/tiposervicio');
        return req;
    };

    this.getByCliente = function (id, estado) {
        var req = $http.get(uri+'/api/cliente/' + id + '/contratos/' + estado);
        return req;
    };

    this.getTipoVehiculo = function (id,tipo) {
        var req = $http.get(uri+'/api/plantilla/' + id + '/tiposervicio/'+tipo+'/tipovehiculo');
        return req;
    };

    this.getTransfert = function (plantilla, tipo, origen, destino){
        var req = $http.get(uri+'/api/transfert/' + plantilla + '/' + tipo + '/' + origen + '/'+destino);
        return req;
    };

    this.getValorParada = function (id) {
        var req = $http.get(uri+'/api/plantilla/' + id + '/parada');
        return req;
    };
    
    this.getRutas = function (idPlantilla) {
        var req = $http.get(uri+'/api/plantilla/' + idPlantilla + '/ruta');
        return req;
    };
    
    this.getTiposVehiculos = function () {
        var req = $http.get(uri+'/api/tipoVehiculo');
        return req;
    }; 
        
}]);
