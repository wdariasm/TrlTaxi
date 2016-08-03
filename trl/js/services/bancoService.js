app.service("bancoService",[ '$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/banco/' + id);
        return req;
    };
       
    this.getAll = function () {
        var req = $http.get(uri+'/api/banco');
        return req;
    };                
        
    this.post = function (banco) { 
        var req = $http.post(uri+'/api/banco',banco); 
        return req; 
    };
          
    this.put = function (id,banco) {        
        var req = $http.put(uri+'/api/banco/' + id, banco);
        return req;        
    };
    
     this.getByNombre = function () {
        var req = $http.get(uri+'/api/bancos');
        return req;
    };
    
    // FRANQUICIAS 
    this.getFranquicia = function (id) {
        var req = $http.get(uri+'/api/franquicia/' + id);
        return req;
    };
    
     this.getAllFranquicia = function (){
        var req = $http.get(uri+'/api/franquicia' );
        return req;
    };
    
    this.postFranquicia =function(franquicia){
       var req = $http.post(uri+'/api/franquicia' ,franquicia);
        return req;  
    };
        
    this.putFranquicia = function (id,franquicia) {        
        var req = $http.put(uri+'/api/franquicia/' + id, franquicia);
        return req;        
    };
    
    this.updateEstado=function(id, object){
        var req = $http.put(uri+'/api/franquicia/updateEstado/' + id, object);
        return req;
    };  
   
   
}]);





