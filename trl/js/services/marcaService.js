app.service("marcaService",[ '$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/marca/' + id);
        return req;
    };
       
    this.getAll = function () {
        var req = $http.get(uri+'/api/marca');
        return req;
    };                
        
    this.post = function (marca) { 
        var req = $http.post(uri+'/api/marca',marca); 
        return req; 
    };
          
    this.put = function (id,marca) {        
        var req = $http.put(uri+'/api/marca/' + id, marca);
        return req;        
    };
        
    this.updateEstado=function(id, object){
        var req = $http.put(uri+'/api/marca/updateEstado/' + id, object);
        return req;
    };      
    
    this.getByNombre = function () {
        var req = $http.get(uri+'/api/marcas');
        return req;
    };
}]);


