app.service("trasladoService",[ '$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/traslado/' + id);
        return req;
    };
       
    this.getAll = function (idPlantilla) {
        var req = $http.get(uri+'/api/plantilla/' + idPlantilla + '/traslado');
        return req;
    };               
        
    this.post = function (traslado) { 
        var req = $http.post(uri+'/api/traslado',traslado); 
        return req; 
    };
   
          
    this.put = function (id,traslado) {        
        var req = $http.put(uri+'/api/traslado/' + id, traslado);
        return req;        
    };
        
    this.updateEstado=function(id, object){
        var req = $http.put(uri+'/api/traslado/updateEstado/' + id, object);
        return req;
    };      
    
    this.getByNombre = function () {
        var req = $http.get(uri+'/api/traslados');
        return req;
    };
}]);





