app.service("tipoDocumentoService",[ '$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/tipoDocumento/' + id);
        return req;
    };
       
    this.getAll = function () {
        var req = $http.get(uri+'/api/tipoDocumento');
        return req;
    };                
        
    this.post = function (tipoDocumento) { 
        var req = $http.post(uri+'/api/tipoDocumento',tipoDocumento); 
        return req; 
    };
          
    this.put = function (id,tipoDocumento) {        
        var req = $http.put(uri+'/api/tipoDocumento/' + id, tipoDocumento);
        return req;        
    };
        
    this.updateEstado=function(id, object){
        var req = $http.put(uri+'/api/tipoDocumento/updateEstado/' + id, object);
        return req;
    };      
    
    this.getByNombre = function () {
        var req = $http.get(uri+'/api/tipoDocumentos');
        return req;
    };
}]);
