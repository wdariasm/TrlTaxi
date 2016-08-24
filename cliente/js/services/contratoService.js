app.service("contratoService",[ '$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/contrato/' + id);
        return req;
    };
    
    this.getByCliente = function (id) {
        var req = $http.get(uri+'/api/cliente/' + id + '/contratos');
        return req;
    };
           
    
    this.getPorNumeroCto = function (numero) {
        var req = $http.get(uri+'/api/contrato/' + numero + '/tiposervicio');
        return req;
    };
         
}]);

