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
    
    this.getTipoContrato = function () {
        var req = $http.get(uri+'/api/tipoContrato');
        return req;
    };
    
    this.getPorNumeroCto = function (numero) {
        var req = $http.get(uri+'/api/contrato/' + numero + '/tiposervicio');
        return req;
    };
    
    /* funciones para crear nuevos servicios*/
    this.getDisponibilidad = function (plantilla, tipo){
        var req = $http.get(uri+'/api/disponibilidad/plantilla/' + plantilla + '/tipo/' + tipo );
        return req;
    };
    
    this.getTraslados = function (idPlantilla) {
        var req = $http.get(uri+'/api/plantilla/' + idPlantilla + '/traslado');
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
    
    this.delete = function (id) {        
        var req = $http.delete(uri+'/api/contrato/' + id);
        return req;        
    };  
    
         
}]);

